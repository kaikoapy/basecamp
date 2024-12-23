// convex/announcements.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("announcements", {
      ...args,
      createdBy: "test_user",
      postedAt: new Date().toISOString(),
      isEmailGenerated: false,
      files: [],
    });
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
      const senderName = args.from.split("<")[0].trim() || args.from;

      // Create the announcement document matching our schema
      const announcement = {
        title: args.subject,
        description: args.body,
        htmlDescription: args.htmlBody,
        images: [], // Empty array - not handling images
        postedAt: new Date().toISOString(),
        category: "email",
        createdBy: senderName,
        isEmailGenerated: true,
        files: [], // Empty array - not handling files
        emailMetadata: {
          from: args.from,
          originalEmailId: args.emailId,
          receivedAt: new Date().toISOString(),
        },
      };

      console.log("Creating announcement:", announcement);

      return await ctx.db.insert("announcements", announcement);
    } catch (error) {
      console.error("Error in processEmailToAnnouncement:", error);
      throw error;
    }
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("announcements").order("desc").collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    expiresAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      images: args.images,
      expiresAt: args.expiresAt,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const archive = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isArchived: true,
    });
  },
});
