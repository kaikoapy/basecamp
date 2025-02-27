import { jsPDF } from "jspdf";
import { parseName } from "../utils";

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

interface GeneratePDFParams {
  monthName: string;
  currentYear: number;
  currentMonth: number;
  firstDayOfMonth: number;
  calendarDays: (number | null)[];
  scheduleData: ScheduleData | null;
  salesFilter: "all" | "new" | "used";
  shifts: ShiftsData;
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
    if (item.startsWith("special:")) return true; // Always show special labels
    if (salesFilter === "all") return true;
    return item.startsWith(salesFilter + ":");
  });
}

// Helper function to get the team name based on filter
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

export async function generateSchedulePDF({
  monthName,
  currentYear,
  currentMonth,
  firstDayOfMonth,
  calendarDays,
  scheduleData,
  salesFilter,
  shifts,
}: GeneratePDFParams) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
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
      const parsedNames = filteredItems.map((item) => parseName(item));
      
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

      if (parsedNames.length > 0) {
        const sortedNames = [...parsedNames].sort((a, b) => a.length - b.length);
        const shiftWidth = doc.getTextWidth(shift + " ");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(namesFontSize);
        
        // Calculate available width for names
        const availableWidth = colWidth - 4 - shiftWidth; // 4mm for padding
        
        // Function to optimize name distribution across rows
        function distributeNames(names: string[], maxWidth: number, maxRows: number = 3, maxNamesPerRow: number | null = null): string[][] {
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
            
            if ((widthIfAdded <= maxWidth && !reachedMaxNamesInRow) || rows[currentRow].length === 0) {
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
          // For Sundays, allow up to 3 rows with 3 names per row
          const nameRows = distributeNames(sortedNames, availableWidth, 3, 3);
          
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

  doc.save(`${monthName.toLowerCase()}-${salesFilter}-sales-schedule.pdf`);
}
