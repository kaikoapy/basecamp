"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CopyButton } from "@/components/copy-button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";

interface Department {
  name: string;
  hours: string;
  phone: string;
}

type DealerInfoDoc = Doc<"dealerInfo"> & {
  name: string;
  address: string;
  googleMapsUrl: string;
  departments: Department[];
  orgId: string;
}

export function DealerInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { organization, isLoaded } = useOrganization();
  
  // Only query when we have an organization ID
  const dealerInfo = useQuery(
    api.dealer_info.get,
    isLoaded && organization?.id ? { orgId: organization.id } : "skip"
  ) as DealerInfoDoc | null;

  // Handle loading and error states
  if (!isLoaded || !organization?.id) return null;
  if (!dealerInfo) return null;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="absolute inset-0 w-full h-full cursor-pointer">
          <span className="sr-only">Open dealer info</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] z-50" align="end">
        <div className="mb-4 text-lg font-semibold">Dealer Information</div>
        <div className="space-y-6">
          {/* Address Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span>{dealerInfo.address}</span>
            </div>
            <CopyButton
              value={dealerInfo.address}
              variant="ghost"
              className="hover:bg-transparent shrink-0 ml-2"
              tooltipText="address"
              disableTooltip
            />
          </div>

          {/* Departments Section */}
          <div className="space-y-4">
            {dealerInfo.departments.map((dept: Department) => (
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
                      disableTooltip
                    />
                  </div>
                </div>

                <div className="grid gap-1 text-sm">
                  {dept.hours.split("\n").map((line: string, i: number) => {
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
