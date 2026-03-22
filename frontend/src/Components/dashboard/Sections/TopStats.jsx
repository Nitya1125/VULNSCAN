import React from "react";
import { Shield, TrendingUp, AlertTriangle } from "lucide-react";

const StatItem = ({ icon, title, value, bgColor, iconColor }) => {
  const Icon = icon;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 hover:border-blue-400/50 hover:shadow-md transition-all duration-300">
      <div className={`p-4 rounded-xl ${bgColor}`}>
        <Icon size={22} className={iconColor} />
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>
    </div>
  );
};

const TopStats = ({ totalScans, avgScore, critical, high }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          VULNSCAN Dashboard
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Security metrics overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatItem
          icon={Shield}
          title="Total Scans"
          value={totalScans}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatItem
          icon={TrendingUp}
          title="Avg Security Score"
          value={`${avgScore}/100`}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatItem
          icon={AlertTriangle}
          title="Critical Issues"
          value={critical}
          bgColor="bg-red-50"
          iconColor="text-red-600"
        />

        <StatItem
          icon={AlertTriangle}
          title="High Issues"
          value={high}
          bgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>
    </div>
  );
};

export default TopStats;