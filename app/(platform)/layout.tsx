import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MountProvider } from "@/components/providers/mount-provider";
import { OrganizationCheck } from "./(components)/organization-check";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MountProvider>
          <OrganizationCheck>{children}</OrganizationCheck>
        </MountProvider>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
