"use client";

import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { parseName } from "../utils";
import { Id } from "@/convex/_generated/dataModel";

interface SalesStaffMember {
  type: string;
  _id: Id<"directory">;
  _creationTime: number;
  nickname?: string;
  number: string;
  name: string;
  position: string;
  department: string;
  extension: string;
  email: string;
}

interface SalespeopleListProps {
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  filteredSalespeople: string[];
  salesStaffData: SalesStaffMember[] | undefined;
}

export function SalespeopleList({
  salesFilter,
  setSalesFilter,
  filteredSalespeople,
  salesStaffData,
}: SalespeopleListProps) {
  return (
    <section className="p-4 bg-gray-50 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Salespeople</h2>
      <div className="flex gap-2 mb-4">
        {(["all", "new", "used"] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setSalesFilter(filter)}
            className={`px-3 py-1 rounded-full border transition-colors duration-200 text-sm 
              ${
                salesFilter === filter
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <DroppableContainer id="salespeople-list">
        <div className="flex flex-wrap gap-2">
          {!salesStaffData ? (
            <p className="text-xs text-gray-500">Loading sales staff...</p>
          ) : filteredSalespeople.length === 0 ? (
            <p className="text-xs text-gray-500">No sales staff found</p>
          ) : (
            filteredSalespeople.map(item => (
              <DraggableItem 
                key={item} 
                id={item} 
                containerId="salespeople-list"
                className="transition-none"
              >
                <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-md shadow-sm hover:shadow-md text-xs">
                  {parseName(item)}
                </div>
              </DraggableItem>
            ))
          )}
        </div>
      </DroppableContainer>
    </section>
  );
}
