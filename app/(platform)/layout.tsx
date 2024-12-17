import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PinProvider } from "../providers/pin-provider";
import { MountProvider } from "@/components/providers/mount-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <PinProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <MountProvider>{children}</MountProvider>
        </SidebarInset>
      </SidebarProvider>
    </PinProvider>
  );
};

export default DashboardLayout;
