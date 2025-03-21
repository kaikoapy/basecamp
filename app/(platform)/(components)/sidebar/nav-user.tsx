"use client";

import { useEffect } from "react";
import { MoreVertical, LogOut, User, Building } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
import { OrganizationSwitcherWrapper } from "@/app/(platform)/(components)/organization-switcher";
import { useAppAuth } from "@/app/providers/auth-provider";
import { createLogger } from "@/lib/logger";

const logger = createLogger("nav-user");

export function NavUser() {
  const { state } = useSidebar();
  const { user } = useUser();
  const { signOut, openUserProfile, closeUserProfile, unmountUserProfile, openOrganizationProfile } = useClerk();
  const router = useRouter();
  const { orgId, orgRole } = useAppAuth();

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

  const handleOrgProfileClick = () => {
    logger.debug("Opening organization profile", { orgId, orgRole });
    openOrganizationProfile();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/");
    }
  };

  if (!user) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between w-full px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                variant="ghost"
                className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent  ${
                  state === "collapsed" ? "px-2 justify-center " : ""
                }`}
              >
                <Avatar
                  className={`${state === "expanded" ? "h-8 w-8" : "h-8 w-8"} rounded-full`}
                >
                  <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                  <AvatarFallback className="rounded-full">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
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
                    <MoreVertical className="ml-auto size-4" />
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
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                    <AvatarFallback className="rounded-full">
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
                <DropdownMenuItem onClick={handleOrgProfileClick}>
                  <Building className="mr-2 h-4 w-4" />
                  Organization Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Your Dealership
              </DropdownMenuLabel>
              <div className="px-2 py-1.5">
                <OrganizationSwitcherWrapper compact={true} />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
