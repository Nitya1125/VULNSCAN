import React from "react";

const StatCard = ({
  target,
  scanDate,
  riskLabel,
  score,
  total = 100,
  critical,
  high,
  medium,
  low,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Latest Scan Overview
      </h3>

      <div className="text-sm text-slate-500 space-y-1.5">
        <p><span className="font-semibold text-slate-700">Target:</span> {target}</p>
        <p><span className="font-semibold text-slate-700">Scan Date:</span> {scanDate}</p>
      </div>

      <div className="mt-5 bg-blue-600 text-white rounded-xl p-4 flex justify-between items-center shadow-md shadow-blue-100">
        <div>
          <p className="font-black uppercase text-xs tracking-wider opacity-90">{riskLabel}</p>
          <p className="text-sm font-medium">Security Assessment</p>
        </div>
        <div className="text-2xl font-black">
          {score}/{total}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-6 text-center">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-red-600 font-bold text-xl">{critical}</p>
          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">Critical</p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-orange-500 font-bold text-xl">{high}</p>
          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">High</p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-yellow-600 font-bold text-xl">{medium}</p>
          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">Medium</p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-emerald-600 font-bold text-xl">{low}</p>
          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">Low</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;