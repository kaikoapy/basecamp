"use client";
import { useEffect, useState } from "react";
import { generateMonthlySchedule, DaySchedule } from "../lib/scheduling";
import { ScheduleInfoDialog } from "./ScheduleInfoDialog";

interface DateState {
  year: number;
  month: number; // 0-11
}

export default function ScheduleDisplay() {
  // Use simple numbers instead of Date object for initial state
  const [currentDate, setCurrentDate] = useState<DateState | null>(null);
  const [data, setData] = useState<DaySchedule[]>([]);

  useEffect(() => {
    // Set initial date state using simple numbers
    const now = new Date();
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth(),
    });
  }, []);

  useEffect(() => {
    if (currentDate) {
      const schedule = generateMonthlySchedule(
        currentDate.year,
        currentDate.month
      );
      setData(schedule);
    }
  }, [currentDate]);

  const getCloseTime = (weekday: number) => {
    return weekday === 5 || weekday === 6 ? "11am-7pm" : "11am-8pm";
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToNextMonth = () => {
    if (currentDate) {
      const newMonth = currentDate.month === 11 ? 0 : currentDate.month + 1;
      const newYear =
        currentDate.month === 11 ? currentDate.year + 1 : currentDate.year;
      setCurrentDate({
        year: newYear,
        month: newMonth,
      });
    }
  };

  const goToPreviousMonth = () => {
    if (currentDate) {
      const newMonth = currentDate.month === 0 ? 11 : currentDate.month - 1;
      const newYear =
        currentDate.month === 0 ? currentDate.year - 1 : currentDate.year;
      setCurrentDate({
        year: newYear,
        month: newMonth,
      });
    }
  };

  if (!currentDate) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Previous Month
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">
            {monthNames[currentDate.month]} Schedule
          </h1>
          <ScheduleInfoDialog />
        </div>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Next Month
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {data.map((day, idx) => {
          const d = day.date;
          const dayOfMonth = d.getDate();

          // Base classes for the cell
          let cellClasses = "border p-2 rounded-lg";
          if (day.isNextMonth) {
            cellClasses += " bg-purple-50"; // Highlight days from next month
          }
          if (day.isPrevMonth) {
            cellClasses += " bg-gray-50"; // Highlight days from previous month
          }
          if (day.isEffectiveLastDay) {
            cellClasses += " border-2 border-purple-500"; // Highlight effective last day
          }

          // If it's a closed holiday
          if (
            day.holiday &&
            day.open.length === 0 &&
            day.mid.length === 0 &&
            day.close.length === 0
          ) {
            return (
              <div
                key={idx}
                className={`${cellClasses} bg-red-100 border-red-300 flex flex-col items-center justify-center min-h-[300px] text-center p-4`}
              >
                <div className="font-bold text-lg mb-4">
                  {
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      day.weekday
                    ]
                  }{" "}
                  {dayOfMonth}
                </div>
                <div className="text-3xl font-bold text-red-600 mb-4">
                  {day.holiday === "New Year's Day" && "🎉 Happy New Year! 🎊"}
                  {day.holiday === "Christmas" && "🎄 Merry Christmas! 🎅"}
                  {day.holiday === "Thanksgiving" &&
                    "🦃 Happy Thanksgiving! 🍁"}
                </div>
                <div className="text-red-600 font-semibold text-xl border-t border-b border-red-300 py-3 px-6 mb-2">
                  Dealership Closed
                </div>
                <div className="text-red-500">
                  In Observance of {day.holiday}
                </div>
              </div>
            );
          }

          // Sunday schedule
          if (day.weekday === 0) {
            return (
              <div key={idx} className={cellClasses}>
                <div className="font-bold mb-2">
                  Sun {dayOfMonth}
                  {day.isNextMonth && (
                    <span className="text-purple-600 ml-1"></span>
                  )}
                  {day.holiday && (
                    <div className="text-red-600 text-sm">{day.holiday}</div>
                  )}
                  {day.isEffectiveLastDay && (
                    <div className="text-purple-600 text-sm">Final Day</div>
                  )}
                </div>
                <div className="font-medium text-blue-800 mb-1">
                  Sunday Shift (12pm-5pm):
                </div>
                <div className="bg-blue-100 p-2 rounded-md mb-2">
                  {day.sundayShift?.map((name) => (
                    <div key={name} className="text-blue-800">
                      {name}
                    </div>
                  ))}
                </div>
                <div className="font-medium text-gray-600 mb-1">Off:</div>
                <div className="bg-gray-100 p-2 rounded-md">
                  {day.offList.map((name) => (
                    <div key={name} className="text-gray-700">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Mon-Sat schedule
          return (
            <div key={idx} className={cellClasses}>
              <div className="font-bold mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.weekday]}{" "}
                {dayOfMonth}
                {day.isNextMonth && (
                  <span className="text-purple-600 ml-1"></span>
                )}
                {day.holiday && (
                  <div className="text-red-600 text-sm">{day.holiday}</div>
                )}
                {day.isEffectiveLastDay && (
                  <div className="text-purple-600 text-sm">Final Day</div>
                )}
              </div>
              <div className="font-medium text-yellow-700 mb-1">
                Open (8:30am-5:30pm):
              </div>
              <div className="bg-yellow-100 p-2 rounded-md mb-2">
                {day.open.map((name) => (
                  <div key={name} className="text-yellow-700">
                    {name}
                  </div>
                ))}
              </div>

              <div className="font-medium text-green-700 mb-1">
                Mid (9am-6pm):
              </div>
              <div className="bg-green-100 p-2 rounded-md mb-2">
                {day.mid.map((name) => (
                  <div key={name} className="text-green-700">
                    {name}
                  </div>
                ))}
              </div>

              <div className="font-medium text-blue-700 mb-1">
                Close ({getCloseTime(day.weekday)}):
              </div>
              <div className="bg-blue-100 p-2 rounded-md mb-2">
                {day.close.map((name) => (
                  <div key={name} className="text-blue-700">
                    {name}
                  </div>
                ))}
              </div>

              <div className="font-medium text-gray-600 mb-1">Off:</div>
              <div className="bg-gray-100 p-2 rounded-md">
                {day.offList.map((name) => (
                  <div key={name} className="text-gray-700">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
