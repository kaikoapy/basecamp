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
import { usePathname } from "next/navigation";

import { NavMain } from "./nav-main";
import { NavProjects, type NavProject } from "./nav-projects";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DOCUMENT_URLS } from "@/app/config/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { openOrganizationProfile } = useClerk();
  const { showDialog } = useDialog();

  const handleSectionNavigation = async (section: string) => {
    if (pathname !== "/dashboard") {
      // Force navigation to dashboard with the section parameter
      const url = `/dashboard?section=${encodeURIComponent(section)}`;
      window.location.href = url;
    } else {
      // If already on dashboard, just scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navigationItems: NavProject[] = [
    {
      name: "Dashboard",
      icon: Home,
      section: "dashboard",
      iconColor: "#8B6DFF", // RoadeoPurple
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("dashboard"),
    },
    {
      name: "Announcements",
      icon: MessageSquare,
      section: "announcements",
      iconColor: "#FF6B6B", // Coral Red
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("announcements"),
    },
    {
      name: "Quick Access",
      icon: Bookmark,
      section: "quick-access",
      iconColor: "#4CAF50", // Green
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("quick-access"),
    },
    {
      name: "Dealer Sites",
      icon: Globe,
      section: "dealer-sites",
      iconColor: "#2196F3", // Blue
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("dealer-sites"),
    },
    {
      name: "Communication",
      icon: MessageSquare,
      section: "communication",
      iconColor: "#9C27B0", // Purple
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("communication"),
    },
    {
      name: "Incentives",
      icon: Tag,
      section: "incentives",
      iconColor: "#FF9800", // Orange
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("incentives"),
    },
    {
      name: "Tools",
      icon: Wrench,
      section: "tools",
      iconColor: "#607D8B", // Blue Gray
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("tools"),
    },
    {
      name: "Volvo Sites",
      icon: Globe,
      section: "volvo-sites",
      iconColor: "#00BCD4", // Cyan
      iconBgColor: "white",
      onClick: () => handleSectionNavigation("volvo-sites"),
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
            action: () => showDialog("onboarding"),
            isModal: true,
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
    <Sidebar collapsible="icon" className="text-gray-800" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={navigationItems} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
