import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MountProvider } from "@/components/providers/mount-provider";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
}
