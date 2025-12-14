import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "./getAllUsers";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 30;

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((res) => setUsers(res.users || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, user_metadata: { ...u.user_metadata, user_role: role } }
            : u
        )
      );
    } catch (err) {
      alert("Error updating role: " + err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // ✅ Pagination logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-300">All Users</h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-[#111]">
          <thead className="bg-(--primary) text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111]">
            {currentUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-800/40">
                {/* Avatar */}
                <td className="px-4 py-3">
                  <img
                    src={u.user_metadata?.avatar_url || "/default-avatar.png"}
                    alt={u.user_metadata?.fullName || "User"}
                    className="w-10 h-10 rounded-full border border-[#222]"
                  />
                </td>

                {/* Name */}
                <td className="px-4 py-3 text-gray-400">
                  {u.user_metadata?.fullName || "N/A"}
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-400">{u.email}</td>

                {/* Role Selector */}
                <td className="px-4 py-3 text-gray-400">
                  <select
                    value={u.user_metadata?.user_role || ""}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-gray-400 rounded px-2 py-1"
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Numbered Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-800 text-gray-400 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-800 text-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
