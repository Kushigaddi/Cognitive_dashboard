import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function StudentTable({ students }) {
  const columns = [
    { field: "student_id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "class", headerName: "Class", width: 100 },
    { field: "comprehension", headerName: "Comprehension", width: 150 },
    { field: "attention", headerName: "Attention", width: 120 },
    { field: "focus", headerName: "Focus", width: 100 },
    { field: "retention", headerName: "Retention", width: 120 },
    { field: "engagement_time", headerName: "Engagement (hrs)", width: 150 },
    { field: "assessment_score", headerName: "Score", width: 100 }
  ];

  // Add id property for DataGrid
  const rows = students.map((s, index) => ({ id: index, ...s }));

  return (
    <div style={{ height: 400, width: "100%", marginTop: "2rem" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </div>
  );
}
