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
  section?:
    | "dashboard"
    | "announcements"
    | "quick-access"
    | "incentives"
    | "tools"
    | "volvo-sites"
    | "dealer-sites"
    | "communication"
    | "dealer-trade-stores"
    | "resources";
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
  const { isMobile, state } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname === "/dashboard";

  const handleClick = async (e: React.MouseEvent, section?: string) => {
    e.preventDefault();

    if (section === "dashboard" || section === "announcements") {
      // Navigate directly to dashboard or announcements
      await router.push(
        section === "dashboard" ? "/dashboard" : "/announcements"
      );
    } else if (!isDashboard) {
      // If not on dashboard and not announcements, navigate to dashboard first
      await router.push("/dashboard");
      if (section) {
        setTimeout(() => {
          scrollToSection(section, isMobile);
        }, 100);
      }
    } else if (section) {
      // If we're already on dashboard and it's not dashboard or announcements, just scroll
      scrollToSection(section, isMobile);
    }
  };

  return (
    <SidebarGroup className={isMobile ? "pb-4" : undefined}>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              onClick={(e) => handleClick(e, item.section)}
              tooltip={item.name}
            >
              <button>
                <item.icon />
                {state === "expanded" && <span>{item.name}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
