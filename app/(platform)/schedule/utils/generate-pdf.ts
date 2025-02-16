import { jsPDF } from "jspdf";
import { shifts, parseName } from "../utils";

// Instead of the abbreviated daysOfWeek, define full weekday names.
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

interface GeneratePDFParams {
  monthName: string;
  currentYear: number;
  currentMonth: number;
  firstDayOfMonth: number;
  calendarDays: (number | null)[];
  scheduleData: ScheduleData | null;
}

export function generateSchedulePDF({
  monthName,
  currentYear,
  currentMonth,
  firstDayOfMonth,
  calendarDays,
  scheduleData,
}: GeneratePDFParams) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Define a blue color palette.
  const primaryBlue: [number, number, number] = [0, 48, 87];          // Deep blue for text & borders.
  const lightBlue: [number, number, number] = [210, 225, 245];          // Soft blue for general backgrounds.
  const weekendBlue: [number, number, number] = [240, 248, 255];        // Very pale blue for weekend cell shading.

  // Page dimensions and margins.
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const headerHeight = 12; // extra space for title

  // Top left header (smaller font).
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primaryBlue);
  doc.text("Employee Schedule\nVolvo North Miami", margin, 10);

  // Center header (larger font).
  const centerHeader = `New Car Sales Team\n${monthName} ${currentYear}`;
  doc.setFontSize(20);
  doc.text(centerHeader, pageWidth / 2, 10, { align: "center" });

  // Top row for weekday names: Dark blue background with white text.
  const colWidth = (pageWidth - 2 * margin) / 7;
  const headerY = margin + headerHeight;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  fullDaysOfWeek.forEach((day, index) => {
    const x = margin + colWidth * index;
    // Fill background with dark blue.
    doc.setFillColor(...primaryBlue);
    doc.rect(x, headerY, colWidth, 7, "F");
    // Set text color to white.
    doc.setTextColor(255, 255, 255);
    doc.text(day, x + colWidth / 2, headerY + 5, { align: "center" });
  });

  // Fixed day cell height is 34mm.
  const rowHeight = 34;
  const calendarStartY = headerY + 7;

  // Helper: determine if a day is a weekend (Sunday = 0, Saturday = 6).
  const isWeekend = (dayIndex: number) => dayIndex === 0 || dayIndex === 6;

  // Settings for shift block formatting.
  const shiftPadding = 1; // small padding above the shift time
  const extraSpacing = 1; // extra spacing between shift blocks

  let currentRow = 0;
  let currentCol = firstDayOfMonth;

  // Process each day (skipping null placeholders).
  calendarDays.filter((day): day is number => day !== null).forEach((day) => {
    const x = margin + currentCol * colWidth;
    const y = calendarStartY + currentRow * rowHeight;
    const dayOfWeek = new Date(currentYear, currentMonth - 1, day).getDay();

    // Shade weekend cells with a very pale blue.
    if (isWeekend(dayOfWeek)) {
      doc.setFillColor(...weekendBlue);
      doc.rect(x, y, colWidth, rowHeight, "F");
    }

    // Draw cell border in primary blue.
    doc.setDrawColor(...primaryBlue);
    doc.rect(x, y, colWidth, rowHeight);

    // Draw a header bar at the top of each day cell using lightBlue.
    doc.setFillColor(...lightBlue);
    doc.rect(x, y, colWidth, 6, "F");
    // Add a border stroke to the light blue header.
    doc.setDrawColor(...primaryBlue);
    doc.rect(x, y, colWidth, 6, "S");

    // Print the day number in the cell header.
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBlue);
    doc.text(`${day}`, x + 2, y + 4);

    // Get the shifts for this day.
    const shiftsForDay =
      dayOfWeek === 0 ? shifts.sunday :
      dayOfWeek === 5 ? shifts.friday :
      dayOfWeek === 6 ? shifts.saturday :
      shifts.weekday;

    // Start drawing shift blocks below the header.
    let shiftY = y + 8;
    // Set default shift time font size.
    const timeFontSize = 7;
    // And names font size (1 size larger).
    const namesFontSize = 8;
    // Set the darker font color (black).
    const darkColor: [number, number, number] = [0, 0, 0];

    shiftsForDay.forEach((shift, shiftIndex) => {
      const containerId = `${day}-${shiftIndex}`;
      const items = scheduleData?.containers?.[containerId] || [];
      const parsedNames = items.map((item) => parseName(item));

      // Sunday-specific formatting.
      if (dayOfWeek === 0) {
        if (parsedNames.length === 0) {
          // Print time in bold.
          doc.setFont("helvetica", "bold");
          doc.setFontSize(timeFontSize);
          doc.setTextColor(...darkColor);
          doc.text(shift, x + 2, shiftY + shiftPadding);
          shiftY += 4 + extraSpacing;
        } else {
          const sortedNames = [...parsedNames].sort((a, b) => a.length - b.length);
          // Row 1: shift time + first 2 names.
          doc.setFont("helvetica", "bold");
          doc.setFontSize(timeFontSize);
          doc.setTextColor(...darkColor);
          doc.text(shift, x + 2, shiftY + shiftPadding);
          const shiftWidth = doc.getTextWidth(shift + " ");

          // Now print names 1 font size larger and in normal style.
          doc.setFont("helvetica", "normal");
          doc.setFontSize(namesFontSize);
          doc.text(sortedNames.slice(0, 2).join(", "), x + 2 + shiftWidth, shiftY + shiftPadding);

          // Row 2: next up to 3 names (if available).
          if (sortedNames.length > 2) {
            shiftY += 4 + extraSpacing;
            doc.text(sortedNames.slice(2, 5).join(", "), x + 2, shiftY + shiftPadding);
          }

          // Row 3: add a blank row for spacing if there are additional names.
          if (sortedNames.length > 5) {
            shiftY += 4 + extraSpacing;
            // Row 4: remaining names.
            doc.text(sortedNames.slice(5).join(", "), x + 2, shiftY + shiftPadding);
            shiftY += 4 + extraSpacing;
          } else {
            shiftY += 4 + extraSpacing;
          }
        }
      } else {
        // Non-Sunday formatting.
        if (parsedNames.length === 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(timeFontSize);
          doc.setTextColor(...darkColor);
          doc.text(shift, x + 2, shiftY + shiftPadding);
          shiftY += 4 + extraSpacing;
        } else if (parsedNames.length <= 2) {
          const sortedNames = [...parsedNames].sort((a, b) => a.length - b.length);
          const namesLine = sortedNames.join(", ");
          // Print shift time in bold.
          doc.setFont("helvetica", "bold");
          doc.setFontSize(timeFontSize);
          doc.setTextColor(...darkColor);
          doc.text(shift, x + 2, shiftY + shiftPadding);
          const shiftWidth = doc.getTextWidth(shift + " ");

          // Print names in normal font, one size larger.
          doc.setFont("helvetica", "normal");
          doc.setFontSize(namesFontSize);
          doc.text(namesLine, x + 2 + shiftWidth, shiftY + shiftPadding);
          shiftY += 6 + extraSpacing;
        } else {
          const sortedNames = [...parsedNames].sort((a, b) => a.length - b.length);
          const firstRowNames = sortedNames.slice(0, 2).join(", ");
          const secondRowNames = sortedNames.slice(2).join(", ");
          // Print time.
          doc.setFont("helvetica", "bold");
          doc.setFontSize(timeFontSize);
          doc.setTextColor(...darkColor);
          doc.text(shift, x + 2, shiftY + shiftPadding);
          const shiftWidth = doc.getTextWidth(shift + " ");
          // Print first row names.
          doc.setFont("helvetica", "normal");
          doc.setFontSize(namesFontSize);
          doc.text(firstRowNames, x + 2 + shiftWidth, shiftY + shiftPadding);
          // Print second row names.
          doc.text(secondRowNames, x + 2, shiftY + shiftPadding + 3);
          shiftY += 9 + extraSpacing;
        }
      }
    });

    // Move to the next day cell.
    currentCol++;
    if (currentCol === 7) {
      currentCol = 0;
      currentRow++;
    }
  });

  // Save the PDF.
  doc.save(`${monthName.toLowerCase()}-sales-schedule.pdf`);
}
