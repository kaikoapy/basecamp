import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DEPARTMENTS, POSITIONS } from "./directory";
import { Doc } from "./_generated/dataModel";

interface Position {
  id: string;
  name: string;
  originalName: string;
  isActive: boolean;
  department: string;
  updatedAt: number;
}

interface Department {
  id: string;
  name: string;
  originalName: string;
  isActive: boolean;
  updatedAt: number;
}

interface PositionConfigDoc extends Doc<"positionConfig"> {
  orgId: string;
  positions: Position[];
  departments: Department[];
  updatedAt: number;
}

// Get all positions and departments
export const getAll = query({
  handler: async (ctx): Promise<PositionConfigDoc | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.subject;
    return await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();
  },
});

// Initialize the position config with default values
export const initialize = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.subject;
    
    // Check if config already exists
    const existing = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();
    
    if (existing) return existing;

    // Initialize with default values
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

    return await ctx.db.get(id);
  },
});

// Helper function to map positions to departments
function getDepartmentForPosition(position: string): string {
  const mappings: Record<string, string> = {
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
    "BDC": "Sales",
  };
  return mappings[position] || "General";
}

// Add a new position
export const addPosition = mutation({
  args: {
    name: v.string(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.subject;
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Configuration not found");

    const newPosition: Position = {
      id: crypto.randomUUID(),
      name: args.name,
      originalName: args.name,
      isActive: true,
      department: args.department,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(config._id, {
      positions: [...config.positions, newPosition],
      updatedAt: Date.now(),
    });
  },
});

// Add a new department
export const addDepartment = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.subject;
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Configuration not found");

    const newDepartment: Department = {
      id: crypto.randomUUID(),
      name: args.name,
      originalName: args.name,
      isActive: true,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(config._id, {
      departments: [...config.departments, newDepartment],
      updatedAt: Date.now(),
    });
  },
});

// Update position
export const updatePosition = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    department: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.subject;
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Configuration not found");

    const positions = config.positions.map((pos: Position) =>
      pos.id === args.id
        ? { ...pos, name: args.name, department: args.department, isActive: args.isActive, updatedAt: Date.now() }
        : pos
    );

    await ctx.db.patch(config._id, {
      positions,
      updatedAt: Date.now(),
    });
  },
});

// Update department
export const updateDepartment = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const orgId = identity.subject;
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Configuration not found");

    const departments = config.departments.map((dept: Department) =>
      dept.id === args.id
        ? { ...dept, name: args.name, isActive: args.isActive, updatedAt: Date.now() }
        : dept
    );

    await ctx.db.patch(config._id, {
      departments,
      updatedAt: Date.now(),
    });
  },
});

// Update multiple positions at once
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

    const orgId = identity.subject;
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Configuration not found");

    // Update each position while preserving other fields
    const positions = config.positions.map((pos: Position) => {
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
      positions,
      updatedAt: Date.now(),
    });
  },
});

// Update multiple departments at once
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

    const orgId = identity.subject;
    const config = await ctx.db
      .query("positionConfig")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!config) throw new Error("Configuration not found");

    // Update each department while preserving other fields
    const departments = config.departments.map((dept: Department) => {
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
      departments,
      updatedAt: Date.now(),
    });
  },
}); 