import React, { useEffect, useState } from "react";
import OverviewStats from "../components/OverviewStats";
import BarChart from "../components/BarChart";
import ScatterChart from "../components/ScatterChart";
import RadarChart from "../components/RadarChart";
import StudentTable from "../components/StudentTable";
import Insights from "../components/Insights";
export default function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("/data/students.json")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
	<div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Cognitive Skills Dashboard</h1>
      {students.length > 0 && <OverviewStats students={students} />}
	  {students.length > 0 && <BarChart students={students} />}
	  {students.length > 0 && <ScatterChart students={students} />}
	  {students.length > 0 && <RadarChart students={students} />}
	  {students.length > 0 && <StudentTable students={students} />}
	  {students.length > 0 && <Insights students={students} />}
    </div>
  );
}
