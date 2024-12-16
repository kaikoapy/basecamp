"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import Link from "next/link";
import { OnboardingDialog } from "./onboarding-dialog";
import { CommandSearch } from "./command-search";
import { DealerInfo } from "./dealer-info";
import { SpeedDial } from "./speed-dial";

interface NavHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function NavHeader({}: NavHeaderProps) {
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
        <TooltipProvider>
          <DealerInfo />
          <SpeedDial />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3" asChild>
                <Link href="/schedule" className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Schedule</span>
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
        </TooltipProvider>
      </div>
    </header>
  );
}
