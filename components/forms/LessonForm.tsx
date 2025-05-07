import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function LessonForm() {
  const addLesson = useMutation(api.lessons.createLesson);
  const teachers = useQuery(api.teachers.list) ?? [];
  const students = useQuery(api.students.list) ?? [];

  return (
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
  );
}
