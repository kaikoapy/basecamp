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
    updatedAt: v.number(),
  }),

  users: defineTable({
    email: v.string(),
    isManager: v.boolean(),
    // Add any other user fields you need
  }),

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
  }).index("by_status", ["isArchived"]),
});
