import { AppSidebar } from "./(components)/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MountProvider } from "@/components/providers/mount-provider";
import { OrganizationCheck } from "./(components)/organization-check";
import { DialogProvider } from "./(components)/dialog-provider";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { DebugRole } from "./(components)/debug-role";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <SignedIn>
        <DebugRole />
        <OrganizationCheck />
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
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default DashboardLayout;
