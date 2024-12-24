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
import { DynamicModal } from "@/components/dynamic-modal";
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

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { state } = useSidebar();
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (state === "collapsed") {
      setOpenStates({});
    } else {
      // Restore default open states when sidebar expands
      const defaultStates = items.reduce(
        (acc, item) => ({
          ...acc,
          [item.title]: item.isActive || false,
        }),
        {}
      );
      setOpenStates(defaultStates);
    }
  }, [state, items]);

  const isExternalUrl = (url: string) => {
    return url.startsWith("http") || url.startsWith("https");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Collapsible
              open={openStates[item.title]}
              onOpenChange={(open) =>
                setOpenStates((prev) => ({ ...prev, [item.title]: open }))
              }
              className="group/collapsible"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenu className="ml-4 border-l border-border pl-2">
                  {item.items?.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      {subItem.action ? (
                        <SidebarMenuButton
                          onClick={subItem.action}
                          tooltip={subItem.title}
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      ) : subItem.isModal ? (
                        <DynamicModal component={subItem.component}>
                          <SidebarMenuButton tooltip={subItem.title}>
                            <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        </DynamicModal>
                      ) : (
                        <SidebarMenuButton asChild tooltip={subItem.title}>
                          <Link
                            href={subItem.url || "#"}
                            {...(isExternalUrl(subItem.url || "")
                              ? {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                }
                              : {})}
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
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
