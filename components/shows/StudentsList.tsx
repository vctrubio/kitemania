import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function StudentsList() {
  const students = useQuery(api.students.list) ?? [];
  const allUsers = useQuery(api.users.getAll) ?? [];

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Students</h2>
      {students.length === 0 ? (
        <p>No students yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {students.map((student) => {
            const assignedUser = allUsers.find(u => u.id === student.userId);
            return (
              <div key={student._id} className="p-4 border rounded-md">
                <p>Name: {student.fullname}</p>
                <p>Age: {student.age}</p>
                <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
