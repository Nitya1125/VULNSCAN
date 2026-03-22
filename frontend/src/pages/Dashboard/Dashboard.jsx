import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/Layout/Sidebar";
import Topbar from "../../Components/dashboard/Layout/Topbar";
import TopStats from "../../Components/dashboard/Sections/TopStats";
import SecurityChart from "../../Components/dashboard/Charts/SecurityChart";

const Dashboard = () => {
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
        console.error(err);
      }
    };

    fetchScans();
  }, []);

  const totalScans = scans.length;
  const totalCritical = scans.reduce((sum, s) => sum + (s.critical || 0), 0);
  const totalHigh = scans.reduce((sum, s) => sum + (s.high || 0), 0);
  const totalMedium = scans.reduce((sum, s) => sum + (s.medium || 0), 0);
  const totalLow = scans.reduce((sum, s) => sum + (s.low || 0), 0);

  const avgScore =
    totalScans > 0
      ? Math.round(
          scans.reduce((sum, s) => sum + (s.securityScore || 0), 0) / totalScans
        )
      : 0;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-0"
        }`}
      >
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-8 space-y-8 overflow-y-auto">
          <TopStats
            totalScans={totalScans}
            avgScore={avgScore}
            critical={totalCritical}
            high={totalHigh}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Security Score Trend
              </h3>

              <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
                {scans.length === 0
                  ? "No scan data yet"
                  : `Latest Score: ${scans[0]?.securityScore || 0}/100`}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Vulnerability Distribution
              </h3>

              <div className="flex justify-center">
                <div className="w-64">
                  <SecurityChart
                    critical={totalCritical}
                    high={totalHigh}
                    medium={totalMedium}
                    low={totalLow}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Recent Scans
              </h3>
              <button
                onClick={() => navigate("/dashboard/history")}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                View all →
              </button>
            </div>

            {scans.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400">
                No scans yet. Start your first scan.
              </div>
            ) : (
              <div className="space-y-3">
                {scans.slice(0, 5).map((scan) => (
                  <div
                    key={scan._id}
                    className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-medium text-slate-700">{scan.targetUrl}</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                      {scan.securityScore}/100
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;