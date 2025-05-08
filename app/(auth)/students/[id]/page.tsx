'use client'
import { StudentView } from "@/components/view/StudentView";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

export default function StudentPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use() to handle both Promise and direct access
  const resolvedParams = 'then' in params ? React.use(params) : params;
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <StudentView studentId={resolvedParams.id as Id<"students">} />
    </div>
  );
}