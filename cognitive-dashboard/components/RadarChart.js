import React, { useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

export default function RadarChart({ students }) {
  const [selectedStudent, setSelectedStudent] = useState(students[0].student_id);

  const student = students.find(s => s.student_id === selectedStudent);

  const data = {
    labels: ["Comprehension", "Attention", "Focus", "Retention"],
    datasets: [
      {
        label: student.name,
        data: [student.comprehension, student.attention, student.focus, student.retention],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2
      }
    ]
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Student Cognitive Profile</h3>
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        {students.map(s => (
          <option key={s.student_id} value={s.student_id}>{s.name}</option>
        ))}
      </select>
      <Radar data={data} />
    </div>
  );
}
