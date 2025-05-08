import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").order("desc").collect();
    return students;
  },
});

export const getById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    return student;
  },
});

export const add = mutation({
  args: {
    fullname: v.string(),
    age: v.number(),
    userId: v.optional(v.id("users")),
    dateSpanId: v.optional(v.id("dateSpans")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("students", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("students"),
    fullname: v.string(),
    age: v.number(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: {
    id: v.id("students"),
  },
  handler: async (ctx, args) => {
    // First, find any associated date spans
    const student = await ctx.db.get(args.id);
    if (student?.dateSpanId) {
      // Delete the associated date span
      await ctx.db.delete(student.dateSpanId);
    }
    
    // Delete the student
    await ctx.db.delete(args.id);
  },
});

export const addDateSpanToStudent = mutation({
  args: {
    studentId: v.id("students"),
    dateSpanId: v.id("dateSpans"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, { dateSpanId: args.dateSpanId });
  },
});