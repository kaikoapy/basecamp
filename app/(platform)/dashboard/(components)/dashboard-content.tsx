"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MarketingCard } from "@/app/(platform)/(resources)/(FAQS)/(components)/marketing-card";
import { usePin } from "@/app/providers/pin-provider";

interface DashboardContentProps {
  searchQuery?: string;
}

export function DashboardContent({ searchQuery = "" }: DashboardContentProps) {
  usePin();

  // Fetch all resources from Convex
  const announcements = useQuery(api.announcements.list);
  // Get all resources and filter for pinned ones client-side
  const allResources = useQuery(api.resources.getAllResources);

  if (!allResources || !announcements) {
    return <div>Loading...</div>;
  }

  // Filter content based on search query and type/pinned status
  const filteredContent = {
    announcements: announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    pinnedContent: allResources.filter(
      (item) =>
        item.pinned && // Filter for pinned items
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    tools: allResources.filter(
      (item) =>
        item.type === "tool" &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    resources: allResources.filter(
      (item) =>
        item.type === "resource" &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  };

  // Group tools by category
  const toolsByCategory = {
    incentives: filteredContent.tools.filter(
      (tool) => tool.category === "Incentives"
    ),
    tools: filteredContent.tools.filter((tool) => tool.category === "Tools"),
    volvoSites: filteredContent.tools.filter(
      (tool) => tool.category === "Volvo Sites"
    ),
    communication: filteredContent.tools.filter(
      (tool) => tool.category === "Communication"
    ),
  };

  return (
    <main className="flex-1 p-6 max-w-[1600px] mx-auto">
      {filteredContent.announcements.length > 0 && (
        <section id="announcements" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Announcements <span className="apple-emoji">📰</span>
          </h2>
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
              />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.incentives.length > 0 && (
        <section id="incentives" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Incentives <span className="apple-emoji">🏷️</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.incentives.map((tool) => (
              <MarketingCard
                key={tool._id}
                id={tool._id}
                {...tool}
                image={tool.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.tools.length > 0 && (
        <section id="tools" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Tools <span className="apple-emoji">🛠️</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.tools.map((tool) => (
              <MarketingCard
                key={tool._id}
                id={tool._id}
                {...tool}
                image={tool.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.volvoSites.length > 0 && (
        <section id="volvo-sites" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Volvo Sites <span className="apple-emoji">🌐</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.volvoSites.map((tool) => (
              <MarketingCard
                key={tool._id}
                id={tool._id}
                {...tool}
                image={tool.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.communication.length > 0 && (
        <section id="communication" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Communication <span className="apple-emoji">💬</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.communication.map((tool) => (
              <MarketingCard
                key={tool._id}
                id={tool._id}
                {...tool}
                image={tool.image ?? ""}
              />
            ))}
          </div>
        </section>
      )}

      {filteredContent.resources.length > 0 && (
        <section id="resources" className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Resources <span className="apple-emoji">📚</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredContent.resources.map((resource) => (
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
