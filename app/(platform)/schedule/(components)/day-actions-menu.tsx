"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Trash2, ChevronRight } from "lucide-react";

interface DayActionsMenuProps {
  day: number;
  containers: Record<string, string[]>;
  prevMonthContainers?: Record<string, string[]>;
  onCopySchedule: (newContainers: Record<string, string[]>) => void;
  onClearDay: () => void;
  currentMonth: number;
  currentYear: number;
}

export function DayActionsMenu({
  day,
  containers,
  prevMonthContainers,
  onCopySchedule,
  onClearDay,
  currentMonth,
  currentYear
}: DayActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCopyOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to get the day of week (0-6, where 0 is Sunday)
  const getDayOfWeek = (dayOfMonth: number, month = currentMonth, year = currentYear) => {
    // month is 1-indexed in our props but Date expects 0-indexed
    return new Date(year, month - 1, dayOfMonth).getDay();
  };

  // Helper function to get all future days with the same weekday in the month
  const getFutureSameWeekdays = (currentDay: number) => {
    const currentDayOfWeek = getDayOfWeek(currentDay);
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const futureDays: number[] = [];
    
    for (let day = currentDay + 7; day <= daysInMonth; day += 7) {
      if (getDayOfWeek(day) === currentDayOfWeek) {
        futureDays.push(day);
      }
    }
    
    return futureDays;
  };

  // Helper function to get all days in future weeks
  const getFutureWeekDays = (currentDay: number) => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const currentWeekStart = currentDay - getDayOfWeek(currentDay); // Get Sunday of current week
    const futureWeeks: number[][] = [];
    
    // Start from the next week
    let weekStart = currentWeekStart + 7;
    while (weekStart <= daysInMonth) {
      const weekDays: number[] = [];
      // Get all days in this week (if they exist in the month)
      for (let i = 0; i < 7; i++) {
        const day = weekStart + i;
        if (day <= daysInMonth) {
          weekDays.push(day);
        }
      }
      if (weekDays.length > 0) {
        futureWeeks.push(weekDays);
      }
      weekStart += 7;
    }
    
    return futureWeeks;
  };

  // Helper function to copy from a specific day
  const copyFromDay = (sourceDay: number, targetDays?: number[], fromPrevMonth: boolean = false) => {
    const daysToApplyTo = targetDays || [day];
    const newContainers: Record<string, string[]> = {};
    
    const sourceContainers = fromPrevMonth ? prevMonthContainers : containers;
    if (!sourceContainers) return;
    
    // Loop through all containers to find ones for the source day
    Object.entries(sourceContainers).forEach(([key, items]) => {
      if (key === "salespeople-list" || key === "special-labels-list") return;
      
      const [containerDay, shiftIndex] = key.split("-");
      
      if (containerDay === String(sourceDay)) {
        // Create new keys for all target days with the same shift index
        daysToApplyTo.forEach(targetDay => {
          const targetKey = `${targetDay}-${shiftIndex}`;
          
          // Clone all items with new timestamps
          const clonedItems = items.map(item => {
            const baseId = item.includes("::") ? item.split("::")[0] : item;
            return baseId + "::" + Date.now();
          });
          
          newContainers[targetKey] = clonedItems;
        });
      }
    });
    
    onCopySchedule(newContainers);
    setIsOpen(false);
    setShowCopyOptions(false);
  };

  // Helper function to copy an entire week
  const copyWeek = (sourceWeekStart: number, targetWeeks: number[][]) => {
    const newContainers: Record<string, string[]> = {};
    
    // Get all containers for the source week
    Object.entries(containers).forEach(([key, items]) => {
      if (key === "salespeople-list" || key === "special-labels-list") return;
      
      const [containerDay, shiftIndex] = key.split("-");
      const dayNum = parseInt(containerDay);
      
      // Check if this container is from the source week
      if (dayNum >= sourceWeekStart && dayNum < sourceWeekStart + 7) {
        const dayOffset = dayNum - sourceWeekStart; // 0 for Sunday, 1 for Monday, etc.
        
        // Apply to each target week
        targetWeeks.forEach(weekDays => {
          if (weekDays[dayOffset]) { // Make sure the day exists in the target week
            const targetKey = `${weekDays[dayOffset]}-${shiftIndex}`;
            
            // Clone all items with new timestamps
            const clonedItems = items.map(item => {
              const baseId = item.includes("::") ? item.split("::")[0] : item;
              return baseId + "::" + Date.now();
            });
            
            newContainers[targetKey] = clonedItems;
          }
        });
      }
    });
    
    onCopySchedule(newContainers);
  };

  // Get the weekday name
  const weekdayName = new Date(currentYear, currentMonth - 1, day).toLocaleDateString('en-US', { weekday: 'long' });

  // Add this helper function at the top with the other helpers
  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Day actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-7 bg-white shadow-md rounded-md border border-gray-200 p-2 z-50 w-56">
          <div className="flex flex-col gap-1">
            {!showCopyOptions ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-between text-xs h-8 gap-2"
                  onClick={() => setShowCopyOptions(true)}
                >
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy schedule
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Clear all assignments for day ${day}?`)) {
                      onClearDay();
                    }
                    setIsOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear this day
                </Button>
              </>
            ) : (
              <>
                <div className="px-2 py-1 text-xs font-medium text-gray-500 border-b mb-1">
                  Copy from:
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => {
                    // If we're in the first 7 days of the month, copy from previous month
                    if (day <= 7 && prevMonthContainers) {
                      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
                      const prevMonthName = new Date(prevYear, prevMonth - 1).toLocaleString('default', { month: 'long' });
                      const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
                      const targetDayOfWeek = getDayOfWeek(day);
                      
                      // Find the matching day in the last week of previous month
                      let matchingDay = daysInPrevMonth;
                      while (getDayOfWeek(matchingDay, prevMonth, prevYear) !== targetDayOfWeek) {
                        matchingDay--;
                      }

                      if (window.confirm(
                        `This will copy the schedule from ${prevMonthName}'s ${weekdayName} (${matchingDay}${getOrdinalSuffix(matchingDay)}) to this ${weekdayName}.\n\n` +
                        "The schedule will be copied exactly as it was. Continue?"
                      )) {
                        copyFromDay(matchingDay, undefined, true);
                      }
                    } else {
                      // Regular previous week copy within the same month
                      copyFromDay(day - 7);
                    }
                  }}
                >
                  Previous week {day <= 7 ? "(from last month)" : `(day ${day - 7})`}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => copyFromDay(day - 1)}
                >
                  Yesterday (day {day - 1})
                </Button>

                <div className="border-t my-1" />

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => {
                    const futureDays = getFutureSameWeekdays(day);
                    if (futureDays.length > 0) {
                      if (window.confirm(`Apply this schedule to all future ${weekdayName}s this month? (Days ${futureDays.join(", ")})`)) {
                        copyFromDay(day, futureDays);
                      }
                    }
                  }}
                >
                  Apply to all future {weekdayName}s
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => {
                    const weekStart = day - getDayOfWeek(day); // Get Sunday of current week
                    const futureWeeks = getFutureWeekDays(day);
                    
                    if (futureWeeks.length > 0) {
                      const weekRanges = futureWeeks.map(week => 
                        `Week ${Math.floor(week[0] / 7) + 1} (${week[0]}-${week[week.length - 1]})`
                      ).join(", ");
                      
                      if (window.confirm(
                        `This will copy the entire schedule from Week ${Math.floor(weekStart / 7) + 1} (days ${weekStart}-${weekStart + 6}) to:\n\n` +
                        `${weekRanges}\n\n` +
                        `Each day's schedule will be copied to the same day of the week in future weeks. Continue?`
                      )) {
                        copyWeek(weekStart, futureWeeks);
                      }
                    }
                  }}
                >
                  Copy week to future weeks
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8 mt-1 border-t pt-1"
                  onClick={() => setShowCopyOptions(false)}
                >
                  Back
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 