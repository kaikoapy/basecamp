"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { NewAnnouncementDialog } from "@/app/(platform)/announcements/(components)/NewAnnouncementDialog";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

// Base64 encoding function
function encodeId(id: string): string {
  if (typeof window === "undefined") return id;
  return btoa(id).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Format date to Month DD, YYYY
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format description by ensuring spaces after commas
function formatDescription(description: string): string {
  return description.replace(/,([^\s])/g, ", $1");
}

interface AnnouncementCardProps {
  id: Id<"announcements"> | string;
  title: string;
  description?: string;
  content?: string;
  postedAt?: string;
  createdBy?: string;
  formattedDate?: string;
  isEmail?: boolean;
  readBy?: Array<{
    userId: string;
    userName: string;
    readAt: string;
  }>;
  files?: Array<{
    url: string;
    name: string;
    type: string;
  }>;
}

export function AnnouncementCard({
  id,
  title,
  description,
  createdBy,
  postedAt,
  readBy = [],
  files,
  content,
  isEmail,
}: AnnouncementCardProps) {
  const { user } = useUser();

  // Check if the announcement is new (not read by current user and within 30 days)
  const isNew = React.useMemo(() => {
    if (!postedAt || !user) {
      return false;
    }

    const now = new Date();
    const postDate = new Date(postedAt);

    if (postDate > now) {
      return false;
    }

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isRecent = postDate > thirtyDaysAgo;
    const hasRead = readBy.some((read) => read.userId === user.id);

    return isRecent && !hasRead;
  }, [postedAt, user, readBy]);

  const displayDate = postedAt ? formatDate(postedAt) : "";

  const handleCardClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("announcement", encodeId(id as string));
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <>
      <Card
        className="group relative flex flex-col justify-between overflow-hidden cursor-pointer transition-all hover:shadow-lg bg-white"
        onClick={handleCardClick}
      >
        {/* New badge */}
        {isNew && (
          <div className="absolute top-2 right-2 z-10">
            <div className="inline-flex items-center px-2 py-1 text-sm font-medium text-orange-600 ">
              New
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="p-5 flex flex-col gap-3">
          {/* Title */}
          <h3 className="text-lg font-medium leading-tight tracking-tight truncate pr-10">
            {title}
          </h3>
          {/* Category & Date */}
          <div className="flex items-center gap-2 text-xs tracking-wide">
            {isEmail && <Mail className="w-3.5 h-3.5 text-gray-500" />}
            <span className="text-gray-500 -mr-1">
              {isEmail ? "Emailed by" : "Posted by"}
            </span>
            <span className="text-gray-500 font-medium">{createdBy}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{displayDate}</span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 whitespace-normal line-clamp-2 text-sm leading-relaxed">
              {formatDescription(description)}
            </p>
          )}

          {/* Footer info */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t">
            <div className="flex items-center gap-2 text-xs tracking-wide text-orange-600">
              <span>Read by {readBy.length}</span>
              {files && files.length > 0 && (
                <>
                  <span className="text-gray-500">
                    • {files.length} attachment{files.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>

            {/* Open button */}
            <button
              className="px-6 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors tracking-wide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCardClick();
              }}
            >
              Open
            </button>
          </div>
        </div>
      </Card>
      <NewAnnouncementDialog
        announcement={{
          _id: id as Id<"announcements">,
          title: title || "",
          description: description || "",
          htmlDescription: content || description || "",
          createdBy: createdBy || "",
          postedAt: postedAt || new Date().toISOString(),
          files,
          isEmailGenerated: isEmail,
        }}
      />
    </>
  );
}
