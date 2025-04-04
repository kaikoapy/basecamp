"use client";

import * as React from "react";
import {
  IconChartBar,
  IconBook,
  IconCommand,
  IconLayoutGrid,
  IconBookmark,
  IconTool,
  IconTag,
  IconSchool,
  IconHome,
  IconWorld,
  IconMessage,
  IconPrinter,
  IconBrain,
  IconSettings,
} from "@tabler/icons-react";
import { useDialog } from "@/components/providers/dialog-provider";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { NavMain } from "./nav-main";
import { NavProjects, type NavProject } from "./nav-projects";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DOCUMENT_URLS } from "@/app/data/document-urls";

export function AppSidebar({ 
  variant = "sidebar", 
  ...props 
}: React.ComponentProps<typeof Sidebar> & { variant?: "sidebar" | "floating" | "inset" }) {
  const pathname = usePathname();
  const router = useRouter();
  // const { openOrganizationProfile } = useClerk();
  const { showDialog } = useDialog();

  const handleSectionNavigation = async (section: string) => {
    if (section === "dashboard") {
      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      } else {
        // Already on dashboard, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (pathname !== "/dashboard") {
      // Navigate to dashboard with the section parameter
      const url = `/dashboard?section=${encodeURIComponent(section)}`;
      router.push(url);
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
      icon: IconHome,
      section: "dashboard",
      onMouseDown: () => handleSectionNavigation("dashboard"),
    },
    {
      name: "Announcements",
      icon: IconMessage,
      section: "announcements",
      onMouseDown: () => handleSectionNavigation("announcements"),
    },
    {
      name: "Quick Access",
      icon: IconBookmark,
      section: "quick-access",
      onMouseDown: () => handleSectionNavigation("quick-access"),
    },
    {
      name: "Dealer Sites",
      icon: IconWorld,
      section: "dealer-sites",
      onMouseDown: () => handleSectionNavigation("dealer-sites"),
    },
    {
      name: "Communication",
      icon: IconMessage,
      section: "communication",
      onMouseDown: () => handleSectionNavigation("communication"),
    },
    {
      name: "Incentives",
      icon: IconTag,
      section: "incentives",
      onMouseDown: () => handleSectionNavigation("incentives"),
    },
    {
      name: "Tools",
      icon: IconTool,
      section: "tools",
      onMouseDown: () => handleSectionNavigation("tools"),
    },
    {
      name: "Volvo Sites",
      icon: IconWorld,
      section: "volvo-sites",
      onMouseDown: () => handleSectionNavigation("volvo-sites"),
    },
  ];

  const data = {
    teams: [
      {
        name: "Sales",
        logo: IconLayoutGrid,
        plan: "Volvo Cars North Miami",
      },
      {
        name: "Finance",
        logo: IconChartBar,
        plan: "Volvo Cars North Miami",
      },
      {
        name: "Accounting",
        logo: IconCommand,
        plan: "Volvo Cars North Miami",
      },
    ],
    navMain: [
      {
        title: "Click to Print",
        url: "#",
        icon: IconPrinter,
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
        icon: IconBook,
        items: [
          {
            title: "Business Applications",
            action: () => showDialog("business-applications"),
            isModal: true,
            onMouseDown: true,
          },
          {
            title: "Out of State Deals",
            action: () => showDialog("out-of-state"),
            isModal: true,
            onMouseDown: true,
          },
          {
            title: "Wire Instructions",
            action: () => showDialog("wire-instructions"),
            isModal: true,
            onMouseDown: true,
          },
          {
            title: "3rd Party Payoffs",
            action: () => showDialog("third-party-payoffs"),
            isModal: true,
            onMouseDown: true,
          },
          {
            title: "Contact Directory",
            url: "/directory",
          },
          {
            title: "VCFS Stipulations",
            url: "/vcfs-stipulations",
          },
          {
            title: "Ad Breakdowns",
            url: "/ad-breakdowns",
          },
          // {
          //   title: "Overseas Delivery",
          //   url: "#",
          // },
          {
            title: "Dealer Trade Stores",
            action: () => showDialog("dealer-trade-stores"),
            isModal: true,
          },
          {
            title: "Gas Savings Calculator",
            action: () => showDialog("gas-savings"),
            isModal: true,
          },
          {
            title: "CSI Surveys",
            url: `https://volvo.medallia.eu/sso/volvo/applications/ex_WEB-9/pages/255?roleId=512&f.calculation=41&f.benchmark=100000006&f.feedback-type=all-feedback&f.question-score=a_overall_score_with_social_media_5_buckets&f.timeperiod=365&f.reporting-date=k_bp_timezone_response_time&cf.topic-filter-builder=${encodeURIComponent('{"t":0,"s":0}')}&alreftoken=94fc738d2571cee6adddacd83c4c764d&responsesSortBy=k_bp_timezone_response_time&responsesSortAscending=false&responsesSortIndex=0&responsesOffset=0`,
          },
        ],
      },
      {
        title: "Product Knowledge",
        url: "#",
        icon: IconBrain,
        // isActive: true,
        items: [
          {
            title: "Thrive - Volvo Training",
            url: "https://ssovolvocars.learn.link/content/",
          },
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
            url: "/product-knowledge/ev-faqs",
          },
          {
            title: "Plug-In Hybrid FAQs",
            url: "/product-knowledge/phev-faqs",
          },
          {
            title: "Brochures",
            url: "/brochures",
          },
        ],
      },
      {
        title: "New Hires",
        url: "#",
        icon: IconSchool,
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
            title: "Co-Advantage HR",
            url: "https://coadquantum.coadvantage.com/Home",
          },
          // {
          //   title: "Product Info",
          //   url: "#",
          // },
          // {
          //   title: "Key Contacts",
          //   url: "/directory",
          // },
          // {
          //   title: "FAQ",
          //   url: "/faq",
          // },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
        requiresAdmin: true,
        items: [
          {
            title: "Sales Schedule",
            url: "/schedule",
          },
          {
            title: "Directory Management",
            url: "/directory",
          },
          {
            title: "Announcements",
            url: "/announcements",
          },
          {
            title: "Users",
            action: () => showDialog("users"),
            isModal: true,
          },
          {
            title: "Dealership Configuration",
            action: () => showDialog("dealership-configuration"),
            isModal: true,
          },
        ],
      },
      // {
      //   title: "Settings",
      //   url: "#",
      //   icon: Settings2,
      //   items: [
      //     {
      //       title: "Dealership Settings",
      //       action: () => openOrganizationProfile(),
      //     },
      // {
      //   title: "Members",
      //   action: () => openOrganizationProfile(),
      // },
      // {
      //   title: "Billing",
      //   action: () => openOrganizationProfile(),
      // },
      //   ],
      // },
    ],
  };

  return (
    <Sidebar 
      collapsible="offcanvas" 
      className={`text-gray-800 ${variant === "inset" ? "border-r" : ""}`} 
      variant={variant}
      {...props}
    >
      <SidebarHeader className={`h-12 ${variant === "inset" ? "bg-background" : "bg-gray-50"}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="flex h-12 items-center px-2 py-2">
              <Link href="/" aria-label="Home">
                <Image
                  src="/Basecamp-logo.png"
                  alt="Basecamp Logo"
                  width={320}
                  height={320}
                  quality={100}
                  priority
                  className="hidden md:block h-6 w-auto dark:invert"
                  style={{ objectFit: 'contain' }}
                />
                <Image
                  src="/Basecamp-B-logo.png"
                  alt="Basecamp Logo"
                  width={320}
                  height={320}
                  quality={100}
                  priority
                  className="block md:hidden h-6 w-auto dark:invert"
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gray-50">
        <NavProjects projects={navigationItems} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {variant === "sidebar" && <SidebarRail />}
    </Sidebar>
  );
}
