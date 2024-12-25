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
  // Reference to the search component
  const searchRef = React.useRef<HTMLDivElement>(null);

  const handleSearchClick = () => {
    // Find the input element within the search component and focus it
    const searchInput = searchRef.current?.querySelector("input");
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Desktop Nav Items with full components
  const DESKTOP_NAV_ITEMS = [
    {
      id: "dealer-info",
      label: "Dealer Info",
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
      href: "/schedule",
      component: (
        <div className="flex items-center text-sm w-full text-gray-700 hover:text-gray-900 font-semibold">
          <CalendarDays className="h-5 w-5" />
          <span className="nav-text ml-2">Schedule</span>
        </div>
      ),
    },
  ];

  // Mobile Nav Items with simple structure
  const MOBILE_NAV_ITEMS = [
    {
      id: "dealer-info",
      label: "Dealer Info",
      icon: Building,
      component: <DealerInfo />,
    },
    {
      id: "speed-dial",
      label: "Speed Dial",
      icon: Users,
      component: <SpeedDial />,
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: CalendarDays,
      href: "/schedule",
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
          <div ref={searchRef} className="w-full sm:w-[400px] max-w-full">
            <SearchBar onOpenChange={handleSearchClick} />
          </div>
        </div>
        <div className="hidden sm:flex items-center">
          <AnimatedBackground>
            {DESKTOP_NAV_ITEMS.map((item) => (
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
          {MOBILE_NAV_ITEMS.map((item) => (
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
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    // Find and trigger the click on the corresponding desktop nav item
                    const desktopItem = document.querySelector(
                      `[data-id="${item.id}"] .absolute`
                    ) as HTMLElement;
                    if (desktopItem) {
                      const overlay =
                        desktopItem.firstElementChild as HTMLElement;
                      if (overlay) {
                        overlay.click();
                      }
                    }
                  }}
                  className="w-full flex flex-col items-center justify-center"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
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
