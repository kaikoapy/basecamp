"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Bookmark, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AffinityMenu } from "@/components/affinity-menu";
import { WireInstructionsDialog } from "@/app/(platform)/dialogs/wire-instructions-dialog";
import { OutOfStateDialog } from "@/app/(platform)/dialogs/out-of-state-dialog";
import { BusinessApplicationsDialog } from "@/app/(platform)/dialogs/business-applications-dialog";
import { ThirdPartyPayoffsDialog } from "@/app/(platform)/dialogs/third-party-payoffs-dialog";
import { NewAnnouncementDialog } from "@/app/(platform)/announcements/(components)/NewAnnouncementDialog";
import { useDialog } from "@/hooks/use-dialog";
import { EX90SheetDialog } from "@/app/(platform)/dialogs/ex90-sheet-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { CopyButtonWithText } from "@/components/copy-button";
// Base64 encoding function
function encodeId(id: string): string {
  if (typeof window === "undefined") return id;
  return btoa(id).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Format date to MM-DD-YY
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${month}-${day}-${year}`;
}

interface DashboardCardProps {
  id: Id<"announcements"> | string;
  title: string;
  description?: string;
  images?: string[];
  image?: string;
  coverText?: string;
  duration?: string;
  category: string;
  content?: string;
  url?: string;
  isModal?: boolean;
  pinned?: boolean;
  slug?: string;
  postedAt?: string;
  formattedDate?: string;
  resourcePath?: string;
  isAffinitySearch?: boolean;
  component?: string;
  createdBy?: string;
  isAnnouncement?: boolean;
  isEmail?: boolean;
  type?: string;
  showCopyButton?: boolean;
  showExternalLink?: boolean;
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

export function DashboardCard(props: DashboardCardProps) {
  const {
    id,
    title,
    description,
    images,
    image,
    coverText,
    duration,
    category,
    pinned: defaultPinned = false,
    url,
    postedAt,
    formattedDate,
    resourcePath,
    isAffinitySearch = false,
    component,
    isModal,
    createdBy,
    isEmail,
    type,
    showCopyButton,
    readBy = [],
    files,
    content,
  } = props;

  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const togglePinnedMutation = useMutation(api.resources.togglePinned);
  const isPinned = defaultPinned;
  const isAnnouncement = category.toLowerCase() === "announcement";
  const isResource =
    category === "Product Info" ||
    category === "Finance" ||
    category === "Sales";

  // Check if the announcement is new (not read by current user and within 30 days)
  const isNew = React.useMemo(() => {
    if (!postedAt || !user) {
      console.log("No postedAt or user:", { postedAt, userId: user?.id });
      return false;
    }

    const now = new Date();
    const postDate = new Date(postedAt);

    // Ignore future dates
    if (postDate > now) {
      console.log("Future date:", { postDate, now });
      return false;
    }

    // Check if posted within last 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isRecent = postDate > thirtyDaysAgo;

    // Check if current user has read it
    const hasRead = readBy.some((read) => read.userId === user.id);

    console.log("Announcement check:", {
      title,
      postDate,
      now,
      thirtyDaysAgo,
      isRecent,
      hasRead,
      isAnnouncement,
      userId: user.id,
      readBy,
    });

    // Return true only if it's recent AND hasn't been read AND is an announcement
    return isRecent && !hasRead && isAnnouncement;
  }, [postedAt, user, readBy, isAnnouncement, title]);

  const dialog = useDialog();

  // Format the date if postedAt is available, otherwise use formattedDate
  const displayDate = postedAt ? formatDate(postedAt) : formattedDate;

  const handlePinToggle = async (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (itemId) {
      // Update database with optimistic update handled by Convex
      await togglePinnedMutation({
        id: itemId as Id<"resources">,
        pinned: !isPinned,
      });
    }
  };

  const handleCardClick = () => {
    if (isModal && component) {
      setDialogOpen(true);
    } else if (isAnnouncement) {
      // Update URL with encoded announcement ID
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("announcement", encodeId(id as string));
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    } else if (type === "business-application") {
      dialog.onOpen();
    } else if (isAffinitySearch && url) {
      // Open URL in new tab for Affinity cards
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Determine which image to use
  const displayImage = images?.[0] || image;

  const renderCard = (
    <Card
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]  relative group hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]"
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        {isNew && (
          <div className="inline-flex items-center rounded-lg bg-green-300 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
            New!
          </div>
        )}
      </div>
      {!isAnnouncement && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => handlePinToggle(e, id)}
              className={cn(
                "absolute top-2 right-2 z-30 transition-all",
                !isPinned && "hidden group-hover:block"
              )}
              aria-label={isPinned ? "Unpin" : "Pin"}
            >
              <div
                className={cn(
                  "flex items-center justify-center transition-all",
                  "bg-white/90 rounded-full p-2 shadow-sm",
                  "hover:shadow-md",
                  isPinned
                    ? "text-yellow-400"
                    : "text-gray-400 hover:text-yellow-400"
                )}
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isPinned ? "currentColor" : "none"}
                  strokeWidth={2}
                />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isPinned ? "Remove from Quick Access" : "Add to Quick Access"}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      <div className="p-0">
        <div className="relative aspect-video bg-blue-50">
          <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0 z-10" />
          {displayImage ? (
            <Image
              src={displayImage}
              alt={title}
              fill
              quality={100}
              className="object-contain transition-all p-4"
            />
          ) : (
            <div
              className="absolute inset-0 bg-muted flex items-center justify-center p-4 text-center"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <h3 className="text-xl font-semibold text-muted-foreground/70">
                {coverText || title}
              </h3>
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl leading-tight truncate flex-1 mr-2">
                {title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {isAffinitySearch ? (
                  <AffinityMenu />
                ) : url ? (
                  <div className="flex gap-1">
                    {showCopyButton && <CopyButtonWithText value={url} />}
                  </div>
                ) : isAnnouncement && displayDate ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{displayDate}</span>
                  </div>
                ) : !isResource && duration ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {duration}
                  </div>
                ) : null}
              </div>
            </div>
            {isAnnouncement && createdBy && (
              <p className="text-xs text-muted-foreground">
                {isEmail ? "Emailed by" : "Posted by"} {createdBy}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
            <button
              className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              onClick={(e) => {
                if (isAffinitySearch) {
                  e.preventDefault(); // Only prevent default for Affinity cards
                  e.stopPropagation();
                }
                handleCardClick();
              }}
            >
              Open
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {isResource && resourcePath ? (
        <Link href={resourcePath}>{renderCard}</Link>
      ) : isAffinitySearch ? (
        renderCard
      ) : url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {renderCard}
        </a>
      ) : (
        renderCard
      )}

      {/* Render appropriate dialog based on component prop */}
      {component === "WireInstructionsDialog" && (
        <WireInstructionsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {component === "OutOfStateFAQDialog" && (
        <OutOfStateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
      {component === "BusinessFAQDialog" && (
        <BusinessApplicationsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {component === "ThirdPartyPayoffsDialog" && (
        <ThirdPartyPayoffsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {isAnnouncement && (
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
      )}
      {type === "business-application" && (
        <BusinessApplicationsDialog
          open={dialog.isOpen}
          onOpenChange={dialog.onOpenChange}
        />
      )}
      {component === "EX90SheetDialog" && (
        <EX90SheetDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </>
  );
}
