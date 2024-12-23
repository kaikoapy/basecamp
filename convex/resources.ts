import { query } from "./_generated/server";
import { v } from "convex/values";

// Query to get resources by type
export const getResourcesByType = query({
  args: {
    type: v.union(
      v.literal("tool"),
      v.literal("resource"),
      v.literal("pinned")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
  },
});

// Query to get all resources
export const getAllResources = query({
  handler: async (ctx) => {
    return await ctx.db.query("resources").collect();
  },
});
