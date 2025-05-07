import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    start: v.string(),
    end: v.string(),
    studentId: v.optional(v.id("students")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dateSpans", {
      start: args.start,
      end: args.end,
      studentId: args.studentId,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("dateSpans").collect();
  },
});
