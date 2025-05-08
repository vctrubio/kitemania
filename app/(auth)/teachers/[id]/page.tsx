'use client'
import { TeacherView } from "@/components/view/TeacherView";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

export default function TeacherPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use() to handle both Promise and direct access
  const resolvedParams = 'then' in params ? React.use(params) : params;
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <TeacherView teacherId={resolvedParams.id as Id<"teachers">} />
    </div>
  );
}