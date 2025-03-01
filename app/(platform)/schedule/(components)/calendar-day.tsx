"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { defaultShifts, daysOfWeek } from "../utils";
import { CopyScheduleButton } from "./copy-schedule-button";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface CalendarDayProps {
  day: number;
  dayOfWeek: number;
  containers: Record<string, string[]>;
  currentMonth: number;
  currentYear: number;
  onUpdateContainers: (newContainers: Record<string, string[]>) => void;
  isEditMode: boolean;
  salesFilter: "all" | "new" | "used";
}

export function CalendarDay({ 
  day, 
  dayOfWeek, 
  containers,
  currentMonth,
  currentYear,
  onUpdateContainers,
  isEditMode,
  salesFilter,
}: CalendarDayProps) {
  // Get shifts from database
  const shifts = useQuery(api.shifts.getShifts) ?? defaultShifts;
  
  // Get sales staff data for filtering
  const salesStaffData = useQuery(api.schedule.getSalesStaff);

  // Helper function to get display name from ID
  const getDisplayName = (id: string): string => {
    // If it's a special label
    if (id.startsWith("special:")) {
      // Extract the label name without the timestamp
      const labelWithPossibleTimestamp = id.substring("special:".length);
      // If it has a timestamp, remove it
      return labelWithPossibleTimestamp.includes("::") 
        ? labelWithPossibleTimestamp.split("::")[0] 
        : labelWithPossibleTimestamp;
    }
    
    // If it has a timestamp (cloned item)
    const baseId = id.includes("::") ? id.split("::")[0] : id;
    
    // Check for "new:" or "used:" prefix and remove it
    let cleanId = baseId;
    if (baseId.startsWith("new:") || baseId.startsWith("used:")) {
      cleanId = baseId.substring(baseId.indexOf(":") + 1);
    }
    
    // Find the staff member
    const staff = salesStaffData?.find(s => s._id === cleanId);
    if (!staff) {
      // For saved schedules, the ID might be in a different format
      // Check if it's a string that contains a name
      if (typeof cleanId === 'string' && cleanId.includes(" ")) {
        // This might be a legacy format where the ID is actually a name
        return cleanId.split(" ")[0]; // Return just the first name
      }
      return "Unknown";
    }
    
    // Get only the first name
    const displayName = staff.displayName || "";
    return displayName.split(" ")[0];
  };

  // Check if this is today's date
  const isToday = useMemo(() => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth - 1 && 
           today.getFullYear() === currentYear;
  }, [day, currentMonth, currentYear]);

  // Filter items based on salesFilter
  const filterItems = (items: string[]) => {
    return items.filter(item => {
      if (item.startsWith("special:")) return true; // Always show special labels
      if (salesFilter === "all") return true;
      
      // Extract the base ID (remove timestamp if present)
      const baseId = item.includes("::") ? item.split("::")[0] : item;
      
      // Check for "new:" or "used:" prefix
      if (baseId.startsWith("new:") && salesFilter === "new") return true;
      if (baseId.startsWith("used:") && salesFilter === "used") return true;
      
      // Remove prefix if present
      let cleanId = baseId;
      if (baseId.startsWith("new:") || baseId.startsWith("used:")) {
        cleanId = baseId.substring(baseId.indexOf(":") + 1);
      }
      
      // Find the staff member and check their type
      const staff = salesStaffData?.find(s => s._id === cleanId);
      
      // If staff not found, show in all filters to avoid hiding legacy data
      if (!staff) return true;
      
      return staff.type === salesFilter;
    });
  };
  
  // Get shifts for the current day
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const shiftsForDay = shifts[dayNames[dayOfWeek]];

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
        {shiftsForDay.map((shift: string, index: number) => {
          const containerId = `${day}-${index}`;
          const items = containers[containerId] || [];
          const filteredItems = filterItems(items);
          
          // Get background color based on shift index
          const getItemBgColor = (isSpecial: boolean) => {
            if (isSpecial) return "bg-white";
            // Check if this is an "Off" shift by name
            if (shift === "Off") return "bg-gray-100";
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
                    {filteredItems.map(item => {
                      const isSpecial = item.startsWith("special:");
                      return (
                        <DraggableItem 
                          key={item} 
                          id={item} 
                          containerId={containerId}
                        >
                          <div className={`${getItemBgColor(isSpecial)} ${isSpecial ? "border border-black" : ""} text-gray-800 px-3 py-2 rounded-md shadow-sm text-xs`}>
                            {getDisplayName(item)}
                          </div>
                        </DraggableItem>
                      );
                    })}
                  </div>
                </DroppableContainer>
              ) : (
                <div className="flex flex-wrap gap-1 min-h-[24px]">
                  {filteredItems.map(item => {
                    const isSpecial = item.startsWith("special:");
                    return (
                      <div 
                        key={item}
                        className={`${getItemBgColor(isSpecial)} ${isSpecial ? "border border-black" : ""} text-gray-900 px-3 py-1 rounded-md font-semibold shadow-sm text-sm`}
                      >
                        {getDisplayName(item)}
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