"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export interface NavProject {
  name: string;
  icon: LucideIcon;
  section: string;
  iconColor?: string;
  iconBgColor?: string;
  onMouseDown?: () => void;
}

export function NavProjects({ projects }: { projects: NavProject[] }) {
  const { state } = useSidebar();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const scrollToSection = (section: string) => {
    if (section === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      scrollToSection(section);
    }
  }, [searchParams]);

  const handleClick = (
    e: React.PointerEvent<HTMLButtonElement>,
    item: NavProject
  ) => {
    e.preventDefault();
    if (item.onMouseDown) {
      item.onMouseDown();
    } else {
      scrollToSection(item.section);
      const params = new URLSearchParams(searchParams);
      params.set("section", item.section);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              onPointerDown={(e) => handleClick(e, item)}
              tooltip={item.name}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className="hover:bg-slate-200/80 transition-colors"
            >
              <button className="flex w-full items-center text-sm font-medium text-gray-700">
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
                    state === "collapsed"
                      ? "w-10 h-10"
                      : "w-7 h-7 rounded-md bg-white border"
                  }`}
                  style={{
                    borderColor:
                      state !== "collapsed" && hoveredItem === item.name
                        ? "#64748b"
                        : "#d1d5db",
                    boxShadow:
                      state !== "collapsed" && hoveredItem === item.name
                        ? `0 1px 2px ${item.iconColor}20, 0 1px 3px ${item.iconColor}20`
                        : "none",
                  }}
                >
                  <item.icon
                    className="h-4 w-4 opacity-90 transition-opacity duration-200 [button:hover_&]:opacity-100"
                    style={{
                      color:
                        state === "collapsed" ? "currentColor" : item.iconColor,
                    }}
                  />
                </div>
                {state !== "collapsed" && (
                  <span className="ml-2">{item.name}</span>
                )}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
