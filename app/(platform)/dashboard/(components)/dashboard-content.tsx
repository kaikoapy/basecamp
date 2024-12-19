"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MarketingCard } from "@/app/(platform)/(resources)/(FAQS)/(components)/marketing-card";
import { usePin } from "@/app/providers/pin-provider";
import {
  pinnedContent as defaultPinnedContent,
  tools,
  resources,
} from "../../../data/dashboard-content";
import { Announcement } from "@/convex/types";

interface DashboardContentProps {
  searchQuery?: string;
}

export function DashboardContent({ searchQuery = "" }: DashboardContentProps) {
  const { pinnedItems } = usePin();
  // Fetch announcements from Convex
  const announcements = useQuery(api.announcements.list);

  // Get all items that can be pinned
  const allItems = [...tools, ...resources];

  // Get dynamically pinned items
  const dynamicPinnedContent = allItems.filter((item) =>
    pinnedItems.has(item.id)
  );

  // Combine default and dynamically pinned items
  const allPinnedContent = [...defaultPinnedContent, ...dynamicPinnedContent];

  const filteredContent = {
    announcements:
      announcements?.filter(
        (item: Announcement) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [],
    pinnedContent: allPinnedContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    tools: tools.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    resources: resources.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-xl font-bold mb-3">Announcements 📰</h2>
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
          <h2 className="text-xl font-bold mb-3">Quick Access 📌</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredContent.pinnedContent.map((content) => (
              <MarketingCard
                key={content.id}
                {...content}
                image={content.image}
              />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.incentives.length > 0 && (
        <section id="incentives" className="mb-6">
          <h2 className="text-xl font-bold mb-3">Incentives 🏷️</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.incentives.map((tool) => (
              <MarketingCard key={tool.id} {...tool} image={tool.image} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.tools.length > 0 && (
        <section id="tools" className="mb-6">
          <h2 className="text-xl font-bold mb-3">Tools 🛠️</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.tools.map((tool) => (
              <MarketingCard key={tool.id} {...tool} image={tool.image} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.volvoSites.length > 0 && (
        <section id="volvo-sites" className="mb-6">
          <h2 className="text-xl font-bold mb-3">Volvo Sites 🌐</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.volvoSites.map((tool) => (
              <MarketingCard key={tool.id} {...tool} image={tool.image} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.communication.length > 0 && (
        <section id="communication" className="mb-6">
          <h2 className="text-xl font-bold mb-3">Communication 💬</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {toolsByCategory.communication.map((tool) => (
              <MarketingCard key={tool.id} {...tool} image={tool.image} />
            ))}
          </div>
        </section>
      )}

      {filteredContent.resources.length > 0 && (
        <section id="resources" className="mb-6">
          <h2 className="text-xl font-bold mb-3">Resources 📚</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredContent.resources.map((resource) => (
              <MarketingCard
                key={resource.id}
                {...resource}
                image={resource.image}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
