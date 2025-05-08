import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listPackages = query({
  handler: async (ctx) => {
    return await ctx.db.query("packages").collect();
  },
});

export const createPackage = mutation({
  args: {
    capacity: v.number(),
    price: v.number(),
    hours: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("packages", args);
  },
});

export const updatePackage = mutation({
  args: {
    id: v.id("packages"),
    capacity: v.optional(v.number()),
    price: v.optional(v.number()),
    hours: v.optional(v.number()),
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
