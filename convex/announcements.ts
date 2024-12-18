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
    // For now, let's skip auth since it's not set up
    // When you're ready to add auth, we can add it back

    return await ctx.db.insert("announcements", {
      ...args,
      createdBy: "test_user", // Temporarily hardcoded
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
    const senderName = args.from.split("<")[0].trim() || args.from;

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

    return await ctx.db.insert("announcements", {
      title: args.subject,
      description: args.body,
      images: images,
      files: files, // Add this to your schema
      category: "announcement",
      createdBy: senderName,
      postedAt: new Date().toISOString(),
      isEmailGenerated: true,
      emailMetadata: {
        from: args.from,
        originalEmailId: args.emailId,
        receivedAt: new Date().toISOString(),
      },
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("announcements").order("desc").collect();
  },
});
