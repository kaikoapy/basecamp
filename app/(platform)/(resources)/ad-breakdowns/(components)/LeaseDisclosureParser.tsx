"use client";

import React, { useState } from "react";
import LeaseDisclosureCard, { LeaseDisclosure } from "./LeaseDisclosureCard"; // adjust the import path as needed
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const LoadingText = () => (
  <span className="inline-flex items-center">
    Decoding
    <span className="ml-1 animate-pulse">.</span>
    <span className="ml-0.5 animate-pulse delay-150">.</span>
    <span className="ml-0.5 animate-pulse delay-300">.</span>
  </span>
);

const LeaseDisclosureParser: React.FC = () => {
  const [disclosureText, setDisclosureText] = useState<string>("");
  const [parsedResult, setParsedResult] = useState<LeaseDisclosure | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isTransparent, setIsTransparent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setParsedResult(null);

    try {
      const response = await fetch("/api/parse-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          disclosure: disclosureText,
          isTransparent 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while parsing the disclosure.");
      }

      const data = await response.json();
      setParsedResult({
        ...data.structuredOutput,
        finePrintSummary: {
          ...data.structuredOutput.finePrintSummary,
          originalDisclosure: disclosureText
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Lease Disclosure Decoder</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <label htmlFor="disclosure" className="font-semibold">
          Paste Lease Disclosure Text:
        </label>
        <textarea
          id="disclosure"
          value={disclosureText}
          onChange={(e) => setDisclosureText(e.target.value)}
          placeholder="Paste the lease disclosure text here..."
          rows={10}
          className="w-full p-3 border border-gray-300 rounded-md font-mono"
        />
        
        <div className="flex items-center space-x-2">
          <Switch
            id="transparency-mode"
            checked={isTransparent}
            onCheckedChange={setIsTransparent}
          />
          <Label htmlFor="transparency-mode">
            Mark as Transparent Advertisement
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? <LoadingText /> : "Decode Disclosure"}
        </Button>
      </form>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {parsedResult && (
        <>
          {/* Render the visual card component */}
          <LeaseDisclosureCard disclosure={parsedResult} />

          {/* Raw JSON Output */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Raw JSON Output</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(parsedResult, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaseDisclosureParser;
