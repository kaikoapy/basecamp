"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Trash2, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { createParser } from "nuqs/server";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShimmerButton from "@/components/ui/shimmer-button";
import { useQueryState } from "nuqs";
import TiptapEditor from "./TipTapEditor";

// Base64 encoding/decoding functions
function encodeId(id: string): string {
  if (typeof window === "undefined") return id;
  return btoa(id).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

const announcementParser = createParser({
  parse: (value: string) => value || "",
  serialize: (value: string) => value || "",
}).withDefault("");

// Custom Dialog components for test
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] bg-background pt-10 px-6 pb-6 shadow-lg duration-200 sm:rounded-lg flex flex-col max-h-[85vh] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">
        Email Content
      </DialogPrimitive.Title>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted p-2 focus:outline-none focus:ring-none focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

interface NewAnnouncementDialogProps {
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
  announcement,
}: NewAnnouncementDialogProps) {
  const [encodedId, setEncodedId] = useQueryState(
    "announcement",
    announcementParser
  );

  const open = encodedId === encodeId(announcement._id);
  const onOpenChange = (isOpen: boolean) => {
    setEncodedId(isOpen ? encodeId(announcement._id) : "");
  };

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

  const getClerkUserImageUrl = (userId: string) => {
    return userId === user?.id ? user?.imageUrl : undefined;
  };

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
    console.log("Clerk user:", {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      username: user.username,
      imageUrl: user.imageUrl,
    });
    try {
      const userName = `${user.firstName} ${user.lastName}`.trim();
      console.log("Using name:", userName);
      await markAsRead({
        id: announcement._id,
        userId: user.id,
        userName,
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

  // Add helper function to get correct download URL
  const getDownloadUrl = (fileUrl: string) => {
    // If URL already contains /api/storage/, it's in the correct format
    if (fileUrl.includes("/api/storage/")) {
      return fileUrl;
    }
    // Extract file ID from upload URL
    const fileId = fileUrl.split("/upload")[0].split("/").pop();
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Header with title */}
        <div className="border-b pb-4">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-xl font-bold mb-3 h-auto py-2 px-3 max-w-3xl"
              placeholder="Enter title..."
            />
          ) : (
            <h2 className="text-xl font-bold mb-3">{announcement.title}</h2>
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
        <div className="flex-1 overflow-y-auto py-4 focus:outline-none">
          {isEditing ? (
            <TiptapEditor
              content={editedDescription}
              onChange={setEditedDescription}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  announcement.htmlDescription || announcement.description,
              }}
              className="prose prose-sm max-w-none min-h-[400px] [&_p]:my-4 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-2 [&_strong]:font-semibold [&_em]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_code]:font-mono [&_code]:text-sm [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:bg-gray-100 focus:outline-none"
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
                        href={getDownloadUrl(file.url)}
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
                        href={getDownloadUrl(file.url)}
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
            {readCount > 0 ? (
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {readStatus?.slice(0, 4).map((reader) => (
                        <Avatar
                          key={reader.userId}
                          className="h-6 w-6 border-2 border-background"
                        >
                          <AvatarImage
                            src={getClerkUserImageUrl(reader.userId)}
                            alt={reader.userName}
                          />
                          <AvatarFallback className="bg-primary/10 text-xs">
                            {reader.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
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
                          <AvatarImage
                            src={getClerkUserImageUrl(reader.userId)}
                            alt={reader.userName}
                          />
                          <AvatarFallback className="text-xs">
                            {reader.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
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
            ) : (
              <span className="text-sm text-muted-foreground">
                Read by {readCount}
              </span>
            )}
            {!hasUserRead && <ShimmerButton onClick={handleMarkAsRead} />}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
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
