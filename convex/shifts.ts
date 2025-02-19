import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

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

export const upsertShifts = mutation({
  args: {
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
    const existing = await ctx.db
      .query("shifts")
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        shifts: args.shifts,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("shifts", {
        dayType: "all",
        shifts: args.shifts,
        updatedAt: Date.now(),
        orgId: "org_2ZPBnKKKWxhOBGZtGPzGFXr0Iy1", // TODO: Get from auth context
      });
    }
  },
}); 