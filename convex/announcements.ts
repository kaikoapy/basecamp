import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

interface Reader {
  userId: string;
  userName: string;
  readAt: string;
}

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Creating announcement with args:", args);
    const announcement = {
      ...args,
      createdBy: "test_user",
      postedAt: new Date().toISOString(),
      isEmailGenerated: false,
      files: [],
      readBy: [] as Reader[],
    };
    return await ctx.db.insert("announcements", announcement);
  },
});

export const processEmailToAnnouncement = mutation({
  args: {
    from: v.string(),
    subject: v.string(),
    body: v.string(),
    htmlBody: v.string(),
    attachments: v.array(
      v.object({
        url: v.string(),
        type: v.string(),
        name: v.string(),
      })
    ),
    emailId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Processing email to announcement with args:", args);
      const senderName = args.from.split("<")[0].trim() || args.from;

      // Create the announcement document matching our schema
      const announcement = {
        title: args.subject,
        description: args.body,
        htmlDescription: args.htmlBody,
        images: [], // Empty array - not handling images yet
        postedAt: new Date().toISOString(),
        category: "email",
        createdBy: senderName,
        isEmailGenerated: true,
        readBy: [] as Reader[],
        files: args.attachments.map((attachment) => ({
          url: attachment.url,
          name: attachment.name,
          type: attachment.type,
        })),
        emailMetadata: {
          from: args.from,
          originalEmailId: args.emailId,
          receivedAt: new Date().toISOString(),
        },
      };

      console.log("Creating announcement:", announcement);

      const result = await ctx.db.insert("announcements", announcement);
      console.log("Announcement created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error in processEmailToAnnouncement:", error);
      throw error;
    }
  },
});

export const list = query({
  handler: async (ctx) => {
    console.log("Listing announcements");
    const announcements = await ctx.db
      .query("announcements")
      .order("desc")
      .collect();
    console.log("Retrieved announcements:", announcements);
    return announcements;
  },
});

export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    description: v.string(),
    htmlDescription: v.optional(v.string()),
    images: v.array(v.string()),
    expiresAt: v.optional(v.string()),
    files: v.optional(
      v.array(
        v.object({
          url: v.string(),
          type: v.string(),
          name: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    console.log("Updating announcement with args:", args);
    return await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      htmlDescription: args.htmlDescription,
      images: args.images,
      expiresAt: args.expiresAt,
      files: args.files,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    console.log("Removing announcement with id:", args.id);
    return await ctx.db.delete(args.id);
  },
});

export const archive = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    console.log("Archiving announcement with id:", args.id);
    return await ctx.db.patch(args.id, {
      isArchived: true,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {
    type: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Generating upload URL for type:", args.type); // Corrected line
    return await ctx.storage.generateUploadUrl();
  },
});

export const markAsRead = mutation({
  args: {
    id: v.id("announcements"),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Marking announcement as read with args:", args);
    const announcement = await ctx.db.get(args.id);
    if (!announcement) {
      console.warn("Announcement not found for id:", args.id);
      return;
    }

    const readBy = announcement.readBy || [];
    // Check if user has already read it
    if (!readBy.some((reader: Reader) => reader.userId === args.userId)) {
      readBy.push({
        userId: args.userId,
        userName: args.userName,
        readAt: new Date().toISOString(),
      });

      await ctx.db.patch(args.id, {
        readBy,
      });
      console.log("Updated readBy list for announcement:", args.id);
    }
    return readBy;
  },
});

export const getReadStatus = query({
  args: {
    id: v.id("announcements"),
  },
  handler: async (ctx, args) => {
    console.log("Getting read status for announcement id:", args.id);
    const announcement = await ctx.db.get(args.id);
    const readStatus = announcement?.readBy || [];
    console.log("Read status retrieved:", readStatus);
    return readStatus;
  },
});

export const getUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    console.log("Generating URL for storage ID:", args.storageId);
    return await ctx.storage.getUrl(args.storageId);
  },
});
