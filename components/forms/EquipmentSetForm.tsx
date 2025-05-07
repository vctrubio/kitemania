import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function EquipmentSetForm() {
  const addEquipmentSet = useMutation(api.equipment.createEquipmentSet);
  const kites = useQuery(api.equipment.listKites) ?? [];
  const bars = useQuery(api.equipment.listBars) ?? [];
  const boards = useQuery(api.equipment.listBoards) ?? [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        void addEquipmentSet({
          name: formData.get("name") as string,
          kiteId: formData.get("kiteId") as string,
          barId: formData.get("barId") as string,
          boardId: formData.get("boardId") as string,
          status: "available",
        });
        form.reset();
      }}
      className="flex flex-col gap-4 p-4 border rounded-lg"
    >
      <h2 className="text-xl font-semibold">Add Equipment Set</h2>
      <input
        name="name"
        type="text"
        placeholder="Set Name"
        className="px-4 py-2 border rounded-md"
        required
      />
      <div className="border-t pt-2">
        <h3 className="font-medium mb-2">Select Kite</h3>
        <select name="kiteId" className="px-4 py-2 border rounded-md mb-2" required>
          <option value="">Select Kite</option>
          {kites.map((kite) => (
            <option key={kite._id} value={kite._id}>
              {kite.brand} {kite.model} ({kite.size}m, {kite.year}) - {kite.condition}
            </option>
          ))}
        </select>
      </div>
      <div className="border-t pt-2">
        <h3 className="font-medium mb-2">Select Bar</h3>
        <select name="barId" className="px-4 py-2 border rounded-md mb-2" required>
          <option value="">Select Bar</option>
          {bars.map((bar) => (
            <option key={bar._id} value={bar._id}>
              {bar.brand} {bar.model} ({bar.size}cm, {bar.year}) - {bar.condition}
            </option>
          ))}
        </select>
      </div>
      <div className="border-t pt-2">
        <h3 className="font-medium mb-2">Select Board</h3>
        <select name="boardId" className="px-4 py-2 border rounded-md mb-2" required>
          <option value="">Select Board</option>
          {boards.map((board) => (
            <option key={board._id} value={board._id}>
              {board.brand} {board.model} ({board.size}cm, {board.year}) - {board.condition}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
      >
        Add Equipment Set
      </button>
    </form>
  );
}
