"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { parseName, shifts, daysOfWeek } from "../utils";
import { CopyScheduleButton } from "./copy-schedule-button";

interface CalendarDayProps {
  day: number;
  dayOfWeek: number;
  containers: Record<string, string[]>;
  currentMonth: number;
  currentYear: number;
  onUpdateContainers: (newContainers: Record<string, string[]>) => void;
}

export function CalendarDay({ 
  day, 
  dayOfWeek, 
  containers,
  currentMonth,
  currentYear,
  onUpdateContainers,
}: CalendarDayProps) {
  const isSunday = dayOfWeek === 0;
  const isFriday = dayOfWeek === 5;
  const isSaturday = dayOfWeek === 6;
  
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
          <div className="font-bold">
            {daysOfWeek[dayOfWeek]} {day}
          </div>
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
        </div>
        {shiftsForDay.map((shift, shiftIndex) => {
          const containerId = `${day}-${shiftIndex}`;
          const items = containers[containerId] || [];
          return (
            <DroppableContainer key={containerId} id={containerId}>
              <div className="flex flex-col">
                <div className="text-muted-foreground text-xs mb-1">{shift}</div>
                <div className="flex flex-wrap gap-1">
                  {items.map(item => {
                    const baseName = parseName(item);
                    const isSpecial = item.startsWith("special:");
                    return (
                      <DraggableItem key={item} id={item} containerId={containerId}>
                        {isSpecial ? (
                          <div className="bg-white text-black border border-black px-2 py-1 rounded-md shadow-sm m-1 text-xs">
                            {baseName}
                          </div>
                        ) : (
                          <div className={`text-black px-2 py-1 rounded-md shadow-sm m-1 text-xs ${
                            shiftIndex === 0 ? 'bg-yellow-100' :  // Opening shift
                            shiftIndex === 1 ? 'bg-blue-100' :    // Mid shift
                            shiftIndex === 2 ? 'bg-purple-100' :  // Closing shift
                            'bg-gray-100'                         // Off shift
                          }`}>
                            {baseName}
                          </div>
                        )}
                      </DraggableItem>
                    );
                  })}
                </div>
              </div>
            </DroppableContainer>
          );
        })}
      </CardContent>
    </Card>
  );
} 