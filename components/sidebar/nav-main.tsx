"use client";

import Link from "next/link";
import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DynamicModal } from "@/components/dynamic-modal";

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
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.title}</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenu>
                  {item.items?.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      {subItem.action ? (
                        <SidebarMenuButton onClick={subItem.action}>
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      ) : subItem.isModal ? (
                        <DynamicModal component={subItem.component}>
                          <SidebarMenuButton>
                            <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        </DynamicModal>
                      ) : (
                        <SidebarMenuButton asChild>
                          <Link href={subItem.url || "#"}>
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
