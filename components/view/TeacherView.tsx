'use client'
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TeacherViewProps {
  teacherId: Id<"teachers">;
}

export function TeacherView({ teacherId }: TeacherViewProps) {
  const router = useRouter();
  const teacher = useQuery(api.teachers.getById, { id: teacherId });
  
  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading teacher data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Teacher Details</h1>
        </div>
        <Link 
          href={`/teachers?edit=${teacher._id}`} 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaEdit /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg">{teacher.fullname}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Employment Status</p>
              <p className="text-lg">{teacher.isFreelance ? "Freelance" : "Full-time"}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional sections can be added here as needed */}
      <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Activity</h2>
        <p className="text-gray-400">No recent activity found.</p>
      </div>
    </div>
  );
}