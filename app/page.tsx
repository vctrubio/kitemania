"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Navbar />
      <main className="p-8">
        <Content />
      </main>
    </>
  );
}

function Content() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const students = useQuery(api.students.list) ?? [];
  const teachers = useQuery(api.teachers.list) ?? [];
  const lessons = useQuery(api.lessons.listLessons) ?? [];
  const availableUsers = useQuery(api.students.getAvailableUsers) ?? [];
  const allUsers = useQuery(api.users.getAll) ?? [];
  const equipmentSets = useQuery(api.equipment.listEquipmentSets) ?? [];
  const sessions = useQuery(api.sessions.listSessions, {}) ?? [];
  const kites = useQuery(api.equipment.listKites) ?? [];
  const bars = useQuery(api.equipment.listBars) ?? [];
  const boards = useQuery(api.equipment.listBoards) ?? [];
  const bookings = useQuery(api.bookings.listBookings) ?? [];
  
  const addStudent = useMutation(api.students.add);
  const addTeacher = useMutation(api.teachers.add);
  const addLesson = useMutation(api.lessons.createLesson);
  const addEquipmentSet = useMutation(api.equipment.createEquipmentSet);
  const addSession = useMutation(api.sessions.createSession);
  const addBooking = useMutation(api.bookings.createBooking);

  if (isLoading || students === undefined || teachers === undefined || lessons === undefined || 
      availableUsers === undefined || allUsers === undefined || equipmentSets === undefined || 
      sessions === undefined) {
    return (
      <div className="mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">School Management</h1>
      
      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Student Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const fullname = formData.get("fullname") as string;
            const age = formData.get("age") as string;
            const userId = formData.get("userId") as string;

            if (fullname && age) {
              void addStudent({ 
                fullname,
                age: parseInt(age),
                userId: userId ? (userId as Id<"users">) : undefined,
              });
              form.reset();
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
          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Add Student
          </button>
        </form>

        {/* Add Teacher Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const fullname = formData.get("fullname") as string;
            const userId = formData.get("userId") as string;
            const isFreelance = formData.get("isFreelance") === "on";

            if (fullname) {
              void addTeacher({ 
                fullname,
                userId: userId ? (userId as Id<"users">) : undefined,
                isFreelance,
              });
              form.reset();
            }
          }}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <h2 className="text-xl font-semibold">Add Teacher</h2>
          <input
            name="fullname"
            type="text"
            placeholder="Enter teacher's full name"
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
          <label className="flex items-center gap-2">
            <input
              name="isFreelance"
              type="checkbox"
              className="rounded"
            />
            Freelance
          </label>
          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Add Teacher
          </button>
        </form>

        {/* Book Lesson Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const teacherId = formData.get("teacherId") as string;
            const studentIds = formData.getAll("studentIds") as string[];
            const price = formData.get("price") as string;
            const hours = formData.get("hours") as string;

            if (teacherId && studentIds.length > 0 && price && hours) {
              void addLesson({ 
                teacherId: teacherId as Id<"teachers">,
                studentIds: studentIds as Id<"students">[],
                price: parseFloat(price),
                hours: parseFloat(hours),
              });
              form.reset();
            }
          }}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <h2 className="text-xl font-semibold">Book a Lesson</h2>
          <select
            name="teacherId"
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullname} {teacher.isFreelance ? "(Freelance)" : ""}
              </option>
            ))}
          </select>
          <select
            name="studentIds"
            className="px-4 py-2 border rounded-md"
            multiple
            required
          >
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullname} (Age: {student.age})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="px-4 py-2 border rounded-md flex-1"
              required
            />
            <input
              name="hours"
              type="number"
              placeholder="Hours"
              className="px-4 py-2 border rounded-md flex-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Book Lesson
          </button>
        </form>

        {/* Add Equipment Set Form */}
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

        {/* Add Session Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            void addSession({
              studentId: formData.get("studentId") as Id<"students">,
              teacherId: formData.get("teacherId") ? (formData.get("teacherId") as Id<"teachers">) : undefined,
              equipmentSetIds: formData.getAll("equipmentSetIds") as Id<"equipmentSet">[],
            });
            form.reset();
          }}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <h2 className="text-xl font-semibold">Add Session</h2>
          
          <select name="studentId" className="px-4 py-2 border rounded-md" required>
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullname}
              </option>
            ))}
          </select>

          <select name="teacherId" className="px-4 py-2 border rounded-md">
            <option value="">Select Teacher (Optional)</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullname}
              </option>
            ))}
          </select>

          <select name="equipmentSetIds" className="px-4 py-2 border rounded-md" multiple required>
            {equipmentSets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name} - {set.kite?.model} ({set.kite?.size}m)
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          >
            Add Session
          </button>
        </form>

        {/* Create Booking Form */}
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
            // For simplicity, start with no payments and no sessions
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
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Students List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Students</h2>
          {students.length === 0 ? (
            <p>No students yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {students.map((student) => {
                const assignedUser = allUsers.find(u => u.id === student.userId);
                return (
                  <div 
                    key={student._id} 
                    className="p-4 border rounded-md"
                  >
                    <p>Name: {student.fullname}</p>
                    <p>Age: {student.age}</p>
                    <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Teachers List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Teachers</h2>
          {teachers.length === 0 ? (
            <p>No teachers yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {teachers.map((teacher) => {
                const assignedUser = allUsers.find(u => u.id === teacher.userId);
                return (
                  <div 
                    key={teacher._id} 
                    className="p-4 border rounded-md"
                  >
                    <p>Name: {teacher.fullname}</p>
                    <p>Status: {teacher.isFreelance ? "Freelance" : "Full-time"}</p>
                    <p>Assigned to: {assignedUser?.email ?? "Not assigned"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lessons List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Lessons</h2>
          {lessons.length === 0 ? (
            <p>No lessons booked yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {lessons.map((lesson) => {
                const teacher = teachers.find(t => t._id === lesson.teacherId);
                return (
                  <div 
                    key={lesson._id} 
                    className="p-4 border rounded-md"
                  >
                    <p>Teacher: {teacher?.fullname}</p>
                    <p>Price: ${lesson.price}</p>
                    <p>Hours: {lesson.hours}</p>
                    <LessonStudents lessonId={lesson._id} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Equipment Sets List */}
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

        {/* Sessions List */}
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Sessions</h2>
          {sessions.length === 0 ? (
            <p>No sessions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Teacher
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[400px]">
                      Equipment Sets
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {session.student?.fullname}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {session.student?.age}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.teacher ? (
                            <>
                              {session.teacher.fullname}
                              <span className="ml-2 text-xs text-gray-500">
                                {session.teacher.isFreelance ? "(Freelance)" : "(Full-time)"}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500">Not assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-4">
                          {session.equipmentSets.map((set) => (
                            set && (
                              <div key={set.id} className="flex flex-col p-3 border rounded-lg bg-gray-50 min-w-[180px]">
                                <div className="font-medium text-sm">{set.name}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Kite: {set.kite?.brand} {set.kite?.model} ({set.kite?.size}m)</div>
                                  <div>Bar: {set.bar?.brand} {set.bar?.model}</div>
                                  <div>Board: {set.board?.brand} {set.board?.model}</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Status: {set.status}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            // TODO: Implement edit functionality
                            console.log("Edit session:", session.id);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete session:", session.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bookings List */}
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
      </div>
    </div>
  );
}

function LessonStudents({ lessonId }: { lessonId: Id<"lessons"> }) {
  const students = useQuery(api.lessonEnrollments.getStudentsForLesson, { lessonId }) ?? [];
  
  return (
    <div className="mt-2">
      <p className="font-semibold">Enrolled Students:</p>
      {students.length === 0 ? (
        <p>No students enrolled</p>
      ) : (
        <ul className="list-disc list-inside">
          {students.map((student) => (
            student && <li key={student._id}>{student.fullname}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
