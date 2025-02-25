"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { XMLParser } from "fast-xml-parser";
import { toast } from "sonner";
import { createLogger } from "@/lib/logger";

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

interface DealerSocketSource {
  name: string;
  type: string;
  Source: string;
  SourceNewLeads: string;
  SourceContacted: string;
  SourceStoreVisits: string;
  SourceApptOpen: string;
  SourceApptShow: string;
  SourceApptNoShow: string;
  SourceSold: string;
  Detail_Collection?: {
    Detail: DealerSocketDetail | DealerSocketDetail[];
  };
}

interface DealerSocketDetail {
  Tracking: string;
  TrackingNewLeads: string;
  TrackingContacted: string;
  TrackingStoreVisits: string;
  TrackingApptOpen: string;
  TrackingApptShow: string;
  TrackingApptNoShow: string;
  TrackingSold: string;
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

const logger = createLogger("lead-analysis");

function validateXMLStructure(data: unknown): data is DealerSocketXML {
  logger.debug("Validating XML structure...");
  
  if (!data || typeof data !== "object") {
    logger.error("XML validation failed", { reason: "Root object is missing" });
    throw new Error("Invalid XML: Root object is missing");
  }

  const result = data as DealerSocketXML;
  logger.debug("Report structure found", {
    hasReport: !!result.Report,
    hasTable1: !!result.Report?.table1,
    hasCollection: !!result.Report?.table1?.table1_Group1_Collection,
    hasGroup1: !!result.Report?.table1?.table1_Group1_Collection?.table1_Group1,
  });

  if (!result.Report?.table1?.table1_Group1_Collection?.table1_Group1) {
    logger.error("XML validation failed", { reason: "Missing required DealerSocket report structure" });
    throw new Error("Invalid XML: Missing required DealerSocket report structure");
  }

  return true;
}

function processSourceData(source: DealerSocketSource): LeadSourceData | null {
  // Skip certain source types
  if (["Dealer Mgmt Sys", "MasterMind", "Mastermind", "Non Sales Call", "Lease Return", "General Lease"]
      .includes(source.Source)) {
    return null;
  }

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
}

export function LeadAnalysisContent() {
  const [data, setData] = useState<LeadSourceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        logger.info("Reading file", { name: file.name });
        const text = await file.text();
        logger.debug("File content details", { 
          length: text.length,
          preview: text.substring(0, 200)
        });

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        
        logger.debug("Parsing XML...");
        const result = parser.parse(text);
        logger.debug("Parsed XML structure", {
          hasReport: !!result.Report,
          hasTable1: !!result.Report?.table1,
        });

        if (validateXMLStructure(result)) {
          const rawSources = result.Report.table1.table1_Group1_Collection.table1_Group1;
          const sources = Array.isArray(rawSources) ? rawSources : [rawSources];
          
          logger.debug("Sources found", { 
            count: sources.length,
            sourceTypes: sources.map((s: DealerSocketSource) => s.name || 'unknown')
          });

          const processedData = sources
            .map((source: DealerSocketSource) => {
              logger.debug("Processing source", { 
                name: source.name || 'unknown',
                type: source.type || 'unknown'
              });
              
              return processSourceData(source);
            })
            .filter((item): item is LeadSourceData => item !== null);

          logger.info("Data processing complete", { 
            processedCount: processedData.length 
          });
          
          if (error) setError(null);
          setData(processedData);
          toast.success(`Successfully processed ${processedData.length} lead sources`);
        }
      } catch (error) {
        logger.error("Failed to process file", {
          error: error instanceof Error ? error.message : String(error)
        });
        setError("Failed to parse XML file");
        toast.error("Failed to parse XML file");
      }
    },
    multiple: false,
    accept: {
      "text/xml": [".xml"],
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