"use client";

import * as React from "react";
import { useState } from "react";
import { MarketingCard } from "./marketing-card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {
  announcements,
  pinnedContent,
  tools,
  resources,
  widgets,
} from "@/app/data/dashboard-content";
import { SearchWidgetCard } from "./search-widget-card";

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
    <main className="flex-1 p-6">
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tools..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {widgets.map((widget, index) => {
            if (widget.type === "search") {
              return <SearchWidgetCard key={index} />;
            }
            return null;
          })}
        </div>
      </section>

      {filteredContent.announcements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Announcements</h2>
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
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContent.pinnedContent.map((content, index) => (
              <MarketingCard key={index} id={`pinned-${index}`} {...content} />
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
          <h2 className="text-2xl font-bold mb-4">Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContent.tools
              .filter((tool) => tool.category !== "Incentives")
              .map((content, index) => (
                <MarketingCard key={index} id={`tool-${index}`} {...content} />
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
  );
}
