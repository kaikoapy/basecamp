import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar, SidebarRail } from "@/components/ui/sidebar";

function SidebarSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Team Switcher Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Navigation Items Skeleton */}
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* User Section Skeleton */}
      <div className="flex items-center gap-2 mt-auto">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function PlatformLoading() {
  return (
    <div className="flex h-screen">
      <Sidebar collapsible="icon">
        <SidebarSkeleton />
        <SidebarRail />
      </Sidebar>
      <div className="flex-1">
        {/* Content loading state will be handled by nested loading.tsx files */}
      </div>
    </div>
  );
}
