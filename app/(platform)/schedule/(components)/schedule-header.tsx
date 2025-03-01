"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Pencil, Printer } from "lucide-react";
import { Protect } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";

interface ScheduleData extends Doc<"schedule"> {
  month: number;
  year: number;
  containers: Record<string, string[]>;
  updatedAt?: number;
  published?: boolean;
}

interface ScheduleHeaderProps {
  monthName: string;
  displayYear: number;
  isAdmin: boolean;
  isEditMode: boolean;
  scheduleData: ScheduleData | null | undefined;
  prevScheduleData: ScheduleData | null | undefined;
  nextScheduleData: ScheduleData | null | undefined;
  hasChanges: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleEditMode: () => void;
  onTogglePublish: () => void;
  onPrint: () => void;
  onSave: () => void;
}

export function ScheduleHeader({
  monthName,
  displayYear,
  isAdmin,
  isEditMode,
  scheduleData,
  prevScheduleData,
  hasChanges,
  onPrevMonth,
  onNextMonth,
  onToggleEditMode,
  onTogglePublish,
  onPrint,
  onSave,
}: ScheduleHeaderProps) {
  // Always allow navigation for admins
  const isNextButtonDisabled = !isAdmin && (!scheduleData || !scheduleData.published);

  return (
    <div className="flex justify-between items-center mb-4 pb-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">
          {monthName} {displayYear} Sales Schedule
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={onPrevMonth}
            variant="outline"
            size="icon"
            // Always allow navigation for admins
            disabled={!isAdmin && (!prevScheduleData || !prevScheduleData.published)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={onNextMonth}
            variant="outline"
            size="icon"
            disabled={isNextButtonDisabled}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {scheduleData ? (
          <>
            <Protect role="org:admin">
              <Button
                onClick={onToggleEditMode}
                variant="outline"
                size="default"
              >
                <Pencil className="h-4 w-4 mr-2" />
                {isEditMode ? "Exit Edit Mode" : "Edit Schedule"}
              </Button>
              <div className="flex items-center space-x-2">
                <Switch
                  id="publish-schedule"
                  checked={scheduleData.published ?? false}
                  onCheckedChange={onTogglePublish}
                />
                <Label htmlFor="publish-schedule" className="w-16 text-sm">
                  {scheduleData.published ? "Published" : "Draft"}
                </Label>
              </div>
            </Protect>
          </>
        ) : isAdmin && (
          // Show create button for non-existent schedules
          <Button onClick={onSave} variant="default" size="default">
            Create Schedule
          </Button>
        )}
        <Button
          onClick={onPrint}
          variant="outline"
          size="default"
          disabled={!scheduleData?.published && !isAdmin}
        >
          <Printer className="h-4 w-4 mr-2" />
          Download Schedule
        </Button>
        {hasChanges && isEditMode && (
          <Button onClick={onSave} variant="default" size="default">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
} 