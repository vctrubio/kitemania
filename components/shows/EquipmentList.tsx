'use client'
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { FaSort, FaSortUp, FaSortDown, FaPlus } from "react-icons/fa";

type Equipment = {
  _id: string;
  model: string;
  size: number;
};

type SortDirection = 'asc' | 'desc' | 'none';

interface EquipmentCardProps {
  title: string;
  items: Equipment[];
  type: 'kites' | 'bars' | 'boards';
  onCreate: (data: { model: string; size: number }) => void;
  unit: string;
}

function EquipmentCard({ title, items, type, onCreate, unit }: EquipmentCardProps) {
  const [sortField, setSortField] = useState<'model' | 'size'>('model');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [model, setModel] = useState('');
  const [size, setSize] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSort = (field: 'model' | 'size') => {
    if (sortField === field) {
      setSortDirection(prev => {
        if (prev === 'none') return 'asc';
        if (prev === 'asc') return 'desc';
        return 'none';
      });
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: 'model' | 'size') => {
    if (sortField !== field) return <FaSort className="ml-1 text-gray-400" />;
    if (sortDirection === 'asc') return <FaSortUp className="ml-1" />;
    if (sortDirection === 'desc') return <FaSortDown className="ml-1" />;
    return <FaSort className="ml-1 text-gray-400" />;
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortDirection === 'none') return 0;
    
    if (sortField === 'model') {
      return sortDirection === 'asc' 
        ? a.model.localeCompare(b.model) 
        : b.model.localeCompare(a.model);
    } else {
      return sortDirection === 'asc' 
        ? a.size - b.size 
        : b.size - a.size;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      model: model,
      size: Number(size),
    });
    setModel('');
    setSize('');
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          className="bg-blue-600 text-white p-2 rounded-full"
          aria-label={`Add ${title}`}
        >
          <FaPlus />
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input 
            type="text" 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model" 
            className="px-2 py-1 border rounded"
            required 
          />
          <input 
            type="number" 
            value={size} 
            onChange={(e) => setSize(e.target.value)}
            placeholder={`Size (${unit})`} 
            className="px-2 py-1 border rounded"
            required 
          />
          <div className="flex gap-2 mt-2">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
            >
              Add {title}
            </button>
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)}
              className="border border-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th 
                className="py-2 px-2 text-left cursor-pointer"
                onClick={() => handleSort('model')}
              >
                <div className="flex items-center">
                  Model {getSortIcon('model')}
                </div>
              </th>
              <th 
                className="py-2 px-2 text-left cursor-pointer"
                onClick={() => handleSort('size')}
              >
                <div className="flex items-center">
                  Size ({unit}) {getSortIcon('size')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 text-center text-gray-500">
                  No items yet
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">
                    <Link href={`/equipment/${type}/${item._id}`} className="hover:underline text-blue-600">
                      {item.model}
                    </Link>
                  </td>
                  <td className="py-2 px-2">{item.size}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EquipmentList() {
  const kites = useQuery(api.equipment.listKites) ?? [];
  const bars = useQuery(api.equipment.listBars) ?? [];
  const boards = useQuery(api.equipment.listBoards) ?? [];
  
  const createKite = useMutation(api.equipment.createKite);
  const createBar = useMutation(api.equipment.createBar);
  const createBoard = useMutation(api.equipment.createBoard);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Equipment Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <EquipmentCard 
          title="Kites" 
          items={kites} 
          type="kites"
          onCreate={createKite}
          unit="m²" 
        />
        <EquipmentCard 
          title="Bars" 
          items={bars} 
          type="bars"
          onCreate={createBar}
          unit="cm" 
        />
        <EquipmentCard 
          title="Boards" 
          items={boards} 
          type="boards"
          onCreate={createBoard}
          unit="cm" 
        />
      </div>
    </div>
  );
}
