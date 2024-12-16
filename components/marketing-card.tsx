"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePin } from "@/app/providers/pin-provider";

interface MarketingCardProps {
  id: string;
  title: string;
  image: string;
  duration: string;
  category: string;
  slug?: string;
  content?: string;
  isModal?: boolean;
  pinned?: boolean;
  url?: string;
  postedAt?: Date;
}

export function MarketingCard({
  id,
  title,
  image,
  duration,
  category,
  slug,
  content,
  isModal = false,
  pinned: defaultPinned = false,
  url,
  postedAt,
}: MarketingCardProps) {
  const { pinnedItems, togglePin } = usePin();
  const isPinned = defaultPinned || pinnedItems.has(id);
  const isNew =
    postedAt &&
    (new Date().getTime() - postedAt.getTime()) / (1000 * 60 * 60) <= 48;
  const isAnnouncement = category.toLowerCase() === "announcement";

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isModal) {
      return (
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
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

    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }

    if (slug) {
      return <Link href={`/examples/${slug}`}>{children}</Link>;
    }

    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] relative group">
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          {isNew && (
            <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              New
            </div>
          )}
        </div>
        {!isAnnouncement && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePin(id);
                  }}
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
                    <span className="text-lg">📍</span>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isPinned
                    ? "Remove from Quick Access"
                    : "Add to Quick Access"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0 z-10" />
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-all"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                {url ? (
                  <ExternalLink className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {duration}
              </div>
            </div>
            <h3 className="font-semibold">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
