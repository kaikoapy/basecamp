"use client";

import React from "react";
import { Building } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import DirectoryTable from "./directory-table";

export function DirectoryContent() {
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
        <DirectoryTable />
      </div>
    </div>
  );
}
