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
import { PrintBusinessApplication } from "@/app/(platform)/(components)/print-business-application";
import { DOCUMENT_URLS } from "@/app/config/constants";
import { Separator } from "@/components/ui/separator";

interface BusinessApplicationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GUIDELINES_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1ymwKBBnyKv3dxk5GC76MncbHBIJiVoQqgsUR1";

const BUSINESS_APP_PREVIEW =
  "https://utfs.io/f/WTe1MV8FTP1yyrskCSu6DcpWYFfvkCVrn34LQaxXdtMy18om";

export function BusinessApplicationsDialog({
  open,
  onOpenChange,
}: BusinessApplicationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Your existing trigger button */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Business Applications</DialogTitle>
          <DialogDescription>
            Review guidelines and access the business application form.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-6">
            {/* Guidelines Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Guidelines & Requirements
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Review these guidelines carefully before submitting your
                  application. Click the image to view in full size.
                </p>
              </div>
              <div className="h-[300px] border rounded-lg overflow-hidden">
                <FullscreenImage
                  src={GUIDELINES_IMAGE}
                  alt="Business Applications Guidelines"
                />
              </div>
            </div>

            <Separator />

            {/* Application Form Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Business Application Form
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you&apos;ve reviewed the guidelines, click below to open
                  and print the official business application form.
                </p>
              </div>
              <div className="h-[300px] border rounded-lg overflow-hidden">
                <FullscreenImage
                  src={BUSINESS_APP_PREVIEW}
                  alt="Business Application Form Preview"
                />
              </div>
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to open and print the business
                  application form:
                </p>
                <PrintBusinessApplication
                  pdfUrl={DOCUMENT_URLS.BUSINESS_APPLICATION}
                />
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
