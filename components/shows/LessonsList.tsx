import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

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

export function LessonsList() {
  const lessons = useQuery(api.lessons.listLessons) ?? [];
  const teachers = useQuery(api.teachers.list) ?? [];
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons booked yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {lessons.map((lesson) => {
            const teacher = teachers.find(t => t._id === lesson.teacherId);
            return (
              <div key={lesson._id} className="p-4 border rounded-md">
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
  );
}
