"use client";

import { useState } from "react";
import { NavHeader } from "@/components/nav-header";
import { MarketingCard } from "@/components/marketing-card";
import {
  announcements,
  pinnedContent,
  tools,
  resources,
} from "../../../data/dashboard-content";

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      <NavHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-1 p-6">
        {filteredContent.announcements.length > 0 && (
          <section className="mb-8">
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
          <section id="quick-access" className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">Quick Access 📌</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredContent.pinnedContent.map((content, index) => (
                <MarketingCard
                  key={index}
                  id={`pinned-${index}`}
                  {...content}
                />
              ))}
            </div>
          </section>
        )}

        <section id="incentives" className="mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Incentives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContent.tools
              .filter((tool) => tool.category === "Incentives")
              .map((content, index) => (
                <MarketingCard
                  key={index}
                  id={`incentive-${index}`}
                  {...content}
                />
              ))}
          </div>
        </section>

        {filteredContent.tools.filter((tool) => tool.category !== "Incentives")
          .length > 0 && (
          <section id="tools" className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">Tools 🛠️</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredContent.tools
                .filter((tool) => tool.category !== "Incentives")
                .map((content, index) => (
                  <MarketingCard
                    key={index}
                    id={`tool-${index}`}
                    {...content}
                  />
                ))}
            </div>
          </section>
        )}

        {filteredContent.resources.length > 0 && (
          <section id="resources" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredContent.resources.map((content, index) => (
                <MarketingCard
                  key={index}
                  id={`resource-${index}`}
                  {...content}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
