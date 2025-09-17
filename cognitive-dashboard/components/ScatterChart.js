import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export default function ScatterChart({ students }) {
  const data = {
    datasets: [
      {
        label: "Attention vs Score",
        data: students.map(s => ({ x: s.attention, y: s.assessment_score })),
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Attention vs Assessment Score" }
    },
    scales: {
      x: { title: { display: true, text: "Attention" } },
      y: { title: { display: true, text: "Assessment Score" } }
    }
  };

  return <Scatter data={data} options={options} />;
}
