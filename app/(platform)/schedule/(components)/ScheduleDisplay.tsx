"use client";
import { useEffect, useState } from "react";
import { DaySchedule } from "../lib/scheduling"; // types remain the same
import { ScheduleInfoDialog } from "./ScheduleInfoDialog";
import { ZoomIn, ZoomOut } from "lucide-react";

interface DateState {
  year: number;
  month: number; // 0-11
}

export default function ScheduleDisplay() {
  const [currentDate, setCurrentDate] = useState<DateState | null>(null);
  const [data, setData] = useState<DaySchedule[]>([]);
  const [zoom, setZoom] = useState(1); // 1 is default, < 1 is zoomed out, > 1 is zoomed in

  // Set the initial date to the current month/year.
  useEffect(() => { 
    const now = new Date();
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth(),
    });
  }, []);

  // Instead of generating the schedule locally with generateMonthlySchedule,
  // fetch it from an API that reads from the database or runs your backend logic.
  useEffect(() => {
    if (currentDate) {
      fetch(`/api/schedule?year=${currentDate.year}&month=${currentDate.month}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((fetchedData: DaySchedule[]) => {
          setData(fetchedData);
        })
        .catch((err) => {
          console.error("Failed to fetch schedule:", err);
        });
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
      const newYear = currentDate.month === 11 ? currentDate.year + 1 : currentDate.year;
      setCurrentDate({ year: newYear, month: newMonth });
    }
  };

  const goToPreviousMonth = () => {
    if (currentDate) {
      const newMonth = currentDate.month === 0 ? 11 : currentDate.month - 1;
      const newYear = currentDate.month === 0 ? currentDate.year - 1 : currentDate.year;
      setCurrentDate({ year: newYear, month: newMonth });
    }
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  if (!currentDate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Previous Month
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {monthNames[currentDate.month]} Schedule
          </h1>
          <ScheduleInfoDialog />
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={zoomIn}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Next Month
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <div
          className="grid grid-cols-7 gap-2 h-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            height: `${100 / zoom}%`,
          }}
        >
          {data.map((day, idx) => {
            const d = day.date;
            const dayOfMonth = new Date(d).getDate(); // ensure date object
            const today = new Date();
            const isToday =
              new Date(d).getDate() === today.getDate() &&
              new Date(d).getMonth() === today.getMonth() &&
              new Date(d).getFullYear() === today.getFullYear();
            const isPastDay = new Date(d) < new Date(today.setHours(0, 0, 0, 0));

            // Base classes for the cell
            let cellClasses = "border p-2 rounded-lg text-sm relative";
            if (day.isNextMonth) {
              cellClasses += " bg-purple-50"; // Highlight days from next month
            }
            if (day.isPrevMonth) {
              cellClasses += " bg-gray-50"; // Highlight days from previous month
            }
            if (day.isEffectiveLastDay) {
              cellClasses += " border-2 border-purple-500"; // Highlight effective last day
            }
            if (isToday) {
              cellClasses += " border-2 border-blue-500"; // Highlight current day
            }

            const pastDayOverlay = isPastDay ? (
              <div className="absolute inset-0 bg-gray-600/30 rounded-lg pointer-events-none" />
            ) : null;

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
                  className={`${cellClasses} bg-red-100 border-red-300 flex flex-col items-center justify-center text-center`}
                >
                  {pastDayOverlay}
                  <div className="font-bold mb-1">
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        day.weekday
                      ]
                    }{" "}
                    {dayOfMonth}
                  </div>
                  <div className="font-bold text-red-600">
                    {day.holiday === "New Year's Day" && "🎉 Happy New Year!"}
                    {day.holiday === "Christmas" && "🎄 Merry Christmas!"}
                    {day.holiday === "Thanksgiving" && "🦃 Happy Thanksgiving!"}
                  </div>
                  <div className="text-red-600 font-semibold">Closed</div>
                </div>
              );
            }

            const renderDateHeader = () => (
              <div className="font-bold flex items-center justify-between gap-1">
                <span>
                  {day.weekday === 0
                    ? "Sun"
                    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        day.weekday
                      ]}{" "}
                  {dayOfMonth}
                </span>
                <div className="flex gap-1">
                  {isToday && (
                    <span className="text-blue-600 text-xs px-1.5 py-0.5 bg-blue-50 rounded-full">
                      Today
                    </span>
                  )}
                  {day.holiday && (
                    <span className="text-red-600 text-xs px-1.5 py-0.5 bg-red-50 rounded-full">
                      {day.holiday}
                    </span>
                  )}
                  {day.isEffectiveLastDay && (
                    <span className="text-purple-600 text-xs px-1.5 py-0.5 bg-purple-50 rounded-full">
                      Final Day
                    </span>
                  )}
                </div>
              </div>
            );

            if (day.weekday === 0) {
              return (
                <div key={idx} className={cellClasses}>
                  {pastDayOverlay}
                  {renderDateHeader()}
                  <div className="font-medium text-gray-900 text-xs">
                    Sunday (12pm-5pm):
                  </div>
                  <div className="bg-blue-100 p-1 rounded-md text-xs mb-1">
                    <div className="flex flex-wrap gap-1">
                      {day.sundayShift?.map((name) => (
                        <div key={name} className="text-gray-900">
                          {name}
                          {day.sundayShift &&
                          day.sundayShift.indexOf(name) <
                            day.sundayShift.length - 1
                            ? ","
                            : ""}
                          &nbsp;
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 text-xs">Off:</div>
                  <div className="bg-gray-100 p-1 rounded-md text-xs">
                    <div className="flex flex-wrap gap-1">
                      {day.offList.map((name) => (
                        <div key={name} className="text-gray-900">
                          {name}
                          {day.offList.indexOf(name) < day.offList.length - 1
                            ? ","
                            : ""}
                          &nbsp;
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className={cellClasses}>
                {pastDayOverlay}
                {renderDateHeader()}
                <div className="space-y-1">
                  <div>
                    <div className="font-medium text-gray-900 text-xs">
                      Open (8:30am-5:30pm):
                    </div>
                    <div className="bg-yellow-100 p-1 rounded-md text-xs">
                      <div className="flex flex-wrap gap-1">
                        {day.open.map((name) => (
                          <div key={name} className="text-gray-900">
                            {name}
                            {day.open.indexOf(name) < day.open.length - 1
                              ? ","
                              : ""}
                            &nbsp;
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 text-xs">
                      Mid (9am-6pm):
                    </div>
                    <div className="bg-green-100 p-1 rounded-md text-xs">
                      <div className="flex flex-wrap gap-1">
                        {day.mid.map((name) => (
                          <div key={name} className="text-gray-900">
                            {name}
                            {day.mid.indexOf(name) < day.mid.length - 1
                              ? ","
                              : ""}
                            &nbsp;
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 text-xs">
                      Close ({getCloseTime(day.weekday)}):
                    </div>
                    <div className="bg-blue-100 p-1 rounded-md text-xs">
                      <div className="flex flex-wrap gap-1">
                        {day.close.map((name) => (
                          <div key={name} className="text-gray-900">
                            {name}
                            {day.close.indexOf(name) < day.close.length - 1
                              ? ","
                              : ""}
                            &nbsp;
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 text-xs">
                      Off:
                    </div>
                    <div className="bg-gray-100 p-1 rounded-md text-xs">
                      <div className="flex flex-wrap gap-1">
                        {day.offList.map((name) => (
                          <div key={name} className="text-gray-900">
                            {name}
                            {day.offList.indexOf(name) < day.offList.length - 1
                              ? ","
                              : ""}
                            &nbsp;
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
