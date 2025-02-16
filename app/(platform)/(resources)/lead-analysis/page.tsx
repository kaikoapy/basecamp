import { Metadata } from "next";
import { LeadAnalysisContent } from "./_components/lead-analysis-content";

export const metadata: Metadata = {
  title: "Lead Source Analysis",
  description: "Analyze and visualize lead source performance data",
};

export default function LeadAnalysisPage() {
  return (
    <div className="h-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lead Source Analysis</h1>
        <p className="text-muted-foreground">
          Upload your lead source data to analyze performance and get AI-powered insights.
        </p>
      </div>
      <LeadAnalysisContent />
    </div>
  );
} 