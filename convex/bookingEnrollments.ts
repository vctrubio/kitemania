import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listForBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.query("bookingEnrollments").withIndex("by_booking", q => q.eq("bookingId", args.bookingId)).collect();
  },
});

export const listForStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.query("bookingEnrollments").withIndex("by_student", q => q.eq("studentId", args.studentId)).collect();
  },
});

export const addEnrollment = mutation({
  args: {
    bookingId: v.id("bookings"),
    studentId: v.id("students"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookingEnrollments", args);
  },
});

export const removeEnrollment = mutation({
  args: { id: v.id("bookingEnrollments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
