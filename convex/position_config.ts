import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { POSITIONS, DEPARTMENTS } from "./directory";

// Get the position configuration for an organization
export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const orgId = identity.tokenIdentifier.split("|")[1];
    return await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();
  },
});

// Initialize or update position configuration
export const initialize = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const orgId = identity.tokenIdentifier.split("|")[1];
    const existing = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (existing) return existing._id;

    // Create initial configuration with all positions and departments active
    const positions = POSITIONS.map((pos) => ({
      id: crypto.randomUUID(),
      name: pos,
      originalName: pos,
      isActive: true,
      department: getDepartmentForPosition(pos),
      updatedAt: Date.now(),
    }));

    const departments = DEPARTMENTS.map((dept) => ({
      id: crypto.randomUUID(),
      name: dept,
      originalName: dept,
      isActive: true,
      updatedAt: Date.now(),
    }));

    const id = await ctx.db.insert("positionConfig", {
      orgId,
      positions,
      departments,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Update position names and active status
export const updatePositions = mutation({
  args: {
    positions: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        isActive: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const orgId = identity.tokenIdentifier.split("|")[1];
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Position configuration not found");

    // Update only the specified positions
    const updatedPositions = config.positions.map((pos) => {
      const update = args.positions.find((p) => p.id === pos.id);
      if (update) {
        return {
          ...pos,
          name: update.name,
          isActive: update.isActive,
          updatedAt: Date.now(),
        };
      }
      return pos;
    });

    await ctx.db.patch(config._id, {
      positions: updatedPositions,
      updatedAt: Date.now(),
    });
  },
});

// Update department names and active status
export const updateDepartments = mutation({
  args: {
    departments: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        isActive: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const orgId = identity.tokenIdentifier.split("|")[1];
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Position configuration not found");

    // Update only the specified departments
    const updatedDepartments = config.departments.map((dept) => {
      const update = args.departments.find((d) => d.id === dept.id);
      if (update) {
        return {
          ...dept,
          name: update.name,
          isActive: update.isActive,
          updatedAt: Date.now(),
        };
      }
      return dept;
    });

    await ctx.db.patch(config._id, {
      departments: updatedDepartments,
      updatedAt: Date.now(),
    });
  },
});

// Helper function to determine department for a position
function getDepartmentForPosition(position: string): string {
  const positionToDepartment: Record<string, string> = {
    "General Manager": "General",
    "Sales Manager": "Sales",
    "New Car Sales Specialist": "Sales",
    "Used Car Sales Specialist": "Sales",
    "Product Specialist": "Sales",
    "Service Advisor": "Service",
    "Service Manager": "Service",
    "Service Mechanic": "Service",
    "Stock Manager": "Logistics",
    "Master Technician": "Service",
    "Parts Specialist": "Parts",
    "Finance Manager": "Finance",
    "Accounting": "Accounting",
    "Title Clerk": "Accounting",
    "Porter": "Logistics",
    "Detail Manager": "Service",
    "Receptionist": "General",
  };

  return positionToDepartment[position] || "General";
} 