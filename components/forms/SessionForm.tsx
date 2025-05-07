import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function SessionForm() {
  const addSession = useMutation(api.sessions.createSession);
  const students = useQuery(api.students.list) ?? [];
  const teachers = useQuery(api.teachers.list) ?? [];
  const equipmentSets = useQuery(api.equipment.listEquipmentSets) ?? [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        void addSession({
          studentId: formData.get("studentId") as Id<"students">,
          teacherId: formData.get("teacherId") ? (formData.get("teacherId") as Id<"teachers">) : undefined,
          equipmentSetIds: formData.getAll("equipmentSetIds") as Id<"equipmentSet">[],
        });
        form.reset();
      }}
      className="flex flex-col gap-4 p-4 border rounded-lg"
    >
      <h2 className="text-xl font-semibold">Add Session</h2>
      <select name="studentId" className="px-4 py-2 border rounded-md" required>
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student._id} value={student._id}>
            {student.fullname}
          </option>
        ))}
      </select>
      <select name="teacherId" className="px-4 py-2 border rounded-md">
        <option value="">Select Teacher (Optional)</option>
        {teachers.map((teacher) => (
          <option key={teacher._id} value={teacher._id}>
            {teacher.fullname}
          </option>
        ))}
      </select>
      <select name="equipmentSetIds" className="px-4 py-2 border rounded-md" multiple required>
        {equipmentSets.map((set) => (
          <option key={set.id} value={set.id}>
            {set.name} - {set.kite?.model} ({set.kite?.size}m)
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
      >
        Add Session
      </button>
    </form>
  );
}
