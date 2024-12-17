"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Settings2,
  Bookmark,
  Wrench,
  FileText,
  Tag,
  GraduationCap,
  Home,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { NavProject } from "./nav-projects";

const navigationItems: NavProject[] = [
  {
    name: "Dashboard",
    icon: Home,
    section: "dashboard",
  },
  {
    name: "Quick Access",
    icon: Bookmark,
    section: "quick-access",
  },
  {
    name: "Incentives",
    icon: Tag,
    section: "incentives",
  },
  {
    name: "Tools",
    icon: Wrench,
    section: "tools",
  },
  {
    name: "Resources",
    icon: FileText,
    section: "resources",
  },
];

// This is sample data.
const data = {
  user: {
    name: "Serdar Dosemecioglu",
    email: "serdar@volvocarsnorthmiami.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Sales",
      logo: GalleryVerticalEnd,
      plan: "Volvo Cars North Miami",
    },
    {
      name: "Service",
      logo: AudioWaveform,
      plan: "Volvo Cars North Miami",
    },
    {
      name: "Accounting",
      logo: Command,
      plan: "Volvo Cars North Miami",
    },
  ],
  navMain: [
    {
      title: "Sales",
      url: "#",
      icon: Tag,
      isActive: true,
      items: [
        {
          title: "New Inventory",
          url: "#",
        },
        {
          title: "Used Inventory",
          url: "#",
        },
        {
          title: "Deal Manager",
          url: "#",
        },
      ],
    },
    {
      title: "Service",
      url: "#",
      icon: Wrench,
      items: [
        {
          title: "Appointments",
          url: "#",
        },
        {
          title: "Work Orders",
          url: "#",
        },
        {
          title: "Parts Orders",
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Contact Directory",
          url: "/directory",
        },
        {
          title: "Overseas Delivery",
          url: "#",
        },
        {
          title: "Rules & Policies",
          url: "/rules",
        },
      ],
    },
    {
      title: "New Hires",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "Start Here",
          url: "/new-hires",
        },
        {
          title: "Product Info",
          url: "#",
        },
        {
          title: "Key Contacts",
          url: "/directory",
        },
        {
          title: "FAQ",
          url: "/faq",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Preferences",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={navigationItems} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
