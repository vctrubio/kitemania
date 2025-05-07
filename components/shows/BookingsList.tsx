import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function BookingsList() {
  const bookings = useQuery(api.bookings.listBookings) ?? [];
  const teachers = useQuery(api.teachers.list) ?? [];
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {bookings.map((booking) => {
            const teacher = teachers.find(t => t._id === booking.teacherId);
            return (
              <div key={booking._id} className="p-4 border rounded-md">
                <p>Teacher: {teacher?.fullname}</p>
                <p>Package: {booking.package.capacity} students, {booking.package.hours}h, ${booking.package.price}</p>
                <p>Start: {booking.startDate}</p>
                <p>Duration: {booking.durationDays} days</p>
                <p>Status: {booking.isCompleted ? "Completed" : "Ongoing"} / {booking.isPaid ? "Paid" : "Unpaid"}</p>
                <p>Payments: {booking.payments.length}</p>
                <p>Sessions: {booking.sessionIds.length}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
