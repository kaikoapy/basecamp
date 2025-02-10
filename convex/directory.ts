// convex/directory.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Predefined options for positions and departments
export const POSITIONS = [
  "General Manager",
  "Sales Manager",
  "Sales Specialist",
  "Service Advisor",
  "Service Manager",
  "Service Mechanic",
  "Stock Manager",
  "Master Technician",
  "Parts Specialist",
  "Finance Manager",
  "Accounting",
  "Title Clerk",
  "Porter",
  "Detail Manager",
  "Receptionist",
] as const;

export const DEPARTMENTS = [
  "General",
  "Sales",
  "Service",
  "Parts",
  "Finance",
  "Accounting",
  "Logistics",
] as const;

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    return await ctx.db.query("directory").collect();
  },
});

export const getAddress = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const dealerInfo = await ctx.db
      .query("dealerInfo")
      .filter((q) => q.eq(q.field("category"), "address"))
      .first();
    return dealerInfo?.address;
  },
});

export const getImportantNumbers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    return await ctx.db
      .query("dealerInfo")
      .filter((q) => q.eq(q.field("category"), "important_number"))
      .collect();
  },
});

// Update the interface to match the actual structure
interface ClerkUserIdentity {
  role: string[];
}

export const deleteOne = mutation({
  args: { id: v.id("directory") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkIdentity = identity as unknown as ClerkUserIdentity;
    if (!clerkIdentity.role?.includes("org:admin")) {
      throw new Error("Unauthorized: Requires directory management permission");
    }

    await ctx.db.delete(args.id);
  },
});

export const deleteMany = mutation({
  args: { ids: v.array(v.id("directory")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkIdentity = identity as unknown as ClerkUserIdentity;
    if (!clerkIdentity.role?.includes("org:admin")) {
      throw new Error("Unauthorized: Requires directory management permission");
    }

    await Promise.all(args.ids.map((id) => ctx.db.delete(id)));
  },
});

export const update = mutation({
  args: {
    id: v.id("directory"),
    name: v.string(),
    nickname: v.optional(v.string()),
    position: v.string(),
    department: v.string(),
    extension: v.string(),
    email: v.string(),
    number: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkIdentity = identity as unknown as ClerkUserIdentity;
    if (!clerkIdentity.role?.includes("org:admin")) {
      throw new Error("Unauthorized: Requires directory management permission");
    }

    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    nickname: v.optional(v.string()),
    position: v.string(),
    department: v.string(),
    extension: v.string(),
    email: v.string(),
    number: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkIdentity = identity as unknown as ClerkUserIdentity;
    if (!clerkIdentity.role?.includes("org:admin")) {
      throw new Error("Unauthorized: Requires directory management permission");
    }

    await ctx.db.insert("directory", {
      name: args.name,
      nickname: args.nickname,
      position: args.position,
      department: args.department,
      extension: args.extension,
      email: args.email,
      number: args.number,
    });
  },
});
