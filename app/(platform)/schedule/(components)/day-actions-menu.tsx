"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Trash2, ChevronRight } from "lucide-react";

interface DayActionsMenuProps {
  day: number;
  containers: Record<string, string[]>;
  onCopySchedule: (newContainers: Record<string, string[]>) => void;
  onClearDay: () => void;
}

export function DayActionsMenu({
  day,
  containers,
  onCopySchedule,
  onClearDay
}: DayActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCopyOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to copy from a specific day
  const copyFromDay = (sourceDay: number) => {
    // Find all containers for the source day
    const newContainers: Record<string, string[]> = {};
    
    // Loop through all containers to find ones for the source day
    Object.entries(containers).forEach(([key, items]) => {
      if (key === "salespeople-list" || key === "special-labels-list") return;
      
      const [containerDay, shiftIndex] = key.split("-");
      
      if (containerDay === String(sourceDay)) {
        // Create a new key for the target day with the same shift index
        const targetKey = `${day}-${shiftIndex}`;
        
        // Clone all items with new timestamps
        const clonedItems = items.map(item => {
          const baseId = item.includes("::") ? item.split("::")[0] : item;
          return baseId + "::" + Date.now();
        });
        
        newContainers[targetKey] = clonedItems;
      }
    });
    
    onCopySchedule(newContainers);
    setIsOpen(false);
    setShowCopyOptions(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Day actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-7 bg-white shadow-md rounded-md border border-gray-200 p-2 z-50 w-48">
          <div className="flex flex-col gap-1">
            {!showCopyOptions ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-between text-xs h-8 gap-2"
                  onClick={() => setShowCopyOptions(true)}
                >
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy schedule
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Clear all assignments for day ${day}?`)) {
                      onClearDay();
                    }
                    setIsOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear this day
                </Button>
              </>
            ) : (
              <>
                <div className="px-2 py-1 text-xs font-medium text-gray-500 border-b mb-1">
                  Copy from:
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => copyFromDay(day - 7)}
                >
                  Previous week (day {day - 7})
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => copyFromDay(day - 1)}
                >
                  Yesterday (day {day - 1})
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => {
                    // Open the custom copy dialog
                    const fromDay = window.prompt("Copy from which day?");
                    if (fromDay) {
                      const dayNum = parseInt(fromDay);
                      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
                        copyFromDay(dayNum);
                      }
                    }
                  }}
                >
                  Custom day...
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-xs h-8 mt-1 border-t pt-1"
                  onClick={() => setShowCopyOptions(false)}
                >
                  Back
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 