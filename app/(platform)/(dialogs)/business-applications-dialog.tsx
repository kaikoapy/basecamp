"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FullscreenImage } from "@/components/fullscreen-image";
import { Printer, ScrollText, FileCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DOCUMENT_URLS } from "@/app/data/document-urls";

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
  const handlePrint = () => {
    window.open(DOCUMENT_URLS.BUSINESS_APPLICATION, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Your existing trigger button */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="mb-4">
          <DialogTitle>Business Applications</DialogTitle>
          <DialogDescription>
            Review guidelines and access the business application form.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="guidelines" className="w-full">
            <ScrollArea>
              <TabsList className="mb-3 h-[52px]">
                <TabsTrigger value="guidelines" className="py-3">
                  <ScrollText
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Guidelines & Requirements
                </TabsTrigger>
                <TabsTrigger value="application" className="py-3">
                  <FileCheck
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Business Application Form
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <TabsContent value="guidelines">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Important guidelines for processing business applications.
                  </p>
                  <p className="text-sm text-foreground/80">
                    Typically, business deals are structured with the business
                    listed as the primary purchaser (line 1), accompanied by an
                    authorized guarantor who co-signs for the business. The
                    guarantor must be explicitly listed in the company&apos;s
                    articles of incorporation.
                  </p>
                  <p className="text-sm text-foreground/80">
                    In some instances, a customer may prefer to structure the
                    deal entirely under the business name. This approach is
                    subject to stricter requirements and carries additional
                    implications. If this is the case, please consult with the
                    sales manager and refer to Volvo&apos;s Business
                    documentation.
                  </p>
                  <p className="text-sm text-foreground/80">
                    Regardless of whether the deal is structured as
                    business-only or business-with-guarantor, ensure that:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-foreground/80">
                    <li>The business application form is fully completed.</li>
                    <li>
                      A printout of the business&apos;s Sunbiz record is included.
                      You can retrieve this record from{" "}
                      <a
                        href="https://search.sunbiz.org/Inquiry/CorporationSearch/ByName"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Sunbiz.org
                      </a>
                      .
                    </li>
                  </ul>
                  <p className="text-sm pt-4 text-foreground/80">
                    Below are the guidliens for a business-only (no guarantor)
                    deal:
                  </p>
                </div>
                <div className="h-[600px] border rounded-lg overflow-hidden bg-muted/50">
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <FullscreenImage
                      src={GUIDELINES_IMAGE}
                      alt="Business Applications Guidelines"
                      showExternalLink={false}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="application">
              <div className="space-y-4 mt-4">
                <p className="text-sm font-medium text-foreground">
                  Print the business application form for your client to
                  complete.
                </p>
                <div className="relative h-[600px] border rounded-lg overflow-hidden bg-muted/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-3 right-3 z-10"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <FullscreenImage
                      src={BUSINESS_APP_PREVIEW}
                      alt="Business Application Form Preview"
                      showExternalLink={false}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
