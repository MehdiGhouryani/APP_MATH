'use client';
import {useEffect,useState} from 'react'; const T='teacher-dev-01';
export default function RecheckQueue(){const [rows,setRows]=useState<any[]>([]);useEffect(()=>{fetch(`/api/v1/teacher/${T}/recheck-queue`).then(r=>r.json()).then(setRows)},[]);return <main dir="rtl" className="adult-shell"><a href="/teacher">← برگشت</a><h1>صف Recheck</h1>{rows.length===0?<p>موردی برای بازبینی نیست.</p>:rows.map(r=><div className="card" key={r.instanceId}><h2>{r.studentName}</h2><p>{r.reason||'بدون توضیح'}</p><p>{r.requestedAt}</p></div>)}<style>{css}</style></main>}
const css=`body{margin:0;background:#fffaf5;font-family:system-ui}.adult-shell{max-width:900px;margin:auto;padding:32px}.card{background:#fff;border:1px solid #eadfd4;border-radius:20px;padding:18px;margin:12px 0}`;
