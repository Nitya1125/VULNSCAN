import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/Layout/Sidebar";
import Topbar from "../../Components/dashboard/Layout/Topbar";
import { Clock, Search, Trash2, ExternalLink } from "lucide-react";

const ScanHistory = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/scans/my-scans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setScans(data);
      } catch (err) {
        console.error("Error fetching scans:", err);
      }
    };
    fetchScans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scan record?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:5000/api/scans/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScans((prev) => prev.filter((scan) => scan._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-0"
        }`}
      >
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-10 space-y-8 overflow-y-auto max-w-6xl mx-auto w-full">
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Scan History</h1>
              <p className="text-slate-500 mt-1 font-medium">
                Showing {scans.length} historical vulnerability reports
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard/new-scan")}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100"
            >
              <Search size={18} />
              New Scan
            </button>
          </div>

          {scans.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                <Clock size={32} className="text-slate-300" />
              </div>

              <h2 className="text-xl font-bold text-slate-700">
                No Scans Recorded
              </h2>
              <p className="text-slate-400 mt-2 max-w-xs">
                You haven't performed any security scans yet. Start one now to protect your target.
              </p>

              <button
                onClick={() => navigate("/dashboard/new-scan")}
                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white transition px-8 py-3 rounded-xl font-bold shadow-md"
              >
                Start First Scan
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {scans.map((scan) => (
                <div
                  key={scan._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 text-lg">
                        {scan.targetUrl}
                      </p>
                      <ExternalLink size={14} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(scan.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-6">
                    <div className="text-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <p className="text-blue-600 font-black text-xl leading-none">
                        {scan.securityScore}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Score</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center px-2">
                        <p className="text-red-500 font-bold">{scan.critical}</p>
                        <p className="text-[10px] font-bold text-slate-400">CRIT</p>
                      </div>
                      <div className="text-center px-2 border-l border-slate-100">
                        <p className="text-orange-500 font-bold">{scan.high}</p>
                        <p className="text-[10px] font-bold text-slate-400">HIGH</p>
                      </div>
                      <div className="text-center px-2 border-l border-slate-100">
                        <p className="text-amber-500 font-bold">{scan.medium}</p>
                        <p className="text-[10px] font-bold text-slate-400">MED</p>
                      </div>
                      <div className="text-center px-2 border-l border-slate-100">
                        <p className="text-emerald-500 font-bold">{scan.low}</p>
                        <p className="text-[10px] font-bold text-slate-400">LOW</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(scan._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Scan"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;