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

// Helper function to filter items based on salesFilter
function filterItems(items: string[], salesFilter: "all" | "new" | "used") {
  return items.filter(item => {
    // Always show special labels
    if (item.startsWith("special:")) return true;
    // Show all items if filter is set to all
    if (salesFilter === "all") return true;
    
    // Extract the base ID (remove timestamp if present)
    const baseId = item.includes("::") ? item.split("::")[0] : item;
    
    // Check for "new:" or "used:" prefix
    if (salesFilter === "new" && (baseId.startsWith("new:") || !baseId.includes(":"))) return true;
    if (salesFilter === "used" && (baseId.startsWith("used:") || !baseId.includes(":"))) return true;
    
    return false;
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
    // Extract the label name without the timestamp
    const labelWithPossibleTimestamp = id.substring("special:".length);
    // If it has a timestamp, remove it
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
  
  // First try to find by ID - this should work for Convex IDs like k57cd9h0m588y905ycmmv58res77jvxp
  if (salesStaffData && salesStaffData.length > 0) {
    // Try to find by exact ID match
    const staffById = salesStaffData.find(s => String(s._id) === cleanId);
    if (staffById) {
      // Handle the case where displayName is an empty string
      const displayName = staffById.displayName === "" 
        ? staffById.name 
        : (staffById.displayName || staffById.name || "");
      const firstName = displayName.split(" ")[0];
      return firstName;
    }
    
    // If not found by exact ID, try case-insensitive comparison
    const staffByIdCaseInsensitive = salesStaffData.find(
      s => String(s._id).toLowerCase() === cleanId.toLowerCase()
    );
    if (staffByIdCaseInsensitive) {
      // Handle the case where displayName is an empty string
      const displayName = staffByIdCaseInsensitive.displayName === "" 
        ? staffByIdCaseInsensitive.name 
        : (staffByIdCaseInsensitive.displayName || staffByIdCaseInsensitive.name || "");
      const firstName = displayName.split(" ")[0];
      return firstName;
    }
  }
  
  // If not found by ID, check if the ID itself is a name (legacy format)
  if (typeof cleanId === 'string' && cleanId.includes(" ")) {
    const firstName = cleanId.split(" ")[0];
    return firstName;
  }
  
  // For production environment, if we have a prefix and a name, use that
  if (prefix && typeof cleanId === 'string') {
    // This might be a case where the ID is actually "used:Alex Reynaldos" format
    // or where the ID is a Convex ID but we need to use it directly
    if (cleanId.includes(" ")) {
      const firstName = cleanId.split(" ")[0];
      return firstName;
    } else if (/^k[a-z0-9]+$/.test(cleanId)) {
      // If it's a Convex ID format, try to find the corresponding staff member again
      // This is a fallback for production where the ID format might be different
      if (salesStaffData) {
        // If the ID is in the salespeople list, it might be a valid staff member
        if (salespeopleList && (salespeopleList.includes(cleanId) || salespeopleList.includes(baseId) || salespeopleList.includes(id))) {
          // Try to find by any property that might match
          for (const staff of salesStaffData) {
            if (
              String(staff._id) === cleanId || 
              String(staff.name).includes(cleanId) || 
              (staff.displayName && String(staff.displayName).includes(cleanId))
            ) {
              // Handle the case where displayName is an empty string
              const displayName = staff.displayName === "" 
                ? staff.name 
                : (staff.displayName || staff.name || "");
              const firstName = displayName.split(" ")[0];
              return firstName;
            }
          }
        }
      }
    }
  }
  
  // Last resort: check if this ID exists in the salespeople-list
  // If it does, it might be a valid ID that we're just not matching correctly
  if (salespeopleList && (salespeopleList.includes(cleanId) || salespeopleList.includes(baseId) || salespeopleList.includes(id))) {
    // Return the ID itself as a last resort
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
    creator: "Schedule Manager"
  });

  // Define a blue color palette.
  const primaryBlue: [number, number, number] = [0, 48, 87];
  const lightBlue: [number, number, number] = [210, 225, 245];
  const weekendBlue: [number, number, number] = [240, 248, 255];
  const black: [number, number, number] = [0, 0, 0];

  // Page dimensions and margins.
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

  // First line: bold.
  doc.setFont("helvetica", "bold");
  const firstLine = "Employee Schedule";
  doc.text(firstLine, headerX, headerY);

  // Calculate the width of the first line for logo placement.
  const firstLineWidth = doc.getTextWidth(firstLine);
  const lineHeightMM = headerFontSize * 0.3528;

  // Second line: normal (non-bold) with smaller font size
  doc.setFont("helvetica", "normal");
  doc.setFontSize(headerFontSize - 2);
  const secondLine = "Volvo Cars North Miami";
  doc.text(secondLine, headerX, headerY + lineHeightMM);

  // Load the logo image
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
  // Calculate the number of rows needed for this month
  const totalDays = calendarDays.filter((day): day is number => day !== null).length;
  const daysInFirstRow = 7 - firstDayOfMonth;
  const remainingDays = totalDays - daysInFirstRow;
  const additionalRows = Math.ceil(remainingDays / 7);
  const totalRows = 1 + additionalRows;
  
  // Calculate available space and adjust row height
  const weekdayHeaderHeight = 7;
  const availableHeight = pageHeight - weekdayHeaderY - weekdayHeaderHeight - margin;
  // Increase the minimum row height slightly for 6-row months to make squares bigger
  const rowHeight = totalRows > 5 
    ? Math.min(30, availableHeight / totalRows) // Slightly larger minimum for 6-row months
    : Math.min(34, availableHeight / totalRows);
  
  const calendarStartY = weekdayHeaderY + weekdayHeaderHeight;
  const isWeekend = (dayIndex: number) => dayIndex === 0 || dayIndex === 6;
  const isSunday = (dayIndex: number) => dayIndex === 0;

  const shiftPadding = 1;
  let currentRow = 0;
  let currentCol = firstDayOfMonth;

  // Dark font color for shifts
  const darkColor: [number, number, number] = [0, 0, 0];

  // Adjust font sizes for smaller cells if needed
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

    // Adjust header height for day number
    const dayHeaderHeight = totalRows > 5 ? 5 : 6;
    
    doc.setFillColor(...lightBlue);
    doc.rect(x, y, colWidth, dayHeaderHeight, "F");
    doc.setDrawColor(...primaryBlue);
    doc.rect(x, y, colWidth, dayHeaderHeight, "S");

    doc.setFontSize(dayFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBlue);
    doc.text(`${day}`, x + 2, y + (dayHeaderHeight * 0.7));

    let shiftY = y + dayHeaderHeight + 2;
    
    // Adjust spacing for shifts based on available space
    shiftsForDay.forEach((shift: string, shiftIndex: number) => {
      const containerId = `${day}-${shiftIndex}`;
      const items = scheduleData?.containers?.[containerId] || [];
      const filteredItems = filterItems(items, salesFilter);
      // Use getDisplayName instead of parseName
      const displayNames = filteredItems.map(item => 
        getDisplayName(item, salesStaffData, salespeopleList)
      );
      
      const isOffShift = shiftIndex === shiftsForDay.length - 1;
      const offShiftOffset = isOffShift ? 1 : 0;
      
      // Add more vertical spacing between shifts when there are multiple rows of names
      // Calculate if the previous shift had multiple rows of names
      const isPreviousShiftWithMultipleRows = shiftIndex > 0 && 
        (scheduleData?.containers?.[`${day}-${shiftIndex-1}`]?.length ?? 0) > 2;
      
      // Add extra padding if previous shift had multiple rows
      const extraPadding = isPreviousShiftWithMultipleRows ? 2 : 0;
      
      // Calculate base vertical position for each shift
      // Use fixed spacing for more consistency rather than dynamic spacing
      const baseShiftSpacing = isSunday(dayOfWeek) ? 
        (rowHeight - dayHeaderHeight - 2) / 2 : // For Sundays with 2 shifts, divide space evenly
        Math.min(11, (rowHeight - dayHeaderHeight - 2) / shiftsForDay.length); // For other days, use consistent spacing with a maximum
      
      shiftY = y + dayHeaderHeight + 2 + (baseShiftSpacing * shiftIndex) + offShiftOffset + extraPadding;

      // Always show the shift time
      doc.setFont("helvetica", "bold");
      doc.setFontSize(timeFontSize);
      doc.setTextColor(...darkColor);
      doc.text(shift, x + 2, shiftY + shiftPadding);

      if (displayNames.length > 0) {
        const sortedNames = [...displayNames].sort((a, b) => a.length - b.length);
        const shiftWidth = doc.getTextWidth(shift + " ");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(namesFontSize);
        
        // Calculate available width for names
        const availableWidth = colWidth - 4 - shiftWidth; // 4mm for padding
        
        // Function to optimize name distribution across rows
        function distributeNames(names: string[], maxWidth: number, maxRows: number = 3, maxNamesPerRow: number | null = null, forceNamesPerRow: boolean = false): string[][] {
          // If no names or no rows allowed, return empty array
          if (names.length === 0 || maxRows === 0) return [];
          
          const rows: string[][] = [[]];
          let currentRowWidth = 0;
          let currentRow = 0;
          
          // Process each name
          for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const nameWidth = doc.getTextWidth(name);
            const commaWidth = doc.getTextWidth(", ");
            
            // Width if we add this name to current row (including comma if not first name)
            const widthIfAdded = currentRowWidth + nameWidth + (rows[currentRow].length > 0 ? commaWidth : 0);
            
            // Check if we've reached the maximum names per row (if specified)
            const reachedMaxNamesInRow = maxNamesPerRow !== null && rows[currentRow].length >= maxNamesPerRow;
            
            // For forced names per row, only check the count limit, not the width
            const shouldAddToCurrentRow = forceNamesPerRow 
              ? !reachedMaxNamesInRow || rows[currentRow].length === 0
              : ((widthIfAdded <= maxWidth && !reachedMaxNamesInRow) || rows[currentRow].length === 0);
            
            if (shouldAddToCurrentRow) {
              // Add to current row if it fits or if it's the first name in the row
              rows[currentRow].push(name);
              currentRowWidth = widthIfAdded;
            } else if (currentRow + 1 < maxRows) {
              // Start a new row if we haven't reached max rows
              currentRow++;
              rows[currentRow] = [name];
              currentRowWidth = nameWidth;
            } else {
              // If we've reached max rows, add to the last row anyway
              // This might overflow but it's better than omitting names
              rows[currentRow].push(name);
            }
          }
          
          return rows;
        }
        
        // Special handling for Sundays (which have fewer shifts)
        if (isSunday(dayOfWeek) && shiftsForDay.length <= 2) {
          // For Sundays, allow up to 3 rows with exactly 3 names per row (force 3 per row)
          const nameRows = distributeNames(sortedNames, availableWidth, 3, 3, true);
          
          // Render each row
          nameRows.forEach((rowNames, rowIndex) => {
            const xPos = rowIndex === 0 ? x + 2 + shiftWidth : x + 2;
            const yPos = shiftY + shiftPadding + (rowIndex * 3);
            doc.text(rowNames.join(", "), xPos, yPos);
          });
        } else {
          // For other days, allow up to 2 rows with 2 names per row
          const nameRows = distributeNames(sortedNames, availableWidth, 2, 2);
          
          // Render each row
          nameRows.forEach((rowNames, rowIndex) => {
            const xPos = rowIndex === 0 ? x + 2 + shiftWidth : x + 2;
            const yPos = shiftY + shiftPadding + (rowIndex * 3.5);
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

  // Return blob URL instead of saving
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
}
