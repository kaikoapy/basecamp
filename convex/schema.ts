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
  createdAt: v.number(),
  updatedAt: v.number(),
};

export default defineSchema({
  // Announcements table
  announcements: defineTable({
    ...baseContentFields,
    content: v.string(),
    postedAt: v.number(), // Store as timestamp
  }),

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
    ...baseContentFields,
    coverText: v.string(),
    component: v.optional(v.string()),
    isModal: v.boolean(),
    content: v.optional(v.string()),
  }),

  // Dealer information table
  dealerInfo: defineTable({
    name: v.string(),
    address: v.string(),
    googleMapsUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Department table (related to dealerInfo)
  departments: defineTable({
    dealerInfoId: v.id("dealerInfo"),
    name: v.string(),
    hours: v.string(),
    phone: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_dealer_info", ["dealerInfoId"]),
});
