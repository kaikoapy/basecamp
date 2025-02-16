"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getDaysInMonth, daysOfWeek, shifts, parseName } from "../utils";

const PrintableSchedule = () => {
  // Use current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

  // Load schedule from Convex
  const scheduleData = useQuery(api.schedule.getSchedule, { month: currentMonth, year: currentYear });

  // Calendar days calculation
  const calendarDays = Array.from(
    { length: daysInMonth + firstDayOfMonth },
    (_, i) => (i < firstDayOfMonth ? null : i - firstDayOfMonth + 1)
  );

  if (!scheduleData) return <div>Loading...</div>;

  return (
    <div className="p-4 print-schedule">
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5cm;
          }
          .print-schedule {
            width: 100%;
          }
          .day-card {
            border: 1px solid #ddd;
            break-inside: avoid;
            padding: 4px;
            margin: 1px;
          }
          .shift-time {
            font-size: 7px;
            color: #666;
            margin-bottom: 2px;
          }
          .person-tag {
            font-size: 7px;
            padding: 2px 4px;
            border-radius: 3px;
            display: inline-block;
            margin: 1px;
          }
          .person-tag.special {
            background: white;
            border: 1px solid black;
            color: black;
          }
          .person-tag.regular {
            background: black;
            color: white;
          }
          .day-header {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          .month-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .day-label {
            font-size: 9px;
            font-weight: bold;
            text-align: center;
          }
        }
      `}</style>
      <h1 className="month-title">{monthName} Sales Schedule</h1>
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map(day => (
          <div key={day} className="day-label">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) =>
          day ? (
            <div key={day} className="day-card">
              <div className="day-header">
                {daysOfWeek[new Date(currentYear, currentMonth - 1, day).getDay()]} {day}
              </div>
              {(() => {
                const dayOfWeek = new Date(currentYear, currentMonth - 1, day).getDay();
                const shiftsForDay = dayOfWeek === 0 ? shifts.sunday :
                                   dayOfWeek === 5 ? shifts.friday :
                                   dayOfWeek === 6 ? shifts.saturday :
                                   shifts.weekday;
                
                return shiftsForDay.map((shift, shiftIndex) => {
                  const containerId = `${day}-${shiftIndex}`;
                  const items = scheduleData.containers?.[containerId] || [];
                  return (
                    <div key={shiftIndex}>
                      <div className="shift-time">{shift}</div>
                      <div className="flex flex-wrap">
                        {items.map(item => {
                          const baseName = parseName(item);
                          const isSpecial = item.startsWith("special:");
                          return (
                            <div
                              key={item}
                              className={`person-tag ${isSpecial ? 'special' : 'regular'}`}
                            >
                              {baseName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div key={`empty-${idx}`} className="day-card" />
          )
        )}
      </div>
    </div>
  );
};

export default PrintableSchedule; 