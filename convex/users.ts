import { query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      id: user._id,
      email: user.email
    }));
  },
});

export const getAvailableUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    // Get all students with assigned users
    const students = await ctx.db
      .query("students")
      .filter((q) => q.neq(q.field("userId"), undefined))
      .collect();
    
    // Get the set of assigned user IDs
    const assignedUserIds = new Set(students.map(s => s.userId));
    
    // Filter out users that are already assigned
    const availableUsers = users.filter(user => !assignedUserIds.has(user._id));
    
    return availableUsers.map(user => ({
      id: user._id,
      email: user.email
    }));
  },
});