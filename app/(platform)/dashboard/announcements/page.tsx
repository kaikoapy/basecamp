"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { MarketingCard } from "@/app/(platform)/(resources)/(FAQS)/(components)/marketing-card";
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

export default function AnnouncementsPage() {
  const announcements = useQuery(api.announcements.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

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
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Link href="/announcements/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center">
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
      {announcements === undefined ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        // Empty state
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first announcement to get started
          </p>
          <Link href="/announcements/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </Link>
        </div>
      ) : (
        // Announcements grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements?.map((announcement) => (
            <MarketingCard
              key={announcement._id}
              id={announcement._id}
              title={announcement.title}
              description={announcement.description}
              images={announcement.images}
              postedAt={new Date(announcement.postedAt)}
              category="announcement"
              createdBy={announcement.createdBy}
              isAnnouncement={true}
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
    </div>
  );
}
