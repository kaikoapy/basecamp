"use client";

import { useState } from "react";
import { MarketingCard } from "@/components/marketing-card";
import {
  announcements,
  pinnedContent,
  tools,
  resources,
} from "../../../data/dashboard-content";

export function DashboardContent() {
  const [searchQuery] = useState("");

  const filteredContent = {
    announcements: announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    pinnedContent: pinnedContent.filter(
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
    <main className="flex-1 p-6">
      {filteredContent.announcements.length > 0 && (
        <section id="announcements" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Announcements 📰</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContent.announcements.map((announcement, index) => (
              <MarketingCard
                key={index}
                id={`announcement-${index}`}
                {...announcement}
              />
            ))}
          </div>
        </section>
      )}

      {filteredContent.pinnedContent.length > 0 && (
        <section id="quick-access" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Access 📌</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContent.pinnedContent.map((content, index) => (
              <MarketingCard key={index} id={`pinned-${index}`} {...content} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.incentives.length > 0 && (
        <section id="incentives" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Incentives 🏷️</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolsByCategory.incentives.map((tool, index) => (
              <MarketingCard key={index} id={`incentive-${index}`} {...tool} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.tools.length > 0 && (
        <section id="tools" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tools 🛠️</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolsByCategory.tools.map((tool, index) => (
              <MarketingCard key={index} id={`tool-${index}`} {...tool} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.volvoSites.length > 0 && (
        <section id="volvo-sites" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Volvo Sites 🌐</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolsByCategory.volvoSites.map((tool, index) => (
              <MarketingCard key={index} id={`volvo-site-${index}`} {...tool} />
            ))}
          </div>
        </section>
      )}

      {toolsByCategory.communication.length > 0 && (
        <section id="communication" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Communication 💬</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolsByCategory.communication.map((tool, index) => (
              <MarketingCard
                key={index}
                id={`communication-${index}`}
                {...tool}
              />
            ))}
          </div>
        </section>
      )}

      {filteredContent.resources.length > 0 && (
        <section id="resources" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Resources 📚</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContent.resources.map((resource, index) => (
              <MarketingCard
                key={index}
                id={`resource-${index}`}
                {...resource}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
