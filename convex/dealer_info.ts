import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

interface ClerkUserIdentity {
  org_role?: string;
  org?: string;
}

export const get = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthenticated");

      const clerkIdentity = identity as unknown as ClerkUserIdentity;
      
      console.log("Dealer Info Query Identity:", {
        hasIdentity: !!identity,
        clerkOrgId: clerkIdentity.org,
        identityOrgId: identity.orgId
      });

      // Get all dealer info first to see what's available
      const allDealerInfo = await ctx.db
        .query("dealerInfo")
        .collect();
      
      // Try with clerk org ID first
      let dealerInfo = null;
      if (clerkIdentity.org) {
        dealerInfo = await ctx.db
          .query("dealerInfo")
          .filter((q) => q.eq(q.field("orgId"), clerkIdentity.org))
          .first();
      }

      // If no dealer info found, try with identity org ID
      if (!dealerInfo && identity.orgId) {
        dealerInfo = await ctx.db
          .query("dealerInfo")
          .filter((q) => q.eq(q.field("orgId"), identity.orgId))
          .first();
      }

      // If still no dealer info found, use the first available one
      if (!dealerInfo && allDealerInfo.length > 0) {
        dealerInfo = allDealerInfo[0];
      }

      console.log("Query Result:", {
        found: !!dealerInfo,
        dealerInfo: dealerInfo ? {
          id: dealerInfo._id,
          orgId: dealerInfo.orgId,
          name: dealerInfo.name
        } : null,
        allDealerInfo: allDealerInfo.map(d => ({
          id: d._id,
          orgId: d.orgId,
          name: d.name
        }))
      });

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