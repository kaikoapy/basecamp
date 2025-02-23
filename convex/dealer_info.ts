import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_ORG_ID = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
  ? "org_2tCUpNDKWSjk7287EmluGeDtC9R"
  : "org_2qOItQ3RqlWD4snDfmLRD1CG5J5";

export const get = query({
  handler: async (ctx) => {
    try {
      // First, get all dealer info to see what's available
      const allDealerInfo = await ctx.db
        .query("dealerInfo")
        .collect();
      
      console.log("All Available Dealer Info:", allDealerInfo.map(d => ({
        id: d._id,
        orgId: d.orgId,
        name: d.name
      })));

      // Try to find dealer info for the default org
      const dealerInfo = await ctx.db
        .query("dealerInfo")
        .filter((q) => q.eq(q.field("orgId"), DEFAULT_ORG_ID))
        .first();

      return dealerInfo;
    } catch (error) {
      console.error("Error in dealer_info.get:", error);
      throw error;
    }
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    // For queries, we'll try with orgId if available, otherwise get all records
    const orgId = identity.orgId;
    if (orgId) {
      return await ctx.db
        .query("dealerInfo")
        .filter((q) => q.eq(q.field("orgId"), orgId))
        .collect();
    }
    return await ctx.db.query("dealerInfo").collect();
  },
});

export const update = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    googleMapsUrl: v.string(),
    departments: v.array(
      v.object({
        name: v.string(),
        hours: v.string(),
        phone: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const orgId = identity.orgId;
    if (!orgId) throw new Error("No organization found");

    const dealerInfo = await ctx.db
      .query("dealerInfo")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!dealerInfo) throw new Error("Dealer info not found");

    await ctx.db.patch(dealerInfo._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const updateDepartment = mutation({
  args: {
    id: v.id("dealerInfo"),
    name: v.string(),
    hours: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.orgId;
    if (!orgId) throw new Error("No organization found");

    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
}); 