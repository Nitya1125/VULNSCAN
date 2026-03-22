import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Google from "../assets/Google-removebg-preview.png";
import VulnScanimg from "../assets/VulnScan.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    if (email === "admin" && password === "admin@123") {
      localStorage.setItem("token", "admin-token");
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", user?.role || "user");
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "User not registered or wrong credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6
bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100"
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <img
            src={VulnScanimg}
            alt="VulnScan"
            className="h-24 w-auto drop-shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
          />

          <p className="text-slate-600 text-xl">
            Web Vulnerability Scanning Platform
          </p>
        </div>

        <div
          className="bg-white/60 backdrop-blur-md
    border border-blue-300
    rounded-2xl
    p-10  
    shadow-2xl
    transition transform hover:scale-[1.02]"
        >
          <h2 className="text-center text-2xl font-semibold text-slate-800 mb-6">
            Sign In
          </h2>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-blue-300
          px-4 py-3 bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition"
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-blue-300
          px-4 py-3 bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600
          hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700
          shadow-lg
          transition transform hover:scale-[1.02]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3
          w-full py-3 rounded-lg
          bg-white border border-slate-300
          hover:bg-slate-100
          font-semibold text-slate-700
          transition"
            >
              <img src={Google} alt="Google" className="h-5 w-5" />
              Sign in with Google
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm text-slate-600">
            <button
              onClick={() => navigate("/forgot")}
              className="hover:text-blue-600 transition"
            >
              Forgot password?
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="hover:text-blue-600 transition"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
