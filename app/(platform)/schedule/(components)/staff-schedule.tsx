"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// ----- Dummy Data for Initialization (used if no DB data) ----- //

const salespeople = [
  "new:Gio",
  "used:Tito",
  "new:Steven",
  "used:Moudy",
  "new:Amr",
  "used:Gabriel",
];
const specialLabels = ["Month End", "Closed"];

const shifts = {
  weekday: ["8:30-5:30", "9:00-6:00", "11:00-8:00", "Off"],
  sunday: ["12:00-5:00", "Off"],
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

// ----- Utility Functions -----

const parseName = (item: string): string => {
  let name = item;
  if (name.includes("::")) {
    name = name.split("::")[0];
  }
  if (name.startsWith("special:")) {
    name = name.substring("special:".length);
  }
  if (name.startsWith("new:")) {
    name = name.substring("new:".length);
  }
  if (name.startsWith("used:")) {
    name = name.substring("used:".length);
  }
  return name;
};

const getSalespersonType = (item: string): string => {
  if (item.startsWith("new:")) return "new";
  if (item.startsWith("used:")) return "used";
  return "";
};

// ----- Draggable and Droppable Components -----

interface DraggableItemProps {
  id: string;
  containerId: string;
  children: React.ReactNode;
}

function DraggableItem({ id, containerId, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { containerId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    cursor: "grab",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
}

function DroppableContainer({ id, children }: DroppableContainerProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    backgroundColor: isOver ? "rgba(224, 247, 250, 0.5)" : "transparent",
    padding: "4px",
    borderRadius: "4px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

// ----- Main CalendarSchedule Component -----

const CalendarSchedule: React.FC = () => {
  // Assume you want the schedule for the current month.
  const currentDate = new Date();
  // If your DB uses 1-indexed months, adjust accordingly:
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  // Use a Convex query to load the schedule for this month.
  const scheduleData = useQuery(api.schedule.getSchedule, {
    month: currentMonth,
    year: currentYear,
  });

  // Local state for containers. Start with dummy data so that the UI is not empty
  // while loading the schedule from the DB.
  const [containers, setContainers] = useState<Record<string, string[]>>({
    "salespeople-list": [...salespeople],
    "special-labels-list": specialLabels.map((label) => "special:" + label),
  });

  // When scheduleData is loaded, update the local state.
  useEffect(() => {
    if (scheduleData && scheduleData.containers) {
      setContainers(scheduleData.containers);
    }
  }, [scheduleData]);

  // Additional UI states.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [salesFilter, setSalesFilter] = useState<"all" | "new" | "used">("all");

  const updateSchedule = useMutation(api.schedule.updateSchedule);

  // ... (handleDragStart, handleDragEnd, handleDragCancel code remains unchanged)
  // (See your existing code for drag logic)

  // For brevity, I'll assume you have the same drag functions as before.
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
    if (
      toContainer === "salespeople-list" ||
      toContainer === "special-labels-list"
    ) {
      if (fromContainer !== toContainer) {
        setContainers((prev) => ({
          ...prev,
          [fromContainer!]: (prev[fromContainer!] || []).filter(
            (item) => item !== itemId
          ),
        }));
        setHasChanges(true);
      }
    } else {
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
      if (
        fromContainer === "salespeople-list" ||
        fromContainer === "special-labels-list"
      ) {
        const cloneId =
          (itemId.includes("::") ? itemId.split("::")[0] : itemId) +
          "::" +
          Date.now();
        setContainers((prev) => ({
          ...prev,
          [toContainer]: [...(prev[toContainer] || []), cloneId],
        }));
        setHasChanges(true);
      } else if (fromContainer !== toContainer) {
        setContainers((prev) => ({
          ...prev,
          [fromContainer!]: (prev[fromContainer!] || []).filter(
            (item) => item !== itemId
          ),
          [toContainer]: [...(prev[toContainer] || []), itemId],
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

  const calendarDays = Array.from(
    { length: daysInMonth + firstDayOfMonth },
    (_, i) => (i < firstDayOfMonth ? null : i - firstDayOfMonth + 1)
  );

  const renderDay = (day: number) => {
    const date = new Date(currentYear, currentMonth - 1, day);
    const dayOfWeek = date.getDay();
    const isSunday = dayOfWeek === 0;
    const shiftsForDay = isSunday ? shifts.sunday : shifts.weekday;
    return (
      <Card key={`day-${day}`} className="m-1">
        <CardContent className="p-2">
          <div className="font-bold mb-2">
            {daysOfWeek[dayOfWeek]} {day}
          </div>
          {shiftsForDay.map((shift, shiftIndex) => {
            const containerId = `${day}-${shiftIndex}`;
            const items = containers[containerId] || [];
            return (
              <DroppableContainer key={containerId} id={containerId}>
                <div className="flex flex-col">
                  <div className="text-muted-foreground text-xs mb-1">
                    {shift}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {items.map((item) => {
                      const baseName = parseName(item);
                      const isSpecial = item.startsWith("special:");
                      return (
                        <DraggableItem
                          key={item}
                          id={item}
                          containerId={containerId}
                        >
                          {isSpecial ? (
                            <div className="bg-white text-black border border-black px-2 py-1 rounded-md shadow-sm m-1 text-xs">
                              {baseName}
                            </div>
                          ) : (
                            <div className="bg-black text-white px-2 py-1 rounded-md shadow-sm m-1 text-xs">
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
  };

  const filteredSalespeople =
    containers["salespeople-list"]?.filter((item) => {
      if (salesFilter === "all") return true;
      return item.startsWith(salesFilter + ":");
    }) || [];

  const handleSave = async () => {
    await updateSchedule({
      month: currentMonth,
      year: currentYear,
      containers,
    });
    setHasChanges(false);
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
          <h2 className="text-xl font-bold mb-4">Salespeople</h2>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setSalesFilter("all")}
              className={`px-2 py-1 border rounded ${
                salesFilter === "all"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSalesFilter("new")}
              className={`px-2 py-1 border rounded ${
                salesFilter === "new"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              New
            </button>
            <button
              onClick={() => setSalesFilter("used")}
              className={`px-2 py-1 border rounded ${
                salesFilter === "used"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Used
            </button>
          </div>
          <DroppableContainer id="salespeople-list">
            <div className="flex flex-wrap">
              {filteredSalespeople.map((item) => (
                <DraggableItem
                  key={item}
                  id={item}
                  containerId="salespeople-list"
                >
                  <div className="bg-black text-white m-2 p-2 rounded-md shadow-sm text-center">
                    {parseName(item)}
                  </div>
                </DraggableItem>
              ))}
            </div>
          </DroppableContainer>
          <h2 className="text-xl font-bold mt-6 mb-4">Special Labels</h2>
          <DroppableContainer id="special-labels-list">
            <div className="flex flex-wrap">
              {(containers["special-labels-list"] || []).map((item) => (
                <DraggableItem
                  key={item}
                  id={item}
                  containerId="special-labels-list"
                >
                  <div className="bg-white text-black border border-black m-2 p-2 rounded-md shadow-sm text-center">
                    {parseName(item)}
                  </div>
                </DraggableItem>
              ))}
            </div>
          </DroppableContainer>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md shadow"
            >
              Save Changes
            </button>
          )}
        </div>
        {/* Calendar */}
        <div className="w-4/5 p-4">
          <h1 className="text-2xl font-bold mb-4">Monthly Sales Schedule</h1>
          <div className="overflow-auto h-[calc(100vh-100px)]">
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center font-bold">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) =>
                day ? renderDay(day) : <div key={`empty-${idx}`} className="m-1" />
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
