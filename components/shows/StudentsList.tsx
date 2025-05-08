'use client'
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { FaEdit, FaSave, FaTimes, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { DateSpanPicker } from "../forms/DateSpanPicker";

type Student = {
  _id: Id<"students">;
  fullname: string;
  age: number;
  userId?: Id<"users">;
  dateSpanId?: Id<"dateSpans">;
};

type SortField = 'fullname' | 'age' | 'date';
type SortDirection = 'asc' | 'desc';

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
  const [editForm, setEditForm] = useState<{
    fullname: string;
    age: number;
    userId?: Id<"users">;
    dateStart?: string;
    dateEnd?: string;
  }>({ fullname: "", age: 0 });
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('fullname');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Search filter
  const [searchTerm, setSearchTerm] = useState("");
  
  // Function to handle sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filtered and sorted students
  const filteredStudents = students
    .filter(student => 
      student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.age.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'fullname') {
        return a.fullname.localeCompare(b.fullname) * modifier;
      } else if (sortField === 'age') {
        return (a.age - b.age) * modifier;
      } else if (sortField === 'date') {
        // Sort by start date if available
        const dateSpanA = a.dateSpanId ? dateSpans.find(ds => ds._id === a.dateSpanId) : undefined;
        const dateSpanB = b.dateSpanId ? dateSpans.find(ds => ds._id === b.dateSpanId) : undefined;
        
        // Handle cases where one or both students don't have date spans
        if (!dateSpanA && !dateSpanB) return 0;
        if (!dateSpanA) return 1 * modifier;
        if (!dateSpanB) return -1 * modifier;
        
        // Compare start dates
        return (dateSpanA.start.localeCompare(dateSpanB.start)) * modifier;
      }
      return 0;
    });

  const startEditing = (student: Student) => {
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

  const cancelEditing = () => {
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

  const saveStudent = async (studentId: Id<"students">) => {
    try {
      // Update student basic info
      await updateStudent({
        id: studentId,
        fullname: editForm.fullname,
        age: editForm.age,
        userId: editForm.userId
      });
      
      // Handle date span if provided
      if (editForm.dateStart && editForm.dateEnd) {
        const dateSpanId = await addDateSpan({
          start: editForm.dateStart,
          end: editForm.dateEnd,
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="inline ml-1" /> : 
      <FaSortDown className="inline ml-1" />;
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold">Students Registry</h2>
        <div className="mt-2 sm:mt-0 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search students..."
            className="px-4 py-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredStudents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No students match your search criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('fullname')}
                >
                  Name {getSortIcon('fullname')}
                </th>
                <th 
                  className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('age')}
                >
                  Age {getSortIcon('age')}
                </th>
                <th className="py-2 px-4 border">Assigned To</th>
                <th 
                  className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('date')}
                >
                  Date Span {getSortIcon('date')}
                </th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const assignedUser = allUsers.find(u => u.id === student.userId);
                const dateSpan = student.dateSpanId
                  ? dateSpans.find(ds => ds._id === student.dateSpanId)
                  : undefined;
                const isEditing = editingStudent === student._id;
                
                return (
                  <tr key={student._id} className={`${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    {isEditing ? (
                      <>
                        <td className="py-2 px-4 border">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.fullname}
                            onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.age}
                            onChange={(e) => setEditForm({...editForm, age: parseInt(e.target.value) || 0})}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <select
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.userId?.toString() || ""}
                            onChange={(e) => setEditForm({...editForm, userId: e.target.value ? e.target.value as Id<"users"> : undefined})}
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
                        </td>
                        <td className="py-2 px-4 border">
                          <DateSpanPicker 
                            onChange={handleDateSpanChange} 
                            initialStart={editForm.dateStart}
                            initialEnd={editForm.dateEnd}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => saveStudent(student._id)}
                              className="p-1 text-white bg-green-500 rounded hover:bg-green-600"
                              title="Save"
                            >
                              <FaSave />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border">{student.fullname}</td>
                        <td className="py-2 px-4 border">{student.age}</td>
                        <td className="py-2 px-4 border">{assignedUser?.email ?? "Not assigned"}</td>
                        <td className="py-2 px-4 border">
                          {dateSpan ? (
                            <span>{dateSpan.start} &ndash; {dateSpan.end}</span>
                          ) : (
                            <span className="text-gray-400">No dates assigned</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border">
                          <button 
                            onClick={() => startEditing(student)}
                            className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
