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
    sessionIds: v.array(v.id("sessions")),
    paymentIds: v.array(v.id("payments")),
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
    sessionIds: v.optional(v.array(v.id("sessions"))),
    paymentIds: v.optional(v.array(v.id("payments"))),
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