import { AppSidebar } from "./(components)/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MountProvider } from "@/components/providers/mount-provider";
import { DialogProvider } from "./(components)/dialog-provider";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { OrganizationInit } from "./(components)/organization-init";
import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <SignedIn>
        <Suspense fallback={<Loading message="Loading your dashboard..." />}>
          <OrganizationInit />
          <div className="h-screen flex">
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">
                <MountProvider>
                  <SidebarInset>
                    {children}
                  </SidebarInset>
                </MountProvider>
              </main>
              <DialogProvider />
            </SidebarProvider>
          </div>
        </Suspense>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default DashboardLayout;
