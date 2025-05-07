import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listBookings = query({
  handler: async (ctx) => {
    return await ctx.db.query("bookings").collect();
  },
});

export const getBooking = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) return null;
    return booking;
  },
});

export const createBooking = mutation({
  args: {
    packageId: v.id("packages"),
    students: v.array(v.id("students")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", args);
  },
});

export const updateBooking = mutation({
  args: {
    id: v.id("bookings"),
    packageId: v.optional(v.id("packages")),
    students: v.optional(v.array(v.id("students"))),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return args.id;
  },
});

export const deleteBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
