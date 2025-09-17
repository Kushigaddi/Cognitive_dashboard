import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ students }) {
  // Labels = student names
  const labels = students.map(s => s.name);

  // Data = average score for each skill per student
  const data = {
    labels,
    datasets: [
      {
        label: "Comprehension",
        data: students.map(s => s.comprehension),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      },
      {
        label: "Attention",
        data: students.map(s => s.attention),
        backgroundColor: "rgba(153, 102, 255, 0.6)"
      },
      {
        label: "Focus",
        data: students.map(s => s.focus),
        backgroundColor: "rgba(255, 159, 64, 0.6)"
      },
      {
        label: "Retention",
        data: students.map(s => s.retention),
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Cognitive Skills by Student" }
    }
  };

  return <Bar data={data} options={options} />;
}
