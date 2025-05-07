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

export const getAvailableUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    // Get all students with assigned users
    const students = await ctx.db
      .query("students")
      .filter((q) => q.neq(q.field("userId"), undefined))
      .collect();
    
    // Get the set of assigned user IDs
    const assignedUserIds = new Set(students.map(s => s.userId));
    
    // Filter out users that are already assigned
    const availableUsers = users.filter(user => !assignedUserIds.has(user._id));
    
    return availableUsers.map(user => ({
      id: user._id,
      email: user.email
    }));
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

export const addDateSpanToStudent = mutation({
  args: {
    studentId: v.id("students"),
    dateSpanId: v.id("dateSpans"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, { dateSpanId: args.dateSpanId });
  },
});