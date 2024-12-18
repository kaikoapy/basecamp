"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OutOfStateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OutOfStateDialog({
  open,
  onOpenChange,
}: OutOfStateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Out of State Sales Process
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto pr-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Required Documentation
              </h3>
              <div className="grid gap-2 text-sm">
                <p>For out of state purchases, we require:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Valid driver&apos;s license from your state</li>
                  <li>Current proof of insurance</li>
                  <li>Current registration (for trade-ins)</li>
                  <li>Proof of residence in your state</li>
                  <li>Signed power of attorney (if applicable)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Tax Information
              </h3>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p>
                  Sales tax will be calculated based on your state&apos;s
                  requirements:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Some states require tax payment at time of purchase</li>
                  <li>Others collect tax when you register the vehicle</li>
                  <li>
                    We provide all necessary documentation for your state&apos;s
                    DMV
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Shipping & Delivery
              </h3>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p>We offer two options for vehicle delivery:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Enclosed Transport:</span>{" "}
                    Premium service with full vehicle protection
                  </li>
                  <li>
                    <span className="font-medium">Open Transport:</span>{" "}
                    Standard shipping method, more economical
                  </li>
                  <li>
                    <span className="font-medium">In-Person Pickup:</span>{" "}
                    Available at our dealership with temporary tags
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Registration Process
              </h3>
              <p className="text-sm text-muted-foreground">
                We assist with all necessary paperwork for your state&apos;s
                registration:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Title transfer documentation</li>
                <li>Temporary registration if needed</li>
                <li>Emissions compliance certificates</li>
                <li>Vehicle inspection documents</li>
              </ul>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                Processing times vary by state. We recommend allowing 2-3 weeks
                for complete processing of all documentation. Your sales
                representative will keep you updated throughout the process.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
