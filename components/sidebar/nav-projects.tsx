"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
}

export function NavProjects({ projects }: { projects: NavProject[] }) {
  const { state } = useSidebar();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    section: string
  ) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("section", section);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              onClick={(e) => handleClick(e, item.section)}
              tooltip={item.name}
            >
              <button className="flex w-full items-center text-sm">
                <div
                  className={`flex items-center justify-center ${
                    state === "collapsed"
                      ? "w-8 h-8 rounded-md hover:bg-white/10"
                      : "w-5 h-5 rounded-md bg-white shadow-sm hover:shadow-md"
                  }`}
                  style={
                    state !== "collapsed"
                      ? {
                          boxShadow: `0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)`,
                        }
                      : undefined
                  }
                >
                  <item.icon
                    className={`transition-transform duration-200 ${
                      state === "collapsed" ? "h-4 w-4" : "h-3.5 w-3.5"
                    }`}
                    style={{ color: item.iconColor }}
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
