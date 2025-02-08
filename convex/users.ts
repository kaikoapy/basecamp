import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    isManager: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      isManager: args.isManager,
      hasCompletedOnboarding: false,
    });
  },
});

export const getOnboardingStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), identity.subject))
      .first();

    return user?.hasCompletedOnboarding ?? false;
  }
});

export const markOnboardingComplete = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (user) {
      await ctx.db.patch(user._id, { hasCompletedOnboarding: true });
    }
  }
});
