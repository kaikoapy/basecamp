"use client";

import { useState } from "react";
import { Building, MapPin, Check } from "lucide-react";
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

export function DealerInfo() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async (text: string, type: "address" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "address") {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 1500);
      } else {
        setCopiedPhone(text);
        setTimeout(() => setCopiedPhone(null), 1500);
      }
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
      <PopoverContent className="w-80" align="end">
        <div className="mb-4 text-lg font-semibold">Dealer Information</div>
        <div className="space-y-4">
          {/* Address Section */}
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <h4 className="text-sm font-semibold">Address</h4>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleCopy(dealerInfo.address, "address")}
                  className="flex items-start gap-1.5 text-sm text-foreground w-full text-left"
                >
                  <span
                    className={cn(
                      "transition-colors",
                      copiedAddress && "text-emerald-500"
                    )}
                  >
                    {dealerInfo.address}
                  </span>
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 text-emerald-500 transition-all shrink-0 mt-1",
                      copiedAddress ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="flex items-center"
              >
                <p>{copiedAddress ? "Copied!" : "Click to copy"}</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Departments Section */}
          <div className="space-y-4">
            {dealerInfo.departments.map((dept) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{dept.name}</h4>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleCopy(dept.phone, "phone")}
                        className="flex items-center gap-1.5 text-sm text-foreground"
                      >
                        <span
                          className={cn(
                            "transition-colors",
                            copiedPhone === dept.phone && "text-emerald-500"
                          )}
                        >
                          {dept.phone}
                        </span>
                        <Check
                          className={cn(
                            "h-3.5 w-3.5 text-emerald-500 transition-all",
                            copiedPhone === dept.phone
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={5}
                      className="flex items-center"
                    >
                      <p>
                        {copiedPhone === dept.phone
                          ? "Copied!"
                          : "Click to copy"}
                      </p>
                      <TooltipArrow />
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid gap-0.5 text-sm pl-4">
                  {dept.hours.split("\n").map((line, i) => {
                    const [day, time] = line.split(": ");
                    return (
                      <div key={i} className="grid grid-cols-[80px,1fr] gap-2">
                        <span className="font-medium">{day}:</span>
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
