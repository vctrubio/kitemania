import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TeachersList() {
  const teachers = useQuery(api.teachers.list) ?? [];
  const allUsers = useQuery(api.users.getAll) ?? [];

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Teachers</h2>
      {teachers.length === 0 ? (
        <p>No teachers yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {teachers.map((teacher) => {
            const assignedUser = allUsers.find(u => u.id === teacher.userId);
            return (
              <div key={teacher._id} className="p-4 border rounded-md">
                <p>Name: {teacher.fullname}</p>
                <p>Status: {teacher.isFreelance ? "Freelance" : "Full-time"}</p>
                <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
