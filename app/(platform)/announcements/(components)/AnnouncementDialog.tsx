"use client";

import * as React from "react";
import {
  Calendar,
  Pencil,
  Clock,
  Archive,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { useAdmin } from "@/hooks/use-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: {
    _id: Id<"announcements">;
    title: string;
    description: string;
    htmlDescription?: string;
    images: string[];
    createdBy: string;
    postedAt: string;
    expiresAt?: string;
    isEmail?: boolean;
    files?: Array<{
      url: string;
      name: string;
      type: string;
    }>;
  };
}

const htmlContentStyles = `
  .announcement-content {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
  }
  .announcement-content p {
    margin-bottom: 1rem;
  }
  .announcement-content b, .announcement-content strong {
    font-weight: 600;
  }
  .announcement-content [style*="background-color"] {
    padding: 0.125rem 0.25rem;
    border-radius: 0.125rem;
  }
  .announcement-content a {
    color: #2563eb;
    text-decoration: underline;
  }
  .announcement-content ul, .announcement-content ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  .announcement-content li {
    margin: 0.5rem 0;
  }
`;

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementDialogProps) {
  const { isAdmin } = useAdmin();
  const updateAnnouncement = useMutation(api.announcements.update);
  const deleteAnnouncement = useMutation(api.announcements.remove);
  const archiveAnnouncement = useMutation(api.announcements.archive);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(announcement.title);
  const [editedDescription, setEditedDescription] = React.useState(
    announcement.htmlDescription || announcement.description
  );

  const hasExpired =
    announcement.expiresAt && new Date(announcement.expiresAt) <= new Date();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateAnnouncement({
        id: announcement._id,
        title: editedTitle,
        description: editedDescription,
        htmlDescription: editedDescription,
        images: announcement.images,
        expiresAt: announcement.expiresAt,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update announcement:", error);
    }
  };

  const handleCancel = () => {
    setEditedTitle(announcement.title);
    setEditedDescription(
      announcement.htmlDescription || announcement.description
    );
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement({ id: announcement._id });
      onOpenChange(false);
    }
  };

  const handleArchive = async () => {
    await archiveAnnouncement({ id: announcement._id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex flex-col max-h-[85vh]",
          isEditing ? "sm:max-w-4xl w-[95vw]" : "sm:max-w-2xl w-[90vw]"
        )}
      >
        <style>{htmlContentStyles}</style>

        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">{announcement.title}</DialogTitle>
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-xl font-semibold"
              />
            </div>
          ) : (
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
          )}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>
                {announcement.isEmail ? "Emailed by" : "Posted by"}{" "}
                {announcement.createdBy}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(announcement.postedAt).toLocaleDateString()}
                </span>
              </div>
              {isAdmin && (
                <>
                  <span>•</span>
                  {isEditing ? (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      Editing Mode
                    </span>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem onClick={handleEdit}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Announcement
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleArchive}
                          className="text-yellow-600"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Announcement
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Announcement
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>
            {announcement.expiresAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  Expires:{" "}
                  {new Date(announcement.expiresAt).toLocaleDateString()}
                </span>
                {hasExpired && (
                  <span className="text-yellow-600">(Expired)</span>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {announcement.images?.length > 0 && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
              <Image
                src={announcement.images[currentImageIndex]}
                alt={announcement.title}
                fill
                className="object-cover"
              />
              {announcement.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {announcement.images.map((_, index) => (
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

          {isEditing ? (
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="min-h-[600px] text-base mb-8 resize-none font-mono"
            />
          ) : (
            <div className="text-base space-y-4">
              {announcement.htmlDescription ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: announcement.htmlDescription,
                  }}
                  className="announcement-content prose prose-sm max-w-none dark:prose-invert"
                />
              ) : (
                <div className="whitespace-pre-wrap">
                  {announcement.description}
                </div>
              )}

              {announcement.files && announcement.files.length > 0 && (
                <div className="mt-6 bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <h3 className="font-medium">
                      Attachments ({announcement.files.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {announcement.files.map((file, index) => {
                      // Determine file type icon and styling
                      const isPDF = file.type === "application/pdf";
                      const isImage = file.type.startsWith("image/");

                      return (
                        <a
                          key={index}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                        >
                          {/* File type icon */}
                          {isPDF ? (
                            <svg
                              className="w-8 h-8 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 2v5a2 2 0 002 2h5"
                              />
                            </svg>
                          ) : isImage ? (
                            <svg
                              className="w-8 h-8 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-8 h-8 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          )}

                          {/* File info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file.type.split("/")[1].toUpperCase()}
                            </p>
                          </div>

                          {/* Download icon */}
                          <svg
                            className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing && (
          <DialogFooter className="flex-shrink-0 gap-2 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1.5" />
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
