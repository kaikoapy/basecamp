"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { parseName, shifts, daysOfWeek } from "../utils";
import { CopyScheduleButton } from "./copy-schedule-button";
import { useMemo } from "react";

interface CalendarDayProps {
  day: number;
  dayOfWeek: number;
  containers: Record<string, string[]>;
  currentMonth: number;
  currentYear: number;
  onUpdateContainers: (newContainers: Record<string, string[]>) => void;
  isEditMode: boolean;
}

export function CalendarDay({ 
  day, 
  dayOfWeek, 
  containers,
  currentMonth,
  currentYear,
  onUpdateContainers,
  isEditMode,
}: CalendarDayProps) {
  const isSunday = dayOfWeek === 0;
  const isFriday = dayOfWeek === 5;
  const isSaturday = dayOfWeek === 6;
  
  // Check if this is today's date
  const isToday = useMemo(() => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth - 1 && 
           today.getFullYear() === currentYear;
  }, [day, currentMonth, currentYear]);
  
  let shiftsForDay;
  if (isSunday) {
    shiftsForDay = shifts.sunday;
  } else if (isFriday) {
    shiftsForDay = shifts.friday;
  } else if (isSaturday) {
    shiftsForDay = shifts.saturday;
  } else {
    shiftsForDay = shifts.weekday;
  }

  return (
    <Card key={`day-${day}`} className="m-1 calendar-card">
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="font-bold">
              {daysOfWeek[dayOfWeek]} {day}
            </div>
            {isToday && (
              <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Today
              </div>
            )}
          </div>
          {isEditMode && (
            <div className="no-print">
              <CopyScheduleButton
                day={day}
                dayOfWeek={dayOfWeek}
                currentMonth={currentMonth}
                currentYear={currentYear}
                containers={containers}
                onCopySchedule={(newContainers) => {
                  onUpdateContainers(newContainers);
                }}
              />
            </div>
          )}
        </div>
        {shiftsForDay.map((shift, index) => {
          const containerId = `${day}-${index}`;
          const items = containers[containerId] || [];
          
          // Get background color based on shift index
          const getItemBgColor = (isSpecial: boolean) => {
            if (isSpecial) return "bg-white";
            switch(index) {
              case 0: return "bg-yellow-100"; // Morning shift
              case 1: return "bg-blue-100";   // Mid shift
              case 2: return "bg-purple-100"; // Closing shift
              default: return "bg-gray-100";  // Default/fallback
            }
          };

          return (
            <div key={containerId} className="mb-2 last:mb-0">
              <div className="text-sm font-semibold text-gray-900 mb-1">{shift}</div>
              {isEditMode ? (
                <DroppableContainer id={containerId}>
                  <div className="flex flex-wrap gap-1 min-h-[24px]">
                    {items.map(item => {
                      const isSpecial = item.startsWith("special:");
                      return (
                        <DraggableItem 
                          key={item} 
                          id={item} 
                          containerId={containerId}
                        >
                          <div className={`${getItemBgColor(isSpecial)} ${isSpecial ? "border border-black" : ""} text-gray-800 px-3 py-2 rounded-md shadow-sm text-xs`}>
                            {parseName(item)}
                          </div>
                        </DraggableItem>
                      );
                    })}
                  </div>
                </DroppableContainer>
              ) : (
                <div className="flex flex-wrap gap-1 min-h-[24px]">
                  {items.map(item => {
                    const isSpecial = item.startsWith("special:");
                    return (
                      <div 
                        key={item}
                        className={`${getItemBgColor(isSpecial)} ${isSpecial ? "border border-black" : ""} text-gray-900 px-3 py-1 rounded-md font-semibold shadow-sm text-sm`}
                      >
                        {parseName(item)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 