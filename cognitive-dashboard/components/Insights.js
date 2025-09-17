import React from "react";

export default function Insights({ students }) {
  if (!students.length) return null;

  // Calculate averages
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const avgScore = avg(students.map(s => s.assessment_score));
  const topStudent = students.reduce((prev, curr) =>
    curr.assessment_score > prev.assessment_score ? curr : prev
  );

  // Low engagement students
  const lowEngagement = students.filter(s => s.engagement_time < 4);

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>🔍 Insights</h3>
      <p>⭐ Top Performing Student: {topStudent.name} ({topStudent.assessment_score})</p>
      <p>📊 Average Assessment Score: {avgScore.toFixed(2)}</p>
      {lowEngagement.length > 0 ? (
        <p>⚠️ Students with low engagement: {lowEngagement.map(s => s.name).join(", ")}</p>
      ) : (
        <p>✅ All students have sufficient engagement.</p>
      )}
    </div>
  );
}
