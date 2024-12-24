"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dealerInfo } from "@/app/data/dealer-info";
import { CopyButton } from "@/components/copy-button";

export function DealerInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="absolute inset-0 w-full h-full cursor-pointer">
          <span className="sr-only">Open dealer info</span>
        </button>
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
            <div className="flex items-center justify-between pl-6">
              <span className="text-sm">{dealerInfo.address}</span>
              <CopyButton
                value={dealerInfo.address}
                variant="ghost"
                className="hover:bg-transparent"
                tooltipText="address"
              />
            </div>
          </div>

          {/* Departments Section */}
          <div className="space-y-4">
            {dealerInfo.departments.map((dept) => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-muted-foreground">
                    {dept.name.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{dept.phone}</span>
                    <CopyButton
                      value={dept.phone}
                      variant="ghost"
                      className="hover:bg-transparent"
                      tooltipText="phone number"
                    />
                  </div>
                </div>

                <div className="grid gap-1 text-sm">
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
