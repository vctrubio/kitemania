import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import { DateSpanPicker } from "./DateSpanPicker";

interface StudentFormProps {
  onSuccess?: () => void;
}

export function StudentForm({ onSuccess }: StudentFormProps) {
  const addStudent = useMutation(api.students.add);
  const addDateSpan = useMutation(api.dateSpans.add);
  const addDateSpanToStudent = useMutation(api.students.addDateSpanToStudent);
  const availableUsers = useQuery(api.users.getAvailableUsers) ?? [];
  const [dateSpan, setDateSpan] = useState<{ start: string; end: string } | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const fullname = formData.get("fullname") as string;
      const age = formData.get("age") as string;
      const userId = formData.get("userId") as string;
      const start = dateSpan?.start;
      const end = dateSpan?.end;

      if (!fullname || !age) {
        setFormError("Name and age are required");
        return;
      }

      const studentId = await addStudent({
        fullname,
        age: parseInt(age),
        userId: userId ? (userId as Id<"users">) : undefined,
      });
      
      if (start && end) {
        const newDateSpanId = await addDateSpan({ start, end, studentId: studentId });
        await addDateSpanToStudent({ studentId: studentId, dateSpanId: newDateSpanId });
      }
      
      form.reset();
      setDateSpan(undefined);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setFormError("Failed to create student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-2xl mx-auto"
    >
      {formError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">{formError}</div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="fullname" className="text-sm font-medium mb-1 text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Enter student's full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="age" className="text-sm font-medium mb-1 text-gray-700">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            placeholder="Enter age"
            min="0"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="userId" className="text-sm font-medium mb-1 text-gray-700">
          Assign to User
        </label>
        <select
          id="userId"
          name="userId"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a user (optional)</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Date Range
        </label>
        <DateSpanPicker onChange={setDateSpan} />
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaSave /> {isSubmitting ? "Saving..." : "Add Student"}
        </button>
      </div>
    </form>
  );
}
