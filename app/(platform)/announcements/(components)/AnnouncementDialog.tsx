"use client";

import * as React from "react";
import Image from "next/image";
import { Calendar, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileAttachment {
  url: string;
  name: string;
  type: string;
}

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: {
    title: string;
    description: string;
    images: string[];
    files?: FileAttachment[];
    createdBy: string;
    postedAt: string;
    isEmail?: boolean;
  };
}

const DEFAULT_COVER_IMAGE =
  "https://utfs.io/f/WTe1MV8FTP1yx3tWeG50m3fOZqTYSyoQcrgMelRFbzW79pIu";

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementDialogProps) {
  const { title, description, images, files, createdBy, postedAt, isEmail } =
    announcement;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const renderAttachment = (file: FileAttachment) => {
    const fileType = file.type.toLowerCase();

    if (fileType.startsWith("image/")) {
      return null;
    }

    return (
      <div
        key={file.url}
        className="flex items-center gap-2 p-2 rounded-md border bg-muted/50"
      >
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-sm truncate">{file.name}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => window.open(file.url, "_blank")}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  };

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
          {(images.length > 0 || !files?.length) && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
              <Image
                src={images[currentImageIndex] || DEFAULT_COVER_IMAGE}
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

          <div className="text-base whitespace-pre-wrap mb-4">
            {description}
          </div>

          {files && files.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium mb-2">Attachments</h4>
              {files.map(renderAttachment)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
