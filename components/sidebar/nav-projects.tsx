"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
  section?: "dashboard" | "quick-access" | "incentives" | "tools" | "resources";
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
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname === "/dashboard";

  const handleClick = async (e: React.MouseEvent, section?: string) => {
    e.preventDefault();

    if (section === "dashboard" || !isDashboard) {
      // Always navigate to dashboard if dashboard is clicked or if we're not on dashboard
      await router.push("/dashboard");
      // Only scroll if it's not the dashboard button
      if (section && section !== "dashboard") {
        setTimeout(() => {
          scrollToSection(section, isMobile);
        }, 100);
      }
    } else if (section) {
      // If we're already on dashboard and it's not the dashboard button, just scroll
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
