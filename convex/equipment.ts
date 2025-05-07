import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const getEquipmentSet = query({
  args: { id: v.id("equipmentSet") },
  handler: async (ctx, args) => {
    const equipmentSet = await ctx.db.get(args.id);
    if (!equipmentSet) return null;

    const kite = await ctx.db.get(equipmentSet.kiteId);
    const bar = await ctx.db.get(equipmentSet.barId);
    const board = await ctx.db.get(equipmentSet.boardId);

    return {
      id: equipmentSet._id,
      notes: equipmentSet.notes,
      kite,
      bar,
      board,
    };
  },
});

export const listEquipmentSets = query({
  handler: async (ctx) => {
    const equipmentSets = await ctx.db.query("equipmentSet").collect();
    return Promise.all(
      equipmentSets.map(async (set) => {
        const kite = await ctx.db.get(set.kiteId);
        const bar = await ctx.db.get(set.barId);
        const board = await ctx.db.get(set.boardId);
        return {
          id: set._id,
          notes: set.notes,
          kite,
          bar,
          board,
        };
      })
    );
  },
});

// New: List all kites
export const listKites = query({
  handler: async (ctx) => {
    return await ctx.db.query("kites").collect();
  },
});

// New: List all bars
export const listBars = query({
  handler: async (ctx) => {
    return await ctx.db.query("bars").collect();
  },
});

// New: List all boards
export const listBoards = query({
  handler: async (ctx) => {
    return await ctx.db.query("boards").collect();
  },
});

// Mutations
export const createEquipmentSet = mutation({
  args: {
    kiteId: v.id("kites"),
    barId: v.id("bars"),
    boardId: v.id("boards"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipmentSetId = await ctx.db.insert("equipmentSet", {
      kiteId: args.kiteId,
      barId: args.barId,
      boardId: args.boardId,
      notes: args.notes,
    });
    return equipmentSetId;
  },
});

// New: Create a kite
export const createKite = mutation({
  args: {
    model: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("kites", args);
  },
});

// New: Create a bar
export const createBar = mutation({
  args: {
    model: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bars", args);
  },
});

// New: Create a board
export const createBoard = mutation({
  args: {
    model: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("boards", args);
  },
});

export const updateEquipmentSet = mutation({
  args: {
    id: v.id("equipmentSet"),
    notes: v.optional(v.string()),
    kiteModel: v.optional(v.string()),
    kiteSize: v.optional(v.number()),
    barModel: v.optional(v.string()),
    barSize: v.optional(v.number()),
    boardModel: v.optional(v.string()),
    boardSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const equipmentSet = await ctx.db.get(args.id);
    if (!equipmentSet) throw new Error("Equipment set not found");

    if (args.notes) {
      await ctx.db.patch(args.id, {
        notes: args.notes,
      });
    }

    if (args.kiteModel || args.kiteSize) {
      await ctx.db.patch(equipmentSet.kiteId, {
        model: args.kiteModel,
        size: args.kiteSize,
      });
    }

    if (args.barModel || args.barSize) {
      await ctx.db.patch(equipmentSet.barId, {
        model: args.barModel,
        size: args.barSize,
      });
    }

    if (args.boardModel || args.boardSize) {
      await ctx.db.patch(equipmentSet.boardId, {
        model: args.boardModel,
        size: args.boardSize,
      });
    }

    return args.id;
  },
});

export const deleteEquipmentSet = mutation({
  args: { id: v.id("equipmentSet") },
  handler: async (ctx, args) => {
    const equipmentSet = await ctx.db.get(args.id);
    if (!equipmentSet) throw new Error("Equipment set not found");

    await ctx.db.delete(equipmentSet.kiteId);
    await ctx.db.delete(equipmentSet.barId);
    await ctx.db.delete(equipmentSet.boardId);
    await ctx.db.delete(args.id);
  },
});