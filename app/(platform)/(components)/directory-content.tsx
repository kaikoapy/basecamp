"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DirectoryContent() {
  const directory = useQuery(api.directory.getAll);

  if (!directory) return <div>Loading...</div>;

  return (
    <div>
      {directory.map((entry) => (
        <div key={entry._id}>{entry.name}</div>
      ))}
    </div>
  );
}
