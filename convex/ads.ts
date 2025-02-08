import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Queries
export const getByDealership = query({
  args: {},
  handler: async (ctx) => {
    const ads = await ctx.db
      .query("leaseAds")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return ads.reduce((groups, ad) => {
      const dealerName = ad.dealershipInfo.name;
      if (!groups[dealerName]) {
        groups[dealerName] = [];
      }
      groups[dealerName].push(ad);
      return groups;
    }, {} as Record<string, typeof ads>);
  },
});

export const getById = query({
  args: { id: v.id("leaseAds") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByModel = query({
  args: { model: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leaseAds")
      .filter((q) => 
        q.eq(q.field("advertisementOverview.vehicleModel"), args.model)
      )
      .collect();
  },
});

export const getByDealershipName = query({
  args: { dealershipName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leaseAds")
      .filter((q) => 
        q.and(
          q.eq(q.field("dealershipInfo.name"), args.dealershipName),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();
  },
});

// Mutations
const leaseAdInput = v.object({
  dealershipInfo: v.object({
    name: v.string(),
    location: v.string(),
  }),
  advertisementOverview: v.object({
    vehicleModel: v.string(),
    advertisedMonthlyPayment: v.string(),
    advertisedDownPayment: v.string(),
    isTransparent: v.boolean(),
  }),
  finePrintSummary: v.object({
    actuallyDueAtSigning: v.string(),
    difference: v.string(),
    monthlyPaymentDetail: v.string(),
    originalDisclosure: v.string(),
    includedFeesInAdvertised: v.array(v.string()),
  }),
  fullPaymentDetails: v.object({
    paymentDetails: v.object({
      monthlyPayment: v.string(),
      downPayment: v.string(),
      firstMonthPayment: v.string(),
      leaseTerm: v.string(),
    }),
    additionalFees: v.object({
      bankAcquisitionFee: v.string(),
      dealerFee: v.string(),
      tagFees: v.string(),
      electronicFee: v.string(),
    }),
    requiredDiscounts: v.object({
      volvoLoyalty: v.string(),
      affinityAplan: v.string(),
      fwdToAwdAllowance: v.string(),
    }),
    vehicleRequirements: v.object({
      model: v.string(),
      msrp: v.string(),
      mileageLimit: v.string(),
    }),
  }),
  expiresAt: v.optional(v.number()),
});

export const create = mutation({
  args: { leaseAd: leaseAdInput },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("leaseAds", {
      ...args.leaseAd,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: { 
    id: v.id("leaseAds"),
    leaseAd: leaseAdInput,
  },
  handler: async (ctx, args) => {
    const { id, leaseAd } = args;
    return await ctx.db.patch(id, {
      ...leaseAd,
      updatedAt: Date.now(),
    });
  },
});

export const deactivate = mutation({
  args: { id: v.id("leaseAds") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("leaseAds") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const updateExpirationDates = mutation({
  args: { 
    ids: v.array(v.id("leaseAds")),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { ids, expiresAt } = args;
    await Promise.all(
      ids.map(id => 
        ctx.db.patch(id, {
          expiresAt,
          updatedAt: Date.now(),
        })
      )
    );
  },
});

