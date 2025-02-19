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
  const rowHeight = 34;
  const calendarStartY = weekdayHeaderY + 7;
  const isWeekend = (dayIndex: number) => dayIndex === 0 || dayIndex === 6;

  const shiftPadding = 1;
  let currentRow = 0;
  let currentCol = firstDayOfMonth;

  // Dark font color for shifts
  const darkColor: [number, number, number] = [0, 0, 0];

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

    doc.setFillColor(...lightBlue);
    doc.rect(x, y, colWidth, 6, "F");
    doc.setDrawColor(...primaryBlue);
    doc.rect(x, y, colWidth, 6, "S");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBlue);
    doc.text(`${day}`, x + 2, y + 4);

    let shiftY = y + 8;
    const timeFontSize = 8;
    const namesFontSize = 8;

    shiftsForDay.forEach((shift: string, shiftIndex: number) => {
      const containerId = `${day}-${shiftIndex}`;
      const items = scheduleData?.containers?.[containerId] || [];
      const filteredItems = filterItems(items, salesFilter);
      const parsedNames = filteredItems.map((item) => parseName(item));
      
      const maxShiftSpace = rowHeight - 8;
      const spacePerShift = maxShiftSpace / shiftsForDay.length;
      const isOffShift = shiftIndex === shiftsForDay.length - 1;
      const offShiftOffset = isOffShift ? 1 : 0;
      
      shiftY = y + 8 + (spacePerShift * shiftIndex) + offShiftOffset;

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

        if (parsedNames.length <= 2) {
          const namesLine = sortedNames.join(", ");
          doc.text(namesLine, x + 2 + shiftWidth, shiftY + shiftPadding);
        } else {
          doc.text(sortedNames.slice(0, 2).join(", "), x + 2 + shiftWidth, shiftY + shiftPadding);
          doc.text(sortedNames.slice(2).join(", "), x + 2, shiftY + shiftPadding + 3);
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
