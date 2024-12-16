"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, SquareArrowOutUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePin } from "@/app/providers/pin-provider";
import { WireInstructionsDialog } from "@/components/wire-instructions-dialog";
import { CopyButton } from "@/components/copy-button";
import { AffinityMenu } from "@/components/affinity-menu";
import {
  EVFAQDialog,
  PHEVFAQDialog,
  OutOfStateFAQDialog,
  BusinessFAQDialog,
} from "@/components/dialogs";

export interface MarketingCardProps {
  id: string;
  title: string;
  image?: string;
  coverText?: string;
  duration: string;
  category: string;
  content?: string;
  url?: string;
  component?: string;
  isModal?: boolean;
  pinned?: boolean;
  slug?: string;
  postedAt?: Date;
}

const DialogComponents: Record<
  string,
  React.ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void }>
> = {
  WireInstructionsDialog,
};

const MODAL_COMPONENTS = {
  EVFAQDialog,
  PHEVFAQDialog,
  OutOfStateFAQDialog,
  BusinessFAQDialog,
};

export function MarketingCard(props: MarketingCardProps) {
  const {
    id,
    title,
    image,
    coverText,
    duration,
    category,
    slug,
    content,
    component,
    isModal = false,
    pinned: defaultPinned = false,
    url,
    postedAt,
  } = props;

  const { pinnedItems, togglePin } = usePin();
  const isPinned = defaultPinned || pinnedItems.has(id);
  const isNew =
    postedAt &&
    (new Date().getTime() - postedAt.getTime()) / (1000 * 60 * 60) <= 48;
  const isAnnouncement = category.toLowerCase() === "announcement";
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const isAffinitySearch = title === "Affinity Search";

  const handleCardClick = () => {
    if (isModal) {
      setDialogOpen(true);
    }
  };

  const handleOpenLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handlePinToggle = (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (itemId) {
      togglePin(itemId);
    }
  };

  const renderCard = (
    <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] relative group">
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
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-all"
            />
          ) : (
            <div
              className="absolute inset-0 bg-muted flex items-center justify-center p-6 text-center"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <h3 className="text-2xl font-semibold text-muted-foreground/70">
                {coverText || title}
              </h3>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{category}</Badge>
            <div className="flex items-center gap-2">
              {isAffinitySearch ? (
                <AffinityMenu />
              ) : url ? (
                <div className="flex gap-2">
                  <CopyButton value={url} />

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleOpenLink}
                        aria-label="Open in new tab"
                      >
                        <SquareArrowOutUpRight
                          size={14}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Open in new tab
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {duration}
                </div>
              )}
            </div>
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
      </div>
    </Card>
  );

  if (
    isModal &&
    component &&
    MODAL_COMPONENTS[component as keyof typeof MODAL_COMPONENTS]
  ) {
    const ModalComponent =
      MODAL_COMPONENTS[component as keyof typeof MODAL_COMPONENTS];
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">{renderCard}</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ModalComponent />
        </DialogContent>
      </Dialog>
    );
  }

  if (isModal) {
    if (component && DialogComponents[component]) {
      const DialogComponent = DialogComponents[component];
      return (
        <>
          <div onClick={handleCardClick}>{renderCard}</div>
          <DialogComponent open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
      );
    }

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div>{renderCard}</div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>{content}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isAffinitySearch) {
    return renderCard;
  }

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {renderCard}
      </a>
    );
  }

  if (slug) {
    return <Link href={`/examples/${slug}`}>{renderCard}</Link>;
  }

  return renderCard;
}
