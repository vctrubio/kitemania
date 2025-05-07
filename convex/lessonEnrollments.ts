import { query } from "./_generated/server";
import { v } from "convex/values";

export const getStudentsForLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("lessonEnrollments")
      .withIndex("by_lesson", (q) => q.eq("lessonId", args.lessonId))
      .collect();

    const students = await Promise.all(
      enrollments.map(async (enrollment) => {
        return await ctx.db.get(enrollment.studentId);
      })
    );

    return students;
  },
});

export const getLessonsForStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("lessonEnrollments")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    const lessons = await Promise.all(
      enrollments.map(async (enrollment) => {
        return await ctx.db.get(enrollment.lessonId);
      })
    );

    return lessons;
  },
}); 