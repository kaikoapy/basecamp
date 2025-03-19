"use client";

import { useRef, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesStaffMember } from "@/convex/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { daysOfWeek } from "../utils";

interface StaffSelectorPopupProps {
  salesStaffData: SalesStaffMember[] | undefined;
  specialLabels: string[];
  onSelect: (id: string) => void;
  onClose: (e?: React.MouseEvent) => void;
  containerId: string;
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  day: number;
  dayOfWeek: number;
  shift: string;
  currentStaff?: string[];
  allDayContainers: Record<string, string[]>; // All containers for the current day
}

export function StaffSelectorPopup({
  salesStaffData,
  specialLabels,
  onSelect,
  onClose,
  salesFilter,
  setSalesFilter,
  day,
  dayOfWeek,
  shift,
  containerId,
  currentStaff = [],
  allDayContainers = {}
}: StaffSelectorPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: string; left: string; right?: string }>({ 
    top: "100%", 
    left: "0" 
  });
  
  // Determine popup position on mount
  useEffect(() => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // If popup would extend beyond the right edge of the viewport
      if (rect.right > viewportWidth) {
        setPopupPosition({ 
          top: "100%", 
          right: "0",
          left: "auto"
        });
      }
    }
  }, []);
  
  // Filter salespeople based on the selected filter
  const filteredSalespeople = salesStaffData?.filter(staff => {
    if (salesFilter === "all") return true;
    return staff.type === salesFilter;
  }) || [];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    }
    
    // Using capture phase to ensure this runs before other handlers
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [onClose]);

  // Prevent click propagation on the popup container itself
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // Get background color based on shift
  const getShiftBgColor = () => {
    // Extract shift index from containerId (format: "day-index")
    const shiftIndex = parseInt(containerId.split('-')[1]);
    
    // Check if this is an "Off" shift by name
    if (shift === "Off") return "bg-gray-100 hover:bg-gray-200";
    
    switch(shiftIndex) {
      case 0: return "bg-yellow-100 hover:bg-yellow-200"; // Morning shift
      case 1: return "bg-blue-100 hover:bg-blue-200";     // Mid shift
      case 2: return "bg-purple-100 hover:bg-purple-200"; // Closing shift
      default: return "bg-gray-100 hover:bg-gray-200";    // Default/fallback
    }
  };

  // Check if a staff member is already in the current shift
  const isStaffInCurrentShift = (staffId: string) => {
    return currentStaff.some(id => {
      // Remove timestamp if present
      const baseId = id.includes("::") ? id.split("::")[0] : id;
      return baseId === staffId;
    });
  };

  // Check if a staff member is already in any shift for this day
  const getStaffShiftForDay = (staffId: string): { inShift: boolean; shiftName?: string; shiftIndex?: number } => {
    // Check all containers for this day (format: "day-index")
    for (const [containerKey, staffIds] of Object.entries(allDayContainers)) {
      // Skip non-day containers
      if (!containerKey.startsWith(`${day}-`)) continue;
      
      // Check if staff is in this container
      const isInContainer = staffIds.some(id => {
        const baseId = id.includes("::") ? id.split("::")[0] : id;
        return baseId === staffId;
      });
      
      if (isInContainer) {
        // Extract shift index
        const shiftIndex = parseInt(containerKey.split('-')[1]);
        return { 
          inShift: true, 
          shiftIndex,
          // Get shift name based on index (this is a simplification, adjust as needed)
          shiftName: shiftIndex === 0 ? "Morning" : 
                    shiftIndex === 1 ? "Mid" : 
                    shiftIndex === 2 ? "Closing" : "Other"
        };
      }
    }
    
    return { inShift: false };
  };

  return (
    <div 
      className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 p-4 w-64 max-h-96 overflow-y-auto staff-selector-popup"
      style={popupPosition}
      ref={popupRef}
      onClick={handlePopupClick}
      onMouseDown={(e) => e.stopPropagation()} // Add mouseDown handler to prevent parent triggers
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-sm">Add Staff to {daysOfWeek[dayOfWeek]} {day}</h3>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        Shift: {shift}
      </div>
      
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
      </Tabs>
      
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Salespeople</h4>
        <div className="grid grid-cols-2 gap-2">
          {filteredSalespeople.map(staff => {
            const isInCurrentShift = isStaffInCurrentShift(staff._id);
            const staffShiftInfo = getStaffShiftForDay(staff._id);
            const isInOtherShift = staffShiftInfo.inShift && !isInCurrentShift;
            
            // Determine button style and functionality based on staff status
            let buttonStyle = getShiftBgColor();
            let isDisabled = false;
            let tooltipText = "";
            
            if (isInOtherShift) {
              buttonStyle = "bg-gray-100 hover:bg-gray-100 opacity-70";
              isDisabled = true;
              tooltipText = `Already in ${staffShiftInfo.shiftName} shift`;
            }
            
            return (
              <div key={staff._id} className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDisabled}
                  className={`justify-between text-xs h-8 border-transparent ${buttonStyle} text-gray-800 w-full`}
                  onClick={() => {
                    onSelect(staff._id);
                    onClose();
                  }}
                >
                  <span className="mx-auto flex items-center gap-1">
                    {staff.displayName?.split(" ")[0] || staff.name?.split(" ")[0] || "Unknown"}
                    {isInCurrentShift ? (
                      <Trash2 className="h-3 w-3 ml-1 text-red-500" />
                    ) : isInOtherShift ? (
                      null
                    ) : (
                      <Plus className="h-3 w-3 ml-1" />
                    )}
                  </span>
                </Button>
                {isInOtherShift && (
                  <div className="absolute left-0 -top-8 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {tooltipText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <h4 className="text-xs font-medium text-gray-500 mb-2">Special Labels</h4>
        <div className="grid grid-cols-2 gap-2">
          {specialLabels.map(label => {
            const labelName = label.startsWith("special:") 
              ? label.substring("special:".length) 
              : label;
            const isInCurrentShift = isStaffInCurrentShift(label);
            const labelShiftInfo = getStaffShiftForDay(label);
            const isInOtherShift = labelShiftInfo.inShift && !isInCurrentShift;
            
            // Determine button style and functionality based on label status
            let buttonStyle = "bg-white border-black";
            let isDisabled = false;
            let tooltipText = "";
            
            if (isInOtherShift) {
              buttonStyle = "bg-gray-100 border-gray-300 opacity-70";
              isDisabled = true;
              tooltipText = `Already in ${labelShiftInfo.shiftName} shift`;
            }
            
            return (
              <div key={label} className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDisabled}
                  className={`justify-between text-xs h-8 ${buttonStyle} w-full`}
                  onClick={() => {
                    onSelect(label);
                    onClose();
                  }}
                >
                  <span className="mx-auto flex items-center gap-1">
                    {labelName}
                    {isInCurrentShift ? (
                      <Trash2 className="h-3 w-3 ml-1 text-red-500" />
                    ) : isInOtherShift ? (
                      null
                    ) : (
                      <Plus className="h-3 w-3 ml-1" />
                    )}
                  </span>
                </Button>
                {isInOtherShift && (
                  <div className="absolute left-0 -top-8 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {tooltipText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 