import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VulnScanimg from "../assets/VulnScan.png";

const Signup = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
          role: "user"
        }
      );

      alert(res.data.message);
      navigate("/");

    } catch (error) {

      alert(error.response?.data?.message || "Signup failed");

    }
  };

  return (

<div className="min-h-screen flex items-center justify-center px-6
bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100">

  <div className="w-full max-w-md">

    <div className="flex flex-col items-center mb-12">

      <img
        src={VulnScanimg}
        alt="VulnScan"
        className="h-24 w-auto drop-shadow-[0_12px_35px_rgba(59,130,246,0.35)]"
      />

      <p className="text-slate-600 text-xl mt-1">
        Web Vulnerability Scanning Platform
      </p>

    </div>

    <div className="bg-white/70 backdrop-blur-xl
    border border-blue-200
    rounded-2xl
    p-10
    shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

      <h2 className="text-center text-2xl font-semibold text-slate-800 mb-7">
        Create Account
      </h2>

      <form onSubmit={handleSignup} className="space-y-5">

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full rounded-lg border border-blue-300
          px-4 py-3 bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
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
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-blue-300
          px-4 py-3 bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600
          hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700
          shadow-lg
          transition transform hover:scale-[1.02]"
        >
          Sign Up
        </button>

      </form>

      <div className="mt-6 text-center text-sm text-slate-600">

        <button
          onClick={()=>navigate("/")}
          className="hover:text-blue-600 transition"
        >
          Already have an account? Login
        </button>

      </div>

    </div>

  </div>

</div>

  );
};

export default Signup;