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
  Globe,
  MessageSquare,
  Printer,
  Brain,
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
    name: "Volvo Sites",
    icon: Globe,
    section: "volvo-sites",
  },
  {
    name: "Communication",
    icon: MessageSquare,
    section: "communication",
  },
  {
    name: "Resources",
    icon: FileText,
    section: "resources",
  },
];

// This is sample data.
const data = {
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
      title: "Click to Print",
      url: "#",
      icon: Printer,
      items: [
        {
          title: "Credit Application",
          url: "#",
        },
        {
          title: "Business Application",
          url: "#",
        },
        {
          title: "Wire Instructions",
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
      title: "Product Knowledge",
      url: "#",
      icon: Brain,
      isActive: true,
      items: [
        {
          title: "XC90 2025.5",
          url: "/product-knowledge/xc90-2025.5",
        },
        {
          title: "EX30",
          url: "/product-knowledge/ex90",
        },
        {
          title: "EX90",
          url: "/product-knowledge/ex90",
        },
        {
          title: "EV FAQs",
          url: "/ev-faqs",
        },
        {
          title: "Plug-In Hybrid FAQs",
          url: "/phev-faqs",
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
          title: "Dealer Map",
          url: "/dealer-map",
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
          title: "Organization",
          url: "/organization-profile",
        },
        {
          title: "Members",
          url: "/organization-profile/members",
        },
        {
          title: "Billing",
          url: "/organization-profile/billing",
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
