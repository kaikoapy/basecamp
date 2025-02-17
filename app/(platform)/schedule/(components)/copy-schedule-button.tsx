"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarSync } from "lucide-react";

// Helper function to convert number to ordinal string
function getOrdinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

interface CopyScheduleButtonProps {
  day: number;
  dayOfWeek: number;
  currentMonth: number;
  currentYear: number;
  containers: Record<string, string[]>;
  onCopySchedule: (containers: Record<string, string[]>) => void;
}

export function CopyScheduleButton({
  day,
  dayOfWeek,
  currentMonth,
  currentYear,
  containers,
  onCopySchedule,
}: CopyScheduleButtonProps) {
  // Find previous occurrences of the same weekday in the current month
  const previousDays = [];
  for (let d = 1; d < day; d++) {
    const date = new Date(currentYear, currentMonth - 1, d);
    if (date.getDay() === dayOfWeek) {
      // Check if this day has any schedules before adding it
      const shifts = Array.from({ length: 4 }, (_, i) => `${d}-${i}`);
      const hasSchedule = shifts.some(shiftId => containers[shiftId]?.length > 0);
      if (hasSchedule) {
        previousDays.push(d);
      }
    }
  }

  if (previousDays.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <CalendarSync className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {previousDays.map(prevDay => {
          const shifts = Array.from({ length: 4 }, (_, i) => `${prevDay}-${i}`);
          return (
            <DropdownMenuItem
              key={prevDay}
              onClick={() => {
                const newContainers: Record<string, string[]> = {};
                shifts.forEach(prevShiftId => {
                  const currentShiftId = `${day}-${prevShiftId.split('-')[1]}`;
                  if (containers[prevShiftId]) {
                    // Create completely new IDs for copied items
                    newContainers[currentShiftId] = containers[prevShiftId].map(item => {
                      // Preserve the special: or new:/used: prefix, but create a new unique ID
                      const prefix = item.startsWith('special:') ? 'special:' : 
                                   item.startsWith('new:') ? 'new:' :
                                   item.startsWith('used:') ? 'used:' : '';
                      const name = item.split(':')[1].split('::')[0];
                      return `${prefix}${name}::${crypto.randomUUID()}`;
                    });
                  }
                });
                onCopySchedule(newContainers);
              }}
            >
              Copy the {getOrdinal(prevDay)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 