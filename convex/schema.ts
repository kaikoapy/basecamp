import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define shared field types that are used across multiple tables
const baseContentFields = {
  title: v.string(),
  image: v.optional(v.string()),
  duration: v.string(),
  category: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  updatedAt: v.number(),
};

export default defineSchema({
  // Pinned content table
  pinnedContent: defineTable({
    ...baseContentFields,
    pinned: v.boolean(),
  }),

  // Tools table
  tools: defineTable({
    ...baseContentFields,
  }),

  // Resources table (including FAQs)
  resources: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    duration: v.optional(v.string()),
    category: v.string(),
    url: v.optional(v.string()),
    type: v.string(),
    isAffinitySearch: v.optional(v.boolean()),
    pinned: v.optional(v.boolean()),
    component: v.optional(v.string()),
    isModal: v.optional(v.boolean()),
    coverText: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    order: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    resourcePath: v.optional(v.string()),
    showCopyButton: v.optional(v.boolean()),
    showExternalLink: v.optional(v.boolean()),
  }).index("by_type", ["type"]),

  // Dealer information table
  dealerInfo: defineTable({
    name: v.string(),
    address: v.string(),
    googleMapsUrl: v.string(),
    updatedAt: v.number(),
  }),

  users: defineTable({
    email: v.string(),
    isManager: v.boolean(),
    // Add any other user fields you need
  }),

  // Department table (related to dealerInfo)
  departments: defineTable({
    dealerInfoId: v.id("dealerInfo"),
    name: v.string(),
    hours: v.string(),
    phone: v.string(),
    updatedAt: v.number(),
  }).index("by_dealer_info", ["dealerInfoId"]),

  // Announcements table
  announcements: defineTable({
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    files: v.optional(
      v.array(
        v.object({
          url: v.string(),
          name: v.string(),
          type: v.string(),
        })
      )
    ),
    postedAt: v.string(),
    category: v.string(),
    createdBy: v.string(),
    isEmailGenerated: v.boolean(),
    emailMetadata: v.optional(
      v.object({
        from: v.string(),
        originalEmailId: v.string(),
        receivedAt: v.string(),
      })
    ),
  }),
});
