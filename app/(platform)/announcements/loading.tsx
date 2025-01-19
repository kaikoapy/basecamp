"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementsLoading() {
  return (
    <div className="flex-1 w-full">
      <main className="flex-1 p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3 items-center mb-6">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-7 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
