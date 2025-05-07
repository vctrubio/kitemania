import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

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

  packages: defineTable({
    capacity: v.int64(),
    price: v.int64(),
    hours: v.int64(),
  }),

  bookings: defineTable({
    packageId: v.id("packages"),
    students: v.array(v.id("students")),
    //add start date, and duration. might consider the dateStruct : MyDate
  }),

  bookingEnrollments: defineTable({
    bookingId: v.id("bookings"),
    studentId: v.id("students"),
  })
    .index("by_booking", ["bookingId"])
    .index("by_student", ["studentId"]),

  lessons: defineTable({
    bookingId: v.id("bookings"),
    teacherId: v.optional(v.id("teachers")),
    isCompleted: v.boolean(),
    isPaid: v.boolean(),
    sessionIds: v.array(v.id("sessions")),
    paymentIds: v.array(v.id("payments")),
  }),

  payments: defineTable({
    cash: v.boolean(),
    total: v.int64(),
    // Optionally, you can add a lessonId or bookingId reference if needed
  }),

  sessions: defineTable({
    equipmentSetIds: v.array(v.id("equipmentSet")),
    durationHours: v.int64(),
    date: v.string(), // ISO date string
  }),

  equipmentSet: defineTable({
    kiteId: v.id("kites"),
    barId: v.id("bars"),
    boardId: v.id("boards"),
    notes: v.optional(v.string()),
  }),

  kites: defineTable({
    model: v.string(),
    size: v.number(),
  }),
  bars: defineTable({
    model: v.string(),
    size: v.number(),
  }),
  boards: defineTable({
    model: v.string(),
    size: v.number(),
  }),
});
