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
      label: "Dealer",
      component: (
        <div className="flex sm:flex-row flex-col items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <Building className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="text-xs mt-1 sm:mt-0 sm:text-sm sm:inline">
            <span className="sm:hidden">Dealer</span>
            <span className="hidden sm:inline">Dealer Info</span>
          </span>
          <div className="absolute inset-0">
            <DealerInfo />
          </div>
        </div>
      ),
    },
    {
      id: "speed-dial",
      label: "Contacts",
      component: (
        <div className="flex sm:flex-row flex-col items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <Users className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="text-xs mt-1 sm:mt-0 sm:text-sm sm:inline">
            <span className="sm:hidden">Contacts</span>
            <span className="hidden sm:inline">Speed Dial</span>
          </span>
          <div className="absolute inset-0">
            <SpeedDial />
          </div>
        </div>
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      href: "/schedule",
      component: (
        <div className="flex sm:flex-row flex-col items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <CalendarDays className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="text-xs mt-1 sm:mt-0 sm:text-sm sm:inline">
            Schedule
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between px-2 sm:px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-50">
        <div className="flex items-center gap-2 sm:gap-4">
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

          <Link href="/dashboard" className="hidden sm:block">
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-heebo)" }}
            >
              <span className="text-RoadeoPurple font-[900]">DealerHub</span>
            </h1>
          </Link>
          <div className="w-full sm:w-[400px] max-w-full">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center">
          <AnimatedBackground>
            <div className="hidden sm:flex items-center space-x-2">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.id}
                  data-id={item.id}
                  className="px-2 sm:px-3 py-1.5 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-md min-w-[40px] sm:min-w-[100px] flex items-center justify-center cursor-pointer relative"
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
            </div>
          </AnimatedBackground>
          <div className="ml-2 hidden sm:block">
            <OnboardingDialog />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              className="flex-1 flex items-center justify-center py-2 text-zinc-600 hover:text-zinc-950 active:text-zinc-950 relative"
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
          <div className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-600">
            <OnboardingDialog />
            <span className="text-xs mt-1">Help</span>
          </div>
        </div>
      </nav>
    </>
  );
}
