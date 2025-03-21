"use client";

import React, { Suspense } from "react";
import { Building } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import DirectoryTable from "./directory-table";
import { Skeleton } from "@/components/ui/skeleton";

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="rounded-lg border border-border">
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DirectoryContent() {
  // Prefetch the directory data
  useQuery(api.directory.getAll);
  const address = useQuery(api.directory.getAddress);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Volvo Cars North Miami Directory
          </h1>
          {address && (
            <div className="flex items-center mb-4 text-gray-600">
              <Building className="w-5 h-5 mr-2" />
              {address}
            </div>
          )}
        </div>
      </div>
      <div className="mb-8">
        <Suspense fallback={<TableSkeleton />}>
          <DirectoryTable />
        </Suspense>
      </div>
    </div>
  );
}
