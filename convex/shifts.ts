import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getShifts = query({
  args: {},
  handler: async (ctx) => {
    const shifts = await ctx.db
      .query("shifts")
      .first();

    if (!shifts) return null;
    return shifts.shifts;
  },
});

export const createShifts = mutation({
  args: {
    dayType: v.string(),
    shifts: v.object({
      monday: v.array(v.string()),
      tuesday: v.array(v.string()),
      wednesday: v.array(v.string()),
      thursday: v.array(v.string()),
      friday: v.array(v.string()),
      saturday: v.array(v.string()),
      sunday: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existingShifts = await ctx.db
      .query("shifts")
      .first();

    if (existingShifts) {
      throw new Error("Shifts already exist");
    }

    const shiftsDoc = await ctx.db.insert("shifts", {
      dayType: args.dayType,
      shifts: args.shifts,
      specialDates: [], // Initialize empty specialDates array
      updatedAt: Date.now(),
      orgId: "default", // Using a default orgId since we're not using auth
    });

    return shiftsDoc;
  },
});

export const upsertShifts = mutation({
  args: {
    dayType: v.string(),
    shifts: v.object({
      monday: v.array(v.string()),
      tuesday: v.array(v.string()),
      wednesday: v.array(v.string()),
      thursday: v.array(v.string()),
      friday: v.array(v.string()),
      saturday: v.array(v.string()),
      sunday: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existingShifts = await ctx.db
      .query("shifts")
      .first();

    if (existingShifts) {
      await ctx.db.patch(existingShifts._id, {
        dayType: args.dayType,
        shifts: args.shifts,
        specialDates: existingShifts.specialDates || [], // Preserve existing specialDates
        updatedAt: Date.now(),
      });
      return existingShifts._id;
    }

    const shiftsDoc = await ctx.db.insert("shifts", {
      dayType: args.dayType,
      shifts: args.shifts,
      specialDates: [], // Initialize empty specialDates array
      updatedAt: Date.now(),
      orgId: "default", // Using a default orgId since we're not using auth
    });

    return shiftsDoc;
  },
});

export const addSpecialDate = mutation({
  args: {
    date: v.string(),
    type: v.union(v.literal("closed"), v.literal("custom")),
    name: v.string(),
    shifts: v.optional(v.array(v.string())),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const shiftsDoc = await ctx.db
      .query("shifts")
      .first();

    if (!shiftsDoc) {
      throw new Error("Shifts document not found");
    }

    const specialDates = shiftsDoc.specialDates || [];
    
    // Check if date already exists
    const existingDateIndex = specialDates.findIndex(d => d.date === args.date);
    
    if (existingDateIndex !== -1) {
      // Update existing date
      specialDates[existingDateIndex] = args;
    } else {
      // Add new date
      specialDates.push(args);
    }

    // Sort dates chronologically
    specialDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await ctx.db.patch(shiftsDoc._id, {
      specialDates,
      updatedAt: Date.now(),
    });

    return specialDates;
  },
});

export const removeSpecialDate = mutation({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const shiftsDoc = await ctx.db
      .query("shifts")
      .first();

    if (!shiftsDoc) {
      throw new Error("Shifts document not found");
    }

    const specialDates = (shiftsDoc.specialDates || []).filter(d => d.date !== args.date);

    await ctx.db.patch(shiftsDoc._id, {
      specialDates,
      updatedAt: Date.now(),
    });

    return specialDates;
  },
});

export const getSpecialDates = query({
  args: {
    month: v.optional(v.number()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const shiftsDoc = await ctx.db
      .query("shifts")
      .first();

    if (!shiftsDoc) return [];

    const specialDates = shiftsDoc.specialDates || [];

    // If month and year are provided, filter dates for that month
    if (args.month && args.year) {
      return specialDates.filter(d => {
        const date = new Date(d.date);
        return date.getMonth() + 1 === args.month && date.getFullYear() === args.year;
      });
    }

    return specialDates;
  },
}); 