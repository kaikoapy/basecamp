"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ChevronLeft, 
  ChevronRight, 
  Pencil, 
  Printer, 
  MoreHorizontal 
} from "lucide-react";
import { Protect } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ScheduleData extends Doc<"schedule"> {
  month: number;
  year: number;
  containers: Record<string, string[]>;
  updatedAt?: number;
  updatedBy?: string; // Clerk User ID
  published?: boolean;
}

/**
 * IMPORTANT: To implement proper "Cancel and Exit" functionality in the parent component:
 * 
 * 1. When entering edit mode, create a deep copy of the original schedule data:
 *    const [originalData, setOriginalData] = useState<ScheduleData | null>(null);
 *    
 *    // When entering edit mode
 *    const handleEnterEditMode = () => {
 *      setOriginalData(JSON.parse(JSON.stringify(scheduleData)));
 *      setIsEditMode(true);
 *    }
 * 
 * 2. Implement the onDiscardChanges function to restore from this original copy:
 *    const handleDiscardChanges = () => {
 *      // Reset working data back to the original
 *      setScheduleData(JSON.parse(JSON.stringify(originalData)));
 *      
 *      // Reset any UI state that tracks changes
 *      setHasChanges(false);
 *      
 *      // Clear any other temporary state
 *      // ...
 *    }
 * 
 * 3. Pass these functions to the ScheduleHeader component:
 *    <ScheduleHeader
 *      // ...other props
 *      onToggleEditMode={handleToggleEditMode}
 *      onDiscardChanges={handleDiscardChanges}
 *      // ...other props
 *    />
 */
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
  onDiscardChanges?: () => void;
  salesFilter: "all" | "new" | "used";
  setSalesFilter: (filter: "all" | "new" | "used") => void;
  showFilterOptions?: boolean;
  setShowFilterOptions?: (show: boolean) => void;
}

function LastUpdated({ 
  updatedAt, 
  updatedBy 
}: { 
  updatedAt?: number; 
  updatedBy?: string;
}) {
  if (!updatedAt) return null;

  return (
    <p className="text-sm text-muted-foreground">
      Last updated {new Date(updatedAt).toLocaleDateString()} at {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {updatedBy || "Unknown User"}
    </p>
  );
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
}: ScheduleHeaderProps) {
  // State to control the alert dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  // Always allow navigation for admins
  const isNextButtonDisabled = !isAdmin && (!scheduleData || !scheduleData.published);

  // Function to handle safe exit from edit mode with discarding changes
  const handleExitEditMode = () => {
    // Close the dialog first
    setIsAlertOpen(false);
    
    // Simplest solution: refresh the page to reset everything to the database state
    window.location.reload();
    
    // The page will refresh, so we don't need these anymore
    // if (typeof onDiscardChanges === 'function') {
    //   onDiscardChanges();
    // } else {
    //   console.warn('onDiscardChanges function not provided to ScheduleHeader component');
    //   console.warn('See the interface documentation for implementation details.');
    // }
    // onToggleEditMode();
  };

  // Function to save changes and exit edit mode
  const handleSaveAndExit = () => {
    onSave();
    onToggleEditMode();
    
    // Show success toast
    toast.success("Changes saved successfully", {
      description: `The ${monthName} ${displayYear} schedule has been updated.`,
      duration: 3000,
    });
  };

  return (
    <div className="mb-4 pb-4 border-b">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              {monthName} {displayYear} Sales Schedule
            </h1>
            {scheduleData && (
              <LastUpdated 
                updatedAt={scheduleData.updatedAt} 
                updatedBy={scheduleData.updatedBy} 
              />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
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
        
        {scheduleData ? (
          <div className="flex items-center gap-3">
            {/* Filter tabs - now placed next to dropdown */}
            <Tabs 
              value={salesFilter} 
              onValueChange={(value) => setSalesFilter(value as "all" | "new" | "used")}
              className="mr-2"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="used">Used</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Print button - now in dropdown, always visible to all users */}
                <DropdownMenuItem 
                  onClick={onPrint} 
                  className="cursor-pointer"
                  disabled={!scheduleData?.published && !isAdmin}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Schedule
                </DropdownMenuItem>
                
                <Protect role="org:admin">
                  <DropdownMenuItem onClick={onToggleEditMode} className="cursor-pointer">
                    <Pencil className="h-4 w-4 mr-2" />
                    {isEditMode ? "Exit Edit Mode" : "Edit Schedule"}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={(e) => {
                      // Prevent dropdown from closing
                      e.preventDefault();
                      onTogglePublish();
                    }} 
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="dropdown-publish-schedule"
                        checked={scheduleData.published ?? false}
                        onCheckedChange={() => {
                          // Call the toggle function directly from the switch
                          // without closing the dropdown
                          onTogglePublish();
                        }}
                        className="ml-0 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      />
                      <span>{scheduleData.published ? "Published" : "Draft"}</span>
                    </div>
                  </DropdownMenuItem>
                  
                  {hasChanges && isEditMode && (
                    <DropdownMenuItem onClick={handleSaveAndExit} className="cursor-pointer">
                      Save Changes & Exit
                    </DropdownMenuItem>
                  )}
                </Protect>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isEditMode && (
              hasChanges ? (
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      Cancel and Exit Editing
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have unsaved changes. If you exit edit mode now, all your changes will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                      <AlertDialogAction onClick={handleExitEditMode} className="bg-red-500 hover:bg-red-600">
                        Discard Changes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button 
                  onClick={handleExitEditMode} 
                  variant="outline" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Cancel and Exit Editing
                </Button>
              )
            )}
            
            {hasChanges && isEditMode && (
              <Button onClick={handleSaveAndExit} variant="default" className="bg-blue-500 hover:bg-blue-600" size="default">
                Save Changes
              </Button>
            )}
          </div>
        ) : isAdmin && (
          // Show create button for non-existent schedules
          <Button onClick={onSave} variant="default" size="default">
            Create Schedule
          </Button>
        )}
      </div>
    </div>
  );
} 