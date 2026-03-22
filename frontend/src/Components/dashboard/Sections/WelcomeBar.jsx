import React from "react";
import { CalendarDays } from "lucide-react";

const WelcomeBar = () => {
  const userName = localStorage.getItem("username") || "User";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-8 mt-6 bg-white border border-slate-200 rounded-3xl px-8 py-6 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {getGreeting()},{" "}
          <span className="text-blue-600">{userName}</span>
        </h2>

        <p className="text-slate-500 mt-2 text-sm font-medium">
          Here's a quick overview of your activity today.
        </p>
      </div>

      <div className="flex items-center gap-3 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-medium">
        <CalendarDays size={18} className="text-blue-600" />
        <span>{today}</span>
      </div>
    </div>
  );
};

export default WelcomeBar;