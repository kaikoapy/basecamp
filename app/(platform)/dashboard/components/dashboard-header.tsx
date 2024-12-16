"use client";

import React, { useState } from "react";
import { Building, CalendarDays, Clock, MapPin, Check } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { dealerInfo } from "@/app/data/dealer-info";
import { cn } from "@/lib/utils";
import { CommandSearch } from "@/components/command-search";

interface NavHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function NavHeader({}: NavHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

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
    <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-50">
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <SidebarTrigger className="-ml-1" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>

        <Link href="/dashboard">
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <span className="text-primary font-semibold">DealerHub</span>
          </h1>
        </Link>
        <div className="w-[400px]">
          <CommandSearch />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const isInDropdown =
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom + 320 &&
              e.clientX >= rect.left - 20 &&
              e.clientX <= rect.right + 260;

            if (!isInDropdown) {
              setIsOpen(false);
            }
          }}
        >
          <DropdownMenu open={isOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                <Building className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[280px]"
              onMouseLeave={() => setIsOpen(false)}
            >
              <DropdownMenuLabel>Dealer Information</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex flex-col items-start w-full"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex items-center text-sm font-medium">
                    <MapPin className="mr-2 h-4 w-4" />
                    Address
                  </div>

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() =>
                          handleCopy(dealerInfo.address, "address")
                        }
                        className="ml-6 flex items-center gap-1.5 w-full text-left"
                      >
                        <span
                          className={cn(
                            "text-sm text-muted-foreground transition-colors",
                            copiedAddress && "text-emerald-500"
                          )}
                        >
                          {dealerInfo.address}
                        </span>
                        <Check
                          className={cn(
                            "h-3.5 w-3.5 text-emerald-500 transition-all shrink-0",
                            copiedAddress
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-0"
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedAddress ? "Copied!" : "Click to copy"}</p>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {dealerInfo.departments.map((dept) => (
                <React.Fragment key={dept.name}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>{dept.name}</span>

                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCopy(dept.phone, "phone")}
                            className="flex items-center gap-1.5"
                          >
                            <span
                              className={cn(
                                "text-xs text-muted-foreground transition-colors",
                                copiedPhone === dept.phone && "text-emerald-500"
                              )}
                            >
                              {dept.phone}
                            </span>
                            <Check
                              className={cn(
                                "h-3 w-3 text-emerald-500 transition-all",
                                copiedPhone === dept.phone
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-0"
                              )}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {copiedPhone === dept.phone
                              ? "Copied!"
                              : "Click to copy"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </DropdownMenuLabel>
                    <div className="px-2 py-1.5 text-sm">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="grid gap-0.5">
                          {dept.hours.split("\n").map((line, i) => {
                            const [day, time] = line.split(": ");
                            return (
                              <div
                                key={i}
                                className="grid grid-cols-[80px,1fr] gap-2"
                              >
                                <span className="text-muted-foreground font-medium">
                                  {day}:
                                </span>
                                <span className="text-muted-foreground">
                                  {time || "Closed"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
              <Link href="/schedule">
                <CalendarDays className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Schedule</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <OnboardingDialog />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help & Onboarding</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
