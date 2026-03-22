import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/dashboard/Layout/Sidebar";
import UserTopbar from "../../Components/dashboard/Layout/Topbar";
import { Download, FileText, CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";

const Report = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
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
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };
    fetchReports();
  }, []);

  const downloadReport = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("VulnScan Security Report", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Target: ${report.targetUrl}`, 20, 40);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Security Score: ${report.securityScore}/100`, 20, 60);
    doc.text(`Status: Completed`, 20, 70);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Vulnerability Summary:", 20, 90);
    
    doc.setFontSize(12);
    doc.text(`- Critical Issues: ${report.critical}`, 20, 100);
    doc.text(`- High Issues: ${report.high}`, 20, 110);
    doc.text(`- Medium Issues: ${report.medium}`, 20, 120);
    doc.text(`- Low Issues: ${report.low}`, 20, 130);

    doc.save(`VulnScan_Report_${report._id}.pdf`);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-0"
        }`}
      >
        <UserTopbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-10 space-y-8 overflow-y-auto max-w-6xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Security Reports
              </h1>
              <p className="text-slate-500 font-medium">
                Generate and download detailed vulnerability assessments
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-5">Target Domain</th>
                  <th className="p-5">Scan Date</th>
                  <th className="p-5">Security Score</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right">Download</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FileText size={48} className="mb-4" />
                        <p className="font-bold text-slate-500">No reports found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="p-5 font-bold text-slate-700">
                        {report.targetUrl}
                      </td>

                      <td className="p-5 text-slate-500 font-medium">
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="p-5">
                        <span className="font-black text-blue-600 text-lg">
                          {report.securityScore}
                        </span>
                        <span className="text-slate-300 font-bold text-sm">/100</span>
                      </td>

                      <td className="p-5 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                          <CheckCircle size={14} />
                          Completed
                        </span>
                      </td>

                      <td className="p-5 text-right">
                        <button
                          onClick={() => downloadReport(report)}
                          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-blue-200"
                        >
                          <Download size={14} />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="text-blue-600 mt-1">
               <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              Reports generated here include a summary of critical, high, medium, and low vulnerabilities. For a full technical breakdown including request/response logs, please use the <strong>Detailed Scan View</strong> in the History tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;