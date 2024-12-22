import { mutation, query } from "./_generated/server";
import { tools, resources, pinnedContent } from "../app/data/dashboard-content";
import { v } from "convex/values";

export const seedResources = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Starting resources seeding...");
    const now = Date.now();

    // Seed pinned content
    for (const item of pinnedContent) {
      await ctx.db.insert("resources", {
        ...item,
        type: "pinned",
        updatedAt: now,
      });
    }
    console.log("✅ Seeded pinned content");

    // Seed tools
    for (const item of tools) {
      await ctx.db.insert("resources", {
        ...item,
        type: "tool",

        updatedAt: now,
      });
    }
    console.log("✅ Seeded tools");

    // Seed resources
    for (const item of resources) {
      await ctx.db.insert("resources", {
        ...item,
        type: "resource",

        updatedAt: now,
      });
    }
    console.log("✅ Seeded resources");

    return "Resources seeded successfully";
  },
});

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
