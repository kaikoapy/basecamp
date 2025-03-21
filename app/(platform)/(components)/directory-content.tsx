"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DirectoryContent() {
  const directory = useQuery(api.directory.getAll);

  if (!directory) return null; // Let the layout handle loading state

  if (directory.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        No directory entries found
      </div>
    );
  }

  return (
    <div>
      {directory.map((entry) => (
        <div key={entry._id}>{entry.name}</div>
      ))}
    </div>
  );
}
