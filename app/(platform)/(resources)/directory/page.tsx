"use client";

import React, { useState } from "react";
import { Building } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import DirectoryTable from "./(components)/directory-table";

const ContactDirectory = () => {
  const [] = useState("");
  const [] = useState<string | null>(null);
  const [] = useState<{
    id: Id<"directory">;
    department: string;
  } | null>(null);

  const contacts = useQuery(api.directory.getAll);
  const address = useQuery(api.directory.getAddress);

  if (!contacts) return <div>Loading...</div>;

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
};

export default ContactDirectory;
