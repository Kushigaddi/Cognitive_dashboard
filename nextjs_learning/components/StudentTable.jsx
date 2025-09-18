import { useState, useMemo } from 'react'

export default function StudentTable({data, onRowClick}){
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({col:'assessment_score',dir:'desc'})
  const cols = [
    {header:'ID', accessor:'student_id'},
    {header:'Name', accessor:'name'},
    {header:'Class', accessor:'class'},
    {header:'Comprehension', accessor:'comprehension'},
    {header:'Attention', accessor:'attention'},
    {header:'Focus', accessor:'focus'},
    {header:'Retention', accessor:'retention'},
    {header:'Score', accessor:'assessment_score'},
    {header:'Engagement', accessor:'engagement_time'},
    {header:'Cluster', accessor:'cluster'}
  ]

  const filtered = useMemo(()=>{
    if(!query) return data
    return data.filter(d => JSON.stringify(d).toLowerCase().includes(query.toLowerCase()))
  },[data,query])

  const sorted = useMemo(()=>{
    return [...filtered].sort((a,b)=>{
      const va = a[sort.col] ?? 0
      const vb = b[sort.col] ?? 0
      return sort.dir === 'asc' ? (va - vb) : (vb - va)
    })
  },[filtered,sort])

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..." className="border px-2 py-1 rounded" />
        <div className="text-sm text-gray-600">Sort by:</div>
        <select value={sort.col} onChange={e=>setSort(s=>({...s,col:e.target.value}))} className="border px-2 py-1 rounded">
          {cols.map(c=>(<option key={c.accessor} value={c.accessor}>{c.header}</option>))}
        </select>
        <button onClick={()=>setSort(s=>({...s,dir:s.dir==='asc'?'desc':'asc'}))} className="px-2 py-1 border rounded">{sort.dir}</button>
      </div>

      <div className="overflow-auto max-h-96">
        <table className="min-w-full text-sm bg-white">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {cols.map(c=>(<th key={c.accessor} className="px-2 py-1 text-left border-b">{c.header}</th>))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row=>(
              <tr key={row.student_id + Math.random()} className="hover:bg-gray-50 cursor-pointer" onClick={()=>onRowClick(row)}>
                {cols.map(c=>(<td key={c.accessor} className="px-2 py-1 border-b">{row[c.accessor]}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
