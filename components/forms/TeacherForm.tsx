import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

interface TeacherFormProps {
  onSuccess?: () => void;
}

export function TeacherForm({ onSuccess }: TeacherFormProps) {
  const addTeacher = useMutation(api.teachers.add);
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
      const isFreelance = formData.get("isFreelance") === "on";

      if (!fullname) {
        setFormError("Name is required");
        setIsSubmitting(false);
        return;
      }

      await addTeacher({
        fullname,
        userId: undefined,
        isFreelance,
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      setFormError("Failed to create teacher. Please try again.");
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
            placeholder="Enter teacher's full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="employment-status" className="text-sm font-medium mb-1 text-gray-700">
            Employment Status
          </label>
          <div className="flex items-center h-10 px-3 py-2 border border-gray-300 rounded-md bg-white">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="employment-status"
                name="isFreelance"
                type="checkbox"
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span>Freelance</span>
            </label>
          </div>
        </div>
      </div>
            
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaSave /> {isSubmitting ? "Saving..." : "Add Teacher"}
        </button>
      </div>
    </form>
  );
}
