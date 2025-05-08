'use client'
import { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export type SortDirection = 'asc' | 'desc';

export interface Column<T, K extends string> {
  key: K;
  header: string;
  sortable?: boolean;
  renderCell: (item: T, isEditing: boolean, editState: any, onChange: (field: string, value: any) => void) => React.ReactNode;
  width?: string;
}

interface EditableDataListProps<T extends { _id: any }, K extends string> {
  title: string;
  items: T[];
  columns: Column<T, K>[];
  initialSortField?: K;
  initialSortDirection?: SortDirection;
  onEdit: (item: T) => void;
  onSave: (id: T['_id'], editState: any) => Promise<void>;
  onCancel: () => void;
  getEditState: (item: T) => any;
  onSearch?: (term: string) => void; // Optional if filtering is handled externally
  searchTerm?: string;
  searchPlaceholder?: string;
  editingItemId: T['_id'] | null;
  editState: any;
  onEditStateChange: (newState: any) => void;
}

export function EditableDataList<T extends { _id: any }, K extends string>({
  title,
  items,
  columns,
  initialSortField,
  initialSortDirection = 'asc',
  onEdit,
  onSave,
  onCancel,
  getEditState,
  searchTerm = '',
  searchPlaceholder = 'Search...',
  onSearch,
  editingItemId,
  editState,
  onEditStateChange
}: EditableDataListProps<T, K>) {
  const [sortField, setSortField] = useState<K | undefined>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Function to handle sort
  const handleSort = (field: K) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    onEditStateChange({
      ...editState,
      [field]: value
    });
  };

  const getSortIcon = (field: K) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="inline ml-1" /> : 
      <FaSortDown className="inline ml-1" />;
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-2 sm:mt-0 w-full sm:w-auto">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="px-4 py-2 border rounded w-full"
            value={onSearch ? searchTerm : localSearchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No data available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={String(column.key)}
                    className={`py-2 px-4 border ${column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={column.width ? { width: column.width } : {}}
                  >
                    {column.header} {column.sortable && getSortIcon(column.key)}
                  </th>
                ))}
                <th className="py-2 px-4 border w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isEditing = editingItemId === item._id;
                
                return (
                  <tr key={item._id} className={`${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    {columns.map((column) => (
                      <td key={String(column.key)} className="py-2 px-4 border">
                        {column.renderCell(item, isEditing, editState, handleFieldChange)}
                      </td>
                    ))}
                    <td className="py-2 px-4 border">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onSave(item._id, editState)}
                            className="p-1 text-white bg-green-500 rounded hover:bg-green-600"
                            title="Save"
                          >
                            <FaSave />
                          </button>
                          <button 
                            onClick={onCancel}
                            className="p-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onEdit(item)}
                          className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
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