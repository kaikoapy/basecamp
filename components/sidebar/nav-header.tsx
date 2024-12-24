"use client";

import React from "react";
import { CalendarDays, Building, Users } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { OnboardingDialog } from "../onboarding-dialog";
import { SearchBar } from "../command-search";
import { DealerInfo } from "../dealer-info";
import { SpeedDial } from "../speed-dial";
import { AnimatedBackground } from "@/components/core/animated-background";

interface NavHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function NavHeader({}: NavHeaderProps) {
  const NAV_ITEMS = [
    {
      id: "dealer-info",
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-medium">
          <Building className="h-4 w-4 mr-2" />
          <span>Dealer Info</span>
          <div className="absolute inset-0">
            <DealerInfo />
          </div>
        </div>
      ),
    },
    {
      id: "speed-dial",
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-medium">
          <Users className="h-4 w-4 mr-2" />
          <span>Speed Dial</span>
          <div className="absolute inset-0">
            <SpeedDial />
          </div>
        </div>
      ),
    },
    {
      id: "schedule",
      href: "/schedule",
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-medium">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Schedule</span>
        </div>
      ),
    },
  ];

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
            <span className="text-primary font-bold">DealerHub</span>
          </h1>
        </Link>
        <div className="w-[400px]">
          <SearchBar />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <AnimatedBackground>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              className="px-3 py-1.5 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-md min-w-[100px] flex items-center justify-center cursor-pointer relative"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="w-full flex items-center justify-center"
                >
                  {item.component}
                </Link>
              ) : (
                item.component
              )}
            </div>
          ))}
        </AnimatedBackground>
        <div>
          <OnboardingDialog />
        </div>
      </div>
    </header>
  );
}
