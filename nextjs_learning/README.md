# Next.js Learning Dashboard

## Quick start

1. Put your exported CSV from Jupyter at `data/students.csv`.
   The CSV should have columns like:
   `student_id,name,class,comprehension,attention,focus,retention,assessment_score,engagement_time`

2. Install dependencies:
   ```
   npm install
   ```

3. Start dev server:
   ```
   npm run dev
   ```
   Open http://localhost:3000

## Notes
- API `pages/api/data.js` reads `data/students.csv` and computes correlations + clusters.
- The ML model trains in-browser using TensorFlow.js.
- If your CSV has quoted fields with commas, replace the simple parser with `papaparse`.
