import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

function Settings() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [token]);

  // Update settings
  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/auth/update",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile Updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 hover:bg-gray-200 rounded"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>

          <label className="text-sm text-gray-600">Username</label>
          <input
            className="w-full border rounded-lg p-2 mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="text-sm text-gray-600">Email</label>
          <input
            className="w-full border rounded-lg p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Security</h2>

          <label className="text-sm text-gray-600">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border rounded-lg p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default Settings;