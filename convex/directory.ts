// convex/directory.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("directory").collect();
  },
});

export const getAddress = query({
  handler: async (ctx) => {
    const dealerInfo = await ctx.db
      .query("dealerInfo")
      .filter((q) => q.eq(q.field("category"), "address"))
      .first();
    return dealerInfo?.address;
  },
});

export const getImportantNumbers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("dealerInfo")
      .filter((q) => q.eq(q.field("category"), "important_number"))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("directory"),
    name: v.optional(v.string()),
    position: v.optional(v.string()),
    department: v.optional(v.string()),
    extension: v.optional(v.string()),
    email: v.optional(v.string()),
    number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const seedDirectory = mutation({
  args: {
    entries: v.array(
      v.object({
        name: v.string(),
        position: v.string(),
        department: v.string(),
        extension: v.string(),
        email: v.string(),
        number: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing entries
    const existing = await ctx.db.query("directory").collect();
    for (const entry of existing) {
      await ctx.db.delete(entry._id);
    }

    // Insert new entries
    for (const entry of args.entries) {
      await ctx.db.insert("directory", entry);
    }
  },
});

export const deleteContact = mutation({
  args: {
    id: v.id("directory"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
