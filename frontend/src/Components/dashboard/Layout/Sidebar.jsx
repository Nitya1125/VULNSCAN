import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Scan,
  History,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", end: true },
    { name: "New Scan", icon: Scan, path: "/dashboard/new-scan" },
    { name: "Scan History", icon: History, path: "/dashboard/history" },
    { name: "Reports", icon: FileText, path: "/dashboard/reports" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];
  
  const user = {
    username: localStorage.getItem("username") || "User",
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72
      bg-white text-slate-800 shadow-xl border-r border-slate-200
      transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          VulnScan
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
          User Dashboard
        </p>
      </div>

      <ul className="p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-semibold ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                    : "hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </ul>

      <div className="absolute bottom-6 left-0 w-full px-5 space-y-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logged in as</p>
          <p className="font-bold text-slate-700 truncate">{user.username}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors p-3 rounded-xl font-bold shadow-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;