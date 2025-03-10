"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { AnnouncementCard } from "../dashboard/(components)/announcement-card";
import { Protect } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import { createLogger } from "@/lib/logger";
import { useAdmin } from "@/hooks/use-admin";

const logger = createLogger("announcements-page");

// Add a helper function to extract text from HTML
function extractTextFromHtml(html: string): string {
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

export default function AnnouncementsPage() {
  const { organization, isLoaded } = useOrganization();
  const isAdmin = useAdmin();
  
  logger.debug("Page state", {
    isLoaded,
    orgId: organization?.id,
    hasOrg: !!organization,
    isAdmin
  });

  const announcements = useQuery(
    api.announcements.list,
    isLoaded && organization?.id ? { orgId: organization.id } : "skip"
  );

  logger.debug("Announcements data", {
    hasAnnouncements: !!announcements,
    count: announcements?.length,
    firstAnnouncement: announcements?.[0]
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  // Handle loading states
  if (!isLoaded || !organization?.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  if (!announcements) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500 font-medium">Loading announcements...</p>
      </div>
    );
  }

  // Filter announcements based on search query and time filter
  const filteredAnnouncements = announcements?.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const announcementDate = new Date(announcement.postedAt);
    const now = new Date();
    const daysDiff =
      (now.getTime() - announcementDate.getTime()) / (1000 * 3600 * 24);

    const matchesTime =
      timeFilter === "all" ||
      (timeFilter === "today" && daysDiff < 1) ||
      (timeFilter === "week" && daysDiff < 7) ||
      (timeFilter === "month" && daysDiff < 30);

    return matchesSearch && matchesTime;
  });

  return (
    <main className="flex-1 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements 📰</h1>
        <Protect role="admin">
          <Link href="/announcements/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </Link>
        </Protect>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Announcements Grid */}
      {filteredAnnouncements?.length === 0 && !searchQuery ? (
        // Empty state
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first announcement to get started
          </p>
          <Protect role="org:admin">
            <Link href="/announcements/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </Link>
          </Protect>
        </div>
      ) : (
        // Announcements grid
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredAnnouncements?.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              id={announcement._id}
              title={announcement.title}
              description={
                announcement.htmlDescription
                  ? extractTextFromHtml(announcement.htmlDescription)
                  : announcement.description
              }
              content={announcement.htmlDescription || announcement.description}
              postedAt={announcement.postedAt}
              createdBy={announcement.createdBy}
              isEmail={announcement.isEmailGenerated}
              files={announcement.files}
              readBy={announcement.readBy}
            />
          ))}
        </div>
      )}

      {/* No results state */}
      {filteredAnnouncements?.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            No matching announcements
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </main>
  );
}
