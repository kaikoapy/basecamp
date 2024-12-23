import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PinProvider } from "@/app/providers/pin-provider";
import { MountProvider } from "@/components/providers/mount-provider";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PinProvider>
      <SidebarProvider>
        <div className="flex h-screen">
          <Suspense fallback={<div className="w-64 bg-muted animate-pulse" />}>
            <AppSidebar />
          </Suspense>
          <div className="flex-1 overflow-auto">
            <MountProvider>
              <Suspense>{children}</Suspense>
            </MountProvider>
          </div>
        </div>
      </SidebarProvider>
    </PinProvider>
  );
}
