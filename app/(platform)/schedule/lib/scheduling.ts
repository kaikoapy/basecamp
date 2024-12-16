export interface Employee {
  name: string;
  fixedOffDay: number; // 0=Sun, 1=Mon, 2=Tue, ... 6=Sat
  sundaySchedule: boolean; // true = works first Sunday of the month
}

export interface DaySchedule {
  date: Date;
  weekday: number; // 0=Sun, 1=Mon, ... 6=Sat
  open: string[];
  mid: string[];
  close: string[];
  offList: string[];
  forcedCloser: string[];
  forcedOpener: string[];
  weekendOff?: string;
  sundayShift?: string[];
  holiday?: string;
  isNextMonth?: boolean; // True if this day is from the next month
  isEffectiveLastDay?: boolean; // True if this is the effective last day
  isPrevMonth?: boolean; // True if this day is from the previous month
}

interface Holiday {
  month: number; // 0-11
  day: number; // 1-31
  name: string;
  isClosed: boolean;
}

const HOLIDAYS: Holiday[] = [
  { month: 11, day: 31, name: "New Year's Eve", isClosed: false },
  { month: 0, day: 1, name: "New Year's Day", isClosed: true },
  { month: 11, day: 25, name: "Christmas", isClosed: true },
];

function isHoliday(date: Date): Holiday | null {
  // Special case for Thanksgiving (4th Thursday of November)
  if (date.getMonth() === 10) {
    // November
    const firstDay = new Date(date.getFullYear(), 10, 1);
    const firstThursday =
      firstDay.getDay() <= 4
        ? firstDay.getDate() + (4 - firstDay.getDay())
        : firstDay.getDate() + (11 - firstDay.getDay());
    const thanksgiving = firstThursday + 21; // 4th Thursday

    if (date.getDate() === thanksgiving) {
      return {
        month: 10,
        day: thanksgiving,
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

function getEffectiveLastDay(year: number, monthIndex: number): Date {
  const lastDay = new Date(year, monthIndex + 1, 0);
  let currentDate = new Date(lastDay);

  // Keep moving forward until we find a valid business day
  while (true) {
    const holiday = isHoliday(currentDate);
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    if (!holiday && !isWeekend) {
      break;
    }

    // Move to next day (even if it's in next month)
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
  }

  return currentDate;
}

export function generateMonthlySchedule(
  year: number,
  monthIndex: number
): DaySchedule[] {
  const employees: Employee[] = [
    { name: "Ron", fixedOffDay: 2, sundaySchedule: true }, // Tuesday
    { name: "Moudy", fixedOffDay: 2, sundaySchedule: false }, // Tuesday
    { name: "Juan", fixedOffDay: 3, sundaySchedule: true }, // Wednesday
    { name: "Amr", fixedOffDay: 3, sundaySchedule: false }, // Wednesday
    { name: "Kai", fixedOffDay: 1, sundaySchedule: true }, // Monday
    { name: "Alex", fixedOffDay: 1, sundaySchedule: false }, // Monday
    { name: "Gabriel", fixedOffDay: 4, sundaySchedule: true }, // Thursday
    { name: "Gio", fixedOffDay: 5, sundaySchedule: false }, // Friday
    { name: "Tito", fixedOffDay: 5, sundaySchedule: true }, // Friday
  ];

  // Get the first day of the month
  const firstDayOfMonth = new Date(year, monthIndex, 1);

  // Calculate how many days we need from the previous month
  const daysFromPrevMonth = firstDayOfMonth.getDay();

  // Get the start date (last Sunday of previous month if month doesn't start on Sunday)
  const startDate = new Date(year, monthIndex, 1 - daysFromPrevMonth);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const effectiveLastDay = getEffectiveLastDay(year, monthIndex);
  const schedule: DaySchedule[] = [];
  const includeExtraDays = effectiveLastDay.getMonth() !== monthIndex;

  let weekendRotationIndex = 0;

  // Calculate total days to generate
  let totalDays = daysInMonth + daysFromPrevMonth;
  if (includeExtraDays) {
    // Add days until we reach the effective last day
    const extraDays = effectiveLastDay.getDate();
    totalDays = daysInMonth + daysFromPrevMonth + extraDays;
  }

  // 1) Initialize each day
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const weekday = currentDate.getDay();
    const holiday = isHoliday(currentDate);
    const isEffectiveLastDay =
      currentDate.getTime() === effectiveLastDay.getTime();
    const isPrevMonth = currentDate.getMonth() !== monthIndex;

    // For closed holidays - no one works and no one is "off"
    if (holiday?.isClosed) {
      schedule.push({
        date: currentDate,
        weekday,
        open: [],
        mid: [],
        close: [],
        offList: [], // Changed: no one is marked as "off" on holidays
        forcedCloser: [],
        forcedOpener: [],
        holiday: holiday.name,
        isNextMonth: currentDate.getMonth() > monthIndex,
        isPrevMonth: isPrevMonth,
      });
      continue;
    }

    const daySchedule: DaySchedule = {
      date: currentDate,
      weekday,
      open: [],
      mid: [],
      close: [],
      offList: [],
      forcedCloser: [],
      forcedOpener: [],
      holiday: holiday?.name,
      isNextMonth: currentDate.getMonth() > monthIndex,
      isPrevMonth: isPrevMonth,
      isEffectiveLastDay,
    };

    if (weekday === 0) {
      daySchedule.sundayShift = [];
    }
    schedule.push(daySchedule);
  }

  // 2) Mark fixed days off and handle Sunday rotation
  for (let i = 0; i < schedule.length; i++) {
    const daySchedule = schedule[i];
    const { weekday, date } = daySchedule;
    const weekNumber = Math.floor(i / 7);
    const holiday = isHoliday(date);

    // Skip off day assignment for holidays (regular or closed) and effective last day
    if (!holiday && !daySchedule.isEffectiveLastDay) {
      employees.forEach((emp) => {
        // Handle fixed off day
        if (emp.fixedOffDay === weekday) {
          daySchedule.offList.push(emp.name);
        }

        // Handle Sunday rotation
        if (weekday === 0) {
          // Check if this is the last Sunday of the month
          const nextSunday = new Date(date);
          nextSunday.setDate(date.getDate() + 7);
          const isLastSundayOfMonth = nextSunday.getMonth() !== date.getMonth();

          if (isLastSundayOfMonth) {
            // On last Sunday, everyone works
            if (!daySchedule.offList.includes(emp.name)) {
              daySchedule.sundayShift!.push(emp.name);
            }
          } else {
            // Regular Sunday rotation
            const shouldWork =
              (emp.sundaySchedule && weekNumber % 2 === 0) ||
              (!emp.sundaySchedule && weekNumber % 2 === 1);
            if (!shouldWork) {
              daySchedule.offList.push(emp.name);
            } else if (!daySchedule.offList.includes(emp.name)) {
              daySchedule.sundayShift!.push(emp.name);
            }
          }
        }
      });
    }
  }

  // 3) Rotating Saturday+Sunday weekend
  for (let i = 0; i < schedule.length; i++) {
    const daySchedule = schedule[i];
    const isLastSundayTomorrow =
      i + 1 < schedule.length &&
      schedule[i + 1].weekday === 0 &&
      isHoliday(schedule[i + 1].date)?.isClosed;

    // Skip weekend assignment if it affects a holiday or is effective last day
    if (daySchedule.isEffectiveLastDay || isLastSundayTomorrow) continue;

    if (daySchedule.weekday === 6 && !isHoliday(daySchedule.date)?.isClosed) {
      // Saturday
      const nextDay = i + 1 < schedule.length ? schedule[i + 1] : null;
      if (
        !nextDay ||
        nextDay.weekday !== 0 ||
        isHoliday(nextDay.date)?.isClosed
      )
        continue;

      const eligibleForWeekend = employees
        .filter(
          (emp) =>
            !daySchedule.offList.includes(emp.name) &&
            nextDay.offList.includes(emp.name)
        )
        .map((emp) => emp.name);

      if (eligibleForWeekend.length > 0) {
        const chosenPerson =
          eligibleForWeekend[weekendRotationIndex % eligibleForWeekend.length];
        weekendRotationIndex++;

        daySchedule.offList.push(chosenPerson);
        daySchedule.weekendOff = chosenPerson;
      }
    }
  }

  // 4) Handle forced opens and closes
  for (let i = 0; i < schedule.length; i++) {
    const currDay = schedule[i];
    const nextDay = i + 1 < schedule.length ? schedule[i + 1] : null;
    const prevDay = i > 0 ? schedule[i - 1] : null;

    if (!isHoliday(currDay.date)?.isClosed && !currDay.isEffectiveLastDay) {
      // Force opens for those off tomorrow
      if (
        nextDay &&
        nextDay.weekday !== 0 &&
        !isHoliday(nextDay.date)?.isClosed
      ) {
        nextDay.offList.forEach((name) => {
          if (!currDay.offList.includes(name)) {
            currDay.forcedOpener.push(name);
          }
        });
      }

      // Force closes for those off yesterday
      if (
        prevDay &&
        prevDay.weekday !== 0 &&
        currDay.weekday !== 0 &&
        !isHoliday(prevDay.date)?.isClosed
      ) {
        prevDay.offList.forEach((name) => {
          if (!currDay.offList.includes(name)) {
            currDay.forcedCloser.push(name);
          }
        });
      }
    }
  }

  // 5) Distribute shifts
  for (let i = 0; i < schedule.length; i++) {
    const daySchedule = schedule[i];
    const nextDay = i + 1 < schedule.length ? schedule[i + 1] : null;

    // Skip holidays and Sundays
    if (isHoliday(daySchedule.date)?.isClosed || daySchedule.weekday === 0)
      continue;

    const workingEmployees = employees
      .map((e) => e.name)
      .filter((name) => !daySchedule.offList.includes(name));

    if (daySchedule.isEffectiveLastDay) {
      // Last day - everyone works
      const totalEmployees = employees.length;
      const openCount = 2;
      const remainingCount = totalEmployees - openCount;
      const midCount = Math.floor(remainingCount / 2);

      daySchedule.open = employees.map((e) => e.name).slice(0, openCount);
      daySchedule.mid = employees
        .map((e) => e.name)
        .slice(openCount, openCount + midCount);
      daySchedule.close = employees
        .map((e) => e.name)
        .slice(openCount + midCount, totalEmployees);
    } else {
      // Normal day
      // Handle forced openers
      daySchedule.open.push(...daySchedule.forcedOpener);

      // Fill remaining opener slots (max 2)
      const remainingOpenSlots = 2 - daySchedule.forcedOpener.length;
      if (remainingOpenSlots > 0) {
        const availableForOpen = workingEmployees.filter(
          (name) =>
            !daySchedule.forcedOpener.includes(name) &&
            !daySchedule.forcedCloser.includes(name)
        );

        // Special handling for Friday openers to prevent same person opening Saturday
        if (daySchedule.weekday === 5 && nextDay && nextDay.weekday === 6) {
          // Filter out people who will be working Saturday and aren't off
          const availableForFriday = availableForOpen.filter(
            (name) => !nextDay.offList.includes(name)
          );
          daySchedule.open.push(
            ...availableForFriday.slice(0, remainingOpenSlots)
          );
        } else if (daySchedule.weekday === 6) {
          // For Saturday, filter out people who opened on Friday
          const prevDay = schedule[i - 1];
          const availableForSaturday = availableForOpen.filter(
            (name) => !prevDay.open.includes(name)
          );
          daySchedule.open.push(
            ...availableForSaturday.slice(0, remainingOpenSlots)
          );
        } else {
          // Normal day distribution
          daySchedule.open.push(
            ...availableForOpen.slice(0, remainingOpenSlots)
          );
        }
      }

      // Get remaining employees to distribute (not openers)
      const remainingEmployees = workingEmployees.filter(
        (name) => !daySchedule.open.includes(name)
      );

      // Count forced closers
      const forcedCloserCount = daySchedule.forcedCloser.length;

      // Calculate additional closers needed
      const totalToDistribute = remainingEmployees.length;
      const targetCloserCount = Math.ceil(totalToDistribute / 2);
      const additionalClosersNeeded = Math.max(
        0,
        targetCloserCount - forcedCloserCount
      );

      // Get non-forced employees to distribute
      const availableToDistribute = remainingEmployees.filter(
        (name) => !daySchedule.forcedCloser.includes(name)
      );

      // Distribute to mid and close
      if (availableToDistribute.length > 0) {
        const additionalClosers = availableToDistribute.slice(
          0,
          additionalClosersNeeded
        );
        const midShifts = availableToDistribute.slice(additionalClosersNeeded);

        daySchedule.mid = midShifts;
        daySchedule.close = [...daySchedule.forcedCloser, ...additionalClosers];
      } else {
        daySchedule.close = daySchedule.forcedCloser;
      }
    }
  }

  return schedule;
}
