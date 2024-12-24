"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FullscreenImage } from "@/components/fullscreen-image";

const EX90_SHEET_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1yIDOOqYvkUzZSeqajA682byYFBfWmhDPKXOQE";

interface EX90SheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EX90SheetDialog({ open, onOpenChange }: EX90SheetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[825px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>EX90 Sheet</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-6">
            {/* Document Preview Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Document Preview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the image below to view in full size. You can print the
                  document from the expanded view.
                </p>
              </div>
              <div className="h-[600px] border rounded-lg overflow-hidden">
                <FullscreenImage src={EX90_SHEET_IMAGE} alt="EX90 Form Sheet" />
              </div>
            </div>

            <Separator />

            {/* Instructions Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Instructions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  How to use this document:
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>• Click the image above to view in full screen</p>
                <p>
                  • Use your browser&apos;s print function (Ctrl/Cmd + P) to
                  print
                </p>
                <p>• Ensure all fields are filled out completely</p>
                <p>• Keep copies for both dealer and customer records</p>
                <p>
                  • Submit the completed form with other required documentation
                </p>
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
