"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarDay } from "./calendar-day";
import { getDaysInMonth, defaultSpecialLabels, daysOfWeek, defaultShifts } from "../utils";
import { isEqual } from "lodash";
import { useQueryState } from "nuqs";
import { createParser } from "nuqs";
import { useAdmin } from "@/hooks/use-admin";
import { ScheduleHeader } from "./schedule-header";
import { generateSchedulePDF } from "../utils/generate-pdf";

const numberParser = createParser({
  parse: (value: string) => parseInt(value),
  serialize: (value: number) => value.toString(),
});

interface CalendarDayInfo {
  day: number;
  month: number;
  year: number;
  isPrevMonth: boolean;
}

const CalendarSchedule: React.FC = () => {
  const { isAdmin, isLoaded } = useAdmin();

  // Use current date – note: we use 1-indexed month for our DB.
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Replace local state with URL state
  const [displayMonth, setDisplayMonth] = useQueryState(
    'month',
    numberParser.withDefault(currentMonth)
  );
  
  const [displayYear, setDisplayYear] = useQueryState(
    'year',
    numberParser.withDefault(currentYear)
  );

  // UI state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [salesFilter, setSalesFilter] = useState<"all" | "new" | "used">("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Load schedule and sales staff from Convex
  const scheduleData = useQuery(api.schedule.getSchedule, { 
    month: Number(displayMonth), 
    year: Number(displayYear) 
  });

  const prevScheduleData = useQuery(api.schedule.getSchedule, { 
    month: Number(displayMonth) === 1 ? 12 : Number(displayMonth) - 1, 
    year: Number(displayMonth) === 1 ? Number(displayYear) - 1 : Number(displayYear)
  });
  const salesStaffData = useQuery(api.schedule.getSalesStaff);
  const updateSchedule = useMutation(api.schedule.updateSchedule);
  const createSchedule = useMutation(api.schedule.createSchedule);

  // Memoize the default salespeople list
  const defaultSalespeople = useMemo(() => {
    if (!salesStaffData || salesStaffData.length === 0) {
      return [];
    }
    
    // Map each staff member to their ID string
    const result = salesStaffData.map(staff => {
      // Use the _id directly as the identifier
      return staff._id;
    });
    
    return result;
  }, [salesStaffData]);

  // Local state for all containers.
  const [containers, setContainers] = useState<Record<string, string[]>>({
    "salespeople-list": [],
    "special-labels-list": defaultSpecialLabels.map(label => "special:" + label),
  });

  // Update salespeople-list when defaultSalespeople changes
  useEffect(() => {
    if (defaultSalespeople.length > 0 && containers["salespeople-list"].length === 0) {
      setContainers(prev => ({
        ...prev,
        "salespeople-list": defaultSalespeople
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSalespeople]);

  // Single effect to handle both new and existing schedules
  useEffect(() => {
    if (!salesStaffData || scheduleData === undefined) return;

    // Don't update URL params if we're navigating to a non-existent schedule
    // This was causing issues with navigation
    if (scheduleData) {
      // Only update URL params if the schedule exists and the values are different
      if (scheduleData.month !== Number(displayMonth) || scheduleData.year !== Number(displayYear)) {
        setDisplayMonth(scheduleData.month);
        setDisplayYear(scheduleData.year);
      }
      
      // For existing schedules, load the containers
      if (scheduleData.containers) {
        // Check for any staff IDs in the schedule that don't match current staff
        if (salesStaffData && salesStaffData.length > 0) {
          const allStaffIds = new Set(salesStaffData.map(staff => String(staff._id)));
          
          // Check each container for staff IDs
          Object.entries(scheduleData.containers).forEach(([containerId, items]) => {
            if (containerId === "salespeople-list" || containerId === "special-labels-list") return;
            
            items.forEach(item => {
              if (!item.startsWith("special:")) {
                const baseId = item.includes("::") ? item.split("::")[0] : item;
                if (!allStaffIds.has(baseId)) {
                  // Staff ID not found in current staff
                }
              }
            });
          });
        }
        
        setContainers(scheduleData.containers);
      }
    } else if (scheduleData === null) {
      // For non-existent schedules, just initialize the containers with salespeople and special labels
      // but DON'T create a new schedule in the database yet
      
      const initialContainers = {
        "salespeople-list": containers["salespeople-list"].length > 0 
          ? containers["salespeople-list"] 
          : defaultSalespeople,
        "special-labels-list": containers["special-labels-list"].length > 0
          ? containers["special-labels-list"]
          : defaultSpecialLabels.map(label => "special:" + label),
      };
      
      // Only update containers if needed
      if (JSON.stringify(containers) !== JSON.stringify(initialContainers)) {
        setContainers(initialContainers);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleData, salesStaffData, defaultSalespeople, displayMonth, displayYear]);

  // Get month name
  const monthName = new Date(displayYear, displayMonth - 1).toLocaleString('default', { month: 'long' });

  const handlePrevMonth = async () => {
    const newMonth = Number(displayMonth) === 1 ? 12 : Number(displayMonth) - 1;
    const newYear = Number(displayMonth) === 1 ? Number(displayYear) - 1 : Number(displayYear);
    
    await Promise.all([
      setDisplayMonth(newMonth),
      setDisplayYear(newYear)
    ]);
  };

  const handleNextMonth = async () => {
    const newMonth = Number(displayMonth) === 12 ? 1 : Number(displayMonth) + 1;
    const newYear = Number(displayMonth) === 12 ? Number(displayYear) + 1 : Number(displayYear);
    
    await Promise.all([
      setDisplayMonth(newMonth),
      setDisplayYear(newYear)
    ]);
  };

  // Check next month's schedule
  const nextScheduleData = useQuery(api.schedule.getSchedule, {
    month: Number(displayMonth) === 12 ? 1 : Number(displayMonth) + 1,
    year: Number(displayMonth) === 12 ? Number(displayYear) + 1 : Number(displayYear)
  });

  // Compute hasChanges by comparing current state with database state
  const hasChanges = useMemo(() => {
    if (!scheduleData?.containers) {
      // If there's no schedule in the database, consider it changed if there are any assignments
      const hasAssignments = Object.entries(containers).some(([key, items]) => {
        return key !== "salespeople-list" && key !== "special-labels-list" && items.length > 0;
      });
      return hasAssignments;
    }

    // Get schedule-only containers (excluding salespeople and special labels)
    const getScheduleContainers = (containers: Record<string, string[]>) => {
      const cleaned: Record<string, string[]> = {};
      Object.entries(containers).forEach(([key, items]) => {
        if (key !== "salespeople-list" && key !== "special-labels-list" && items.length > 0) {
          cleaned[key] = [...items].sort();
        }
      });
      return cleaned;
    };

    const currentSchedule = getScheduleContainers(containers);
    const dbSchedule = getScheduleContainers(scheduleData.containers);

    return !isEqual(currentSchedule, dbSchedule);
  }, [containers, scheduleData]);

  // Calendar days calculation
  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDayOfMonth = new Date(displayYear, displayMonth - 1, 1).getDay();
  
  // Calculate previous month's days
  const prevMonth = displayMonth === 1 ? 12 : displayMonth - 1;
  const prevYear = displayMonth === 1 ? displayYear - 1 : displayYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  
  // Create array for previous month's days
  const prevMonthDays: CalendarDayInfo[] = Array.from(
    { length: firstDayOfMonth },
    (_, i) => ({
      day: daysInPrevMonth - firstDayOfMonth + i + 1,
      month: prevMonth,
      year: prevYear,
      isPrevMonth: true
    })
  );
  
  // Current month days
  const currentMonthDays: CalendarDayInfo[] = Array.from(
    { length: daysInMonth },
    (_, i) => ({
      day: i + 1,
      month: displayMonth,
      year: displayYear,
      isPrevMonth: false
    })
  );
  
  // Calculate next month's days to fill out the grid
  const lastDayOfMonth = new Date(displayYear, displayMonth - 1, daysInMonth).getDay();
  const nextMonthDays: CalendarDayInfo[] = Array.from(
    { length: lastDayOfMonth === 6 ? 0 : 6 - lastDayOfMonth },
    (_, i) => ({
      day: i + 1,
      month: displayMonth === 12 ? 1 : displayMonth + 1,
      year: displayMonth === 12 ? displayYear + 1 : displayYear,
      isPrevMonth: true // We'll use the same styling as prev month
    })
  );
  
  // Combine all arrays
  const calendarDays: CalendarDayInfo[] = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Get shifts from database
  const shifts = useQuery(api.shifts.getShifts) ?? defaultShifts;

  // Save handler
  const handleSave = async () => {
    // Clean up empty containers before saving
    const cleanedContainers = { ...containers };
    Object.keys(cleanedContainers).forEach(key => {
      if (key !== "salespeople-list" && key !== "special-labels-list" && cleanedContainers[key].length === 0) {
        delete cleanedContainers[key];
      }
    });

    // Ensure salespeople-list and special-labels-list are included
    if (!cleanedContainers["salespeople-list"]) {
      cleanedContainers["salespeople-list"] = defaultSalespeople;
    }
    
    if (!cleanedContainers["special-labels-list"]) {
      cleanedContainers["special-labels-list"] = defaultSpecialLabels.map(label => "special:" + label);
    }

    if (scheduleData === null) {
      // Create a new schedule if it doesn't exist
      await createSchedule({ 
        month: displayMonth, 
        year: displayYear, 
        containers: cleanedContainers 
      });
    } else {
      // Update existing schedule
      await updateSchedule({ 
        month: displayMonth, 
        year: displayYear, 
        containers: cleanedContainers 
      });
    }
  };

  const handlePrint = async () => {
    if (!shifts) return;
    
    // Convert CalendarDayInfo[] to (number | null)[]
    const printCalendarDays = calendarDays.map(dayInfo => 
      dayInfo.isPrevMonth ? null : dayInfo.day
    );

    // Convert scheduleData to the expected format
    const printScheduleData = scheduleData ? {
      containers: scheduleData.containers
    } : null;
    
    // Generate PDF and get the blob URL
    const pdfUrl = await generateSchedulePDF({
      monthName,
      currentYear: displayYear,
      currentMonth: displayMonth,
      firstDayOfMonth,
      calendarDays: printCalendarDays,
      scheduleData: printScheduleData,
      salesFilter,
      shifts: shifts,
      salesStaffData,
    });
    
    // Simply open in a new tab - let the PDF metadata handle the display name
    window.open(pdfUrl, '_blank');
  };

  // Add togglePublish mutation
  const togglePublish = useMutation(api.schedule.togglePublishSchedule);

  const handleTogglePublish = async () => {
    if (!scheduleData) return;
    
    // Don't try to toggle publish for a non-existent schedule
    if (scheduleData === null) {
      return;
    }
    
    await togglePublish({
      month: displayMonth,
      year: displayYear,
      published: !scheduleData.published
    });
  };

  // Modify handleDragStart to respect edit mode
  const handleDragStart = (event: DragStartEvent) => {
    if (!isEditMode) return;
    const id = event.active.id.toString();
    setActiveId(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }
    const fromContainer = active.data.current?.containerId;
    const toContainer = over.id.toString();
    const itemId = active.id.toString();
    const originalName = getDisplayName(itemId);

    // If dropping into a sidebar, treat as removal.
    if (toContainer === "salespeople-list" || toContainer === "special-labels-list") {
      if (fromContainer !== toContainer) {
        setContainers(prev => {
          const newContainers = { ...prev };
          // Remove the item from its container
          newContainers[fromContainer!] = (prev[fromContainer!] || []).filter(item => item !== itemId);
          
          // If the container is now empty and it's not a special container, remove it
          if (newContainers[fromContainer!].length === 0 && 
              fromContainer !== "salespeople-list" && 
              fromContainer !== "special-labels-list") {
            delete newContainers[fromContainer!];
          }
          
          return newContainers;
        });
      }
    } else {
      // Dropping into a shift container.
      const targetDay = toContainer.split("-")[0];
      let duplicateFound = false;
      
      // Only check for duplicates if we have a valid name
      if (originalName !== "Unknown") {
        Object.entries(containers).forEach(([key, items]) => {
          if (key === "salespeople-list" || key === "special-labels-list") return;
          const keyDay = key.split("-")[0];
          if (keyDay === targetDay) {
            if (fromContainer === key) return;
            for (const item of items) {
              if (getDisplayName(item) === originalName) {
                duplicateFound = true;
                break;
              }
            }
          }
        });
      }
      
      if (duplicateFound) {
        setActiveId(null);
        return;
      }
      if (fromContainer === "salespeople-list" || fromContainer === "special-labels-list") {
        const cloneId = (itemId.includes("::") ? itemId.split("::")[0] : itemId) + "::" + Date.now();
        setContainers(prev => ({
          ...prev,
          [toContainer]: [...(prev[toContainer] || []), cloneId]
        }));
      } else if (fromContainer !== toContainer) {
        setContainers(prev => {
          const newContainers = { ...prev };
          // Remove from old container
          newContainers[fromContainer!] = prev[fromContainer!].filter(item => item !== itemId);
          // Add to new container
          newContainers[toContainer] = [...(prev[toContainer] || []), itemId];
          
          // If the old container is now empty, remove it
          if (newContainers[fromContainer!].length === 0 && 
              fromContainer !== "salespeople-list" && 
              fromContainer !== "special-labels-list") {
            delete newContainers[fromContainer!];
          }
          
          return newContainers;
        });
      }
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Helper function to get display name from ID
  const getDisplayName = (id: string): string => {
    // If it's a special label (handle both original and cloned special labels)
    if (id.startsWith("special:")) {
      // Extract the label name without the timestamp
      const labelWithPossibleTimestamp = id.substring("special:".length);
      // If it has a timestamp, remove it
      const result = labelWithPossibleTimestamp.includes("::") 
        ? labelWithPossibleTimestamp.split("::")[0] 
        : labelWithPossibleTimestamp;
      return result;
    }
    
    // If it has a timestamp (cloned item)
    const baseId = id.includes("::") ? id.split("::")[0] : id;
    
    // Check for "new:" or "used:" prefix and remove it
    let cleanId = baseId;
    let prefix = "";
    if (baseId.startsWith("new:")) {
      cleanId = baseId.substring(baseId.indexOf(":") + 1);
      prefix = "new:";
    } else if (baseId.startsWith("used:")) {
      cleanId = baseId.substring(baseId.indexOf(":") + 1);
      prefix = "used:";
    }
    
    // First try to find by ID - this should work for Convex IDs like k57cd9h0m588y905ycmmv58res77jvxp
    if (salesStaffData) {
      // Try to find by exact ID match
      const staffById = salesStaffData.find(s => String(s._id) === cleanId);
      if (staffById) {
        // Handle the case where displayName is an empty string
        const displayName = staffById.displayName === "" 
          ? staffById.name 
          : (staffById.displayName || staffById.name || "");
        const firstName = displayName.split(" ")[0];
        return firstName;
      }
      
      // If not found by exact ID, try case-insensitive comparison
      const staffByIdCaseInsensitive = salesStaffData.find(
        s => String(s._id).toLowerCase() === cleanId.toLowerCase()
      );
      if (staffByIdCaseInsensitive) {
        // Handle the case where displayName is an empty string
        const displayName = staffByIdCaseInsensitive.displayName === "" 
          ? staffByIdCaseInsensitive.name 
          : (staffByIdCaseInsensitive.displayName || staffByIdCaseInsensitive.name || "");
        const firstName = displayName.split(" ")[0];
        return firstName;
      }
    }
    
    // If not found by ID, check if the ID itself is a name (legacy format)
    if (typeof cleanId === 'string' && cleanId.includes(" ")) {
      const firstName = cleanId.split(" ")[0];
      return firstName;
    }
    
    // For production environment, if we have a prefix and a name, use that
    if (prefix && typeof cleanId === 'string') {
      // This might be a case where the ID is actually "used:Alex Reynaldos" format
      // or where the ID is a Convex ID but we need to use it directly
      if (cleanId.includes(" ")) {
        const firstName = cleanId.split(" ")[0];
        return firstName;
      } else if (/^k[a-z0-9]+$/.test(cleanId)) {
        // If it's a Convex ID format, try to find the corresponding staff member again
        // This is a fallback for production where the ID format might be different
        if (salesStaffData) {
          // Try to find by ID in containers["salespeople-list"]
          const salespeopleList = containers["salespeople-list"] || [];
          
          // If the ID is in the salespeople list, it might be a valid staff member
          if (salespeopleList.includes(cleanId) || salespeopleList.includes(baseId) || salespeopleList.includes(id)) {
            // Try to find by any property that might match
            for (const staff of salesStaffData) {
              if (
                String(staff._id) === cleanId || 
                String(staff.name).includes(cleanId) || 
                String(staff.displayName).includes(cleanId)
              ) {
                // Handle the case where displayName is an empty string
                const displayName = staff.displayName === "" 
                  ? staff.name 
                  : (staff.displayName || staff.name || "");
                const firstName = displayName.split(" ")[0];
                return firstName;
              }
            }
          }
        }
      }
    }
    
    // Last resort: check if this ID exists in the salespeople-list
    // If it does, it might be a valid ID that we're just not matching correctly
    const salespeopleList = containers["salespeople-list"] || [];
    if (salespeopleList.includes(cleanId) || salespeopleList.includes(baseId) || salespeopleList.includes(id)) {
      // Return the ID itself as a last resort
      return cleanId.substring(0, 10); // Truncate long IDs
    }
    
    return "Unknown";
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {!isLoaded ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500 font-medium">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="p-4">
            <ScheduleHeader 
              monthName={monthName}
              displayYear={displayYear}
              isAdmin={isAdmin}
              isEditMode={isEditMode}
              scheduleData={scheduleData}
              prevScheduleData={prevScheduleData}
              nextScheduleData={nextScheduleData}
              hasChanges={hasChanges}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToggleEditMode={() => setIsEditMode(!isEditMode)}
              onTogglePublish={handleTogglePublish}
              onPrint={handlePrint}
              onSave={handleSave}
              salesFilter={salesFilter}
              setSalesFilter={setSalesFilter}
              showFilterOptions={showFilterOptions}
              setShowFilterOptions={setShowFilterOptions}
            />
            
            {/* Notification banner for non-existent schedule */}
            {scheduleData === null && isAdmin && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">This schedule doesn&apos;t exist yet</p>
                  <p className="text-sm">Click &quot;Create Schedule&quot; to create it.</p>
                </div>
              </div>
            )}
            
            <div className="overflow-auto h-[calc(100vh-150px)]">
              {!scheduleData?.published && !isAdmin ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500 font-medium">Schedule Not Available</p>
                </div>
              ) : scheduleData === null && !isAdmin ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-lg text-gray-500 font-medium">
                    This schedule doesn&apos;t exist yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-bold">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((dayInfo) => (
                    dayInfo.isPrevMonth ? (
                      <div key={`prev-${dayInfo.day}`} className="m-1 opacity-25">
                        <CalendarDay
                          day={dayInfo.day}
                          dayOfWeek={new Date(dayInfo.year, dayInfo.month - 1, dayInfo.day).getDay()}
                          containers={prevScheduleData?.containers ?? {}}
                          currentMonth={dayInfo.month}
                          currentYear={dayInfo.year}
                          onUpdateContainers={() => {}}
                          isEditMode={false}
                          salesFilter={salesFilter}
                          setSalesFilter={setSalesFilter}
                        />
                      </div>
                    ) : (
                      <CalendarDay
                        key={dayInfo.day}
                        day={dayInfo.day}
                        dayOfWeek={new Date(dayInfo.year, dayInfo.month - 1, dayInfo.day).getDay()}
                        containers={containers}
                        currentMonth={displayMonth}
                        currentYear={displayYear}
                        onUpdateContainers={(newContainers) => {
                          setContainers(prev => ({
                            ...prev,
                            ...newContainers
                          }));
                        }}
                        isEditMode={isEditMode}
                        salesFilter={salesFilter}
                        setSalesFilter={setSalesFilter}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isEditMode && (
        <DragOverlay>
          {activeId ? (
            <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-md shadow-sm text-xs">
              {getDisplayName(activeId)}
            </div>
          ) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default CalendarSchedule;
