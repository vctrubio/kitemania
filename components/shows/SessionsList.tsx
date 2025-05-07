import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SessionsList() {
  const sessions = useQuery(api.sessions.listSessions, {}) ?? [];
  return (
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
  );
}
