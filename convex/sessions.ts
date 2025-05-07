import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const getSession = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session) return null;
    return session;
  },
});

export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").collect();
  },
});

// Mutations
export const createSession = mutation({
  args: {
    equipmentSetIds: v.array(v.id("equipmentSet")),
    durationHours: v.int64(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      equipmentSetIds: args.equipmentSetIds,
      durationHours: args.durationHours,
      date: args.date,
    });
  },
});

export const updateSession = mutation({
  args: {
    id: v.id("sessions"),
    equipmentSetIds: v.optional(v.array(v.id("equipmentSet"))),
    durationHours: v.optional(v.int64()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { ...args });
    return args.id;
  },
});

export const deleteSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});