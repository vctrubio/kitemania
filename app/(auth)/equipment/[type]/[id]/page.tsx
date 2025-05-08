"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function EquipmentDetailPage() {
  const params = useParams();
  const type = params.type as string;
  const id = params.id as Id<"kites" | "bars" | "boards">;
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  // Use the appropriate query based on equipment type
  const kiteData = useQuery(api.equipment.getKite, 
    type === "kites" ? { id: id as Id<"kites"> } : "skip");
  const barData = useQuery(api.equipment.getBar, 
    type === "bars" ? { id: id as Id<"bars"> } : "skip");
  const boardData = useQuery(api.equipment.getBoard, 
    type === "boards" ? { id: id as Id<"boards"> } : "skip");
  
  if (!mounted) return null;

  // Determine which data to use based on equipment type
  let equipmentDetail;
  if (type === "kites") {
    equipmentDetail = kiteData;
  } else if (type === "bars") {
    equipmentDetail = barData;
  } else if (type === "boards") {
    equipmentDetail = boardData;
  }
  
  const unit = type === "kites" ? "m²" : "cm";

  if (!equipmentDetail) {
    return (
      <div className="p-8 bg-white rounded-lg shadow">
        <p>Loading equipment details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{equipmentDetail.model}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">ID</p>
            <p className="font-medium">{id}</p>
          </div>
          <div>
            <p className="text-gray-600">Size</p>
            <p className="font-medium">{equipmentDetail.size} {unit}</p>
          </div>
          <div>
            <p className="text-gray-600">Model</p>
            <p className="font-medium">{equipmentDetail.model}</p>
          </div>
        </div>
      </div>
      
      {/* Placeholder for future relationships */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Related Items</h3>
        <p className="text-gray-500">No related items to display yet.</p>
      </div>
    </div>
  );
}