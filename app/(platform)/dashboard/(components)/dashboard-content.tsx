"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardCard } from "@/app/(platform)/(components)/dashboard-card";
import { usePin } from "@/app/providers/pin-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_COVER_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1yx3tWeG50m3fOZqTYSyoQcrgMelRFbzW79pIu";

interface DashboardContentProps {
  searchQuery?: string;
}

// Add a helper function for consistent date formatting
function formatDate(date: Date | string) {
  // Use UTC to ensure consistent formatting between server and client
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function DashboardContent({ searchQuery = "" }: DashboardContentProps) {
  usePin();

  // Fetch all resources from Convex
  const announcements = useQuery(api.announcements.list);
  const allResources = useQuery(api.resources.getAllResources);

  if (!allResources || !announcements) {
    return <div>Loading...</div>;
  }

  // Filter content based on search query and categories
  const filteredContent = {
    announcements: announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    pinnedContent: allResources.filter(
      (item) =>
        item.pinned === true &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    // Filter all resources by category instead of type
    resources: allResources.filter(
      (item) =>
        (!item.pinned &&
          item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  // Group resources by category and sort by order
  const resourcesByCategory = {
    incentives: filteredContent.resources
      .filter((resource) => resource.category === "Incentives")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

    tools: filteredContent.resources
      .filter((resource) => resource.category === "Tools")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

    volvoSites: filteredContent.resources
      .filter((resource) => resource.category === "Volvo Sites")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

    dealerSites: filteredContent.resources
      .filter((resource) => resource.category === "Dealer Site")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

    communication: filteredContent.resources
      .filter((resource) => resource.category === "Communication")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };

  return (
    <main className="flex-1 p-6 max-w-[1600px] mx-auto">
      {filteredContent.announcements.length > 0 && (
        <section id="announcements" className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold">
              Announcements <span className="apple-emoji">📰</span>
            </h2>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/announcements" className="flex items-center">
                See All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredContent.announcements.map((announcement) => (
              <DashboardCard
                key={announcement._id}
                id={announcement._id}
                title={announcement.title}
                description={announcement.description}
                images={announcement.images}
                category="announcement"
                postedAt={announcement.postedAt}
                formattedDate={formatDate(announcement.postedAt)}
                createdBy={announcement.createdBy}
                isAnnouncement={true}
                isEmail={announcement.isEmailGenerated}
                image={announcement.images?.[0] || DEFAULT_COVER_IMAGE}
              />
            ))}
          </div>
        </section>
      )}

      {filteredContent.pinnedContent.length > 0 && (
        <section id="quick-access" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Quick Access <span className="apple-emoji">📌</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredContent.pinnedContent.map((content) => (
              <DashboardCard
                key={content._id}
                id={content._id}
                title={content.title}
                image={content.image ?? ""}
                category={content.category}
                description={content.description}
                url={content.url}
                pinned={content.pinned}
                showCopyButton={content.showCopyButton}
                showExternalLink={content.showExternalLink}
              />
            ))}
          </div>
        </section>
      )}

      {resourcesByCategory.incentives.length > 0 && (
        <section id="incentives" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Incentives <span className="apple-emoji">🏷️</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {resourcesByCategory.incentives.map((resource) => (
              <DashboardCard
                key={resource._id}
                id={resource._id}
                {...resource}
                image={resource.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {resourcesByCategory.tools.length > 0 && (
        <section id="tools" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Tools <span className="apple-emoji">🛠️</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {resourcesByCategory.tools.map((resource) => (
              <DashboardCard
                key={resource._id}
                id={resource._id}
                {...resource}
                image={resource.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {resourcesByCategory.volvoSites.length > 0 && (
        <section id="volvo-sites" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Volvo Sites <span className="apple-emoji">🌐</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {resourcesByCategory.volvoSites.map((resource) => (
              <DashboardCard
                key={resource._id}
                id={resource._id}
                {...resource}
                image={resource.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {resourcesByCategory.dealerSites.length > 0 && (
        <section id="dealer-sites" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Dealer Sites <span className="apple-emoji">🏢</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {resourcesByCategory.dealerSites.map((resource) => (
              <DashboardCard
                key={resource._id}
                id={resource._id}
                {...resource}
                image={resource.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {resourcesByCategory.communication.length > 0 && (
        <section id="communication" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Communication <span className="apple-emoji">💬</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {resourcesByCategory.communication.map((resource) => (
              <DashboardCard
                key={resource._id}
                id={resource._id}
                {...resource}
                image={resource.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
