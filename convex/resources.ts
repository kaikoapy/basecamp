import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get resources by type
export const getResourcesByType = query({
  args: {
    category: v.union(
      v.literal("tool"),
      v.literal("resource"),
      v.literal("pinned")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});

// Query to get all resources
export const getAllResources = query({
  handler: async (ctx) => {
    return await ctx.db.query("resources").collect();
  },
});

// Mutation to toggle the pinned state of a resource
export const togglePinned = mutation({
  args: {
    id: v.id("resources"),
    pinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      pinned: args.pinned,
    });
  },
});
