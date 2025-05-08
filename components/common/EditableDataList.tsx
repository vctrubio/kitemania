'use client'
import { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaSort, FaSortUp, FaSortDown, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  onDelete?: (id: T['_id']) => Promise<void>;
  getEditState: (item: T) => any;
  onSearch?: (term: string) => void; // Optional if filtering is handled externally
  searchTerm?: string;
  searchPlaceholder?: string;
  editingItemId: T['_id'] | null;
  editState: any;
  onEditStateChange: (newState: any) => void;
  viewRoute?: string; // The base route for viewing items, e.g., "students" or "teachers"
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
  onDelete,
  getEditState,
  searchTerm = '',
  searchPlaceholder = 'Search...',
  onSearch,
  editingItemId,
  editState,
  onEditStateChange,
  viewRoute
}: EditableDataListProps<T, K>) {
  const router = useRouter();
  const [sortField, setSortField] = useState<K | undefined>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<T['_id'] | null>(null);
  const [animateSortField, setAnimateSortField] = useState<K | null>(null);

  // Function to handle sort
  const handleSort = (field: K) => {
    setAnimateSortField(field);
    
    // Reset animation after it completes
    setTimeout(() => setAnimateSortField(null), 500);
    
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort the items based on the current sort field and direction
  const sortedItems = [...items].sort((a, b) => {
    if (!sortField) return 0;
    
    const column = columns.find(col => col.key === sortField);
    if (!column) return 0;
    
    // Get values to compare - we'll use the rendered cell content as a string for comparison
    // This works for simple cases, but may need customization for complex data types
    const aValue = getSortableValue(a, column, getEditState);
    const bValue = getSortableValue(b, column, getEditState);
    
    // Compare values based on sort direction
    const compareResult = compareValues(aValue, bValue);
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });

  // Helper function to get a sortable value from an item
  function getSortableValue(item: T, column: Column<T, K>, getEditState: (item: T) => any): any {
    // Try to get a simple value first (for basic types like strings, numbers)
    const basicValue = (item as any)[column.key];
    if (basicValue !== undefined && basicValue !== null) return basicValue;
    
    // For more complex cases, render the cell to a string and use that for comparison
    // This is a simple approach that might not work for all cases
    const mockOnChange = () => {};
    const renderedContent = column.renderCell(item, false, getEditState(item), mockOnChange);
    
    // If it's a React element, try to get its textContent
    if (renderedContent && typeof renderedContent === 'object' && 'props' in renderedContent) {
      // For spans and divs, get the children as text
      if ('children' in renderedContent.props) {
        return String(renderedContent.props.children || '');
      }
    }
    
    return String(renderedContent || '');
  }

  // Helper function to compare any two values
  function compareValues(a: any, b: any): number {
    // Handle nulls and undefined
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;
    
    // Handle different types
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b ? 0 : (a ? 1 : -1);
    }
    
    // For dates in string format
    if (isDateString(a) && isDateString(b)) {
      return new Date(a).getTime() - new Date(b).getTime();
    }
    
    // Default to string comparison
    return String(a).localeCompare(String(b));
  }

  // Helper to check if a string is a date
  function isDateString(str: any): boolean {
    if (typeof str !== 'string') return false;
    
    // Simple check for YYYY-MM-DD format
    return /^\d{4}-\d{2}-\d{2}/.test(str);
  }

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

  const handleView = (itemId: T['_id']) => {
    if (viewRoute) {
      router.push(`/${viewRoute}/${itemId}`);
    }
  };

  const handleConfirmDelete = (itemId: T['_id']) => {
    setDeleteConfirmId(itemId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleDelete = async (itemId: T['_id']) => {
    if (!onDelete) return;
    
    try {
      await onDelete(itemId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const getSortIcon = (field: K) => {
    const isAnimating = animateSortField === field;
    const animationClass = isAnimating ? 'animate-bounce' : '';
    
    if (sortField !== field) {
      return <FaSort className={`inline ml-1 text-gray-400 ${animationClass}`} />;
    }
    
    return sortDirection === 'asc' ? 
      <FaSortUp className={`inline ml-1 text-blue-600 ${animationClass}`} /> : 
      <FaSortDown className={`inline ml-1 text-blue-600 ${animationClass}`} />;
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
                <th className="py-2 px-4 border" style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => {
                const isEditing = editingItemId === item._id;
                const isConfirmingDelete = deleteConfirmId === item._id;
                
                return (
                  <tr key={item._id} className={`${isEditing ? 'bg-blue-50' : isConfirmingDelete ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
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
                      ) : isConfirmingDelete ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                            title="Confirm Delete"
                          >
                            <FaTrash />
                          </button>
                          <button 
                            onClick={handleCancelDelete}
                            className="p-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          {viewRoute && (
                            <button 
                              onClick={() => handleView(item._id)}
                              className="p-1 text-white bg-green-500 rounded hover:bg-green-600"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                          )}
                          {onDelete && (
                            <button 
                              onClick={() => handleConfirmDelete(item._id)}
                              className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
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