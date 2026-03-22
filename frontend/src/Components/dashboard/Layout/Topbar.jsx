import React, { useState } from "react";
import { Menu, Bell, User, LogOut, Search} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTopbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const userName = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleSearchBar = () =>{
    navigate("/dashboard/new-scan")
  }
  return (
    <div className="w-full px-8 py-5 flex items-center justify-between bg-white text-slate-800 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-5">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          onClick={handleSearchBar}
          placeholder="New Scan   "
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
        />
          <Search size={45}/>

        <div
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-100 px-3 py-1.5 rounded-xl transition"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-100">
            <User size={18} />
          </div>

          <span className="text-sm font-bold text-slate-700">{userName}</span>
        </div>

        {openMenu && (
          <div className="absolute right-0 top-14 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => {
                navigate("/dashboard/profile");
                setOpenMenu(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium transition"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-2 text-red-600 font-bold border-t border-slate-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTopbar;
