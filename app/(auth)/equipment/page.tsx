"use client";

import { useState, useEffect } from "react";
import { EquipmentList } from "../../../components/shows/EquipmentList";

export default function EquipmentPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <main className="p-8">
      <EquipmentList />
    </main>
  );
}
