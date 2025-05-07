/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as bookingEnrollments from "../bookingEnrollments.js";
import type * as bookings from "../bookings.js";
import type * as dateSpans from "../dateSpans.js";
import type * as equipment from "../equipment.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as myFunctions from "../myFunctions.js";
import type * as packages from "../packages.js";
import type * as sessions from "../sessions.js";
import type * as students from "../students.js";
import type * as teachers from "../teachers.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bookingEnrollments: typeof bookingEnrollments;
  bookings: typeof bookings;
  dateSpans: typeof dateSpans;
  equipment: typeof equipment;
  http: typeof http;
  lessons: typeof lessons;
  myFunctions: typeof myFunctions;
  packages: typeof packages;
  sessions: typeof sessions;
  students: typeof students;
  teachers: typeof teachers;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
