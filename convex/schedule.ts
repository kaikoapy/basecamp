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

// Query to get all sales consultants from directory
export const getSalesStaff = query({
  handler: async (ctx) => {
    const salesStaff = await ctx.db
      .query("directory")
      .filter((q) => 
        q.or(
          q.eq(q.field("position"), "New Sales Specialist"),
          q.eq(q.field("position"), "Used Sales Specialist")
        )
      )
      .collect();
    
    console.log("Raw Sales Staff from Directory:", salesStaff);
    
    const mappedStaff = salesStaff.map(staff => ({
      ...staff,
      type: staff.position.startsWith("New") ? "new" : "used"
    }));
    
    console.log("Mapped Sales Staff:", mappedStaff);
    
    return mappedStaff;
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
      published: false, // New schedules are unpublished by default
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
        published: false,
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

// Mutation to publish/unpublish a schedule
export const togglePublishSchedule = mutation({
  args: {
    month: v.number(),
    year: v.number(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { month, year, published } = args;
    
    const existingSchedule = await ctx.db
      .query("schedule")
      .filter((q) => q.eq(q.field("month"), month))
      .filter((q) => q.eq(q.field("year"), year))
      .first();
    
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }

    await ctx.db.patch(existingSchedule._id, {
      published,
      updatedAt: Date.now(),
    });
  },
});

// Debug query to check all positions in directory
export const getAllPositions = query({
  handler: async (ctx) => {
    const allStaff = await ctx.db.query("directory").collect();
    const positions = new Set(allStaff.map(staff => staff.position));
    console.log("All positions in directory:", Array.from(positions));
    return Array.from(positions);
  },
});
