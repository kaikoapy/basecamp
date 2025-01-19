"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DirectoryLoading() {
  return (
    <div className="flex-1 w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Skeleton className="h-9 w-96 mb-2" />
            <div className="flex items-center mb-4">
              <Skeleton className="h-5 w-72" />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="space-y-4">
            {/* Search and Actions Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Skeleton className="h-10 w-64" />
                </div>
                <Skeleton className="h-10 w-[200px]" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="w-full rounded-lg border bg-background overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="border-b transition-colors">
                    <th className="h-12 w-[50px] p-4">
                      <Skeleton className="h-4 w-4" />
                    </th>
                    {[
                      "Name",
                      "Position",
                      "Department",
                      "Extension",
                      "Phone",
                      "Email",
                      "",
                    ].map((_, i) => (
                      <th key={i} className="h-12 p-4 text-left">
                        <Skeleton className="h-4 w-full" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...Array(10)].map((_, i) => (
                    <tr key={i}>
                      <td className="p-4">
                        <Skeleton className="h-4 w-4" />
                      </td>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="p-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
