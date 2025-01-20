"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DynamicModal } from "@/app/(platform)/(components)/dynamic-modal";
import { useEffect, useState } from "react";

interface NavMainItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url?: string;
    component?: string;
    isModal?: boolean;
    action?: () => void;
  }[];
}

function isExternalUrl(url: string) {
  return url.startsWith("http") || url.startsWith("https");
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { state } = useSidebar();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialOpenState = items.reduce(
      (acc, item) => {
        if (item.isActive) {
          acc[item.title] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>
    );
    setOpenItems(initialOpenState);
  }, [items]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Hide the entire component when sidebar is collapsed
  if (state === "collapsed") {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="hover:bg-slate-200/90 transition-colors" // Added hover style
                >
                  <Link
                    href={item.url || "#"}
                    {...(isExternalUrl(item.url || "")
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="text-sm text-left"
                  >
                    <item.icon className="size-4" />
                    <span className="flex-1">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              open={openItems[item.title]}
              onOpenChange={() => toggleItem(item.title)}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="text-left hover:bg-slate-200/90 transition-colors" // Added hover style
                  >
                    <item.icon className="size-4" />
                    <span className="flex-1 text-sm text-gray-800">
                      {item.title}
                    </span>
                    <ChevronRight
                      className={`size-4 transition-transform ${
                        openItems[item.title] ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenu className="ml-4 border-l border-border pl-2">
                  {item.items?.map((subItem) => (
                    <SidebarMenuItem key={subItem.title} className="pr-4">
                      {" "}
                      {/* Add right padding */}
                      {subItem.action ? (
                        <SidebarMenuButton
                          onClick={subItem.action}
                          tooltip={subItem.title}
                          className="text-sm text-left hover:bg-slate-200/90 transition-colors" // Added hover style
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      ) : subItem.isModal ? (
                        <DynamicModal component={subItem.component}>
                          <SidebarMenuButton
                            tooltip={subItem.title}
                            className="text-sm text-left hover:bg-slate-200/90transition-colors" // Added hover style
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        </DynamicModal>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          tooltip={subItem.title}
                          className="hover:bg-slate-200/90 transition-colors" // Added hover style
                        >
                          <Link
                            href={subItem.url || "#"}
                            {...(isExternalUrl(subItem.url || "")
                              ? {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                }
                              : {})}
                            className="text-sm text-left"
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
