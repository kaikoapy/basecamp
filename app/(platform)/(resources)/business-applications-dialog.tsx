"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BusinessApplicationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BusinessApplicationsDialog({
  open,
  onOpenChange,
}: BusinessApplicationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Business Application Requirements
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto pr-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Required Documents
              </h3>
              <div className="grid gap-2 text-sm">
                <p>For all business applications, we require:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Articles of Incorporation or Organization</li>
                  <li>EIN (Employer Identification Number)</li>
                  <li>Business License</li>
                  <li>Previous two years of business tax returns</li>
                  <li>Bank statements (last 3 months)</li>
                  <li>Profit & Loss statement (current year)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Additional Requirements
              </h3>
              <div className="grid gap-2 text-sm">
                <p>For businesses less than 2 years old:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Business plan</li>
                  <li>Personal tax returns (last 2 years)</li>
                  <li>Personal financial statement</li>
                  <li>Resume of principal owners</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Guarantor Information
              </h3>
              <p className="text-sm text-muted-foreground">
                For each guarantor (anyone owning 20% or more of the business),
                we need:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Valid government-issued ID</li>
                <li>Social Security number</li>
                <li>Personal income verification</li>
                <li>Proof of residence</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Processing Timeline
              </h3>
              <p className="text-sm text-muted-foreground">
                Applications are typically processed within 2-3 business days
                after receiving all required documentation. Complex applications
                may require additional time for review.
              </p>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                All documents must be current and valid. Incomplete applications
                may result in processing delays. Please ensure all information
                is accurate and verifiable.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
