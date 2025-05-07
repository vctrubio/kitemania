import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
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
  },
  handler: async (ctx, args) => {
    // If a userId is provided, check if it's already assigned
    if (args.userId) {
      const existingStudent = await ctx.db
        .query("students")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
      
      if (existingStudent) {
        throw new Error("This user is already assigned to a student");
      }
    }

    const studentId = await ctx.db.insert("students", {
      fullname: args.fullname,
      age: args.age,
      userId: args.userId,
    });
    return studentId;
  },
}); 