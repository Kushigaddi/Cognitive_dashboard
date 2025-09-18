import fs from 'fs'
import path from 'path'

function parseCSV(text){
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h=>h.trim())
  const rows = lines.slice(1).map(l=>{
    const vals = l.split(',').map(v=>v.trim())
    const obj = {}
    headers.forEach((h,i)=> obj[h] = vals[i] !== undefined ? vals[i] : '')
    return obj
  })
  return {headers, rows}
}

function toNumberSafe(v){
  if (v === '' || v === null || v === undefined) return NaN
  const n = Number(v)
  return Number.isNaN(n) ? NaN : n
}

function pearson(x,y){
  const n = x.length
  const mx = x.reduce((a,b)=>a+b,0)/n
  const my = y.reduce((a,b)=>a+b,0)/n
  let num=0, dx=0, dy=0
  for(let i=0;i<n;i++){ num += (x[i]-mx)*(y[i]-my); dx += (x[i]-mx)**2; dy += (y[i]-my)**2 }
  return num/Math.sqrt(dx*dy)
}

function kmeans(data, k=4, maxIter=50){
  const dim = data[0].length
  const centroids = []
  for(let i=0;i<k;i++) centroids.push(data[Math.floor(Math.random()*data.length)].slice())
  let labels = new Array(data.length).fill(0)
  for(let it=0; it<maxIter; it++){
    let changed=false
    for(let i=0;i<data.length;i++){
      let best=0,bestd=Infinity
      for(let c=0;c<k;c++){
        let d=0
        for(let j=0;j<dim;j++) d += (data[i][j]-centroids[c][j])**2
        if(d<bestd){ bestd=d; best=c }
      }
      if(labels[i]!==best){ labels[i]=best; changed=true }
    }
    if(!changed) break
    const sums = Array.from({length:k}, ()=>Array(dim).fill(0))
    const counts = Array(k).fill(0)
    for(let i=0;i<data.length;i++){
      const l=labels[i]; counts[l]++
      for(let j=0;j<dim;j++) sums[l][j] += data[i][j]
    }
    for(let c=0;c<k;c++){
      if(counts[c]===0) continue
      for(let j=0;j<dim;j++) centroids[c][j] = sums[c][j]/counts[c]
    }
  }
  return {labels, centroids}
}

export default function handler(req,res){
  try{
    const filePath = path.join(process.cwd(), 'data', 'students.csv')
    if(!fs.existsSync(filePath)) return res.status(400).json({error: 'data/students.csv not found. Export your notebook dataframe to data/students.csv'})
    const text = fs.readFileSync(filePath, 'utf8')
    const {rows} = parseCSV(text)

    const normalize = (obj) => {
      const out = {}
      for(const k in obj) out[k.trim().toLowerCase()] = obj[k]
      return out
    }
    const parsed = rows.map(r=>{
      const n = normalize(r)
      return {
        student_id: n.student_id || n.id || '',
        name: n.name || '',
        class: n.class || n.grade || '',
        comprehension: toNumberSafe(n.comprehension),
        attention: toNumberSafe(n.attention),
        focus: toNumberSafe(n.focus),
        retention: toNumberSafe(n.retention),
        assessment_score: toNumberSafe(n.assessment_score || n.score || n.assessment),
        engagement_time: toNumberSafe(n.engagement_time || n.engagement || n.time)
      }
    }).filter(s => !Number.isNaN(s.assessment_score))

    const comps = parsed.map(s=>s.comprehension)
    const atts = parsed.map(s=>s.attention)
    const focs = parsed.map(s=>s.focus)
    const rets = parsed.map(s=>s.retention)
    const scores = parsed.map(s=>s.assessment_score)

    const correlations = {
      comprehension: pearson(comps, scores),
      attention: pearson(atts, scores),
      focus: pearson(focs, scores),
      retention: pearson(rets, scores)
    }

    const featureVectors = parsed.map(s => [s.comprehension || 0, s.attention || 0, s.focus || 0, s.retention || 0, s.engagement_time || 0])
    const {labels, centroids} = kmeans(featureVectors.filter(v=>v.every(n=>!Number.isNaN(n))), 4)
    parsed.forEach((s,i)=> s.cluster = labels[i] ?? 0)

    const averages = {
      avg_assessment: +(scores.reduce((a,b)=>a+b,0)/scores.length || 0).toFixed(2),
      avg_comprehension: +(comps.reduce((a,b)=>a+b,0)/comps.length || 0).toFixed(2),
      avg_attention: +(atts.reduce((a,b)=>a+b,0)/atts.length || 0).toFixed(2),
      avg_focus: +(focs.reduce((a,b)=>a+b,0)/focs.length || 0).toFixed(2),
      avg_retention: +(rets.reduce((a,b)=>a+b,0)/rets.length || 0).toFixed(2),
    }

    const corrEntries = Object.entries(correlations).sort((a,b)=>Math.abs(b[1]) - Math.abs(a[1]))
    const insight = []
    insight.push(`Top predictor: ${corrEntries[0][0]} (r=${corrEntries[0][1] ? corrEntries[0][1].toFixed(2) : '0.00'})`)
    const clusterSummary = {}
    for(let i=0;i<4;i++) clusterSummary[i] = {count:0, avg_score:0}
    parsed.forEach(s => { clusterSummary[s.cluster].count++; clusterSummary[s.cluster].avg_score += s.assessment_score})
    for(const k of Object.keys(clusterSummary)){ const c = clusterSummary[k]; if(c.count) c.avg_score = +(c.avg_score/c.count).toFixed(2) }

    res.status(200).json({ students: parsed, correlations, averages, centroids, clusterSummary, insight })
  }catch(err){
    console.error(err)
    res.status(500).json({error: err.message})
  }
}
