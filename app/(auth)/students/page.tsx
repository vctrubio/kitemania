'use client'
import { useState } from "react";
import { StudentsList } from "@/components/shows/StudentsList";
import { StudentForm } from "@/components/forms/StudentForm";
import { FaPlus, FaTable } from "react-icons/fa";

export default function StudentsPage() {
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsAddingStudent(!isAddingStudent)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${isAddingStudent ? 'bg-gray-600' : 'bg-blue-600'}`}
          >
            {isAddingStudent ? (
              <>
                <FaTable /> View Students
              </>
            ) : (
              <>
                <FaPlus /> Add Student
              </>
            )}
          </button>
        </div>
      </div>

      {isAddingStudent ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
          <StudentForm onSuccess={() => setIsAddingStudent(false)} />
        </div>
      ) : (
        <StudentsList />
      )}
    </main>
  );
}
