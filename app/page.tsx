"use client";

import { Navbar } from "../components/Navbar";
import { StudentForm } from "../components/forms/StudentForm";
import { TeacherForm } from "../components/forms/TeacherForm";
import { LessonForm } from "../components/forms/LessonForm";
import { EquipmentSetForm } from "../components/forms/EquipmentSetForm";
import { SessionForm } from "../components/forms/SessionForm";
import { BookingForm } from "../components/forms/BookingForm";
import { StudentsList } from "../components/shows/StudentsList";
import { TeachersList } from "../components/shows/TeachersList";
import { LessonsList } from "../components/shows/LessonsList";
import { EquipmentSetsList } from "../components/shows/EquipmentSetsList";
import { SessionsList } from "../components/shows/SessionsList";
import { BookingsList } from "../components/shows/BookingsList";
import { useState, useEffect } from "react";

function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GetHeader() {
  return (
    <div className="flex flex-col gap-1 text-base text-gray-700 mb-4">
      <div>Today wind forecast is <span className="font-semibold">X</span></div>
      <div>Students available is <span className="font-semibold">X</span></div>
      <div>Students without a class yet is <span className="font-semibold">X</span></div>
      <div>Kite gears thats left is <span className="font-semibold">X</span></div>
      <div>Total revenue is <span className="font-semibold">X</span></div>
      <div>Pending payments that are due is <span className="font-semibold">X</span></div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [dateTime, setDateTime] = useState(getCurrentDateTime());
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000 * 60); // update every minute
    return () => clearInterval(interval);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <Navbar />
      <main className="p-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">School Management</h1>
            <span className="text-gray-500 text-lg">{dateTime}</span>
          </div>
          <GetHeader />
          {/* Forms Section */}
          <div className="flex flex-wrap gap-8 [&>*]:min-w-[500px]">
            <StudentForm />
            <TeacherForm />
            <LessonForm />
            <EquipmentSetForm />
            <SessionForm />
            <BookingForm />
          </div>
          {/* Lists Section */}
          <div className="flex flex-wrap gap-8 [&>*]:min-w-[500px]">
            <StudentsList />
            <TeachersList />
            <LessonsList />
            <EquipmentSetsList />
            <SessionsList />
            <BookingsList />
          </div>
        </div>
      </main>
    </>
  );
}
