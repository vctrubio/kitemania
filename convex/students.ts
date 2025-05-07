import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    return students;
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      id: user._id,
      email: user.email
    }));
  },
});

export const add = mutation({
  args: {
    age: v.number(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const studentId = await ctx.db.insert("students", {
      age: args.age,
      userId: args.userId,
    });
    return studentId;
  },
}); 