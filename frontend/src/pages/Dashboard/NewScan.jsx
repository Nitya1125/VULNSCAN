import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/dashboard/Layout/Sidebar";
import Topbar from "../../Components/dashboard/Layout/Topbar";
import { Globe, Search } from "lucide-react";

const NewScan = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [target, setTarget] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const quickUrls = [
    "https://example.com",
    "https://testphp.vulnweb.com",
    "https://demo.testfire.net",
  ];

  const saveScan = async (scanData) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/scans/save",
        {
          targetUrl: target,
          securityScore: scanData.score,
          critical: scanData.summary?.critical || 0,
          high: scanData.summary?.high || 0,
          medium: scanData.summary?.medium || 0,
          low: scanData.summary?.low || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Failed to save scan", error);
    }
  };

  const startScan = async () => {
    if (!target) return alert("Please enter a target URL");

    try {
      setIsScanning(true);
      setProgress(10);
      setResult(null);

      const response = await fetch("http://localhost:5000/api/zap/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target }),
      });

      setProgress(60);

      const data = await response.json();

      setProgress(100);
      setIsScanning(false);

      setResult(data);

      await saveScan(data);
    } catch (error) {
      console.error("Scan failed:", error);
      setIsScanning(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-72" : "ml-0"}`}
      >
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-12 flex flex-col items-center overflow-y-auto">
          <div className="w-full max-w-3xl mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              New Vulnerability Scan
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Enter a whitelisted URL to begin security assessment
            </p>
          </div>

          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Target URL
              </label>

              <div className="relative mt-3">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="https://example.com"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                Quick select (demo)
              </p>

              <div className="flex flex-wrap gap-2">
                {quickUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setTarget(url)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startScan}
              disabled={isScanning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              <Search size={18} />
              {isScanning ? "Scanning System..." : "Start Security Scan"}
            </button>

            {isScanning && (
              <div className="mt-4">
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm font-bold text-blue-600 mt-3 animate-pulse">
                  Scan in progress: {progress}%
                </p>
              </div>
            )}
          </div>

          {result && (
            <div className="w-full max-w-5xl mt-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Scan Report Generated
                </h2>
                <p className="text-slate-500 text-sm">Target: {target}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">
                  Overall Security Score
                </p>

                <span className="text-4xl font-black text-blue-600">
                  {result?.score ?? 0}
                  <span className="text-slate-300 text-2xl">/100</span>
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                  <p className="text-orange-600 font-black text-2xl">
                    {result?.summary?.high ?? 0}
                  </p>
                  <p className="text-xs font-bold text-orange-400 uppercase">
                    High
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                  <p className="text-amber-600 font-black text-2xl">
                    {result?.summary?.medium ?? 0}
                  </p>
                  <p className="text-xs font-bold text-amber-500 uppercase">
                    Medium
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                  <p className="text-emerald-600 font-black text-2xl">
                    {result?.summary?.low ?? 0}
                  </p>
                  <p className="text-xs font-bold text-emerald-500 uppercase">
                    Low
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Vulnerabilities Found
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Vulnerability</th>
                        <th className="px-4 py-3 text-left">Risk</th>
                        <th className="px-4 py-3 text-left">URL</th>
                        <th className="px-4 py-3 text-left">Parameter</th>
                      </tr>
                    </thead>

                    <tbody>
                      {result?.vulnerabilities?.map((vuln, index) => (
                        <tr key={index} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {vuln.name}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold
                        ${
                          vuln.risk === "High"
                            ? "bg-red-100 text-red-600"
                            : vuln.risk === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-600"
                        }`}
                            >
                              {vuln.risk}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-slate-500 break-all">
                            {vuln.url}
                          </td>

                          <td className="px-4 py-3 text-slate-500">
                            {vuln.parameter || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewScan;
