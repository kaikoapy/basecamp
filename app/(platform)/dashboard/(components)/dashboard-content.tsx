"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MarketingCard } from "@/app/(platform)/(resources)/(FAQS)/(components)/marketing-card";
import { usePin } from "@/app/providers/pin-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_COVER_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1yx3tWeG50m3fOZqTYSyoQcrgMelRFbzW79pIu";

interface DashboardContentProps {
  searchQuery?: string;
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

    communication: filteredContent.resources
      .filter((resource) => resource.category === "Communication")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

    salesAndFinance: filteredContent.resources
      .filter(
        (resource) =>
          resource.category === "Sales" || resource.category === "Finance"
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };

  return (
    <main className="flex-1 p-6 max-w-[1600px] mx-auto">
      {filteredContent.announcements.length > 0 && (
        <section id="announcements" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">
              Announcements <span className="apple-emoji">📰</span>
            </h2>
            <Button variant="outline" size="sm" className="text-sm" asChild>
              <Link href="/announcements">
                See All Announcements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredContent.announcements.map((announcement) => (
              <MarketingCard
                key={announcement._id}
                id={announcement._id}
                title={announcement.title}
                description={announcement.description}
                images={announcement.images}
                category="announcement"
                postedAt={new Date(announcement.postedAt)}
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
              <MarketingCard
                key={content._id}
                id={content._id}
                title={content.title}
                image={content.image ?? ""}
                duration={content.duration}
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
              <MarketingCard
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
              <MarketingCard
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
              <MarketingCard
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
              <MarketingCard
                key={resource._id}
                id={resource._id}
                {...resource}
                image={resource.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {resourcesByCategory.salesAndFinance.length > 0 && (
        <section id="sales-and-finance" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Sales & Finance Resources <span className="apple-emoji">💼</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {resourcesByCategory.salesAndFinance.map((resource) => (
              <MarketingCard
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
