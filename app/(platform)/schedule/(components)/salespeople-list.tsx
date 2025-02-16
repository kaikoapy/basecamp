"use client";

import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { parseName } from "../utils";

interface SalespeopleListProps {
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  filteredSalespeople: string[];
  salesStaffData: any;
}

export function SalespeopleList({
  salesFilter,
  setSalesFilter,
  filteredSalespeople,
  salesStaffData,
}: SalespeopleListProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Salespeople</h2>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSalesFilter("all")}
          className={`px-2 py-1 border rounded ${
            salesFilter === "all" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSalesFilter("new")}
          className={`px-2 py-1 border rounded ${
            salesFilter === "new" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          New
        </button>
        <button
          onClick={() => setSalesFilter("used")}
          className={`px-2 py-1 border rounded ${
            salesFilter === "used" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          Used
        </button>
      </div>
      <DroppableContainer id="salespeople-list">
        <div className="flex flex-wrap">
          {!salesStaffData ? (
            <div className="text-muted-foreground text-sm">Loading sales staff...</div>
          ) : filteredSalespeople.length === 0 ? (
            <div className="text-muted-foreground text-sm">No sales staff found</div>
          ) : (
            filteredSalespeople.map(item => (
              <DraggableItem key={item} id={item} containerId="salespeople-list">
                <div className="bg-black text-white m-2 p-2 rounded-md shadow-sm text-center">
                  {parseName(item)}
                </div>
              </DraggableItem>
            ))
          )}
        </div>
      </DroppableContainer>
    </>
  );
} 