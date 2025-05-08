import React, { useRef } from "react";
import { addDays, format } from "date-fns";

interface DateSpanPickerProps {
  onChange: (dateSpan: { start: string; end: string } | undefined) => void;
  initialStart?: string;
  initialEnd?: string;
  className?: string;
}

export function DateSpanPicker({
  onChange,
  initialStart,
  initialEnd,
  className = "",
}: DateSpanPickerProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Set default value for start date to today
  const today = React.useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  React.useEffect(() => {
    if (startRef.current) {
      startRef.current.value = initialStart || today;
    }
    if (endRef.current) {
      endRef.current.value = initialEnd || today;
    }
  }, [today, initialStart, initialEnd]);

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
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">Start Date</label>
        <input
          name="start"
          type="date"
          ref={startRef}
          defaultValue={initialStart || today}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">End Date</label>
        <div className="flex items-center gap-2">
          <input
            name="end"
            type="date"
            ref={endRef}
            defaultValue={initialEnd || today}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-1">
            <button
              type="button"
              className="px-3 py-2 border rounded hover:bg-gray-100"
              onClick={() => changeEndDateBy(-1)}
              tabIndex={-1}
              title="Subtract one day"
            >
              -
            </button>
            <button
              type="button"
              className="px-3 py-2 border rounded hover:bg-gray-100"
              onClick={() => changeEndDateBy(1)}
              tabIndex={-1}
              title="Add one day"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}