"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Pencil, Printer, ChevronDown } from "lucide-react";
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
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  showFilterOptions: boolean;
  setShowFilterOptions: (show: boolean) => void;
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
  salesFilter,
  setSalesFilter,
  showFilterOptions,
  setShowFilterOptions
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
            {/* Filter dropdown - always visible */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="default" 
                className="flex items-center gap-1 bg-white border-gray-300 hover:bg-gray-50"
                onClick={() => setShowFilterOptions(!showFilterOptions)}
              >
                <span className="text-gray-700">
                  {salesFilter === "all" ? "All Sales Staff" : 
                   salesFilter === "new" ? "New Car Sales" : "Used Car Sales"}
                </span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </Button>
              
              {showFilterOptions && (
                <div className="absolute right-0 top-full mt-1 bg-white shadow-md rounded-md border border-gray-200 p-1 z-50 min-w-[180px]">
                  <Button 
                    variant={salesFilter === "all" ? "default" : "ghost"} 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSalesFilter("all");
                      setShowFilterOptions(false);
                    }}
                  >
                    All Sales Staff
                  </Button>
                  <Button 
                    variant={salesFilter === "new" ? "default" : "ghost"} 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSalesFilter("new");
                      setShowFilterOptions(false);
                    }}
                  >
                    New Car Sales
                  </Button>
                  <Button 
                    variant={salesFilter === "used" ? "default" : "ghost"} 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSalesFilter("used");
                      setShowFilterOptions(false);
                    }}
                  >
                    Used Car Sales
                  </Button>
                </div>
              )}
            </div>
            <Protect role="org:admin">
              <div className="flex items-center space-x-2">
                <Switch
                  id="publish-schedule"
                  checked={scheduleData.published ?? false}
                  onCheckedChange={onTogglePublish}
                />
                <Label htmlFor="publish-schedule" className="text-sm">
                  {scheduleData.published ? "Published" : "Draft"}
                </Label>
              </div>
              <Button
                onClick={onToggleEditMode}
                variant={isEditMode ? "destructive" : "outline"}
                size="default"
              >
                <Pencil className="h-4 w-4 mr-2" />
                {isEditMode ? "Exit Edit Mode" : "Edit Schedule"}
              </Button>
            </Protect>
          </>
        ) : isAdmin && (
          // Show create button for non-existent schedules
          <Button onClick={onSave} variant="default" size="default">
            Create Schedule
          </Button>
        )}
        {!isEditMode && scheduleData !== null && (
          <Button
            onClick={onPrint}
            variant="outline"
            size="default"
            className="bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white border-black transition-colors"
            disabled={!scheduleData?.published && !isAdmin}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Schedule
          </Button>
        )}
        {hasChanges && isEditMode && (
          <Button onClick={onSave} variant="default" className="bg-blue-600 hover:bg-blue-700" size="default">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
} 