import { mutation } from "./_generated/server";
import {
  announcements,
  pinnedContent,
  tools,
  resources,
} from "../app/data/dashboard-content";
import { dealerInfo } from "../app/data/dealer-info";

// Mutation for seeding the database
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Helper function to add timestamps
    const withTimestamps = <T extends object>(data: T) => ({
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Seed announcements
    for (const announcement of announcements) {
      await ctx.db.insert("announcements", {
        ...withTimestamps(announcement),
        postedAt: announcement.postedAt.getTime(), // Convert Date to timestamp
      });
    }

    // Seed pinned content
    for (const content of pinnedContent) {
      await ctx.db.insert("pinnedContent", withTimestamps(content));
    }

    // Seed tools
    for (const tool of tools) {
      await ctx.db.insert("tools", withTimestamps(tool));
    }

    // Seed resources
    for (const resource of resources) {
      await ctx.db.insert("resources", withTimestamps(resource));
    }

    // Seed dealer info
    const dealerInfoId = await ctx.db.insert(
      "dealerInfo",
      withTimestamps({
        name: dealerInfo.name,
        address: dealerInfo.address,
        googleMapsUrl: dealerInfo.googleMapsUrl,
      })
    );

    // Seed departments
    for (const department of dealerInfo.departments) {
      await ctx.db.insert(
        "departments",
        withTimestamps({
          ...department,
          dealerInfoId,
        })
      );
    }

    return "Database seeded successfully!";
  },
});
