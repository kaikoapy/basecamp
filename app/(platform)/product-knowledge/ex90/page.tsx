"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

const EX90_SHEET_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1yIDOOqYvkUzZSeqajA682byYFBfWmhDPKXOQE";

const EX90_SHEET_PDF =
  "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yOKuo2HpvrsXpeiu26yZTBnadAzhLNKxb95WI";

export default function EX90Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">EX90 Information</h1>
          <p className="text-muted-foreground mt-2">
            Essential information and resources for the Volvo EX90
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">EX90 Sheet</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(EX90_SHEET_IMAGE, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Size
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(EX90_SHEET_PDF, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
            <Image
              src={EX90_SHEET_IMAGE}
              alt="EX90 Sheet"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Additional EX90 content sections can be added here */}
      </div>
    </div>
  );
}
