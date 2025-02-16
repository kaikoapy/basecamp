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
import { parseName, getDaysInMonth, defaultSpecialLabels, daysOfWeek } from "../utils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { generateSchedulePDF } from "../utils/generate-pdf";

const CalendarSchedule: React.FC = () => {
  // Use current date – note: we use 1-indexed month for our DB.
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  
  // Get month name
  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

  // Load schedule and sales staff from Convex
  const scheduleData = useQuery(api.schedule.getSchedule, { month: currentMonth, year: currentYear });
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
      if (defaultSalespeople.length === 0 && prev["salespeople-list"].length > 0) {
        return prev;
      }
      
      return {
        ...prev,
        "salespeople-list": defaultSalespeople
      };
    });
  }, [defaultSalespeople, salesStaffData]);

  // When the DB schedule loads, merge it with our defaults
  useEffect(() => {
    if (scheduleData === undefined) return;
    
    if (scheduleData === null) {
      createSchedule({
        month: currentMonth,
        year: currentYear,
        containers: {
          "salespeople-list": defaultSalespeople,
          "special-labels-list": defaultSpecialLabels.map(label => "special:" + label),
        },
      });
      return;
    }

    if (scheduleData.containers) {
      const mergedSalespeople = [
        ...new Set([
          ...(scheduleData.containers["salespeople-list"] || []),
          ...defaultSalespeople
        ])
      ];
      
      setContainers({
        ...scheduleData.containers,
        "salespeople-list": mergedSalespeople,
        "special-labels-list": scheduleData.containers["special-labels-list"] || 
          defaultSpecialLabels.map(label => "special:" + label),
      });
    }
  }, [scheduleData, currentMonth, currentYear, createSchedule, defaultSalespeople]);

  // UI state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [salesFilter, setSalesFilter] = useState<"all" | "new" | "used">("all");

  const updateSchedule = useMutation(api.schedule.updateSchedule);

  // Memoize the filtered salespeople list
  const filteredSalespeople = useMemo(() => {
    const list = containers["salespeople-list"] || [];
    return list.filter(item => {
      if (salesFilter === "all") return true;
      return item.startsWith(salesFilter + ":");
    });
  }, [containers, salesFilter]);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id.toString();
    setActiveId(id);
    setActiveContainer(event.active.data.current?.containerId ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      setActiveContainer(null);
      return;
    }
    const fromContainer = active.data.current?.containerId;
    const toContainer = over.id.toString();
    const itemId = active.id.toString();
    const originalName = parseName(itemId);

    // If dropping into a sidebar, treat as removal.
    if (toContainer === "salespeople-list" || toContainer === "special-labels-list") {
      if (fromContainer !== toContainer) {
        setContainers(prev => ({
          ...prev,
          [fromContainer!]: (prev[fromContainer!] || []).filter(item => item !== itemId)
        }));
        setHasChanges(true);
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
        setActiveContainer(null);
        return;
      }
      if (fromContainer === "salespeople-list" || fromContainer === "special-labels-list") {
        const cloneId = (itemId.includes("::") ? itemId.split("::")[0] : itemId) + "::" + Date.now();
        setContainers(prev => ({
          ...prev,
          [toContainer]: [...(prev[toContainer] || []), cloneId]
        }));
        setHasChanges(true);
      } else if (fromContainer !== toContainer) {
        setContainers(prev => ({
          ...prev,
          [fromContainer!]: (prev[fromContainer!] || []).filter(item => item !== itemId),
          [toContainer]: [...(prev[toContainer] || []), itemId]
        }));
        setHasChanges(true);
      }
    }
    setActiveId(null);
    setActiveContainer(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveContainer(null);
  };

  // Calendar days calculation
  const calendarDays = Array.from(
    { length: daysInMonth + firstDayOfMonth },
    (_, i) => (i < firstDayOfMonth ? null : i - firstDayOfMonth + 1)
  );

  // Save handler
  const handleSave = async () => {
    await updateSchedule({ month: currentMonth, year: currentYear, containers });
    setHasChanges(false);
  };

  const handlePrint = () => {
    generateSchedulePDF({
      monthName,
      currentYear,
      currentMonth,
      firstDayOfMonth,
      calendarDays,
      scheduleData: scheduleData ?? null,
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 p-4 border-r">
          <SalespeopleList
            salesFilter={salesFilter}
            setSalesFilter={setSalesFilter}
            filteredSalespeople={filteredSalespeople}
            salesStaffData={salesStaffData}
          />
          <SpecialLabels labels={containers["special-labels-list"] || []} />
          <div className="flex gap-2">
            {hasChanges && (
              <button onClick={handleSave} className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md shadow">
                Save Changes
              </button>
            )}
            <Button
              onClick={handlePrint}
              variant="outline"
              size="default"
              className="mt-6"
            >
              <Printer className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        {/* Calendar */}
        <div className="w-4/5 p-4">
          <h1 className="text-2xl font-bold mb-4">{monthName} Sales Schedule</h1>
          <div className="overflow-auto h-[calc(100vh-100px)]">
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center font-bold">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) =>
                day ? (
                  <CalendarDay
                    key={day}
                    day={day}
                    dayOfWeek={new Date(currentYear, currentMonth - 1, day).getDay()}
                    containers={containers}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    onUpdateContainers={(newContainers) => {
                      setContainers(prev => ({
                        ...prev,
                        ...newContainers
                      }));
                      setHasChanges(true);
                    }}
                  />
                ) : (
                  <div key={`empty-${idx}`} className="m-1" />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          activeContainer === "salespeople-list" ||
          activeContainer === "special-labels-list" ? (
            <div className="bg-black text-white m-2 p-2 rounded-md shadow-sm text-center">
              {parseName(activeId)}
            </div>
          ) : activeId.startsWith("special:") ? (
            <div className="bg-white text-black border border-black m-1 p-2 rounded-md shadow-sm text-xs">
              {parseName(activeId)}
            </div>
          ) : (
            <div className="bg-black text-white m-1 p-2 rounded-md shadow-sm text-xs">
              {parseName(activeId)}
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CalendarSchedule;
