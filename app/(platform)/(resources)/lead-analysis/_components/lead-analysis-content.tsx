"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { XMLParser } from "fast-xml-parser";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadSourceTable } from "./lead-source-table";
import { LeadInsights } from "./lead-insights";

interface LeadSourceData {
  source: string;
  newLeads: number;
  contacted: number;
  storeVisits: number;
  apptsOpened: number;
  apptsShown: number;
  noShows: number;
  sales: number;
  details: {
    tracking: string;
    newLeads: number;
    contacted: number;
    storeVisits: number;
    apptsOpened: number;
    apptsShown: number;
    noShows: number;
    sales: number;
  }[];
}

interface DetailData {
  Tracking: string;
  TrackingNewLeads: string;
  TrackingContacted: string;
  TrackingStoreVisits: string;
  TrackingApptOpen: string;
  TrackingApptShow: string;
  TrackingApptNoShow: string;
  TrackingSold: string;
}

interface DealerSocketSource {
  Source: string;
  SourceNewLeads: string;
  SourceContacted: string;
  SourceStoreVisits: string;
  SourceApptOpen: string;
  SourceApptShow: string;
  SourceApptNoShow: string;
  SourceSold: string;
  Detail_Collection: {
    Detail: DetailData | DetailData[];
  };
}

interface DealerSocketXML {
  Report: {
    table1: {
      table1_Group1_Collection: {
        table1_Group1: DealerSocketSource | DealerSocketSource[];
      };
    };
  };
}

function validateXMLStructure(data: unknown): data is DealerSocketXML {
  console.log("Validating XML structure...");
  
  if (!data || typeof data !== "object") {
    console.log("Failed: Root object is missing");
    throw new Error("Invalid XML: Root object is missing");
  }

  const result = data as DealerSocketXML;
  console.log("Report structure:", {
    hasReport: !!result.Report,
    hasTable1: !!result.Report?.table1,
    hasCollection: !!result.Report?.table1?.table1_Group1_Collection,
    hasGroup1: !!result.Report?.table1?.table1_Group1_Collection?.table1_Group1,
  });

  if (!result.Report?.table1?.table1_Group1_Collection?.table1_Group1) {
    console.log("Failed: Missing required DealerSocket report structure");
    throw new Error("Invalid XML: Missing required DealerSocket report structure");
  }

  return true;
}

export function LeadAnalysisContent() {
  const [data, setData] = useState<LeadSourceData[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/xml": [".xml"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        console.log("Reading file:", file.name);
        const text = await file.text();
        console.log("File content length:", text.length);
        console.log("First 200 characters:", text.substring(0, 200));

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
          parseAttributeValue: true,
          parseTagValue: true,
          trimValues: true,
          ignoreDeclaration: true,
          removeNSPrefix: true,
        });
        
        console.log("Parsing XML...");
        const result = parser.parse(text);
        console.log("Full parsed result:", result);
        console.log("Parsed XML structure:", {
          hasReport: !!result.Report,
          hasTable1: !!result.Report?.table1,
          hasCollection: !!result.Report?.table1?.table1_Group1_Collection,
          hasGroup1: !!result.Report?.table1?.table1_Group1_Collection?.table1_Group1,
        });
        
        if (validateXMLStructure(result)) {
          let sources = result.Report.table1.table1_Group1_Collection.table1_Group1;
          
          // Ensure sources is an array
          if (!Array.isArray(sources)) {
            sources = [sources];
          }
          
          console.log("Raw sources:", sources);
          console.log("Processing", sources.length, "sources");
          const processedData = sources
            .map((source) => {
              console.log("Processing source:", source);
              
              // Process details
              let details = source.Detail_Collection?.Detail || [];
              if (!Array.isArray(details)) {
                details = [details];
              }
              
              return {
                source: source.Source,
                newLeads: Number(source.SourceNewLeads || 0),
                contacted: Number(source.SourceContacted || 0),
                storeVisits: Number(source.SourceStoreVisits || 0),
                apptsOpened: Number(source.SourceApptOpen || 0),
                apptsShown: Number(source.SourceApptShow || 0),
                noShows: Number(source.SourceApptNoShow || 0),
                sales: Number(source.SourceSold || 0),
                details: details.map(detail => ({
                  tracking: detail.Tracking,
                  newLeads: Number(detail.TrackingNewLeads || 0),
                  contacted: Number(detail.TrackingContacted || 0),
                  storeVisits: Number(detail.TrackingStoreVisits || 0),
                  apptsOpened: Number(detail.TrackingApptOpen || 0),
                  apptsShown: Number(detail.TrackingApptShow || 0),
                  noShows: Number(detail.TrackingApptNoShow || 0),
                  sales: Number(detail.TrackingSold || 0),
                })),
              };
            })
            .filter((row) =>
              row.source &&
              ![
                "Dealer Mgmt Sys",
                "MasterMind",
                "Mastermind",
                "Non Sales Call",
                "Lease Return",
                "General Lease"
              ].includes(
                row.source
              )
            );

          console.log("Processed data:", processedData);
          setData(processedData);
          toast.success(`Successfully processed ${processedData.length} lead sources`);
        }
      } catch (error) {
        console.error("Full error details:", error);
        toast.error(
          error instanceof Error
            ? `Error: ${error.message}`
            : "Error parsing XML file"
        );
      }
    },
  });

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary/50 bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <UploadIcon className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop your DealerSocket XML report here"
              : "Drag & drop your DealerSocket lead source report (XML) here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Accepts DealerSocket &quot;New Leads by Source (Tracking Codes)&quot; report in XML format
          </p>
        </div>
      </Card>

      {data.length > 0 && (
        <div className="space-y-6">
          <LeadSourceTable data={data} />
          <LeadInsights data={data} />
        </div>
      )}
    </div>
  );
} 