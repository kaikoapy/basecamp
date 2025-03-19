import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Resources table (including FAQs)
  resources: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    category: v.string(), //make enum
    url: v.optional(v.string()),
    isAffinitySearch: v.optional(v.boolean()),
    pinned: v.optional(v.boolean()),
    component: v.optional(v.string()),
    isModal: v.optional(v.boolean()),
    coverText: v.optional(v.string()),
    order: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    resourcePath: v.optional(v.string()),
    showCopyButton: v.optional(v.boolean()),
    showExternalLink: v.optional(v.boolean()),
  }).index("by_category", ["category"]),

  // Dealer information table
  dealerInfo: defineTable({
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
    updatedAt: v.number(),
    orgId: v.optional(v.string()),
  }).index("by_orgId", ["orgId"]),

  // Directory table
  directory: defineTable({
    name: v.string(),
    nickname: v.optional(v.string()),
    position: v.string(),
    department: v.string(),
    extension: v.string(),
    email: v.string(),
    number: v.string(),
  }).index("by_department", ["department"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    isManager: v.boolean(),
    hasCompletedOnboarding: v.boolean(),
    orgId: v.optional(v.string()),
    // Add any other user fields you need
  }).index("by_clerk_id", ["clerkId"]),

  // Announcements table
  announcements: defineTable({
    title: v.string(),
    description: v.string(),
    htmlDescription: v.optional(v.string()),
    images: v.array(v.string()),
    category: v.string(),
    createdBy: v.string(),
    postedAt: v.string(),
    
    expiresAt: v.optional(v.string()),
    isArchived: v.optional(v.boolean()),
    isEmailGenerated: v.boolean(),
    files: v.optional(
      v.array(
        v.object({
          url: v.string(),
          type: v.string(),
          name: v.string(),
        })
      )
    ),
    emailMetadata: v.optional(
      v.object({
        from: v.string(),
        originalEmailId: v.string(),
        receivedAt: v.string(),
      })
    ),
    readBy: v.optional(
      v.array(
        v.object({
          userId: v.string(),
          userName: v.string(),
          readAt: v.string(),
        })
      )
    ),
    orgId: v.optional(v.string()),
  }).index("by_status", ["isArchived"])
    .index("by_orgId", ["orgId"]),

  // Schedule table
  schedule: defineTable({
    month: v.number(), // 1-12
    year: v.number(),  // e.g., 2023
    containers: v.record(v.string(), v.array(v.string())), // e.g. { "salespeople-list": [...], "1-0": [...] }
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.string()), // Clerk User ID
    published: v.optional(v.boolean()),
  }),

  // Company settings table
  companySettings: defineTable({
    name: v.string(),
    value: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_category", ["category"]),

  // Audit log for tracking changes
  auditLog: defineTable({
    userId: v.string(),
    action: v.string(),
    tableName: v.string(),
    recordId: v.string(),
    changes: v.string(),
    timestamp: v.number(),
  }).index("by_record_id", ["recordId"]),

  // Lease Advertisements table
  leaseAds: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
    isActive: v.boolean(),
    expiresAt: v.optional(v.number()),
  }).index("by_dealership", ["dealershipInfo.name"])
    .index("by_model", ["advertisementOverview.vehicleModel"])
    .index("by_active", ["isActive"]),

  shifts: defineTable({
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
    specialDates: v.optional(v.array(v.object({
      date: v.string(),
      type: v.union(v.literal("closed"), v.literal("custom")),
      name: v.string(),
      shifts: v.optional(v.array(v.string())),
      note: v.optional(v.string()),
    }))),
    updatedAt: v.number(),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),

  // Position and department configuration table
  positionConfig: defineTable({
    orgId: v.string(),
    positions: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        originalName: v.string(), // Reference to the original position name
        isActive: v.boolean(),
        department: v.string(),
        updatedAt: v.number(),
      })
    ),
    departments: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        originalName: v.string(), // Reference to the original department name
        isActive: v.boolean(),
        updatedAt: v.number(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_orgId", ["orgId"]),
});
