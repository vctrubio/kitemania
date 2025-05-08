'use client'
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DateSpanPicker } from "../forms/DateSpanPicker";
import { Column, EditableDataList } from "../common/EditableDataList";

type Student = {
  _id: Id<"students">;
  fullname: string;
  age: number;
  userId?: Id<"users">;
  dateSpanId?: Id<"dateSpans">;
};

type StudentEditState = {
  fullname: string;
  age: number;
  userId?: Id<"users">;
  dateStart?: string;
  dateEnd?: string;
};

type StudentColumn = 'fullname' | 'age' | 'userId' | 'date';

export function StudentsList() {
  const students = useQuery(api.students.list) ?? [];
  const allUsers = useQuery(api.users.getAll) ?? [];
  const dateSpans = useQuery(api.dateSpans.list) ?? [];
  const availableUsers = useQuery(api.students.getAvailableUsers) ?? [];
  
  const updateStudent = useMutation(api.students.update);
  const addDateSpan = useMutation(api.dateSpans.add);
  const addDateSpanToStudent = useMutation(api.students.addDateSpanToStudent);

  // State for editing
  const [editingStudent, setEditingStudent] = useState<Id<"students"> | null>(null);
  const [editForm, setEditForm] = useState<StudentEditState>({ fullname: "", age: 0 });
  
  // Search filter
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtered students
  const filteredStudents = students.filter(student => 
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.age.toString().includes(searchTerm)
  );

  const handleEdit = (student: Student) => {
    setEditingStudent(student._id);
    const dateSpan = student.dateSpanId
      ? dateSpans.find(ds => ds._id === student.dateSpanId)
      : undefined;
      
    setEditForm({
      fullname: student.fullname,
      age: student.age,
      userId: student.userId,
      dateStart: dateSpan?.start,
      dateEnd: dateSpan?.end,
    });
  };

  const handleCancel = () => {
    setEditingStudent(null);
  };
  
  const handleDateSpanChange = (dateSpan: { start: string; end: string } | undefined) => {
    if (dateSpan) {
      setEditForm(prev => ({
        ...prev,
        dateStart: dateSpan.start,
        dateEnd: dateSpan.end
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        dateStart: undefined,
        dateEnd: undefined
      }));
    }
  };

  const handleSave = async (studentId: Id<"students">, editState: StudentEditState) => {
    try {
      // Update student basic info
      await updateStudent({
        id: studentId,
        fullname: editState.fullname,
        age: editState.age,
        userId: editState.userId
      });
      
      // Handle date span if provided
      if (editState.dateStart && editState.dateEnd) {
        const dateSpanId = await addDateSpan({
          start: editState.dateStart,
          end: editState.dateEnd,
          studentId
        });
        
        await addDateSpanToStudent({
          studentId,
          dateSpanId
        });
      }
      
      // Exit edit mode
      setEditingStudent(null);
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const columns: Column<Student, StudentColumn>[] = [
    {
      key: 'fullname',
      header: 'Name',
      sortable: true,
      renderCell: (student, isEditing, editState, onChange) => {
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
        return student.fullname;
      }
    },
    {
      key: 'age',
      header: 'Age',
      sortable: true,
      width: '100px',
      renderCell: (student, isEditing, editState, onChange) => {
        if (isEditing) {
          return (
            <input
              type="number"
              className="w-full px-2 py-1 border rounded"
              value={editState.age}
              onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
            />
          );
        }
        return student.age;
      }
    },
    {
      key: 'userId',
      header: 'Assigned To',
      renderCell: (student, isEditing, editState, onChange) => {
        const assignedUser = allUsers.find(u => u.id === student.userId);
        
        if (isEditing) {
          return (
            <select
              className="w-full px-2 py-1 border rounded"
              value={editState.userId?.toString() || ""}
              onChange={(e) => onChange('userId', e.target.value ? e.target.value as Id<"users"> : undefined)}
            >
              <option value="">Not assigned</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>{user.email}</option>
              ))}
              {/* Include the currently assigned user if any */}
              {assignedUser && !availableUsers.some(u => u.id === assignedUser.id) && (
                <option key={assignedUser.id} value={assignedUser.id}>{assignedUser.email} (current)</option>
              )}
            </select>
          );
        }
        return assignedUser?.email ?? "Not assigned";
      }
    },
    {
      key: 'date',
      header: 'Date Span',
      sortable: true,
      renderCell: (student, isEditing, editState, onChange) => {
        const dateSpan = student.dateSpanId
          ? dateSpans.find(ds => ds._id === student.dateSpanId)
          : undefined;
          
        if (isEditing) {
          return (
            <DateSpanPicker 
              onChange={handleDateSpanChange} 
              initialStart={editState.dateStart}
              initialEnd={editState.dateEnd}
            />
          );
        }
        
        if (dateSpan) {
          return <span>{dateSpan.start} &ndash; {dateSpan.end}</span>;
        }
        return <span className="text-gray-400">No dates assigned</span>;
      }
    }
  ];

  return (
    <EditableDataList
      title="Students Registry"
      items={filteredStudents}
      columns={columns}
      initialSortField="fullname"
      initialSortDirection="asc"
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      getEditState={(student) => {
        const dateSpan = student.dateSpanId
          ? dateSpans.find(ds => ds._id === student.dateSpanId)
          : undefined;
          
        return {
          fullname: student.fullname,
          age: student.age,
          userId: student.userId,
          dateStart: dateSpan?.start,
          dateEnd: dateSpan?.end,
        };
      }}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder="Search students..."
      editingItemId={editingStudent}
      editState={editForm}
      onEditStateChange={setEditForm}
    />
  );
}
