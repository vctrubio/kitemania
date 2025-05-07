"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Navbar } from "./components/Navbar";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
        <Content />
      </main>
    </>
  );
}

function Content() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const students = useQuery(api.students.list) ?? [];
  const users = useQuery(api.students.getUsers) ?? [];
  const addStudent = useMutation(api.students.add);
  const [newAge, setNewAge] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  if (isLoading || students === undefined || users === undefined) {
    return (
      <div className="mx-auto">
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Student Management</h1>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Add New Student</h2>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              placeholder="Enter age"
              className="px-4 py-2 border rounded-md"
            />
            <select
              value={selectedUserId ?? ""}
              onChange={(e) => setSelectedUserId(e.target.value || undefined)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Select a user (optional)</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
            onClick={() => {
              if (newAge) {
                void addStudent({ 
                  age: parseInt(newAge),
                  userId: selectedUserId as Id<"users"> | undefined,
                });
                setNewAge("");
                setSelectedUserId(undefined);
              }
            }}
          >
            Add Student
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Student List</h2>
        {students.length === 0 ? (
          <p>No students yet. Add one above!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {students.map((student) => {
              const assignedUser = users.find(u => u.id === student.userId);
              return (
                <div 
                  key={student._id} 
                  className="p-4 border rounded-md"
                >
                  <p>Age: {student.age}</p>
                  <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
