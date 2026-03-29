import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/dashboard/Layout/Sidebar";
import Topbar from "../../Components/dashboard/Layout/Topbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

const Comparison = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [scans, setScans] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchScans = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/scans/my-scans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setScans(data);
    };

    fetchScans();
  }, []);

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      }
    }
  };

  const resetSelection = () => setSelected([]);

  const scan1 = scans.find((s) => s._id === selected[0]);
  const scan2 = scans.find((s) => s._id === selected[1]);

  const getChartData = (scan) => [
    { name: "Critical", value: scan?.critical || 0 },
    { name: "High", value: scan?.high || 0 },
    { name: "Medium", value: scan?.medium || 0 },
    { name: "Low", value: scan?.low || 0 },
  ];

  const getBarData = () => [
    { name: "Critical", scan1: scan1?.critical || 0, scan2: scan2?.critical || 0 },
    { name: "High", scan1: scan1?.high || 0, scan2: scan2?.high || 0 },
    { name: "Medium", scan1: scan1?.medium || 0, scan2: scan2?.medium || 0 },
    { name: "Low", scan1: scan1?.low || 0, scan2: scan2?.low || 0 },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={isOpen} />

      <div className={`flex-1 ${isOpen ? "ml-72" : "ml-0"}`}>
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-10 max-w-6xl mx-auto">

          {/* ================= SELECT MODE ================= */}
          {selected.length < 2 && (
            <>
              <h1 className="text-3xl font-bold mb-6">Select 2 Scans</h1>

              <div className="bg-white rounded-xl p-6 shadow">
                {scans.map((scan) => (
                  <div
                    key={scan._id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <div>
                      <p className="font-bold">{scan.targetUrl}</p>
                      <p className="text-sm text-gray-500">
                        Score: {scan.securityScore}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={selected.includes(scan._id)}
                      onChange={() => handleSelect(scan._id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= COMPARISON MODE ================= */}
          {selected.length === 2 && scan1 && scan2 && (
            <>
              <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">Comparison</h1>
                <button
                  onClick={resetSelection}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>

              {/* TABLE */}
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <table className="w-full text-center">
                  <thead>
                    <tr className="border-b">
                      <th>Metric</th>
                      <th>{scan1.targetUrl}</th>
                      <th>{scan2.targetUrl}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["critical", "high", "medium", "low"].map((key) => (
                      <tr key={key} className="border-b">
                        <td className="capitalize">{key}</td>
                        <td>{scan1[key]}</td>
                        <td>{scan2[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BAR CHART */}
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getBarData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scan1" fill="#3b82f6" />
                    <Bar dataKey="scan2" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE */}
              <div className="grid grid-cols-2 gap-6">
                {[scan1, scan2].map((scan, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={getChartData(scan)} dataKey="value">
                          {getChartData(scan).map((entry, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Comparison;