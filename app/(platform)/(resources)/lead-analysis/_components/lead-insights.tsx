"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, BrainCircuit } from "lucide-react";

interface LeadSourceData {
  source: string;
  newLeads: number;
  contacted: number;
  storeVisits: number;
  apptsOpened: number;
  apptsShown: number;
  noShows: number;
  sales: number;
}

interface LeadInsightsProps {
  data: LeadSourceData[];
}

export function LeadInsights({ data }: LeadInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) throw new Error("Failed to generate insights");

      const result = await response.json();
      setInsights(result.insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Failed to generate insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Get AI-powered analysis and recommendations based on your lead data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights ? (
          <div className="prose prose-sm dark:prose-invert">
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: insights }}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the button below to generate AI insights from your lead data.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={generateInsights}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            "Generate Insights"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 