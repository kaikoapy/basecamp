"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Check, Trash2, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Custom Dialog components for test
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] bg-background pt-10 px-6 pb-6 shadow-lg duration-200 sm:rounded-lg flex flex-col max-h-[85vh]",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">
        Email Content
      </DialogPrimitive.Title>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

interface NewAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: {
    _id: Id<"announcements">;
    title: string;
    description: string;
    htmlDescription?: string;
    createdBy: string;
    postedAt: string;
    images?: string[];
    isEmailGenerated?: boolean;
    files?: Array<{
      url: string;
      name: string;
      type: string;
    }>;
  };
}

interface Reader {
  userId: string;
  userName: string;
  readAt: string;
}

export function NewAnnouncementDialog({
  open,
  onOpenChange,
  announcement,
}: NewAnnouncementDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(announcement.title);
  const [editedDescription, setEditedDescription] = useState(
    announcement.htmlDescription || announcement.description
  );
  const [editedFiles, setEditedFiles] = useState(announcement.files || []);
  const [isUploading, setIsUploading] = useState(false);
  const updateAnnouncement = useMutation(api.announcements.update);
  const generateUploadUrl = useMutation(api.announcements.generateUploadUrl);
  const markAsRead = useMutation(api.announcements.markAsRead);
  const readStatus = useQuery(api.announcements.getReadStatus, {
    id: announcement._id,
  }) as Reader[] | undefined;
  const { user } = useUser();
  const { toast } = useToast();

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    try {
      const newFiles = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const uploadUrl = await generateUploadUrl({
            type: file.type,
          });

          await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          const fileUrl = uploadUrl.split("?")[0];
          return {
            url: fileUrl,
            name: file.name,
            type: file.type,
          };
        })
      );

      setEditedFiles([...editedFiles, ...newFiles]);
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (fileToRemove: (typeof editedFiles)[0]) => {
    setEditedFiles(editedFiles.filter((file) => file.url !== fileToRemove.url));
  };

  const handleSave = async () => {
    try {
      await updateAnnouncement({
        id: announcement._id,
        title: editedTitle,
        description: editedDescription,
        htmlDescription: editedDescription,
        images: announcement.images || [],
        files: editedFiles,
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      });
      console.error("Error updating announcement:", error);
    }
  };

  const handleMarkAsRead = async () => {
    if (!user) return;
    try {
      await markAsRead({
        id: announcement._id,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`.trim(),
      });
      toast({
        title: "Success",
        description: "Marked as read",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  const hasUserRead = readStatus?.some((reader) => reader.userId === user?.id);
  const readCount = readStatus?.length || 0;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Header with title */}
        <div className="border-b pb-4">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-bold mb-3 h-auto py-2 px-3"
              placeholder="Enter title..."
            />
          ) : (
            <h2 className="text-2xl font-bold mb-3">{announcement.title}</h2>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {announcement.isEmailGenerated ? "Emailed From: " : "Posted By: "}
              {announcement.createdBy}
            </div>
            <div>{formatDate(announcement.postedAt)}</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto py-4">
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full h-full min-h-[400px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none font-[inherit] text-[inherit]"
              placeholder="Enter description..."
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  announcement.htmlDescription || announcement.description,
              }}
              className="prose prose-sm max-w-none min-h-[400px] [&_p]:my-4 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-2 [&_strong]:font-semibold [&_em]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_code]:font-mono [&_code]:text-sm [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:bg-gray-100"
            />
          )}
        </div>

        {/* Attachments section in edit mode */}
        {isEditing ? (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Attachments</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isUploading}
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Add Files"}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {editedFiles.map((file, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-3 rounded-lg border bg-muted/30 w-[300px]"
                >
                  <div className="flex-shrink-0">
                    {file.type.includes("pdf") ? (
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    ) : file.type.includes("image") ? (
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
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
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <a
                        href={file.url}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFile(file)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* View mode attachments */
          announcement.files &&
          announcement.files.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-4">Attachments</h3>
              <div className="flex flex-wrap gap-4">
                {announcement.files.map((file, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-3 rounded-lg border bg-muted/30 w-[300px]"
                  >
                    <div className="flex-shrink-0">
                      {file.type.includes("pdf") ? (
                        <svg
                          className="w-8 h-8 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      ) : file.type.includes("image") ? (
                        <svg
                          className="w-8 h-8 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
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
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <a
                        href={file.url}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Footer with edit buttons and read status */}
        <div className="border-t pt-4 mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {readStatus?.slice(0, 4).map((reader) => (
                      <Avatar
                        key={reader.userId}
                        className="h-6 w-6 border-2 border-background"
                      >
                        <AvatarFallback className="bg-primary/10 text-xs">
                          {reader.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {readStatus && readStatus.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                        +{readStatus.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Read by {readCount}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {readStatus?.map((reader) => (
                    <div
                      key={reader.userId}
                      className="text-sm flex items-center gap-2"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {reader.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{reader.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        ({new Date(reader.readAt).toLocaleDateString()})
                      </span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
            {!hasUserRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsRead}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Mark as read
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditedTitle(announcement.title);
                    setEditedDescription(
                      announcement.htmlDescription || announcement.description
                    );
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </DialogPrimitive.Root>
  );
}
