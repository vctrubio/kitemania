import { StudentsList } from "@/components/shows/StudentsList";
export default function StudentsPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <StudentsList />
    </main>
  );
}
