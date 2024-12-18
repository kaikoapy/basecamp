import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrls = mutation({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    const uploadUrls = await Promise.all(
      Array(args.count)
        .fill(null)
        .map(() => ctx.storage.generateUploadUrl())
    );
    return uploadUrls;
  },
});
