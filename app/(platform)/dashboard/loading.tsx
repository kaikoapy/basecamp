"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-auto">
      <main className="flex-1 p-6 max-w-[1600px] mx-auto animate-in fade-in-50">
        {/* Announcements Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-8 w-32" />
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="mb-6">
          <Skeleton className="h-8 w-32 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="mb-6">
          <Skeleton className="h-8 w-32 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Volvo Sites Section */}
        <section className="mb-6">
          <Skeleton className="h-8 w-32 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
