import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (role === "admin") {
          setUser({
            username: "Admin",
            email: "admin@system",
          });
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch {
        setUser(false);
      }
    };

    fetchUser();
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg hover:bg-gray-200 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      {user && (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-5">
            <div>
              <label className="text-sm text-gray-500">Username</label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full mt-1 p-3 rounded-xl border bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full mt-1 p-3 rounded-xl border bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Role</label>
              <input
                type="text"
                value={role}
                disabled
                className="w-full mt-1 p-3 rounded-xl border bg-gray-100 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;