"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Doc } from "@/convex/_generated/dataModel";

interface EditAdFormProps {
  ad: Doc<"leaseAds">;
  onSave: (updatedAd: Doc<"leaseAds">) => Promise<void>;
  onCancel: () => void;
}

type LeaseAdFields = Doc<"leaseAds">;

export function EditAdForm({ ad, onSave, onCancel }: EditAdFormProps) {
  const [editedAd, setEditedAd] = useState<LeaseAdFields>(ad);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(editedAd);
  };

  const updateField = (
    section: 'dealershipInfo' | 'advertisementOverview' | 'finePrintSummary' | 'fullPaymentDetails',
    field: string,
    value: string
  ) => {
    setEditedAd(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (
    section: 'fullPaymentDetails',
    subsection: 'paymentDetails' | 'additionalFees' | 'requiredDiscounts' | 'vehicleRequirements',
    field: string,
    value: string
  ) => {
    setEditedAd(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dealership Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={editedAd.dealershipInfo.name}
              onChange={(e) => updateField('dealershipInfo', 'name', e.target.value)}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={editedAd.dealershipInfo.location}
              onChange={(e) => updateField('dealershipInfo', 'location', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Advertisement Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Vehicle Model</Label>
            <Input
              value={editedAd.advertisementOverview.vehicleModel}
              onChange={(e) => updateField('advertisementOverview', 'vehicleModel', e.target.value)}
            />
          </div>
          <div>
            <Label>Monthly Payment</Label>
            <Input
              value={editedAd.advertisementOverview.advertisedMonthlyPayment}
              onChange={(e) => updateField('advertisementOverview', 'advertisedMonthlyPayment', e.target.value)}
            />
          </div>
          <div>
            <Label>Down Payment</Label>
            <Input
              value={editedAd.advertisementOverview.advertisedDownPayment}
              onChange={(e) => updateField('advertisementOverview', 'advertisedDownPayment', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(editedAd.fullPaymentDetails.paymentDetails).map(([key, value]) => (
            <div key={key}>
              <Label>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
              <Input
                value={value}
                onChange={(e) => updateNestedField('fullPaymentDetails', 'paymentDetails', key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Fees</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(editedAd.fullPaymentDetails.additionalFees).map(([key, value]) => (
            <div key={key}>
              <Label>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
              <Input
                value={value}
                onChange={(e) => updateNestedField('fullPaymentDetails', 'additionalFees', key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Required Discounts</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(editedAd.fullPaymentDetails.requiredDiscounts).map(([key, value]) => (
            <div key={key}>
              <Label>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
              <Input
                value={value}
                onChange={(e) => updateNestedField('fullPaymentDetails', 'requiredDiscounts', key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vehicle Requirements</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(editedAd.fullPaymentDetails.vehicleRequirements).map(([key, value]) => (
            <div key={key}>
              <Label>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
              <Input
                value={value}
                onChange={(e) => updateNestedField('fullPaymentDetails', 'vehicleRequirements', key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
} 