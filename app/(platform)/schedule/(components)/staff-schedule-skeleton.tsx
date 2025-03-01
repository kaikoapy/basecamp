"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { daysOfWeek } from "../utils";

export function StaffScheduleSkeleton() {
  // Create a 5x7 grid for the calendar (5 weeks, 7 days per week)
  const weeks = 5;
  
  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
      
      {/* Day of week header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-semibold">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: weeks * 7 }, (_, i) => (
          <Card key={i} className="p-2 min-h-[150px]">
            {/* Day number */}
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            
            {/* Staff shifts */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 