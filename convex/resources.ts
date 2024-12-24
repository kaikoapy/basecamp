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

// Helper function to normalize text for searching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove all non-alphanumeric characters
    .trim();
}

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.query.trim();
    const limit = args.limit ?? 5;

    if (!searchQuery) {
      return [];
    }

    const resources = await ctx.db
      .query("resources")
      .withIndex("by_category")
      .collect();

    // Normalize the search query
    const normalizedQuery = normalizeText(searchQuery);

    // Filter with flexible matching
    return resources
      .filter((resource) => {
        // Normalize the title
        const normalizedTitle = normalizeText(resource.title);

        // Normalize the description if it exists
        const normalizedDescription = resource.description
          ? normalizeText(resource.description)
          : "";

        // Check if the normalized query is included in the normalized title or description
        return (
          normalizedTitle.includes(normalizedQuery) ||
          normalizedDescription.includes(normalizedQuery) ||
          // Also check the original strings with spaces for more natural matching
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (resource.description?.toLowerCase() ?? "").includes(
            searchQuery.toLowerCase()
          )
        );
      })
      .slice(0, limit);
  },
});
