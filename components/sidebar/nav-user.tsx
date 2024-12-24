"use client";

import { useEffect } from "react";
import { Bell, ChevronsUpDown, CreditCard, LogOut, User } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { state } = useSidebar();
  const { user } = useUser();
  const { signOut, openUserProfile, closeUserProfile, unmountUserProfile } =
    useClerk();

  useEffect(() => {
    // Store original body style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Add event listener for Clerk dialog close
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" &&
          !document.querySelector('[role="dialog"]')
        ) {
          // Dialog was removed from DOM, restore scroll
          document.body.style.overflow = originalStyle;
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      closeUserProfile();
      document.body.style.overflow = originalStyle;
      observer.disconnect();

      const profileElement = document.getElementById(
        "user-profile"
      ) as HTMLDivElement;
      if (profileElement) {
        unmountUserProfile(profileElement);
      }
    };
  }, [closeUserProfile, unmountUserProfile]);

  const handleProfileClick = () => {
    openUserProfile();
  };

  if (!user) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              variant="ghost"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent ${
                state === "collapsed" ? "px-2 justify-center" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  state === "expanded"
                    ? "w-5 h-5 rounded-md bg-white shadow-sm hover:shadow-md"
                    : "w-8 h-8 rounded-md hover:bg-white/10"
                }`}
                style={
                  state === "expanded"
                    ? {
                        boxShadow: `0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)`,
                      }
                    : undefined
                }
              >
                <Avatar
                  className={`${state === "expanded" ? "h-5 w-5" : "h-8 w-8"} rounded-md`}
                >
                  <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                  <AvatarFallback className="rounded-md">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              {state === "expanded" && (
                <>
                  <div className="grid flex-1 text-left text-sm text-gray-800 leading-tight">
                    <span className="truncate font-semibold">
                      {user.fullName || user.username}
                    </span>
                    <span className="truncate text-xs">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                  <AvatarFallback className="rounded-lg">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.fullName || user.username}
                  </span>
                  <span className="truncate text-xs">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
