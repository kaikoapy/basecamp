import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MountProvider } from "@/components/providers/mount-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Suspense fallback={<div className="w-64 bg-muted animate-pulse" />}>
          <AppSidebar />
        </Suspense>
        <div className="flex flex-col flex-1 overflow-hidden">
          <MountProvider>
            <Suspense>{children}</Suspense>
          </MountProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
