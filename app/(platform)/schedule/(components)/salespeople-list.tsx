"use client";

import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { SalesStaffMember } from "@/convex/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SalespeopleListProps {
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  filteredSalespeople: string[];
  salesStaffData: SalesStaffMember[] | undefined;
}

export const SalespeopleList: React.FC<SalespeopleListProps> = ({
  salesFilter,
  setSalesFilter,
  filteredSalespeople,
  salesStaffData
}) => {
  return (
    <section className="p-4 bg-gray-50 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Salespeople</h2>
      <Tabs value={salesFilter} onValueChange={(value) => setSalesFilter(value as "all" | "new" | "used")}>
        <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground w-full mb-4">
          <TabsTrigger
            value="all"
            className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
          >
            New
          </TabsTrigger>
          <TabsTrigger
            value="used"
            className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
          >
            Used
          </TabsTrigger>
        </TabsList>
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
                    {salesStaffData?.find(staff => staff._id === item)?.displayName?.split(" ")[0] || "Unknown"}
                  </div>
                </DraggableItem>
              ))
            )}
          </div>
        </DroppableContainer>
      </Tabs>
    </section>
  );
}
