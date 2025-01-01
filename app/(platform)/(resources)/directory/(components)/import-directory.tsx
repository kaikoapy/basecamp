import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Papa from "papaparse";
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface ImportStats {
  departments: number;
  entries: number;
}

interface CSVRow {
  "": string;
  "Volvo Cars North Miami": string;
  _1: string;
  _2: string;
  _3: string;
  _4: string;
  _5: string;
  _6: string;
  _7: string;
  _8: string;
}

interface DirectoryEntry {
  name: string;
  position: string;
  department: string;
  extension: string;
  number: string;
  email: string;
}

const DirectoryImport = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importStats, setImportStats] = useState<ImportStats>({
    departments: 0,
    entries: 0,
  });

  const seedDirectory = useMutation(api.directory.seedDirectory);

  const processCSV = async (file: string): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<CSVRow>(file, {
        header: true,
        skipEmptyLines: "greedy",
        transform: (value) => value.trim(),
        complete: (results) => resolve(results.data),
        error: (error: Error) => reject(error),
      });
    });
  };

  const processWithAI = async (entries: DirectoryEntry[]) => {
    try {
      const response = await fetch("/api/directory-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) {
        throw new Error("Failed to process data");
      }

      const processedData = await response.json();
      return processedData.entries;
    } catch (error) {
      console.error("Error processing with AI:", error);
      throw error;
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError("");
    setSuccess("");
    setImportStats({ departments: 0, entries: 0 });

    try {
      // Read and parse the CSV
      const fileContent = await file.text();
      const parsedData = await processCSV(fileContent);

      // Process departments
      const processedEntries: DirectoryEntry[] = [];

      parsedData.forEach((row: CSVRow) => {
        // Process left side entry
        const leftSide: DirectoryEntry = {
          name: row["_1"],
          position: row["Volvo Cars North Miami"] || "Staff",
          department: getRowDepartment(row),
          extension: row["_2"],
          number: row["_3"],
          email: "",
        };

        // Process right side entry
        const rightSide: DirectoryEntry = {
          name: row["_6"],
          position: row["_5"] || "Staff",
          department: getRowDepartment(row, true),
          extension: row["_7"],
          number: row["_8"],
          email: "",
        };

        if (isValidEntry(leftSide)) {
          processedEntries.push(leftSide);
        }
        if (isValidEntry(rightSide)) {
          processedEntries.push(rightSide);
        }
      });

      // Process with OpenAI
      const normalizedEntries = await processWithAI(processedEntries);

      // Get unique departments
      const departments = new Set(
        normalizedEntries.map((entry: DirectoryEntry) => entry.department)
      );

      // Seed the directory
      await seedDirectory({ entries: normalizedEntries });

      setImportStats({
        departments: departments.size,
        entries: normalizedEntries.length,
      });
      setSuccess("Directory data imported successfully!");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Error importing directory data");
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  function getRowDepartment(row: CSVRow, isRightSide = false): string {
    if (isRightSide) {
      return row["_5"]?.includes("Department")
        ? row["_5"].replace(" Department", "")
        : "Service";
    }
    return row["Volvo Cars North Miami"]?.includes("Department")
      ? row["Volvo Cars North Miami"].replace(" Department", "")
      : "Sales";
  }

  function isValidEntry(entry: DirectoryEntry): boolean {
    return Boolean(
      entry.name &&
        entry.extension &&
        !entry.name.toLowerCase().includes("ext.") &&
        entry.name.length > 0 &&
        entry.extension.length > 0
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Import Directory Data
        </h2>
        <p className="text-gray-600">
          Upload a CSV file to import directory data. The file should contain
          employee information including names, departments, and contact
          details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">CSV files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing}
            />
          </label>
        </div>

        {importing && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Importing directory data...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-md">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Import Summary:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Departments imported: {importStats.departments}</li>
                <li>Directory entries imported: {importStats.entries}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryImport;
