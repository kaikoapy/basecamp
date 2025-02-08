// --------------------------------------------------
// 1. Types, Enums, and Interfaces
// --------------------------------------------------

/**
 * Enum for weekdays for clarity.
 */
export enum Weekday {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export interface MonthlySchedule {
  schedule: DaySchedule[];
  nextSundayRotationOffset: number;
}

/**
 * Employee interface.
 */
export interface Employee {
  name: string;
  fixedOffDay: Weekday; // e.g., Weekday.Tuesday means Tuesday off.
  sundaySchedule: boolean; // true if employee is scheduled to work on the first Sunday of the month.
}

/**
 * Holiday interface.
 */
export interface Holiday {
  month: number; // 0-11 (0 = January)
  day: number;   // 1-31
  name: string;
  isClosed: boolean; // if true, the business is closed on that holiday.
}

/**
 * DaySchedule interface represents one day in the calendar.
 * Note: We cache holiday details on the day so that later code doesn’t need to recompute it.
 */
export interface DaySchedule {
  date: Date;
  weekday: Weekday;
  open: string[];
  mid: string[];
  close: string[];
  offList: string[];
  forcedCloser: string[];
  forcedOpener: string[];
  weekendOff?: string;
  sundayShift?: string[];
  // Cached holiday info (if any)
  holiday?: string;
  holidayDetails?: Holiday;
  // Flags to indicate if this day belongs to the previous/next month or is the effective last day.
  isNextMonth?: boolean;
  isEffectiveLastDay?: boolean;
  isPrevMonth?: boolean;
}

// --------------------------------------------------
// 2. Holiday Definitions and Date Utilities
// --------------------------------------------------

// Define holidays.
const HOLIDAYS: Holiday[] = [
  { month: 11, day: 31, name: "New Year's Eve", isClosed: false },
  { month: 0, day: 1, name: "New Year's Day", isClosed: true },
  { month: 11, day: 25, name: "Christmas", isClosed: true },
];

/**
 * Checks if a given date is a holiday.
 * Includes a special case for Thanksgiving (the 4th Thursday of November).
 *
 * @param date The date to check.
 * @returns The matching Holiday object or null.
 */
function isHoliday(date: Date): Holiday | null {
  // Special case: Thanksgiving (4th Thursday of November)
  if (date.getMonth() === 10) { // November (month index 10)
    const firstDay = new Date(date.getFullYear(), 10, 1);
    const firstThursday =
      firstDay.getDay() <= Weekday.Thursday
        ? firstDay.getDate() + (Weekday.Thursday - firstDay.getDay())
        : firstDay.getDate() + (7 + Weekday.Thursday - firstDay.getDay());
    const thanksgivingDate = firstThursday + 21; // 4th Thursday
    if (date.getDate() === thanksgivingDate) {
      return {
        month: 10,
        day: thanksgivingDate,
        name: "Thanksgiving",
        isClosed: true,
      };
    }
  }

  return (
    HOLIDAYS.find(
      (h) => h.month === date.getMonth() && h.day === date.getDate()
    ) || null
  );
}

/**
 * Computes the effective last business day of the month.
 * Starting from the calendar’s last day, moves forward until a non-holiday, weekday is found.
 *
 * @param year The year.
 * @param monthIndex The month index (0-based).
 * @returns The effective last business day.
 */
function getEffectiveLastDay(year: number, monthIndex: number): Date {
  const lastCalendarDay = new Date(year, monthIndex + 1, 0);
  let candidate = new Date(lastCalendarDay);

  while (true) {
    const holiday = isHoliday(candidate);
    const isWeekend = candidate.getDay() === Weekday.Sunday || candidate.getDay() === Weekday.Saturday;
    if (!holiday && !isWeekend) {
      break;
    }
    // Move to next day (even if it enters the next month)
    candidate = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate() + 1);
  }
  return candidate;
}

// --------------------------------------------------
// 3. Calendar Building and Caching Holiday Data
// --------------------------------------------------

/**
 * Builds the full grid of calendar days for a given month.
 * This includes spillover days from the previous and next months.
 * Each day is flagged with properties (e.g., isPrevMonth, isNextMonth, and holiday info).
 *
 * @param year The year.
 * @param monthIndex The month (0 = January, …, 11 = December).
 * @returns Array of DaySchedule objects.
 */
function createCalendarDays(year: number, monthIndex: number): DaySchedule[] {
  const schedule: DaySchedule[] = [];

  // Determine the first day of the month and how many previous month days to show.
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const daysFromPrevMonth = firstDayOfMonth.getDay(); // number of days from previous month
  const startDate = new Date(year, monthIndex, 1 - daysFromPrevMonth);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const effectiveLastDay = getEffectiveLastDay(year, monthIndex);
  const includeExtraDays = effectiveLastDay.getMonth() !== monthIndex;

  // Total days to display.
  let totalDays = daysInMonth + daysFromPrevMonth;
  if (includeExtraDays) {
    // Extend grid until reaching the effective last day.
    totalDays = (effectiveLastDay.getDate() + daysFromPrevMonth);
  }

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const weekday = currentDate.getDay() as Weekday;
    const holiday = isHoliday(currentDate);
    const isEffectiveLastDay = currentDate.getTime() === effectiveLastDay.getTime();
    const isPrevMonth = currentDate.getMonth() !== monthIndex;

    const day: DaySchedule = {
      date: currentDate,
      weekday,
      open: [],
      mid: [],
      close: [],
      offList: [],
      forcedCloser: [],
      forcedOpener: [],
      isNextMonth: currentDate.getMonth() > monthIndex,
      isPrevMonth,
      isEffectiveLastDay,
    };

    // Cache holiday information (if any) on the day
    if (holiday) {
      day.holiday = holiday.name;
      day.holidayDetails = holiday;
    }

    // Initialize Sunday shift array for Sundays (unless a closed holiday)
    if (weekday === Weekday.Sunday && !holiday?.isClosed) {
      day.sundayShift = [];
    }

    schedule.push(day);
  }

  return schedule;
}

// --------------------------------------------------
// 4. Scheduling Rule Functions
// --------------------------------------------------

/**
 * Marks each day with employees’ fixed off days.
 * Skips days that are closed holidays or the effective last day.
 *
 * @param schedule The calendar grid.
 * @param employees The array of employees.
 */
function applyFixedOffDays(schedule: DaySchedule[], employees: Employee[]): void {
  schedule.forEach((day) => {
    // Skip days where business rules dictate no off assignment.
    if (day.holidayDetails?.isClosed || day.isEffectiveLastDay) {
      return;
    }
    employees.forEach((emp) => {
      if (emp.fixedOffDay === day.weekday) {
        day.offList.push(emp.name);
      }
    });
  });
}

/**
 * Applies the Sunday rotation logic.
 * - For non‑last Sundays, the rotation is computed solely from those Sundays.
 *   * When the rotation index is even, employees with sundaySchedule:true are OFF,
 *     and employees with sundaySchedule:false are WORKING.
 *   * When the rotation index is odd, the reverse happens.
 * - The last Sunday is always overridden so that everyone works.
 *
 * @param schedule The calendar grid.
 * @param employees The array of employees.
 */
function applySundayRotation(schedule: DaySchedule[], employees: Employee[]): void {
  // Collect non-last Sundays (exclude any Sunday that is the last of the month)
  const nonLastSundays: { day: DaySchedule; rotationIndex: number }[] = [];
  schedule.forEach((day) => {
    if (day.weekday === Weekday.Sunday && day.sundayShift) {
      // Determine if this Sunday is the last Sunday of the month.
      const nextSunday = new Date(day.date);
      nextSunday.setDate(day.date.getDate() + 7);
      const isLastSunday = nextSunday.getMonth() !== day.date.getMonth();
      if (!isLastSunday) {
        nonLastSundays.push({ day, rotationIndex: nonLastSundays.length });
      }
    }
  });

  // Apply rotation logic to all non-last Sundays.
  // In this revised logic:
  // - When rotationIndex is even (0, 2, ...), employees with sundaySchedule:true are OFF.
  // - When rotationIndex is odd (1, 3, ...), employees with sundaySchedule:true are WORKING.
  nonLastSundays.forEach(({ day, rotationIndex }) => {
    employees.forEach((emp) => {
      // Invert the original logic so that on rotationIndex 0, employees with sundaySchedule:true are off.
      const shouldWork = (emp.sundaySchedule && rotationIndex % 2 !== 0) ||
                         (!emp.sundaySchedule && rotationIndex % 2 === 0);
      if (shouldWork) {
        day.sundayShift!.push(emp.name);
      } else {
        day.offList.push(emp.name);
      }
    });
  });

  // Now process last Sundays: override so that everyone works (i.e. no one is off)
  schedule.forEach((day) => {
    if (day.weekday === Weekday.Sunday && day.sundayShift) {
      const nextSunday = new Date(day.date);
      nextSunday.setDate(day.date.getDate() + 7);
      const isLastSunday = nextSunday.getMonth() !== day.date.getMonth();
      if (isLastSunday) {
        // Override: clear any off assignments and assign every employee to work.
        day.offList = [];
        day.sundayShift = employees.map((emp) => emp.name);
      }
    }
  });
}



/**
 * Assigns a rotating weekend off.
 * On Saturday (if conditions are met), one eligible employee is chosen for an off assignment,
 * based on employees who are off on the following Sunday.
 *
 * @param schedule The calendar grid.
 * @param employees The array of employees.
 */
function applyWeekendRotation(schedule: DaySchedule[], employees: Employee[]): void {
  let weekendRotationIndex = 0;
  for (let i = 0; i < schedule.length; i++) {
    const day = schedule[i];

    // Skip days that are the effective last day.
    if (day.isEffectiveLastDay) continue;

    // If the next day is a closed Sunday, skip weekend rotation.
    const nextDay = schedule[i + 1];
    if (
      nextDay &&
      nextDay.weekday === Weekday.Sunday &&
      nextDay.holidayDetails?.isClosed
    ) {
      continue;
    }

    if (day.weekday === Weekday.Saturday && !day.holidayDetails?.isClosed && nextDay?.weekday === Weekday.Sunday) {
      // Identify eligible employees: those working on Saturday (not off) but off on Sunday.
      const eligible = employees
        .filter(
          (emp) =>
            !day.offList.includes(emp.name) &&
            nextDay.offList.includes(emp.name)
        )
        .map((emp) => emp.name);

      if (eligible.length > 0) {
        const chosen = eligible[weekendRotationIndex % eligible.length];
        weekendRotationIndex++;
        day.offList.push(chosen);
        day.weekendOff = chosen;
      }
    }
  }
}

/**
 * Applies forced shift rules.
 * Forced openers are those who are off on the next day, while forced closers are those who were off on the previous day.
 *
 * @param schedule The calendar grid.
 */
function applyForcedShifts(schedule: DaySchedule[]): void {
  for (let i = 0; i < schedule.length; i++) {
    const currentDay = schedule[i];
    const nextDay = schedule[i + 1] || null;
    const prevDay = i > 0 ? schedule[i - 1] : null;

    // Skip days that are closed or the effective last day.
    if (currentDay.holidayDetails?.isClosed || currentDay.isEffectiveLastDay) continue;

    // Forced openers: if an employee is off tomorrow, they must open today.
    if (nextDay && nextDay.weekday !== Weekday.Sunday && !nextDay.holidayDetails?.isClosed) {
      nextDay.offList.forEach((name) => {
        if (!currentDay.offList.includes(name)) {
          currentDay.forcedOpener.push(name);
        }
      });
    }

    // Forced closers: if an employee was off yesterday, they must close today.
    if (prevDay && prevDay.weekday !== Weekday.Sunday && !prevDay.holidayDetails?.isClosed && currentDay.weekday !== Weekday.Sunday) {
      prevDay.offList.forEach((name) => {
        if (!currentDay.offList.includes(name)) {
          currentDay.forcedCloser.push(name);
        }
      });
    }
  }
}

/**
 * Distributes shift roles (open, mid, close) among working employees.
 * Special handling is applied for forced shift assignments and for Friday/Saturday transitions.
 *
 * @param schedule The calendar grid.
 * @param employees The array of employees.
 */
function distributeShifts(schedule: DaySchedule[], employees: Employee[]): void {
  schedule.forEach((day, i) => {
    // Skip days that are closed or Sundays.
    if (day.holidayDetails?.isClosed || day.weekday === Weekday.Sunday) return;

    const nextDay = schedule[i + 1] || null;
    // Determine working employees: those not in the off list.
    const workingEmployees = employees.map((emp) => emp.name)
      .filter((name) => !day.offList.includes(name));

    if (day.isEffectiveLastDay) {
      // On the effective last day, everyone works.
      const total = employees.length;
      const openCount = 2;
      const midCount = Math.floor((total - openCount) / 2);
      day.open = employees.map((emp) => emp.name).slice(0, openCount);
      day.mid = employees.map((emp) => emp.name).slice(openCount, openCount + midCount);
      day.close = employees.map((emp) => emp.name).slice(openCount + midCount);
    } else {
      // Start with forced openers.
      day.open.push(...day.forcedOpener);
      const remainingOpenSlots = 2 - day.forcedOpener.length;

      if (remainingOpenSlots > 0) {
        // Choose additional openers from those not forced to close.
        const availableForOpen = workingEmployees.filter(
          (name) =>
            !day.forcedOpener.includes(name) &&
            !day.forcedCloser.includes(name)
        );

        // For Friday, avoid selecting someone who will open on Saturday.
        if (day.weekday === Weekday.Friday && nextDay && nextDay.weekday === Weekday.Saturday) {
          const filtered = availableForOpen.filter(
            (name) => !nextDay.offList.includes(name)
          );
          day.open.push(...filtered.slice(0, remainingOpenSlots));
        }
        // For Saturday, avoid employees who opened on Friday.
        else if (day.weekday === Weekday.Saturday && i > 0) {
          const prevDay = schedule[i - 1];
          const filtered = availableForOpen.filter(
            (name) => !prevDay.open.includes(name)
          );
          day.open.push(...filtered.slice(0, remainingOpenSlots));
        }
        else {
          day.open.push(...availableForOpen.slice(0, remainingOpenSlots));
        }
      }

      // Determine remaining employees and assign them to mid and close.
      const remainingEmployees = workingEmployees.filter((name) => !day.open.includes(name));
      const forcedCloserCount = day.forcedCloser.length;
      const targetCloserCount = Math.ceil(remainingEmployees.length / 2);
      const additionalClosersNeeded = Math.max(0, targetCloserCount - forcedCloserCount);

      const availableForAssignment = remainingEmployees.filter(
        (name) => !day.forcedCloser.includes(name)
      );
      if (availableForAssignment.length > 0) {
        const additionalClosers = availableForAssignment.slice(0, additionalClosersNeeded);
        const midShifts = availableForAssignment.slice(additionalClosersNeeded);
        day.mid = midShifts;
        day.close = [...day.forcedCloser, ...additionalClosers];
      } else {
        day.close = [...day.forcedCloser];
      }
    }
  });
}

// --------------------------------------------------
// 5. Main Schedule Generator (Parameterized Dependencies)
// --------------------------------------------------

/**
 * Generates the monthly schedule.
 * All dependencies (such as the employee list) are passed in so that the logic is flexible and reusable.
 *
 * Business Rules (documented inline):
 *  - The calendar grid includes spillover days from previous/next months.
 *  - Holidays are precomputed and cached on each day.
 *  - Each employee’s fixed off day is marked.
 *  - Sunday shifts are assigned based on rotation rules.
 *  - A rotating weekend off is applied on Saturday when conditions are met.
 *  - Forced shift assignments are computed from adjacent days.
 *  - Shift roles (open, mid, close) are then distributed among working employees.
 *
 * @param year The year.
 * @param monthIndex The month (0-based).
 * @param employees Array of Employee objects.
 * @returns An array of DaySchedule objects for the month.
 */
export function generateMonthlySchedule(
  year: number,
  monthIndex: number,
  employees: Employee[],
  sundayRotationOffset: number = 0  // 0 or 1; default is 0
): MonthlySchedule {
  // 1. Build the calendar grid.
  const schedule = createCalendarDays(year, monthIndex);

  // 2. Apply fixed off days.
  applyFixedOffDays(schedule, employees);

  // 3. Compute the Sunday rotation using our offset.
  // We'll collect all non-last Sundays (i.e. those used in the rotation).
  const nonLastSundays: { day: DaySchedule; rotationIndex: number }[] = [];
  schedule.forEach((day) => {
    if (day.weekday === Weekday.Sunday && day.sundayShift) {
      const nextSunday = new Date(day.date);
      nextSunday.setDate(day.date.getDate() + 7);
      const isLastSunday = nextSunday.getMonth() !== day.date.getMonth();
      if (!isLastSunday) {
        // rotation index is our starting offset plus the count of non-last Sundays so far
        nonLastSundays.push({ day, rotationIndex: sundayRotationOffset + nonLastSundays.length });
      }
    }
  });

  // Apply rotation on non-last Sundays.
  // In this revised logic:
  //   - When rotationIndex is even, employees with sundaySchedule:true are OFF
  //   - When rotationIndex is odd, employees with sundaySchedule:true are WORKING
  nonLastSundays.forEach(({ day, rotationIndex }) => {
    employees.forEach((emp) => {
      const shouldWork = (emp.sundaySchedule && rotationIndex % 2 !== 0) ||
                         (!emp.sundaySchedule && rotationIndex % 2 === 0);
      if (shouldWork) {
        day.sundayShift!.push(emp.name);
      } else {
        day.offList.push(emp.name);
      }
    });
  });

  // Process the last Sunday(s) of the month.
  // We want to force all employees to work on the last Sunday.
  // However, we also compute what the rotation index WOULD have been if it were counted.
  let lastSundayRotationIndex: number | null = null;
  schedule.forEach((day) => {
    if (day.weekday === Weekday.Sunday && day.sundayShift) {
      const nextSunday = new Date(day.date);
      nextSunday.setDate(day.date.getDate() + 7);
      const isLastSunday = nextSunday.getMonth() !== day.date.getMonth();
      if (isLastSunday) {
        // This is the last Sunday.
        lastSundayRotationIndex = sundayRotationOffset + nonLastSundays.length;
        // Force: Clear offList and assign everyone to work.
        day.offList = [];
        day.sundayShift = employees.map((emp) => emp.name);
      }
    }
  });

  // 4. Compute the new offset for the next month.
  // If the forced last Sunday would have resulted in an off day (for, say, employees with sundaySchedule:true),
  // then we add one to the rotation count to "flip" the order.
  let newOffset: number;
  if (lastSundayRotationIndex !== null) {
    // For example, if our convention is that even rotation means sundaySchedule:true would be off,
    // then check that:
    const lastSundayWouldHaveBeenOff = (lastSundayRotationIndex % 2 === 0);
    newOffset = (sundayRotationOffset + nonLastSundays.length + (lastSundayWouldHaveBeenOff ? 1 : 0)) % 2;
  } else {
    newOffset = (sundayRotationOffset + nonLastSundays.length) % 2;
  }

  // 5. Apply other scheduling rules.
  applyWeekendRotation(schedule, employees);
  applyForcedShifts(schedule);
  distributeShifts(schedule, employees);

  return { schedule, nextSundayRotationOffset: newOffset };
}


// --------------------------------------------------
// 6. Example Usage
// --------------------------------------------------

// (You can remove or modify this section as needed.)
const employees: Employee[] = [
  { name: "Ron", fixedOffDay: Weekday.Tuesday, sundaySchedule: true },
  { name: "Moudy", fixedOffDay: Weekday.Tuesday, sundaySchedule: false },
  { name: "Juan", fixedOffDay: Weekday.Wednesday, sundaySchedule: true },
  { name: "Amr", fixedOffDay: Weekday.Wednesday, sundaySchedule: false },
  { name: "Steven", fixedOffDay: Weekday.Thursday, sundaySchedule: true },
  { name: "Alex", fixedOffDay: Weekday.Monday, sundaySchedule: false },
  { name: "Gabriel", fixedOffDay: Weekday.Thursday, sundaySchedule: true },
  { name: "Gio", fixedOffDay: Weekday.Friday, sundaySchedule: false },
  { name: "Tito", fixedOffDay: Weekday.Friday, sundaySchedule: true },
];

// For example, generate the schedule for February 2025 (monthIndex = 1)
const monthlySchedule = generateMonthlySchedule(2025, 1, employees);
console.log(JSON.stringify(monthlySchedule, null, 2));
