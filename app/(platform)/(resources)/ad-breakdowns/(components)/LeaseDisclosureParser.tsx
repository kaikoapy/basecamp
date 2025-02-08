"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import LeaseDisclosureCard from "./LeaseDisclosureCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";
import { EditAdForm } from "./EditAdForm";
import type { Doc } from "@/convex/_generated/dataModel";

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
  const [parsedResult, setParsedResult] = useState<Doc<"leaseAds"> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [selectedAdId, setSelectedAdId] = useState<Id<"leaseAds"> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Convex mutations
  const createAd = useMutation(api.ads.create);
  const updateAd = useMutation(api.ads.update);
  const deleteAd = useMutation(api.ads.remove);
  const deactivateAd = useMutation(api.ads.deactivate);

  // Fetch existing ads grouped by dealership
  const adsByDealership = useQuery(api.ads.getByDealership);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
      const parsedData = {
        ...data.structuredOutput,
        finePrintSummary: {
          ...data.structuredOutput.finePrintSummary,
          originalDisclosure: disclosureText
        }
      };
      
      setParsedResult(parsedData);

      // Prepare the lease ad data
      const leaseAdData = {
        dealershipInfo: parsedData.dealershipInfo,
        advertisementOverview: {
          ...parsedData.advertisementOverview,
          isTransparent,
        },
        finePrintSummary: parsedData.finePrintSummary,
        fullPaymentDetails: parsedData.fullPaymentDetails,
      };

      // Create or update the ad in Convex
      if (selectedAdId) {
        await updateAd({ id: selectedAdId, leaseAd: leaseAdData });
        toast.success("Lease ad updated successfully");
      } else {
        await createAd({ leaseAd: leaseAdData });
        toast.success("Lease ad created successfully");
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdId) return;
    
    try {
      await deleteAd({ id: selectedAdId });
      setSelectedAdId(null);
      setParsedResult(null);
      setDisclosureText("");
      toast.success("Lease ad deleted successfully");
    } catch {
      toast.error("Failed to delete lease ad");
    }
  };

  const handleDeactivate = async () => {
    if (!selectedAdId) return;
    
    try {
      await deactivateAd({ id: selectedAdId });
      toast.success("Lease ad deactivated successfully");
    } catch {
      toast.error("Failed to deactivate lease ad");
    }
  };

  // Get ad by ID query
  const getAdById = useQuery(api.ads.getById, selectedAdId ? { id: selectedAdId } : "skip");

  // Use useEffect to handle loading existing ad data
  useEffect(() => {
    if (getAdById) {
      setDisclosureText(getAdById.finePrintSummary.originalDisclosure);
      setIsTransparent(getAdById.advertisementOverview.isTransparent);
      setParsedResult(getAdById);
    }
  }, [getAdById]);

  const handleLoadExistingAd = (adId: Id<"leaseAds">) => {
    setSelectedAdId(adId);
  };

  const handleSaveEdit = async (updatedAd: Doc<"leaseAds">) => {
    if (!selectedAdId) return;
    
    try {
      await updateAd({ 
        id: selectedAdId, 
        leaseAd: {
          dealershipInfo: updatedAd.dealershipInfo,
          advertisementOverview: updatedAd.advertisementOverview,
          finePrintSummary: updatedAd.finePrintSummary,
          fullPaymentDetails: updatedAd.fullPaymentDetails,
        }
      });
      setIsEditing(false);
      setParsedResult(updatedAd);
      toast.success("Ad updated successfully");
    } catch {
      toast.error("Failed to update ad");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Lease Disclosure Decoder</h1>

      {/* Existing Ads Selector */}
      {adsByDealership && (
        <div className="mb-6">
          <Label htmlFor="existing-ad">Load Existing Ad</Label>
          <Select onValueChange={(value) => handleLoadExistingAd(value as Id<"leaseAds">)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an existing ad" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(adsByDealership).map(([dealership, dealerAds]) => (
                <SelectGroup key={dealership}>
                  <SelectLabel>{dealership} ({dealerAds.length} ads)</SelectLabel>
                  {dealerAds.map((ad) => (
                    <SelectItem key={ad._id} value={ad._id}>
                      {ad.advertisementOverview.vehicleModel} - {ad.advertisementOverview.advertisedMonthlyPayment}/mo
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? <LoadingText /> : (selectedAdId ? "Update Ad" : "Create Ad")}
          </Button>

          {selectedAdId && (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete Ad
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDeactivate}
                className="flex-1"
              >
                Deactivate Ad
              </Button>
            </>
          )}
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {parsedResult && !isEditing && (
        <>
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Edit Ad Details
            </Button>
          </div>
          <LeaseDisclosureCard disclosure={parsedResult} />
          <div>
            <h2 className="text-2xl font-bold mb-4">Raw JSON Output</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(parsedResult, null, 2)}
            </pre>
          </div>
        </>
      )}

      {parsedResult && isEditing && (
        <EditAdForm
          ad={parsedResult}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default LeaseDisclosureParser;
