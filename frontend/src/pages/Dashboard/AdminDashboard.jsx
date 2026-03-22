import React, { useEffect, useState } from "react";
import axios from "axios";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);

        let scans = 0;
        res.data.forEach((u) => (scans += u.scanCount || 0));

        setStats({
          totalUsers: res.data.length,
          totalScans: scans,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirm = window.confirm("Delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
  

        <div className="p-10 overflow-y-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            Admin Dashboard
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <p className="text-sm text-slate-500">Total Users</p>
              <h2 className="text-3xl font-bold text-blue-600">
                {stats.totalUsers}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <p className="text-sm text-slate-500">Total Scans</p>
              <h2 className="text-3xl font-bold text-indigo-600">
                {stats.totalScans}
              </h2>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Username</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Scans</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {user.username}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold
${
  user.role === "admin"
    ? "bg-purple-100 text-purple-700"
    : "bg-green-100 text-green-700"
}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">{user.scanCount || 0}</td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  );
};

export default AdminDashboard;
