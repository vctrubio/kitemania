import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function StudentForm() {
  const addStudent = useMutation(api.students.add);
  const availableUsers = useQuery(api.students.getAvailableUsers) ?? [];

  return (
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
  );
}
