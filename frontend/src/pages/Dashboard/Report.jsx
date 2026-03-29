import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/dashboard/Layout/Sidebar";
import UserTopbar from "../../Components/dashboard/Layout/Topbar";
import { jsPDF } from "jspdf";

const Report = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/scans/my-scans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchReports();
  }, []);

  const downloadReport = (report) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("VulnScan Security Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Target: ${report.targetUrl}`, 20, 40);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Score: ${report.securityScore}/100`, 20, 60);

    doc.text("Summary:", 20, 80);
    doc.text(`Critical: ${report.critical}`, 20, 90);
    doc.text(`High: ${report.high}`, 20, 100);
    doc.text(`Medium: ${report.medium}`, 20, 110);
    doc.text(`Low: ${report.low}`, 20, 120);

    let y = 140;
    doc.text("Vulnerabilities:", 20, y);
    y += 10;

    if (report.vulnerabilities && report.vulnerabilities.length > 0) {
      report.vulnerabilities.forEach((v, i) => {
        doc.text(`${i + 1}. ${v.name}`, 20, y);
        y += 6;

        doc.text(`Risk: ${v.risk}`, 20, y);
        y += 6;

        doc.text(`URL: ${v.url}`, 20, y);
        y += 6;

        const desc = v.description || "No description";
        const lines = doc.splitTextToSize(desc, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 5;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save("report.pdf");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={isOpen} />

      <div className={`flex-1 ${isOpen ? "ml-72" : "ml-0"}`}>
        <UserTopbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-10">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>

          <table className="w-full bg-white rounded-xl shadow">
            <thead>
              <tr>
                <th className="p-4">Target</th>
                <th className="p-4">Date</th>
                <th className="p-4">Score</th>
                <th className="p-4">Download</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td className="p-4">{r.targetUrl}</td>
                  <td className="p-4">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">{r.securityScore}</td>
                  <td className="p-4">
                    <button
                      onClick={() => downloadReport(r)}
                      className="bg-black text-white px-3 py-1 rounded"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;