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
        images: [], // Empty array since we're not handling images yet
        postedAt: new Date().toISOString(),
        category: "email", // Default category for email announcements
        createdBy: senderName,
        isEmailGenerated: true,
        files: [], // Empty array as per schema
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
