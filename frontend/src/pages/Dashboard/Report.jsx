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

    // HEADER
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("VulnScan Security Report", 20, 20);

    // BASIC INFO
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Target: ${report.targetUrl}`, 20, 40);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Security Score: ${report.securityScore}/100`, 20, 60);
    doc.text(`Status: Completed`, 20, 70);

    // SUMMARY
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Vulnerability Summary:", 20, 90);

    doc.setFontSize(12);
    doc.text(`Critical: ${report.critical}`, 20, 100);
    doc.text(`High: ${report.high}`, 20, 110);
    doc.text(`Medium: ${report.medium}`, 20, 120);
    doc.text(`Low: ${report.low}`, 20, 130);

    // DETAILS
    doc.setFontSize(14);
    doc.text("Vulnerability Details:", 20, 150);

    let y = 160;

    if (report.vulnerabilities && report.vulnerabilities.length > 0) {
      report.vulnerabilities.forEach((vuln, index) => {

        // Name
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`${index + 1}. ${vuln.name || "Unknown"}`, 20, y);
        y += 6;

        // Severity
        doc.setFontSize(10);
        doc.text(`Severity: ${vuln.risk || "N/A"}`, 20, y);
        y += 6;

        // Description
        const desc = vuln.description || "No description available";
        const splitDesc = doc.splitTextToSize(desc, 170);
        doc.text(splitDesc, 20, y);
        y += splitDesc.length * 5 + 5;

        // Page break
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.setFontSize(12);
      doc.text("No vulnerabilities found.", 20, y);
    }

    // SAVE
    doc.save(`VulnScan_Report_${report._id}.pdf`);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isOpen} />

      <div className={`flex-1 flex flex-col ${isOpen ? "ml-72" : "ml-0"}`}>
        <UserTopbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-10 space-y-8 overflow-y-auto max-w-6xl mx-auto w-full">
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Security Reports</h1>
              <p className="text-slate-500">
                Generate and download detailed reports
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase font-bold">
                <tr>
                  <th className="p-5">Target</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Score</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right">Download</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td className="p-5 font-bold">{report.targetUrl}</td>

                    <td className="p-5">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-5">
                      {report.securityScore}/100
                    </td>

                    <td className="p-5 text-center">
                      <span className="text-green-600 font-bold">
                        Completed
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <button
                        onClick={() => downloadReport(report)}
                        className="bg-black text-white px-4 py-2 rounded"
                      >
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Report;