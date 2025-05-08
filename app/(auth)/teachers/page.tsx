'use client'
import { useState } from "react";
import { TeachersList } from "@/components/shows/TeachersList";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { FaPlus, FaTable } from "react-icons/fa";

export default function TeachersPage() {
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsAddingTeacher(!isAddingTeacher)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${isAddingTeacher ? 'bg-gray-600' : 'bg-blue-600'}`}
          >
            {isAddingTeacher ? (
              <>
                <FaTable /> View Teachers
              </>
            ) : (
              <>
                <FaPlus /> Add Teacher
              </>
            )}
          </button>
        </div>
      </div>

      {isAddingTeacher ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
          <TeacherForm onSuccess={() => setIsAddingTeacher(false)} />
        </div>
      ) : (
        <TeachersList />
      )}
    </main>
  );
}
