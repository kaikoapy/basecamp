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
  Tag,
  GraduationCap,
  Home,
  Globe,
  MessageSquare,
  Printer,
  Brain,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useDialog } from "@/components/providers/dialog-provider";

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
import { DOCUMENT_URLS } from "@/app/config/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { openOrganizationProfile } = useClerk();
  const { showDialog } = useDialog();

  const navigationItems: NavProject[] = [
    {
      name: "Dashboard",
      icon: Home,
      section: "dashboard",
    },
    {
      name: "Announcements",
      icon: MessageSquare,
      section: "announcements",
    },
    {
      name: "Quick Access",
      icon: Bookmark,
      section: "quick-access",
    },
    {
      name: "Dealer Sites",
      icon: Globe,
      section: "dealer-sites",
    },
    {
      name: "Communication",
      icon: MessageSquare,
      section: "communication",
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
  ];

  const data = {
    teams: [
      {
        name: "Sales",
        logo: GalleryVerticalEnd,
        plan: "Volvo Cars North Miami",
      },
      {
        name: "Finance",
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
            url: DOCUMENT_URLS.CREDIT_APPLICATION,
          },
          {
            title: "Business Application",
            url: DOCUMENT_URLS.BUSINESS_APPLICATION,
          },
          {
            title: "Wire Instructions",
            url: DOCUMENT_URLS.WIRE_INSTRUCTIONS,
          },
        ],
      },
      {
        title: "Resources",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Business Applications",
            action: () => showDialog("business-applications"),
            isModal: true,
          },
          {
            title: "Out of State Deals",
            action: () => showDialog("out-of-state"),
            isModal: true,
          },
          {
            title: "Wire Instructions",
            action: () => showDialog("wire-instructions"),
            isModal: true,
          },
          {
            title: "3rd Party Payoffs",
            action: () => showDialog("third-party-payoffs"),
            isModal: true,
          },
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
          {
            title: "Dealer Trade Stores",
            url: "/dealer-trade-stores",
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
            url: "/product-knowledge/ex30",
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
          {
            title: "Brochures",
            url: "/brochures",
          },
          {
            title: "Thrive - Volvo Training",
            url: "https://ssovolvocars.learn.link/content/",
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
            action: () => openOrganizationProfile(),
          },
          {
            title: "Members",
            action: () => openOrganizationProfile(),
          },
          {
            title: "Billing",
            action: () => openOrganizationProfile(),
          },
        ],
      },
    ],
  };

  return (
    <Sidebar
      collapsible="icon"
      className="text-foreground/90 font-medium"
      {...props}
    >
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
