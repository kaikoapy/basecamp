"use client";

import React from "react";
import { CalendarDays, Building, Users, Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { SearchBar } from "../command-search";
import { DealerInfo } from "../dealer-info";
import { SpeedDial } from "../speed-dial";
import { AnimatedBackground } from "@/components/core/animated-background";

interface NavHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function NavHeader({}: NavHeaderProps) {
  const handleSearchClick = () => {};

  const NAV_ITEMS = [
    {
      id: "dealer-info",
      label: "Dealer Info",
      icon: Building,
      onClick: () => {
        const dealerInfo = document.querySelector(
          '[data-id="dealer-info"] .absolute'
        ) as HTMLElement;
        dealerInfo?.click();
      },
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <Building className="h-5 w-5" />
          <span className="nav-text ml-2">Dealer Info</span>
          <div className="absolute inset-0">
            <DealerInfo />
          </div>
        </div>
      ),
    },
    {
      id: "speed-dial",
      label: "Speed Dial",
      icon: Users,
      onClick: () => {
        const speedDial = document.querySelector(
          '[data-id="speed-dial"] .absolute'
        ) as HTMLElement;
        speedDial?.click();
      },
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <Users className="h-5 w-5" />
          <span className="nav-text ml-2">Speed Dial</span>
          <div className="absolute inset-0">
            <SpeedDial />
          </div>
        </div>
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: CalendarDays,
      href: "/schedule",
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <CalendarDays className="h-5 w-5" />
          <span className="nav-text ml-2">Schedule</span>
        </div>
      ),
    },
  ];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between px-2 sm:px-4 border-b sticky top-0 bg-background z-50">
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
            <SearchBar onOpenChange={handleSearchClick} />
          </div>
        </div>
        <div className="hidden sm:flex items-center">
          <AnimatedBackground>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                data-id={item.id}
                className="px-3 py-1.5 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-md min-w-[48px] xl:min-w-[100px] flex items-center justify-center cursor-pointer relative group not-prose"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
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
                  </TooltipTrigger>
                  <TooltipContent className="xl:hidden">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </AnimatedBackground>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex h-16 w-full">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              className="flex-1 flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-950 active:text-zinc-950"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="w-full flex flex-col items-center justify-center"
                >
                  <div className="flex flex-col items-center">
                    {/* Extract just the icon and text from the component */}
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs mt-1">{item.label}</span>
                  </div>
                </Link>
              ) : (
                <button
                  className="w-full flex flex-col items-center justify-center"
                  onClick={item.onClick}
                >
                  <div className="flex flex-col items-center">
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs mt-1">{item.label}</span>
                  </div>
                </button>
              )}
            </div>
          ))}
          <button
            className="flex-1 flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-950 active:text-zinc-950"
            onClick={handleSearchClick}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </button>
        </div>
      </nav>
    </>
  );
}
