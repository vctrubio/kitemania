"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";

export default function EquipmentPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-8">Equipment Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <KiteFormAndList />
          <BarFormAndList />
          <BoardFormAndList />
        </div>
      </main>
    </>
  );
}

function KiteFormAndList() {
  const kites = useQuery(api.equipment.listKites) ?? [];
  const createKite = useMutation(api.equipment.createKite);
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Add Kite</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          createKite({
            model: formData.get("model") as string,
            size: Number(formData.get("size")),
          });
          form.reset();
        }}
        className="flex flex-col gap-2"
      >
        <input name="model" type="text" placeholder="Model" className="px-2 py-1 border rounded" required />
        <input name="size" type="number" placeholder="Size (m2)" className="px-2 py-1 border rounded" required />
        <button type="submit" className="bg-foreground text-background rounded px-4 py-2 mt-2">Add Kite</button>
      </form>
      <h3 className="font-medium mt-4">Kites</h3>
      <ul className="flex flex-col gap-1">
        {kites.map(kite => (
          <li key={kite._id} className="border rounded p-2">
            {kite.model} ({kite.size}m)
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarFormAndList() {
  const bars = useQuery(api.equipment.listBars) ?? [];
  const createBar = useMutation(api.equipment.createBar);
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Add Bar</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          createBar({
            model: formData.get("model") as string,
            size: Number(formData.get("size")),
          });
          form.reset();
        }}
        className="flex flex-col gap-2"
      >
        <input name="model" type="text" placeholder="Model" className="px-2 py-1 border rounded" required />
        <input name="size" type="number" placeholder="Size (cm)" className="px-2 py-1 border rounded" required />
        <button type="submit" className="bg-foreground text-background rounded px-4 py-2 mt-2">Add Bar</button>
      </form>
      <h3 className="font-medium mt-4">Bars</h3>
      <ul className="flex flex-col gap-1">
        {bars.map(bar => (
          <li key={bar._id} className="border rounded p-2">
            {bar.model} ({bar.size}cm)
          </li>
        ))}
      </ul>
    </div>
  );
}

function BoardFormAndList() {
  const boards = useQuery(api.equipment.listBoards) ?? [];
  const createBoard = useMutation(api.equipment.createBoard);
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Add Board</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          createBoard({
            model: formData.get("model") as string,
            size: Number(formData.get("size")),
          });
          form.reset();
        }}
        className="flex flex-col gap-2"
      >
        <input name="model" type="text" placeholder="Model" className="px-2 py-1 border rounded" required />
        <input name="size" type="number" placeholder="Size (cm)" className="px-2 py-1 border rounded" required />
        <button type="submit" className="bg-foreground text-background rounded px-4 py-2 mt-2">Add Board</button>
      </form>
      <h3 className="font-medium mt-4">Boards</h3>
      <ul className="flex flex-col gap-1">
        {boards.map(board => (
          <li key={board._id} className="border rounded p-2">
            {board.model} ({board.size}cm)
          </li>
        ))}
      </ul>
    </div>
  );
}
