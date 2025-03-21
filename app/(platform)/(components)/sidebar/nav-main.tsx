"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Protect } from "@clerk/nextjs";
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
} from "@/components/ui/sidebar";
import { DynamicModal } from "@/app/(platform)/(components)/dynamic-modal";
import { useEffect, useState } from "react";

interface NavMainItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  isActive?: boolean;
  requiresAdmin?: boolean;
  items?: {
    title: string;
    url?: string;
    component?: string;
    isModal?: boolean;
    action?: () => void;
  }[];
  onMouseDown?: boolean;
}

function isExternalUrl(url: string) {
  return url.startsWith("http") || url.startsWith("https");
}

export function NavMain({ items }: { items: NavMainItem[] }) {
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

  const renderItem = (item: NavMainItem) => {
    const content = !item.items?.length ? (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          className="hover:bg-slate-200/90 transition-colors"
        >
          <Link
            href={item.url || "#"}
            {...(isExternalUrl(item.url || "")
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : { prefetch: true })}
            className="text-sm text-left"
          >
            <item.icon className="size-4" />
            <span className="flex-1">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ) : (
      <Collapsible
        key={item.title}
        open={openItems[item.title]}
        onOpenChange={() => toggleItem(item.title)}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={item.title}
              className="text-left hover:bg-slate-200/90 transition-colors"
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
                {subItem.action ? (
                  <SidebarMenuButton
                    onClick={subItem.action}
                    tooltip={subItem.title}
                    className="text-sm text-left hover:bg-slate-200/90 transition-colors"
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuButton>
                ) : subItem.isModal ? (
                  <DynamicModal component={subItem.component}>
                    <SidebarMenuButton
                      tooltip={subItem.title}
                      className="text-sm text-left hover:bg-slate-200/90transition-colors"
                    >
                      <span>{subItem.title}</span>
                    </SidebarMenuButton>
                  </DynamicModal>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={subItem.title}
                    className="hover:bg-slate-200/90 transition-colors"
                  >
                    <Link
                      href={subItem.url || "#"}
                      {...(isExternalUrl(subItem.url || "")
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : { prefetch: true })}
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

    return item.requiresAdmin ? (
      <Protect key={item.title} role="org:admin" fallback={null}>
        {content}
      </Protect>
    ) : (
      content
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(renderItem)}
      </SidebarMenu>
    </SidebarGroup>
  );
}
