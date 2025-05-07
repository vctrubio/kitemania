import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function TeacherForm() {
  const addTeacher = useMutation(api.teachers.add);
  const availableUsers = useQuery(api.students.getAvailableUsers) ?? [];

  return (
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
  );
}
