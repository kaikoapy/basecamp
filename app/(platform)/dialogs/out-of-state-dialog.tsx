"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FullscreenImage } from "@/components/fullscreen-image";
import { Separator } from "@/components/ui/separator";

interface OutOfStateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OUT_OF_STATE_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1yuAGphJwKDF7TiHP5kxGQpyXOd9f3gn1vjzWC";

export function OutOfStateDialog({
  open,
  onOpenChange,
}: OutOfStateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Your existing trigger button */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Out of State Deals Process</DialogTitle>
          <DialogDescription>
            Learn about our process for handling out of state vehicle sales.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-6">
            {/* Process Overview Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Process Overview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Review our step-by-step process for handling out of state
                  deals. Click the image to view in full size.
                </p>
              </div>
              <div className="h-[300px] border rounded-lg overflow-hidden">
                <FullscreenImage
                  src={OUT_OF_STATE_IMAGE}
                  alt="Out of State Process Diagram"
                />
              </div>
            </div>

            <Separator />

            {/* Requirements Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Requirements & Documentation
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Essential documents and requirements for out of state
                  transactions:
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>• Valid driver&apos;s license from customer&apos;s state</p>
                <p>• Proof of insurance from customer&apos;s state</p>
                <p>• Shipping or transport arrangements if needed</p>
                <p>• State-specific documentation requirements</p>
                <p>• Notarized power of attorney (if applicable)</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
