"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
  icon: Icon;
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
              className="flex h-8 items-center gap-1.5 px-2 py-1.5 hover:bg-slate-200/90 transition-colors cursor-pointer"
              onPointerDown={(e) => handleClick(e, item)}
              tooltip={item.name}
              size="sm"
            >
              <div className="text-sm text-left text-gray-700">
                <item.icon className="size-4" />
                {state !== "collapsed" && (
                  <span className="flex-1 ml-1">{item.name}</span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
