"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const type = params.type as string;
  const typeName = type === "kites" ? "Kite" : type === "bars" ? "Bar" : "Board";

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/equipment" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Back to Equipment List
        </Link>
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{typeName} Details</h1>
      </div>
      {children}
    </div>
  );
}