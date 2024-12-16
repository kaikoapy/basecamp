import { AppSidebar } from "../../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PinProvider } from "../providers/pin-provider";
import { DashboardContent } from "./dashboard-content";

export default function Page() {
  return (
    <PinProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardContent />
        </SidebarInset>
      </SidebarProvider>
    </PinProvider>
  );
}
