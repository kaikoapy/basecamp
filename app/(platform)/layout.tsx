import { AppSidebar } from "./(components)/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MountProvider } from "@/components/providers/mount-provider";
import { OrganizationCheck } from "./(components)/organization-check";
import { DialogProvider } from "./(components)/dialog-provider";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <SignedIn>
        <OrganizationCheck />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <MountProvider>
              {children}
            </MountProvider>
          </SidebarInset>
          <DialogProvider />
        </SidebarProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default DashboardLayout;
