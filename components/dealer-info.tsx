"use client";

import { useState } from "react";
import { Building, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { dealerInfo } from "@/app/data/dealer-info";
import { CopyButton } from "@/components/copy-button";

export function DealerInfo() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="lg" className="h-8 px-3">
          <Building className="h-4 w-4 mr-2" />
          <span>Dealer Info</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]" align="end">
        <div className="mb-4 text-lg font-semibold">Dealer Information</div>
        <div className="space-y-6">
          {/* Address Section */}
          <div className="space-y-2">
            <div className="flex items-center text-sm font-semibold text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>ADDRESS</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleCopy(dealerInfo.address)}
                  className="flex items-start gap-1.5 text-sm w-full text-left pl-6"
                >
                  <span
                    className={cn(
                      "transition-colors",
                      copiedAddress && "text-emerald-500"
                    )}
                  >
                    {dealerInfo.address}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>{copiedAddress ? "Copied!" : "Click to copy"}</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Departments Section */}
          <div className="space-y-6">
            {dealerInfo.departments.map((dept) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm font-semibold text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{dept.name.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className=" text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-sm rounded-full px-2.5 py-0.5">
                      {dept.phone}
                    </div>
                    <CopyButton value={dept.phone} tooltipText="phone number" />
                  </div>
                </div>

                <div className="pl-6 grid gap-1 text-sm">
                  {dept.hours.split("\n").map((line, i) => {
                    const [day, time] = line.split(": ");
                    return (
                      <div key={i} className="grid grid-cols-[100px,1fr] gap-2">
                        <span className="text-muted-foreground">{day}</span>
                        <span>{time || "Closed"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
