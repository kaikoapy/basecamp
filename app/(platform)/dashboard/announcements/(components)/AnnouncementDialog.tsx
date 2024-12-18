"use client";

import * as React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: {
    title: string;
    description: string;
    images: string[];
    createdBy: string;
    postedAt: string;
    isEmail?: boolean;
  };
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementDialogProps) {
  const { title, description, images, createdBy, postedAt, isEmail } =
    announcement;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <span>
                  {isEmail ? "Emailed by" : "Posted by"} {createdBy}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(postedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto pr-6">
          {images.length > 0 && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
              <Image
                src={images[currentImageIndex]}
                alt={title}
                fill
                className="object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="text-base whitespace-pre-wrap">{description}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
