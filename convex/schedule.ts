import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to get schedule for a specific month/year
export const getSchedule = query({
  args: {
    month: v.number(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedule")
      .filter((q) => q.eq(q.field("month"), args.month))
      .filter((q) => q.eq(q.field("year"), args.year))
      .first();
  },
});

// Mutation to create a new schedule
export const createSchedule = mutation({
  args: {
    month: v.number(),
    year: v.number(),
    containers: v.record(v.string(), v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { month, year, containers } = args;
    
    return await ctx.db.insert("schedule", {
      month,
      year,
      containers,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to update an existing schedule
export const updateSchedule = mutation({
  args: {
    month: v.number(),
    year: v.number(),
    containers: v.record(v.string(), v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { month, year, containers } = args;
    
    // Look for an existing schedule for the given month/year.
    const existingSchedule = await ctx.db
      .query("schedule")
      .filter((q) => q.eq(q.field("month"), month))
      .filter((q) => q.eq(q.field("year"), year))
      .first();
    
    if (!existingSchedule) {
      // If no schedule exists, insert one.
      await ctx.db.insert("schedule", {
        month,
        year,
        containers,
        updatedAt: Date.now(),
      });
      return;
    }

    // Otherwise, update the existing schedule.
    await ctx.db.patch(existingSchedule._id, {
      containers,
      updatedAt: Date.now(),
    });
  },
});
