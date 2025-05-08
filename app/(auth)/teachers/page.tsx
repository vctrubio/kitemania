'use client'
import { useState } from "react";
import { TeachersList } from "@/components/shows/TeachersList";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";

export default function TeachersPage() {
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsAddingTeacher(!isAddingTeacher)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus /> 
            Add Teacher
            {isAddingTeacher ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
          </button>
        </div>
      </div>

      {isAddingTeacher && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-blue-500 animate-slideDown">
          <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
          <TeacherForm onSuccess={() => setIsAddingTeacher(false)} />
        </div>
      )}
      
      <TeachersList />
    </main>
  );
}
