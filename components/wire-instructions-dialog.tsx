"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WireInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WireInstructionsDialog({
  open,
  onOpenChange,
}: WireInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Wire Transfer & ACH Instructions
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Important Notice
              </h3>
              <p className="text-sm text-muted-foreground">
                Wire transfers, while secure, may result in delivery delays as
                we must wait for funds to fully clear. For faster processing,
                consider using a cashier&apos;s check which can often allow for
                quicker vehicle release.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Bank Information
              </h3>
              <div className="grid gap-1 text-sm">
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="font-medium">Beneficiary Bank:</span>
                  <span>TD Bank, NA</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="font-medium">Address:</span>
                  <span>16200 NW 57th Ave, Miami Lakes, FL 33014</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Transfer Numbers
              </h3>
              <div className="grid gap-1 text-sm">
                <div className="grid grid-cols-[220px,1fr]">
                  <span className="font-medium">
                    Domestic Wire (ABA/Routing):
                  </span>
                  <span className="font-mono">031101266</span>
                </div>
                <div className="grid grid-cols-[220px,1fr]">
                  <span className="font-medium">International Wire (USD):</span>
                  <span className="font-mono">NRTHUS33XXX</span>
                </div>
                <div className="grid grid-cols-[220px,1fr]">
                  <span className="font-medium">
                    International Wire (Foreign):
                  </span>
                  <span className="font-mono">TDOMCATTTOR</span>
                </div>
                <div className="grid grid-cols-[220px,1fr]">
                  <span className="font-medium">ACH Routing:</span>
                  <span className="font-mono">067014822</span>
                  <span className="col-span-2 text-xs text-muted-foreground">
                    (Not for Wire Transfers)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Recipient Details
              </h3>
              <div className="grid gap-1 text-sm">
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="font-medium">Account Name:</span>
                  <span>VOLVO OF NORTH MIAMI</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="font-medium">Account Number:</span>
                  <span className="font-mono">435254087</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="font-medium">Address:</span>
                  <span>20800 NW 2ND AVE, MIAMI GARDENS, FL 33169</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">Need Help?</h3>
              <div className="grid gap-1 text-sm">
                <p>Contact TD Bank Customer Service available 24/7:</p>
                <div className="grid grid-cols-[80px,1fr]">
                  <span className="font-medium">Phone:</span>
                  <span>1-888-751-9000</span>
                </div>
                <div className="grid grid-cols-[80px,1fr]">
                  <span className="font-medium">Website:</span>
                  <a
                    href="http://www.tdbank.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.tdbank.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                Please ensure all information is entered exactly as shown to
                avoid transfer delays. Your vehicle release will be processed
                once funds have fully cleared our account.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
