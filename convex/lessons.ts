import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listLessons = query({
  handler: async (ctx) => {
    return await ctx.db.query("lessons").collect();
  },
});

export const createLesson = mutation({
  args: {
    bookingId: v.id("bookings"),
    teacherId: v.optional(v.id("teachers")),
    isCompleted: v.boolean(),
    isPaid: v.boolean(),
    payments: v.array(v.object({ cash: v.boolean(), total: v.int64() })),
    sessionIds: v.array(v.id("sessions")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lessons", args);
  },
});

export const updateLesson = mutation({
  args: {
    id: v.id("lessons"),
    bookingId: v.optional(v.id("bookings")),
    teacherId: v.optional(v.id("teachers")),
    isCompleted: v.optional(v.boolean()),
    isPaid: v.optional(v.boolean()),
    payments: v.optional(v.array(v.object({ cash: v.boolean(), total: v.int64() }))),
    sessionIds: v.optional(v.array(v.id("sessions"))),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return args.id;
  },
});

export const deleteLesson = mutation({
  args: { id: v.id("lessons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});