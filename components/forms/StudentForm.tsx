import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import React, { useRef, useState } from "react";
import { addDays, format } from "date-fns";

// date picker
function DateSpanPicker({
  onChange,
}: {
  onChange: (dateSpan: { start: string; end: string } | undefined) => void;
}) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Set default value for start date to today
  const today = React.useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  React.useEffect(() => {
    if (startRef.current && !startRef.current.value) {
      startRef.current.value = today;
    }
    if (endRef.current && !endRef.current.value) {
      endRef.current.value = today;
    }
  }, [today]);

  function changeEndDateBy(days: number) {
    if (!endRef.current) return;
    const endDate = endRef.current.value || today;
    const newDate = format(addDays(new Date(endDate), days), "yyyy-MM-dd");
    endRef.current.value = newDate;
    handleBlur();
  }

  async function handleBlur() {
    const start = startRef.current?.value ?? "";
    const end = endRef.current?.value ?? "";
    if (start && end) {
      onChange({ start, end });
    } else {
      onChange(undefined);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label>
        Start Date:
        <input
          name="start"
          type="date"
          ref={startRef}
          defaultValue={today}
          onBlur={handleBlur}
          className="px-2 py-1 border rounded-md ml-2"
        />
      </label>
      <label>
        End Date:
        <div className="flex items-center gap-2">
          <input
            name="end"
            type="date"
            ref={endRef}
            defaultValue={today}
            onBlur={handleBlur}
            className="px-2 py-1 border rounded-md ml-2"
          />
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={() => changeEndDateBy(-1)}
            tabIndex={-1}
          >
            -
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded "
            onClick={() => changeEndDateBy(1)}
            tabIndex={-1}
          >
            +
          </button>
        </div>
      </label>
    </div>
  );
}

export function StudentForm() {
  const addStudent = useMutation(api.students.add);
  const addDateSpan = useMutation(api.dateSpans.add);
  const addDateSpanToStudent = useMutation(api.students.addDateSpanToStudent);
  const availableUsers = useQuery(api.students.getAvailableUsers) ?? [];
  const [dateSpan, setDateSpan] = useState<{ start: string; end: string } | undefined>(undefined);
  
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const fullname = formData.get("fullname") as string;
        const age = formData.get("age") as string;
        const userId = formData.get("userId") as string;
        const start = dateSpan?.start;
        const end = dateSpan?.end;

        if (fullname && age) {
          const studentId = await addStudent({
            fullname,
            age: parseInt(age),
            userId: userId ? (userId as Id<"users">) : undefined,
          });
          console.log("Student ID:", studentId);
          
          if (start && end) {
            const newDateSpanId = await addDateSpan({ start, end, studentId: studentId });
            await addDateSpanToStudent({ studentId: studentId, dateSpanId: newDateSpanId });
          }
          form.reset();
          setDateSpan(undefined);
        }
      }}
      className="flex flex-col gap-4 p-4 border rounded-lg"
    >
      <h2 className="text-xl font-semibold">Add Student</h2>
      <input
        name="fullname"
        type="text"
        placeholder="Enter full name"
        className="px-4 py-2 border rounded-md"
        required
      />
      <input
        name="age"
        type="number"
        placeholder="Enter age"
        className="px-4 py-2 border rounded-md"
        required
      />
      <select
        name="userId"
        className="px-4 py-2 border rounded-md"
      >
        <option value="">Select a user (optional)</option>
        {availableUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>
      <DateSpanPicker onChange={setDateSpan} />
      <button
        type="submit"
        className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
      >
        Add Student
      </button>
    </form>
  );
}
