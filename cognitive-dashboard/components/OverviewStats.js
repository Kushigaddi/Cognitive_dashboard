import React from "react";

export default function OverviewStats({ students }) {
  // Function to calculate average
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const avgScore = avg(students.map(s => s.assessment_score));
  const avgComprehension = avg(students.map(s => s.comprehension));
  const avgAttention = avg(students.map(s => s.attention));
  const avgFocus = avg(students.map(s => s.focus));
  const avgRetention = avg(students.map(s => s.retention));

  return (
    <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
      <div>🎯 Average Score: {avgScore.toFixed(2)}</div>
      <div>📖 Comprehension: {avgComprehension.toFixed(2)}</div>
      <div>🧠 Attention: {avgAttention.toFixed(2)}</div>
      <div>🎯 Focus: {avgFocus.toFixed(2)}</div>
      <div>📝 Retention: {avgRetention.toFixed(2)}</div>
    </div>
  );
}
