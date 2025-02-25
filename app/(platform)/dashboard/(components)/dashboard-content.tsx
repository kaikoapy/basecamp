import React from "react";
import { DashboardContentClient } from "@/app/(platform)/dashboard/(components)/client-components/dashboard-content-client";
import { OnboardingDialogWrapper } from "@/app/(platform)/dashboard/(components)/client-components/onboarding-dialog-wrapper";

interface DashboardContentProps {
  searchQuery?: string;
}

// Add a helper function for consistent date formatting
export function formatDate(date: Date | string) {
  // Use UTC to ensure consistent formatting between server and client
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

// Add a helper function to extract text from HTML
export function extractTextFromHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: Use basic regex to extract text
    return (
      html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
        .substring(0, 150) + (html.length > 150 ? "..." : "")
    );
  }

  // Client-side: Use DOM parser
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.trim().substring(0, 150) + (text.length > 150 ? "..." : "");
}

// Main export - Server Component wrapper
export function DashboardContent({ searchQuery = "" }: DashboardContentProps) {
  return (
    <>
      <DashboardContentClient searchQuery={searchQuery} />
      <OnboardingDialogWrapper />
    </>
  );
}
