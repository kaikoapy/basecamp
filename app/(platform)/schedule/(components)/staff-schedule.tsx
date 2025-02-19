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
import { SalespeopleList } from "./salespeople-list";
import { SpecialLabels } from "./special-labels";
import { CalendarDay } from "./calendar-day";
import { parseName, getDaysInMonth, defaultSpecialLabels, daysOfWeek, defaultShifts } from "../utils";
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
  const createSchedule = useMutation(api.schedule.createSchedule);

  // Transform sales staff data into the format we need - memoized to prevent unnecessary recalculations
  const defaultSalespeople = useMemo(() => {
    if (!salesStaffData) return [];
    
    const transformed = salesStaffData.map(staff => `${staff.type}:${staff.name}`);
    return transformed;
  }, [salesStaffData]);

  // Local state for all containers.
  const [containers, setContainers] = useState<Record<string, string[]>>({
    "salespeople-list": [],
    "special-labels-list": defaultSpecialLabels.map(label => "special:" + label),
  });

  // When the sales staff data loads, update the salespeople list
  useEffect(() => {
    if (!salesStaffData) return;
    
    setContainers(prev => {
      const newContainers = {
        ...prev,
        "salespeople-list": defaultSalespeople
      };
      return newContainers;
    });
  }, [defaultSalespeople, salesStaffData]);

  // When the DB schedule loads, merge it with our defaults
  useEffect(() => {
    if (scheduleData === undefined) return;
    
    const updateUrlParams = async () => {
      if (scheduleData) {
        await Promise.all([
          setDisplayMonth(scheduleData.month),
          setDisplayYear(scheduleData.year)
        ]);
      }
    };

    if (scheduleData === null) {
      const initialContainers = {
        "salespeople-list": defaultSalespeople,
        "special-labels-list": defaultSpecialLabels.map(label => "special:" + label),
      };
      createSchedule({
        month: displayMonth,
        year: displayYear,
        containers: initialContainers,
      });
      setContainers(initialContainers);
      return;
    }

    updateUrlParams();

    if (scheduleData.containers) {
      const mergedSalespeople = [
        ...new Set([
          ...(scheduleData.containers["salespeople-list"] || []),
          ...defaultSalespeople
        ])
      ];
      
      const newContainers = {
        ...scheduleData.containers,
        "salespeople-list": mergedSalespeople,
        "special-labels-list": scheduleData.containers["special-labels-list"] || 
          defaultSpecialLabels.map(label => "special:" + label),
      };
      
      setContainers(newContainers);
    }
  }, [scheduleData, displayMonth, displayYear, createSchedule, defaultSalespeople, setDisplayMonth, setDisplayYear]);

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
    if (!scheduleData?.containers) return false;

    // Get schedule-only containers (excluding salespeople and special labels)@
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

  const updateSchedule = useMutation(api.schedule.updateSchedule);

  // Memoize the filtered salespeople list
  const filteredSalespeople = useMemo(() => {
    const list = containers["salespeople-list"] || [];
    return list.filter(item => {
      if (salesFilter === "all") return true;
      return item.startsWith(salesFilter + ":");
    });
  }, [containers, salesFilter]);

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

    await updateSchedule({ 
      month: displayMonth, 
      year: displayYear, 
      containers: cleanedContainers 
    });
  };

  const handlePrint = () => {
    if (!shifts) return;
    
    // Convert CalendarDayInfo[] to (number | null)[]
    const printCalendarDays = calendarDays.map(dayInfo => 
      dayInfo.isPrevMonth ? null : dayInfo.day
    );

    // Convert scheduleData to the expected format
    const printScheduleData = scheduleData ? {
      containers: scheduleData.containers
    } : null;
    
    generateSchedulePDF({
      monthName,
      currentYear: displayYear,
      currentMonth: displayMonth,
      firstDayOfMonth,
      calendarDays: printCalendarDays,
      scheduleData: printScheduleData,
      salesFilter,
      shifts: shifts,
    });
  };

  // Add togglePublish mutation
  const togglePublish = useMutation(api.schedule.togglePublishSchedule);

  const handleTogglePublish = async () => {
    if (!scheduleData) return;
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
    const originalName = parseName(itemId);

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
      Object.entries(containers).forEach(([key, items]) => {
        if (key === "salespeople-list" || key === "special-labels-list") return;
        const keyDay = key.split("-")[0];
        if (keyDay === targetDay) {
          if (fromContainer === key) return;
          for (const item of items) {
            if (parseName(item) === originalName) {
              duplicateFound = true;
              break;
            }
          }
        }
      });
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
        <div className="flex h-screen">
          {/* Sidebar - only show in edit mode */}
          {isEditMode && (
            <div className="w-1/5 p-4 border-r">
              <SalespeopleList
                salesFilter={salesFilter}
                setSalesFilter={setSalesFilter}
                filteredSalespeople={filteredSalespeople}
                salesStaffData={salesStaffData}
              />
              <SpecialLabels labels={containers["special-labels-list"] || []} />
            </div>
          )}
          {/* Calendar */}
          <div className={isEditMode ? "w-4/5 p-4" : "w-full p-4"}>
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
            />
            <div className="overflow-auto h-[calc(100vh-100px)]">
              {!scheduleData?.published && !isAdmin ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500 font-medium">Schedule Not Available</p>
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
              {parseName(activeId)}
            </div>
          ) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default CalendarSchedule;
