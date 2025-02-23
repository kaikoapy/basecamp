import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const orgId = identity.orgId;
    
    // Try to get dealer info for the current org first
    let dealerInfo = null;
    if (orgId) {
      dealerInfo = await ctx.db
        .query("dealerInfo")
        .filter((q) => q.eq(q.field("orgId"), orgId))
        .first();
    }

    // If no dealer info found for current org, try the default org
    if (!dealerInfo) {
      // Use hardcoded values for now since we're in transition
      const defaultOrgId = "org_2qOItQ3RqlWD4snDfmLRD1CG5J5"; // dev org
      
      dealerInfo = await ctx.db
        .query("dealerInfo")
        .filter((q) => q.eq(q.field("orgId"), defaultOrgId))
        .first();
    }

    return dealerInfo || null;
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