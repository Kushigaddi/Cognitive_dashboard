import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ScatterChart, Scatter, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import StudentTable from '../components/StudentTable'

export default function Home(){
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  useEffect(()=>{ fetch('/api/data').then(r=>r.json()).then(setData).catch(()=>{}) },[])
  if(!data) return <div className="p-8">Loading data... (make sure data/students.csv exists)</div>

  const {students, correlations, averages, insight} = data

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Learning Dashboard</h1>
        <div className="text-sm text-gray-600">Students: {students.length}</div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-1 p-4 rounded shadow bg-white">
          <h3 className="font-semibold">Overview</h3>
          <ul className="mt-2 text-sm space-y-1">
            <li>Avg score: {averages.avg_assessment}</li>
            <li>Avg comprehension: {averages.avg_comprehension}</li>
            <li>Top predictor: {insight[0]}</li>
          </ul>
        </div>

        <div className="col-span-2 p-4 rounded shadow bg-white">
          <h3 className="font-semibold mb-2">Skill correlation with score</h3>
          <div style={{width:'100%',height:260}}>
            <ResponsiveContainer>
              <BarChart data={Object.keys(correlations).map(k=>({skill:k, r: correlations[k]}))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="r" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded shadow bg-white">
          <h3 className="font-semibold">Attention vs Assessment (scatter)</h3>
          <div style={{width:'100%',height:300}}>
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="attention" name="Attention" />
                <YAxis dataKey="assessment_score" name="Score" />
                <Tooltip />
                <Scatter data={students} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 rounded shadow bg-white">
          <h3 className="font-semibold">Student Profile (radar)</h3>
          <div style={{width:'100%',height:300}}>
            <ResponsiveContainer>
              {selected ? (
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  {subject:'Comprehension', A:selected.comprehension},
                  {subject:'Attention', A:selected.attention},
                  {subject:'Focus', A:selected.focus},
                  {subject:'Retention', A:selected.retention},
                  {subject:'Engagement', A:selected.engagement_time/1.2}
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name={selected.name} dataKey="A" />
                </RadarChart>
              ) : (
                <div className="text-sm text-gray-500">Select a student from the table below to view radar.</div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-4 rounded shadow bg-white mb-4">
        <h3 className="font-semibold mb-2">Students</h3>
        <StudentTable data={students} onRowClick={s=>setSelected(s)} />
      </div>

      <div className="p-4 rounded shadow bg-white mb-4">
        <h3 className="font-semibold">Insights</h3>
        <ul className="list-disc pl-6 mt-2 text-sm">
          {data.insight.map((ins,i)=>(<li key={i}>{ins}</li>))}
        </ul>
      </div>

      <div className="p-4 rounded shadow bg-white">
        <h3 className="font-semibold">Quick ML: Train model in browser</h3>
        <TrainModel students={students} />
      </div>
    </div>
  )
}

function TrainModel({students}){
  const [status,setStatus] = useState('idle')
  const [rmse,setRmse] = useState(null)
  useEffect(()=>{
    import('@tensorflow/tfjs').then(tf=>{
      setStatus('preparing data')
      const xs = tf.tensor2d(students.map(s=>[s.comprehension/100, s.attention/100, s.focus/100, s.retention/100, (s.engagement_time||0)/120]))
      const ys = tf.tensor2d(students.map(s=>[s.assessment_score/100]))
      const model = tf.sequential()
      model.add(tf.layers.dense({units:16, inputShape:[5], activation:'relu'}))
      model.add(tf.layers.dense({units:8, activation:'relu'}))
      model.add(tf.layers.dense({units:1, activation:'linear'}))
      model.compile({optimizer:'adam', loss:'meanSquaredError'})
      setStatus('training')
      model.fit(xs, ys, {epochs:40, batchSize:32}).then(()=> {
        setStatus('evaluating')
        const preds = model.predict(xs)
        const mse = tf.metrics.meanSquaredError(ys, preds).dataSync()[0]
        setRmse(Math.sqrt(mse).toFixed(3))
        setStatus('trained')
      })
    })
  },[])
  return (
    <div>
      <div className="text-sm">Status: {status}{rmse ? ` — RMSE: ${rmse}` : ''}</div>
      <div className="text-xs text-gray-500 mt-2">Model: a small dense network trained in-browser on the dataset.</div>
    </div>
  )
}
