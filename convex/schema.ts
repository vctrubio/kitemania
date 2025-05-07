import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  students: defineTable({
    fullname: v.string(),
    age: v.number(),
    userId: v.optional(v.id("users")),
  }).index("by_userId", ["userId"]),
  teachers: defineTable({
    fullname: v.string(),
    userId: v.optional(v.id("users")),
    isFreelance: v.boolean(),
  }).index("by_userId", ["userId"]),
  lessons: defineTable({
    teacherId: v.id("teachers"),
    price: v.number(),
    hours: v.number(),
  }).index("by_teacher", ["teacherId"]),
  lessonEnrollments: defineTable({
    lessonId: v.id("lessons"),
    studentId: v.id("students"),
  }).index("by_lesson", ["lessonId"])
    .index("by_student", ["studentId"]),
});
