import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lessons").collect();
    return lessons;
  },
});

export const getByTeacher = query({
  args: { teacherId: v.id("teachers") },
  handler: async (ctx, args) => {
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .collect();
    return lessons;
  },
});

export const add = mutation({
  args: {
    teacherId: v.id("teachers"),
    price: v.number(),
    hours: v.number(),
    studentIds: v.array(v.id("students")),
  },
  handler: async (ctx, args) => {
    // Create the lesson first
    const lessonId = await ctx.db.insert("lessons", {
      teacherId: args.teacherId,
      price: args.price,
      hours: args.hours,
    });

    // Create enrollments for each student
    for (const studentId of args.studentIds) {
      await ctx.db.insert("lessonEnrollments", {
        lessonId,
        studentId,
      });
    }

    return lessonId;
  },
}); 