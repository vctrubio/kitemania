import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function BookingForm() {
  const addBooking = useMutation(api.bookings.createBooking);
  const teachers = useQuery(api.teachers.list) ?? [];

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const teacherId = formData.get("teacherId") as string;
        const capacity = parseInt(formData.get("capacity") as string);
        const price = parseInt(formData.get("price") as string);
        const hours = parseInt(formData.get("hours") as string);
        const startDate = formData.get("startDate") as string;
        const durationDays = parseInt(formData.get("durationDays") as string);
        const isCompleted = formData.get("isCompleted") === "on";
        const isPaid = formData.get("isPaid") === "on";
        void addBooking({
          teacherId,
          package: { capacity, price, hours },
          startDate,
          durationDays,
          isCompleted,
          isPaid,
          payments: [],
          sessionIds: [],
        });
        form.reset();
      }}
      className="flex flex-col gap-4 p-4 border rounded-lg"
    >
      <h2 className="text-xl font-semibold">Create Booking</h2>
      <select name="teacherId" className="px-4 py-2 border rounded-md" required>
        <option value="">Select Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher._id} value={teacher._id}>{teacher.fullname}</option>
        ))}
      </select>
      <input name="capacity" type="number" placeholder="Capacity" className="px-4 py-2 border rounded-md" required />
      <input name="price" type="number" placeholder="Price" className="px-4 py-2 border rounded-md" required />
      <input name="hours" type="number" placeholder="Hours" className="px-4 py-2 border rounded-md" required />
      <input name="startDate" type="date" className="px-4 py-2 border rounded-md" required />
      <input name="durationDays" type="number" placeholder="Duration (days)" className="px-4 py-2 border rounded-md" required />
      <label className="flex items-center gap-2">
        <input name="isCompleted" type="checkbox" className="rounded" />
        Completed
      </label>
      <label className="flex items-center gap-2">
        <input name="isPaid" type="checkbox" className="rounded" />
        Paid
      </label>
      <button type="submit" className="bg-foreground text-background text-sm px-4 py-2 rounded-md">Create Booking</button>
    </form>
  );
}
