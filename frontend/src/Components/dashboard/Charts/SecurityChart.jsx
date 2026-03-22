import React from "react";
import {Chart as ChartJS, ArcElement,Tooltip,Legend,} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const SecurityChart = ({
  critical = 0, 
  high = 0,
  medium = 0,
  low = 0,
}) => {
  const data = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        data: [critical, high, medium, low],
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#facc15",
          "#22c55e",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#d1d5db",
          boxWidth: 14,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="w-72">
        <Doughnut data={data} options={options} />
      </div>

    </div>
  );
};

export default SecurityChart;