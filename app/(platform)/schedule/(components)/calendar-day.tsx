"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { defaultShifts, daysOfWeek } from "../utils";
import { useMemo, useState, useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Plus, X } from "lucide-react";
import { StaffSelectorPopup } from "./staff-selector-popup";
import { DayActionsMenu } from "./day-actions-menu";

interface CalendarDayProps {
  day: number;
  dayOfWeek: number;
  containers: Record<string, string[]>;
  currentMonth: number;
  currentYear: number;
  onUpdateContainers: (newContainers: Record<string, string[]>) => void;
  isEditMode: boolean;
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  prevScheduleData?: { containers: Record<string, string[]> };
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
  setSalesFilter,
  prevScheduleData
}: CalendarDayProps) {
  // Get shifts from database
  const shifts = useQuery(api.shifts.getShifts) ?? defaultShifts;
  
  // Get sales staff data for filtering
  const salesStaffData = useQuery(api.schedule.getSalesStaff);

  // State for the staff selector popup
  const [activeShiftIndex, setActiveShiftIndex] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Add a click outside handler
  useEffect(() => {
    if (activeShiftIndex !== null) {
      const handleClickOutside = (e: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
          setActiveShiftIndex(null);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeShiftIndex]);

  // Handle closing the staff selector popup
  const handleCloseStaffSelector = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveShiftIndex(null);
  };

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

  // Handle adding a staff member to a shift
  const handleAddStaff = (staffId: string, shiftIndex: number) => {
    const containerId = `${day}-${shiftIndex}`;
    const currentItems = containers[containerId] || [];
    
    // Check if staff is already in the shift (by base ID without timestamp)
    const baseStaffId = staffId.includes("::") ? staffId.split("::")[0] : staffId;
    const isAlreadyInShift = currentItems.some(item => {
      const baseItemId = item.includes("::") ? item.split("::")[0] : item;
      return baseItemId === baseStaffId;
    });
    
    if (isAlreadyInShift) {
      // Remove the staff member
      const updatedItems = currentItems.filter(item => {
        const baseItemId = item.includes("::") ? item.split("::")[0] : item;
        return baseItemId !== baseStaffId;
      });
      
      onUpdateContainers({
        [containerId]: updatedItems
      });
    } else {
      // Add the staff member
      const cloneId = (baseStaffId) + "::" + Date.now();
      
      onUpdateContainers({
        [containerId]: [...currentItems, cloneId]
      });
    }
  };

  // Handle clearing all staff from this day
  const handleClearDay = () => {
    const updatedContainers: Record<string, string[]> = {};
    
    // Find all containers for this day and set them to empty arrays
    Object.keys(containers).forEach(key => {
      if (key === "salespeople-list" || key === "special-labels-list") return;
      
      const [containerDay] = key.split("-");
      if (containerDay === String(day)) {
        updatedContainers[key] = [];
      }
    });
    
    onUpdateContainers(updatedContainers);
  };

  // Add this helper function to count scheduled staff
  const getScheduledStaffCount = () => {
    // Get all unique staff IDs scheduled for this day (across all shifts)
    const scheduledStaffIds = new Set<string>();
    
    Object.entries(containers).forEach(([key, items]) => {
      if (key === "salespeople-list" || key === "special-labels-list") return;
      
      const [containerDay] = key.split("-");
      if (containerDay === String(day)) {
        items.forEach(item => {
          if (!item.startsWith("special:")) {
            // Extract the base ID without timestamp
            const baseId = item.includes("::") ? item.split("::")[0] : item;
            // Remove "new:" or "used:" prefix if present
            const cleanId = baseId.startsWith("new:") || baseId.startsWith("used:") 
              ? baseId.substring(baseId.indexOf(":") + 1)
              : baseId;
            
            // Find the staff member
            const staff = salesStaffData?.find(s => s._id === cleanId);
            if (staff) {
              // Only add if it matches the current filter
              if (salesFilter === "all" || staff.type === salesFilter) {
                scheduledStaffIds.add(cleanId);
              }
            }
          }
        });
      }
    });

    // Filter staff based on current filter
    const availableStaff = (salesStaffData || []).filter(staff => {
      if (salesFilter === "all") return true;
      return staff.type === salesFilter;
    });

    return {
      scheduled: scheduledStaffIds.size,
      total: availableStaff.length
    };
  };

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
          <div className="flex items-center gap-2">
            {isEditMode && (
              <div className="text-xs text-gray-500">
                {(() => {
                  const { scheduled, total } = getScheduledStaffCount();
                  const isComplete = scheduled === total;
                  return (
                    <span className={isComplete ? "text-green-600" : "text-amber-600"}>
                      {scheduled}/{total} scheduled
                    </span>
                  );
                })()}
              </div>
            )}
            {isEditMode && (
              <div className="no-print">
                <DayActionsMenu
                  day={day}
                  containers={containers}
                  prevMonthContainers={prevScheduleData?.containers}
                  onCopySchedule={(newContainers) => {
                    onUpdateContainers(newContainers);
                  }}
                  onClearDay={handleClearDay}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                />
              </div>
            )}
          </div>
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
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-semibold text-gray-900">{shift}</div>
                {isEditMode && (
                  <div className="relative">
                    {activeShiftIndex === index ? (
                      // Separate close button when popup is open - styled identically to the Button
                      <div 
                        role="button"
                        className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer"
                        style={{ margin: '0', padding: '0' }} // Ensure no additional spacing
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setActiveShiftIndex(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </div>
                    ) : (
                      // Open button - explicitly set dimensions to match close button
                      <div
                        role="button"
                        className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                        style={{ margin: '0', padding: '0' }} // Ensure no additional spacing
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setActiveShiftIndex(index);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </div>
                    )}
                    
                    {activeShiftIndex === index && (
                      <div 
                        className="absolute z-50 staff-selector-popup" 
                        onClick={(e) => e.stopPropagation()}
                        ref={popupRef}
                      >
                        <StaffSelectorPopup
                          salesStaffData={salesStaffData}
                          specialLabels={containers["special-labels-list"] || []}
                          onSelect={(staffId) => {
                            handleAddStaff(staffId, index);
                            handleCloseStaffSelector();
                          }}
                          onClose={handleCloseStaffSelector}
                          containerId={containerId}
                          salesFilter={salesFilter}
                          setSalesFilter={setSalesFilter}
                          day={day}
                          dayOfWeek={dayOfWeek}
                          shift={shift}
                          currentStaff={containers[containerId] || []}
                          allDayContainers={containers}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
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