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

      // Ensure we have valid data
      if (!args.body) {
        console.error("Missing body in email processing");
        throw new Error("Email body is required");
      }

      // Split attachments by type
      const images = args.attachments
        .filter((att) => att.type.startsWith("image/"))
        .map((att) => att.url);

      const files = args.attachments
        .filter((att) => !att.type.startsWith("image/"))
        .map((att) => ({
          url: att.url,
          name: att.name,
          type: att.type,
        }));

      const announcement = {
        title: args.subject,
        description: args.body,
        images,
        files,
        category: "announcement",
        createdBy: senderName,
        postedAt: new Date().toISOString(),
        isEmailGenerated: true,
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
