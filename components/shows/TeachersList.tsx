'use client'
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Column, EditableDataList } from "../common/EditableDataList";

type Teacher = {
  _id: Id<"teachers">;
  fullname: string;
  isFreelance: boolean;
};

type TeacherEditState = {
  fullname: string;
  isFreelance: boolean;
};

type TeacherColumn = 'fullname' | 'status';

export function TeachersList() {
  const teachers = useQuery(api.teachers.list) ?? [];
  const updateTeacher = useMutation(api.teachers.update);
  const deleteTeacher = useMutation(api.teachers.remove);

  // State for editing
  const [editingTeacher, setEditingTeacher] = useState<Id<"teachers"> | null>(null);
  const [editForm, setEditForm] = useState<TeacherEditState>({ 
    fullname: "", 
    isFreelance: false
  });
  
  // Search filter
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtered teachers
  const filteredTeachers = teachers.filter(teacher => 
    teacher.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.isFreelance ? "freelance" : "full-time").includes(searchTerm.toLowerCase())
  );
  
  // Apply default sorting only initially (will be overridden by column header clicks)
  const defaultSortedTeachers = [...filteredTeachers].sort((a, b) => {
    // Sort by freelance status (non-freelancers first)
    if (a.isFreelance !== b.isFreelance) {
      return a.isFreelance ? 1 : -1; // Non-freelancers first
    }
    
    // Then sort alphabetically by name
    return a.fullname.localeCompare(b.fullname);
  });

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher._id);
    setEditForm({
      fullname: teacher.fullname,
      isFreelance: teacher.isFreelance,
    });
  };

  const handleCancel = () => {
    setEditingTeacher(null);
  };

  const handleSave = async (teacherId: Id<"teachers">, editState: TeacherEditState) => {
    try {
      // Update teacher basic info
      await updateTeacher({
        id: teacherId,
        fullname: editState.fullname,
        userId: undefined, // Teachers don't have users assigned
        isFreelance: editState.isFreelance
      });
      
      // Exit edit mode
      setEditingTeacher(null);
    } catch (error) {
      console.error("Failed to save teacher:", error);
    }
  };

  const handleDelete = async (teacherId: Id<"teachers">) => {
    try {
      await deleteTeacher({ id: teacherId });
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  const columns: Column<Teacher, TeacherColumn>[] = [
    {
      key: 'fullname',
      header: 'Name',
      sortable: true,
      renderCell: (teacher, isEditing, editState, onChange) => {
        if (isEditing) {
          return (
            <input
              type="text"
              className="w-full px-2 py-1 border rounded"
              value={editState.fullname}
              onChange={(e) => onChange('fullname', e.target.value)}
            />
          );
        }
        return teacher.fullname;
      }
    },
    {
      key: 'status',
      header: 'Employment Status',
      sortable: true,
      renderCell: (teacher, isEditing, editState, onChange) => {
        if (isEditing) {
          return (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded"
                checked={editState.isFreelance}
                onChange={(e) => onChange('isFreelance', e.target.checked)}
              />
              <span>Freelance</span>
            </label>
          );
        }
        return teacher.isFreelance ? "Freelance" : "Full-time";
      }
    }
  ];

  return (
    <EditableDataList
      title="Teachers Registry"
      items={filteredTeachers}
      columns={columns}
      initialSortField="status"
      initialSortDirection="asc"
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      getEditState={(teacher) => ({
        fullname: teacher.fullname,
        isFreelance: teacher.isFreelance,
      })}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder="Search teachers..."
      editingItemId={editingTeacher}
      editState={editForm}
      onEditStateChange={setEditForm}
      viewRoute="teachers"
    />
  );
}
