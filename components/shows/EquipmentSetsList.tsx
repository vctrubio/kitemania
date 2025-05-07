import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function EquipmentSetsList() {
  const equipmentSets = useQuery(api.equipment.listEquipmentSets) ?? [];
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Equipment Sets</h2>
      {equipmentSets.length === 0 ? (
        <p>No equipment sets yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {equipmentSets.map((set) => (
            <div key={set.id} className="p-4 border rounded-md">
              <p className="font-medium">{set.name}</p>
              <p>Status: {set.status}</p>
              <div className="mt-2">
                <p className="font-medium">Kite:</p>
                <p>{set.kite?.brand} {set.kite?.model} ({set.kite?.size}m)</p>
                <p>Condition: {set.kite?.condition}</p>
              </div>
              <div className="mt-2">
                <p className="font-medium">Bar:</p>
                <p>{set.bar?.brand} {set.bar?.model} ({set.bar?.size}m)</p>
                <p>Condition: {set.bar?.condition}</p>
              </div>
              <div className="mt-2">
                <p className="font-medium">Board:</p>
                <p>{set.board?.brand} {set.board?.model} ({set.board?.size}m)</p>
                <p>Condition: {set.board?.condition}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
