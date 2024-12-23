"use client";

import { WireInstructionsDialog } from "@/app/(platform)/(resources)/wire-instructions-dialog";
import { OutOfStateDialog } from "@/app/(platform)/(resources)/out-of-state-dialog";
import { BusinessApplicationsDialog } from "@/app/(platform)/(resources)/business-applications-dialog";
import { ThirdPartyPayoffsDialog } from "@/app/(platform)/(resources)/third-party-payoffs-dialog";
import React from "react";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface SubItem {
  title: string;
  url?: string;
  component?: string;
  isModal?: boolean;
  onClick?: (clerk: ReturnType<typeof useClerk>) => void;
}

interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SubItem[];
}

export function NavMain({ items }: { items: MenuItem[] }) {
  const clerk = useClerk();
  const [activeDialog, setActiveDialog] = React.useState<string | null>(null);

  const handleItemClick = (subItem: SubItem) => {
    if (subItem.isModal && subItem.component) {
      setActiveDialog(subItem.component);
      return;
    }

    if (subItem.url) {
      window.location.href = subItem.url;
    }
  };

  const handleDialogClose = () => {
    setActiveDialog(null);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        onClick={(e) => {
                          e.preventDefault();
                          if (subItem.onClick) {
                            subItem.onClick(clerk);
                          } else {
                            handleItemClick(subItem);
                          }
                        }}
                      >
                        <a href={subItem.url || "#"}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>

      {/* Conditionally render dialogs */}
      <WireInstructionsDialog
        open={activeDialog === "WireInstructionsDialog"}
        onOpenChange={handleDialogClose}
      />
      <OutOfStateDialog
        open={activeDialog === "OutOfStateFAQDialog"}
        onOpenChange={handleDialogClose}
      />
      <BusinessApplicationsDialog
        open={activeDialog === "BusinessFAQDialog"}
        onOpenChange={handleDialogClose}
      />
      <ThirdPartyPayoffsDialog
        open={activeDialog === "ThirdPartyPayoffsDialog"}
        onOpenChange={handleDialogClose}
      />
    </SidebarGroup>
  );
}
