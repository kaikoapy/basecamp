"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardCard } from "../dashboard-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnnouncementCard } from "../announcement-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";
import { useAppAuth } from "@/app/providers/auth-provider";
import { Loading } from "@/components/ui/loading";
import { formatDate, extractTextFromHtml } from "../dashboard-content";
import { createLogger } from "@/lib/logger";

interface DashboardContentClientProps {
  searchQuery?: string;
}

const logger = createLogger("dashboard-content-client");

export function DashboardContentClient({ searchQuery = "" }: DashboardContentClientProps) {
  const { isLoaded, orgId, isAdmin } = useAppAuth();
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  
  // Add debug logging
  logger.debug("Dashboard state", {
    isLoaded,
    orgId,
    isAdmin
  });

  const announcements = useQuery(
    api.announcements.list,
    isLoaded && orgId ? { orgId } : "skip"
  );
  const allResources = useQuery(api.resources.getAllResources);

  // Add debug logging for announcements
  logger.debug("Dashboard Announcements:", {
    hasAnnouncements: !!announcements,
    count: announcements?.length
  });

  logger.debug("Announcements", {
    count: announcements?.length,
    latest: announcements?.[0]
  });

  // Handle initial loading state with a delay to prevent flashing
  React.useEffect(() => {
    if (isLoaded && orgId && allResources && announcements) {
      // Add a small delay before showing content to ensure everything is loaded
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, orgId, allResources, announcements]);

  // Show consistent loading state during initial load
  if (isInitialLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Show loading state while org data is loading
  if (!isLoaded || !orgId) {
    return <Loading message="Loading organization data..." />;
  }

  // Show loading state while data is loading
  if (!allResources || !announcements) {
    return <Loading message="Loading content..." />;
  }

  // Filter content based on search query and categories
  const filteredContent = {
    announcements: announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.htmlDescription || item.description)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
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

    dealerTradeStores: filteredContent.resources
      .filter((resource) => resource.category === "Dealer Trade Store")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };

  return (
    <>
    <main className="flex-1 p-6 max-w-8xl mx-auto bg-[rgb(250,250,252)]">
    {filteredContent.announcements.length > 0 && (
          <section id="announcements" className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Announcements
              </h2>
              <div className="h-4 w-[1px] bg-border mx-2" />
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link
                  href="/announcements"
                  className="flex items-center text-[#3b82f6]"
                >
                  See All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <ScrollArea className="max-w-[1600px] whitespace-nowrap rounded-md">
              <div className="flex gap-4 pb-4">
                {filteredContent.announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement._id} className="w-[440px] min-w-[440px]">
                    <AnnouncementCard
                      id={announcement._id}
                      title={announcement.title}
                      description={
                        announcement.htmlDescription
                          ? extractTextFromHtml(announcement.htmlDescription)
                          : announcement.description
                      }
                      content={
                        announcement.htmlDescription || announcement.description
                      }
                      postedAt={announcement.postedAt}
                      formattedDate={formatDate(announcement.postedAt)}
                      createdBy={announcement.createdBy}
                      isEmail={announcement.isEmailGenerated}
                      files={announcement.files}
                      readBy={announcement.readBy}
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}

        {filteredContent.pinnedContent.length > 0 && (
          <section id="quick-access" className="mb-6 ">
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Quick Access
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-8xl">
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

        {resourcesByCategory.dealerSites.length > 0 && (
          <section id="dealer-sites" className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Dealer Sites
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
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Communication
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

        {resourcesByCategory.incentives.length > 0 && (
          <section id="incentives" className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Incentives
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
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Tools
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
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Volvo Sites
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

        {resourcesByCategory.dealerTradeStores.length > 0 && (
          <section id="dealer-trade-stores" className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Dealer Trade Stores
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {resourcesByCategory.dealerTradeStores.map((resource) => (
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
    </>
  );
} 