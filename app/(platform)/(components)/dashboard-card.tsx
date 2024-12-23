"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, SquareArrowOutUpRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePin } from "@/app/providers/pin-provider";
import { CopyButton } from "@/components/copy-button";
import { AffinityMenu } from "@/components/affinity-menu";
import { WireInstructionsDialog } from "@/app/(platform)/dialogs/wire-instructions-dialog";
import { OutOfStateDialog } from "@/app/(platform)/dialogs/out-of-state-dialog";
import { BusinessApplicationsDialog } from "@/app/(platform)/dialogs/business-applications-dialog";
import { ThirdPartyPayoffsDialog } from "@/app/(platform)/dialogs/third-party-payoffs-dialog";
import { AnnouncementDialog } from "@/app/(platform)/announcements/(components)/AnnouncementDialog";
import { useDialog } from "@/hooks/use-dialog";
import { EX90SheetDialog } from "@/app/(platform)/dialogs/ex90-sheet-dialog";

export interface DashboardCardProps {
  id: string;
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
    showExternalLink,
  } = props;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { pinnedItems, togglePin } = usePin();
  const isPinned = defaultPinned || pinnedItems.has(id);
  const isNew = postedAt
    ? (new Date().getTime() - new Date(postedAt).getTime()) /
        (1000 * 60 * 60) <=
      48
    : false;
  const isAnnouncement = category.toLowerCase() === "announcement";
  const isResource =
    category === "Product Info" ||
    category === "Finance" ||
    category === "Sales";

  const dialog = useDialog();

  const handlePinToggle = (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (itemId) {
      togglePin(itemId);
    }
  };

  const handleOpenLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardClick = () => {
    if (isModal && component) {
      setDialogOpen(true);
    } else if (isAnnouncement) {
      setDialogOpen(true);
    } else if (type === "business-application") {
      dialog.onOpen();
    }
  };

  // Determine which image to use
  const displayImage = images?.[0] || image;

  const renderCard = (
    <Card
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] relative group"
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        {isNew && (
          <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </div>
        )}
      </div>
      {!isAnnouncement && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => handlePinToggle(e, id)}
              className={cn(
                "absolute top-2 right-2 z-30 transition-all hover:scale-110",
                !isPinned && "hidden group-hover:block"
              )}
              aria-label={isPinned ? "Unpin" : "Pin"}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all",
                  isPinned ? "bg-white" : "bg-gray-200"
                )}
              >
                <span className="text-lg">📌</span>
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
        <div className="relative aspect-video">
          <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0 z-10" />
          {displayImage ? (
            <Image
              src={displayImage}
              alt={title}
              fill
              quality={100}
              className="object-cover transition-all"
            />
          ) : (
            <div
              className="absolute inset-0 bg-muted flex items-center justify-center p-4 text-center"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <h3 className="text-lg font-semibold text-muted-foreground/70">
                {coverText || title}
              </h3>
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base leading-tight truncate flex-1 mr-2">
                {title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {isAffinitySearch ? (
                  <AffinityMenu />
                ) : url ? (
                  <div className="flex gap-1">
                    {showCopyButton && <CopyButton value={url} />}
                    {showExternalLink && (
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleOpenLink}
                            aria-label="Open in new tab"
                          >
                            <SquareArrowOutUpRight
                              size={12}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="px-2 py-1 text-xs">
                          Open in new tab
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ) : isAnnouncement && formattedDate ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
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
        <AnnouncementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          announcement={{
            title,
            description: description || "",
            images: images || [],
            createdBy: createdBy || "",
            postedAt: postedAt || new Date().toISOString(),
            isEmail,
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
