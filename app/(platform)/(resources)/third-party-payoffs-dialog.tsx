"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThirdPartyPayoffsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThirdPartyPayoffsDialog({
  open,
  onOpenChange,
}: ThirdPartyPayoffsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Third Party Payoff Requirements
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto pr-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Required Documentation
              </h3>
              <div className="grid gap-2 text-sm">
                <p>To process a third party payoff, we need:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Current payoff statement (valid for at least 10 days)</li>
                  <li>Account number</li>
                  <li>Lender&apos;s complete mailing address</li>
                  <li>Vehicle information (Year, Make, Model)</li>
                  <li>VIN (Vehicle Identification Number)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Processing Time
              </h3>
              <p className="text-sm text-muted-foreground">
                Payoffs are typically processed within 24-48 business hours
                after receiving all required documentation. Please note that the
                actual transfer of funds may take additional time depending on
                the lender.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Important Notes
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>
                  Ensure all information is accurate to avoid delays in
                  processing
                </li>
                <li>
                  If the payoff amount changes, a new statement may be required
                </li>
                <li>
                  Contact your lender to confirm they&apos;ve received the
                  payoff
                </li>
                <li>Keep copies of all documentation for your records</li>
              </ul>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                Please submit all required documentation to your finance
                manager. Incomplete information may result in processing delays.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
