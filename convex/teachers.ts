import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query("teachers").collect();
    return teachers;
  },
});

export const getById = query({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    return teacher;
  },
});

export const add = mutation({
  args: {
    fullname: v.string(),
    userId: v.optional(v.id("users")),
    isFreelance: v.boolean(),
  },
  handler: async (ctx, args) => {
    const teacherId = await ctx.db.insert("teachers", {
      fullname: args.fullname,
      userId: args.userId,
      isFreelance: args.isFreelance,
    });
    return teacherId;
  },
});

export const update = mutation({
  args: {
    id: v.id("teachers"),
    fullname: v.string(),
    userId: v.optional(v.id("users")),
    isFreelance: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: {
    id: v.id("teachers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});