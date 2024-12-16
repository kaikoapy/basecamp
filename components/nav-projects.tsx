"use client";

import { type LucideIcon } from "lucide-react";

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
  section?: "quick-access" | "incentives" | "tools" | "resources";
}

const scrollToSection = (sectionId: string, isMobile: boolean) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const header = document.querySelector("header");
    const headerHeight = header?.offsetHeight || 0;
    // Add extra offset for mobile to account for any mobile-specific UI elements
    const mobileOffset = isMobile ? 8 : 16;
    const top = section.offsetTop - headerHeight - mobileOffset;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
};

export function NavProjects({ projects }: { projects: NavProject[] }) {
  const { isMobile } = useSidebar();

  const handleClick = (e: React.MouseEvent, section?: string) => {
    e.preventDefault();
    if (section) {
      scrollToSection(section, isMobile);
    }
  };

  return (
    <SidebarGroup
      className={isMobile ? "pb-4" : "group-data-[collapsible=icon]:hidden"}
    >
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              onClick={(e) => handleClick(e, item.section)}
            >
              <button>
                <item.icon />
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
