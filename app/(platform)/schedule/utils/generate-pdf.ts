import { jsPDF } from "jspdf";

const fullDaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ScheduleData {
  containers?: Record<string, string[]>;
}

interface ShiftsData {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface SalesStaff {
  _id: string;
  name: string;
  displayName?: string;
  type?: string; // Added to enable filtering by staff type
}

interface GeneratePDFParams {
  monthName: string;
  currentYear: number;
  currentMonth: number;
  firstDayOfMonth: number;
  calendarDays: (number | null)[];
  scheduleData: ScheduleData | null;
  salesFilter: "all" | "new" | "used";
  shifts: ShiftsData;
  salesStaffData?: SalesStaff[];
}

// Helper function to load an image as a Base64 data URL.
function loadImageAsBase64(url: string): Promise<string> {
  return fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

// Helper function to filter items based on salesFilter and salesStaffData
function filterItems(items: string[], salesFilter: "all" | "new" | "used", salesStaffData: SalesStaff[]) {
  return items.filter(item => {
    // Always show special labels
    if (item.startsWith("special:")) return true;

    // Include all items if salesFilter is "all"
    if (salesFilter === "all") return true;

    // Extract the base ID (remove timestamp if present)
    const baseId = item.includes("::") ? item.split("::")[0] : item;

    // Check for "new:" or "used:" prefix and match with salesFilter
    if (baseId.startsWith("new:") && salesFilter === "new") return true;
    if (baseId.startsWith("used:") && salesFilter === "used") return true;

    // Remove prefix if present to get clean ID
    let cleanId = baseId;
    if (baseId.startsWith("new:") || baseId.startsWith("used:")) {
      cleanId = baseId.substring(baseId.indexOf(":") + 1);
    }

    // Find the staff member in salesStaffData
    const staff = salesStaffData.find(s => s._id === cleanId);

    // If staff not found, include the item (handles legacy data)
    if (!staff) return true;

    // Filter based on staff type
    return staff.type === salesFilter;
  });
}

// Helper function to get team name based on filter
function getTeamName(salesFilter: "all" | "new" | "used") {
  switch (salesFilter) {
    case "new":
      return "New Car Sales Team";
    case "used":
      return "Used Car Sales Team";
    default:
      return "Sales Team";
  }
}

// Helper function to get display name from ID (similar to staff-schedule.tsx)
function getDisplayName(id: string, salesStaffData?: SalesStaff[], salespeopleList?: string[]): string {
  // If it's a special label (handle both original and cloned special labels)
  if (id.startsWith("special:")) {
    const labelWithPossibleTimestamp = id.substring("special:".length);
    const result = labelWithPossibleTimestamp.includes("::")
      ? labelWithPossibleTimestamp.split("::")[0]
      : labelWithPossibleTimestamp;
    return result;
  }

  // If it has a timestamp (cloned item)
  const baseId = id.includes("::") ? id.split("::")[0] : id;

  // Check for "new:" or "used:" prefix and remove it
  let cleanId = baseId;
  let prefix = "";
  if (baseId.startsWith("new:")) {
    cleanId = baseId.substring(baseId.indexOf(":") + 1);
    prefix = "new:";
  } else if (baseId.startsWith("used:")) {
    cleanId = baseId.substring(baseId.indexOf(":") + 1);
    prefix = "used:";
  }

  // Try to find by ID in salesStaffData
  if (salesStaffData && salesStaffData.length > 0) {
    const staffById = salesStaffData.find(s => String(s._id) === cleanId);
    if (staffById) {
      const displayName =
        staffById.displayName === "" ? staffById.name : (staffById.displayName || staffById.name || "");
      const firstName = displayName.split(" ")[0];
      return firstName;
    }

    const staffByIdCaseInsensitive = salesStaffData.find(
      s => String(s._id).toLowerCase() === cleanId.toLowerCase()
    );
    if (staffByIdCaseInsensitive) {
      const displayName =
        staffByIdCaseInsensitive.displayName === ""
          ? staffByIdCaseInsensitive.name
          : (staffByIdCaseInsensitive.displayName || staffByIdCaseInsensitive.name || "");
      const firstName = displayName.split(" ")[0];
      return firstName;
    }
  }

  // If ID is a name (legacy format)
  if (typeof cleanId === "string" && cleanId.includes(" ")) {
    const firstName = cleanId.split(" ")[0];
    return firstName;
  }

  // Handle prefixed names or Convex IDs in production
  if (prefix && typeof cleanId === "string") {
    if (cleanId.includes(" ")) {
      const firstName = cleanId.split(" ")[0];
      return firstName;
    } else if (/^k[a-z0-9]+$/.test(cleanId) && salesStaffData) {
      if (salespeopleList && (salespeopleList.includes(cleanId) || salespeopleList.includes(baseId) || salespeopleList.includes(id))) {
        for (const staff of salesStaffData) {
          if (
            String(staff._id) === cleanId ||
            String(staff.name).includes(cleanId) ||
            (staff.displayName && String(staff.displayName).includes(cleanId))
          ) {
            const displayName =
              staff.displayName === "" ? staff.name : (staff.displayName || staff.name || "");
            const firstName = displayName.split(" ")[0];
            return firstName;
          }
        }
      }
    }
  }

  // Last resort: check salespeopleList
  if (salespeopleList && (salespeopleList.includes(cleanId) || salespeopleList.includes(baseId) || salespeopleList.includes(id))) {
    return cleanId.substring(0, 10); // Truncate long IDs
  }

  return "Unknown";
}

export async function generateSchedulePDF({
  monthName,
  currentYear,
  currentMonth,
  firstDayOfMonth,
  calendarDays,
  scheduleData,
  salesFilter,
  shifts,
  salesStaffData = [],
}: GeneratePDFParams) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Extract salespeople list from scheduleData for name resolution
  const salespeopleList = scheduleData?.containers?.["salespeople-list"] || [];

  // Set PDF metadata for better browser display
  const title = `${monthName.toLowerCase()}-${salesFilter}-sales-schedule`;
  doc.setProperties({
    title: title,
    subject: `Sales Schedule for ${monthName} ${currentYear}`,
    author: "Volvo Cars North Miami",
    creator: "Schedule Manager",
  });

  // Define a blue color palette
  const primaryBlue: [number, number, number] = [0, 48, 87];
  const lightBlue: [number, number, number] = [210, 225, 245];
  const weekendBlue: [number, number, number] = [240, 248, 255];
  const black: [number, number, number] = [0, 0, 0];

  // Page dimensions and margins
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const headerHeight = 12;

  // ===== Top Left Header with Logo =====
  const headerFontSize = 14;
  doc.setFontSize(headerFontSize);
  doc.setTextColor(...black);
  const headerX = margin;
  const headerY = 10;

  doc.setFont("helvetica", "bold");
  const firstLine = "Employee Schedule";
  doc.text(firstLine, headerX, headerY);

  const firstLineWidth = doc.getTextWidth(firstLine);
  const lineHeightMM = headerFontSize * 0.3528;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(headerFontSize - 2);
  const secondLine = "Volvo Cars North Miami";
  doc.text(secondLine, headerX, headerY + lineHeightMM);

  const logoDataUrl = await loadImageAsBase64("/Volvo-Iron-Mark.png");
  const imageGap = 4;
  const imageX = headerX + firstLineWidth + imageGap;
  const imageHeight = lineHeightMM * 2.25;
  const imageWidth = imageHeight;
  const imageY = headerY - lineHeightMM;
  doc.addImage(logoDataUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

  // ===== Center Header =====
  const teamName = getTeamName(salesFilter);
  const centerHeader = `${teamName}\n${monthName} ${currentYear}`;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(centerHeader, pageWidth / 2, 10, { align: "center" });

  // ===== Weekday Header Row =====
  const colWidth = (pageWidth - 2 * margin) / 7;
  const weekdayHeaderY = margin + headerHeight;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  fullDaysOfWeek.forEach((day, index) => {
    const x = margin + colWidth * index;
    doc.setFillColor(...primaryBlue);
    doc.rect(x, weekdayHeaderY, colWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(day, x + colWidth / 2, weekdayHeaderY + 5, { align: "center" });
  });

  // ===== Calendar Day Cells =====
  const totalDays = calendarDays.filter((day): day is number => day !== null).length;
  const daysInFirstRow = 7 - firstDayOfMonth;
  const remainingDays = totalDays - daysInFirstRow;
  const additionalRows = Math.ceil(remainingDays / 7);
  const totalRows = 1 + additionalRows;

  const weekdayHeaderHeight = 7;
  const availableHeight = pageHeight - weekdayHeaderY - weekdayHeaderHeight - margin;
  const rowHeight =
    totalRows > 5 ? Math.min(30, availableHeight / totalRows) : Math.min(34, availableHeight / totalRows);

  const calendarStartY = weekdayHeaderY + weekdayHeaderHeight;
  const isWeekend = (dayIndex: number) => dayIndex === 0 || dayIndex === 6;
  const isSunday = (dayIndex: number) => dayIndex === 0;

  const shiftPadding = 1;
  let currentRow = 0;
  let currentCol = firstDayOfMonth;

  const darkColor: [number, number, number] = [0, 0, 0];
  const dayFontSize = totalRows > 5 ? 8 : 9;
  const timeFontSize = totalRows > 5 ? 7 : 8;
  const namesFontSize = totalRows > 5 ? 7 : 8;

  calendarDays.filter((day): day is number => day !== null).forEach((day) => {
    const x = margin + currentCol * colWidth;
    const y = calendarStartY + currentRow * rowHeight;
    const dayOfWeek = new Date(currentYear, currentMonth - 1, day).getDay();
    const dayName = fullDaysOfWeek[dayOfWeek].toLowerCase() as keyof ShiftsData;
    const shiftsForDay = shifts[dayName];

    if (isWeekend(dayOfWeek)) {
      doc.setFillColor(...weekendBlue);
      doc.rect(x, y, colWidth, rowHeight, "F");
    }

    doc.setDrawColor(...primaryBlue);
    doc.rect(x, y, colWidth, rowHeight);

    const dayHeaderHeight = totalRows > 5 ? 5 : 6;
    doc.setFillColor(...lightBlue);
    doc.rect(x, y, colWidth, dayHeaderHeight, "F");
    doc.setDrawColor(...primaryBlue);
    doc.rect(x, y, colWidth, dayHeaderHeight, "S");

    doc.setFontSize(dayFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBlue);
    doc.text(`${day}`, x + 2, y + dayHeaderHeight * 0.7);

    let shiftY = y + dayHeaderHeight + 2;

    shiftsForDay.forEach((shift: string, shiftIndex: number) => {
      const containerId = `${day}-${shiftIndex}`;
      const items = scheduleData?.containers?.[containerId] || [];
      const filteredItems = filterItems(items, salesFilter, salesStaffData); // Updated to include salesStaffData
      const displayNames = filteredItems.map(item =>
        getDisplayName(item, salesStaffData, salespeopleList)
      );

      const isOffShift = shiftIndex === shiftsForDay.length - 1;
      const offShiftOffset = isOffShift ? 1 : 0;
      const isPreviousShiftWithMultipleRows =
        shiftIndex > 0 && (scheduleData?.containers?.[`${day}-${shiftIndex - 1}`]?.length ?? 0) > 2;
      const extraPadding = isPreviousShiftWithMultipleRows ? 2 : 0;

      const baseShiftSpacing = isSunday(dayOfWeek)
        ? (rowHeight - dayHeaderHeight - 2) / 2
        : Math.min(11, (rowHeight - dayHeaderHeight - 2) / shiftsForDay.length);

      shiftY = y + dayHeaderHeight + 2 + baseShiftSpacing * shiftIndex + offShiftOffset + extraPadding;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(timeFontSize);
      doc.setTextColor(...darkColor);
      doc.text(shift, x + 2, shiftY + shiftPadding);

      if (displayNames.length > 0) {
        const sortedNames = [...displayNames].sort((a, b) => a.length - b.length);
        const shiftWidth = doc.getTextWidth(shift + " ");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(namesFontSize);

        const availableWidth = colWidth - 4 - shiftWidth;

        function distributeNames(
          names: string[],
          maxWidth: number,
          maxRows: number = 3,
          maxNamesPerRow: number | null = null,
          forceNamesPerRow: boolean = false
        ): string[][] {
          if (names.length === 0 || maxRows === 0) return [];
          const rows: string[][] = [[]];
          let currentRowWidth = 0;
          let currentRow = 0;

          for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const nameWidth = doc.getTextWidth(name);
            const commaWidth = doc.getTextWidth(", ");
            const widthIfAdded = currentRowWidth + nameWidth + (rows[currentRow].length > 0 ? commaWidth : 0);
            const reachedMaxNamesInRow = maxNamesPerRow !== null && rows[currentRow].length >= maxNamesPerRow;
            const shouldAddToCurrentRow = forceNamesPerRow
              ? !reachedMaxNamesInRow || rows[currentRow].length === 0
              : (widthIfAdded <= maxWidth && !reachedMaxNamesInRow) || rows[currentRow].length === 0;

            if (shouldAddToCurrentRow) {
              rows[currentRow].push(name);
              currentRowWidth = widthIfAdded;
            } else if (currentRow + 1 < maxRows) {
              currentRow++;
              rows[currentRow] = [name];
              currentRowWidth = nameWidth;
            } else {
              rows[currentRow].push(name);
            }
          }
          return rows;
        }

        if (isSunday(dayOfWeek) && shiftsForDay.length <= 2) {
          const nameRows = distributeNames(sortedNames, availableWidth, 3, 3, true);
          nameRows.forEach((rowNames, rowIndex) => {
            const xPos = rowIndex === 0 ? x + 2 + shiftWidth : x + 2;
            const yPos = shiftY + shiftPadding + rowIndex * 3;
            doc.text(rowNames.join(", "), xPos, yPos);
          });
        } else {
          const nameRows = distributeNames(sortedNames, availableWidth, 2, 2);
          nameRows.forEach((rowNames, rowIndex) => {
            const xPos = rowIndex === 0 ? x + 2 + shiftWidth : x + 2;
            const yPos = shiftY + shiftPadding + rowIndex * 3.5;
            doc.text(rowNames.join(", "), xPos, yPos);
          });
        }
      }
    });

    currentCol++;
    if (currentCol === 7) {
      currentCol = 0;
      currentRow++;
    }
  });

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}