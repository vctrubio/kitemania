"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Navbar } from "./components/Navbar";
import { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Navbar />
      <main className="p-8">
        <Content />
      </main>
    </>
  );
}

function Content() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const students = useQuery(api.students.list) ?? [];
  const teachers = useQuery(api.teachers.list) ?? [];
  const lessons = useQuery(api.lessons.list) ?? [];
  const availableUsers = useQuery(api.students.getAvailableUsers) ?? [];
  const allUsers = useQuery(api.users.getAll) ?? [];
  
  const addStudent = useMutation(api.students.add);
  const addTeacher = useMutation(api.teachers.add);
  const addLesson = useMutation(api.lessons.add);

  if (isLoading || students === undefined || teachers === undefined || lessons === undefined || availableUsers === undefined || allUsers === undefined) {
    return (
      <div className="mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">School Management</h1>
      
      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Student Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const fullname = formData.get("fullname") as string;
            const age = formData.get("age") as string;
            const userId = formData.get("userId") as string;

            if (fullname && age) {
              void addStudent({ 
                fullname,
                age: parseInt(age),
                userId: userId ? (userId as Id<"users">) : undefined,
              });
              form.reset();
            }
          }}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <h2 className="text-xl font-semibold">Add Student</h2>
          <input
            name="fullname"
            type="text"
            placeholder="Enter full name"
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            name="age"
            type="number"
            placeholder="Enter age"
            className="px-4 py-2 border rounded-md"
            required
          />
          <select
            name="userId"
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Select a user (optional)</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Add Student
          </button>
        </form>

        {/* Add Teacher Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const fullname = formData.get("fullname") as string;
            const userId = formData.get("userId") as string;
            const isFreelance = formData.get("isFreelance") === "on";

            if (fullname) {
              void addTeacher({ 
                fullname,
                userId: userId ? (userId as Id<"users">) : undefined,
                isFreelance,
              });
              form.reset();
            }
          }}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <h2 className="text-xl font-semibold">Add Teacher</h2>
          <input
            name="fullname"
            type="text"
            placeholder="Enter teacher's full name"
            className="px-4 py-2 border rounded-md"
            required
          />
          <select
            name="userId"
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Select a user (optional)</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input
              name="isFreelance"
              type="checkbox"
              className="rounded"
            />
            Freelance
          </label>
          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Add Teacher
          </button>
        </form>

        {/* Book Lesson Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const teacherId = formData.get("teacherId") as string;
            const studentIds = formData.getAll("studentIds") as string[];
            const price = formData.get("price") as string;
            const hours = formData.get("hours") as string;

            if (teacherId && studentIds.length > 0 && price && hours) {
              void addLesson({ 
                teacherId: teacherId as Id<"teachers">,
                studentIds: studentIds as Id<"students">[],
                price: parseFloat(price),
                hours: parseFloat(hours),
              });
              form.reset();
            }
          }}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <h2 className="text-xl font-semibold">Book a Lesson</h2>
          <select
            name="teacherId"
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullname} {teacher.isFreelance ? "(Freelance)" : ""}
              </option>
            ))}
          </select>
          <select
            name="studentIds"
            className="px-4 py-2 border rounded-md"
            multiple
            required
          >
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullname} (Age: {student.age})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="px-4 py-2 border rounded-md flex-1"
              required
            />
            <input
              name="hours"
              type="number"
              placeholder="Hours"
              className="px-4 py-2 border rounded-md flex-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Book Lesson
          </button>
        </form>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Students List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Students</h2>
          {students.length === 0 ? (
            <p>No students yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {students.map((student) => {
                const assignedUser = allUsers.find(u => u.id === student.userId);
                return (
                  <div 
                    key={student._id} 
                    className="p-4 border rounded-md"
                  >
                    <p>Name: {student.fullname}</p>
                    <p>Age: {student.age}</p>
                    <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Teachers List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Teachers</h2>
          {teachers.length === 0 ? (
            <p>No teachers yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {teachers.map((teacher) => {
                const assignedUser = allUsers.find(u => u.id === teacher.userId);
                return (
                  <div 
                    key={teacher._id} 
                    className="p-4 border rounded-md"
                  >
                    <p>Name: {teacher.fullname}</p>
                    <p>Status: {teacher.isFreelance ? "Freelance" : "Full-time"}</p>
                    <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lessons List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Lessons</h2>
          {lessons.length === 0 ? (
            <p>No lessons booked yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {lessons.map((lesson) => {
                const teacher = teachers.find(t => t._id === lesson.teacherId);
                return (
                  <div 
                    key={lesson._id} 
                    className="p-4 border rounded-md"
                  >
                    <p>Teacher: {teacher?.fullname}</p>
                    <p>Price: ${lesson.price}</p>
                    <p>Hours: {lesson.hours}</p>
                    <LessonStudents lessonId={lesson._id} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonStudents({ lessonId }: { lessonId: Id<"lessons"> }) {
  const students = useQuery(api.lessonEnrollments.getStudentsForLesson, { lessonId }) ?? [];
  
  return (
    <div className="mt-2">
      <p className="font-semibold">Enrolled Students:</p>
      {students.length === 0 ? (
        <p>No students enrolled</p>
      ) : (
        <ul className="list-disc list-inside">
          {students.map((student) => (
            student && <li key={student._id}>{student.fullname}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
