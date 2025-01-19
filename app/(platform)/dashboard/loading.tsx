"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="w-full">
      <main className="p-6 max-w-[1600px] mx-auto animate-in fade-in-50">
        {/* Announcements Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-8 w-32" />
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {/* First two are announcement cards */}
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="col-span-2 rounded-lg border bg-white p-4 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex items-center justify-between pt-4 border-t mt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="mb-6">
          <Skeleton className="h-8 w-32 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-white overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]"
              >
                <Skeleton className="aspect-video w-full" />
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full rounded-lg mt-6" />
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
              <div
                key={i}
                className="rounded-lg border bg-white overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]"
              >
                <Skeleton className="aspect-video w-full" />
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full rounded-lg mt-6" />
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
              <div
                key={i}
                className="rounded-lg border bg-white overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]"
              >
                <Skeleton className="aspect-video w-full" />
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full rounded-lg mt-6" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
