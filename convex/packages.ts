import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listPackages = query({
  handler: async (ctx) => {
    return await ctx.db.query("packages").collect();
  },
});

export const createPackage = mutation({
  args: {
    capacity: v.int64(),
    price: v.int64(),
    hours: v.int64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("packages", args);
  },
});

export const updatePackage = mutation({
  args: {
    id: v.id("packages"),
    capacity: v.optional(v.int64()),
    price: v.optional(v.int64()),
    hours: v.optional(v.int64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return args.id;
  },
});

export const deletePackage = mutation({
  args: { id: v.id("packages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
