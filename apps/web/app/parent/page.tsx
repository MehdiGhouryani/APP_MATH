'use client';

import { useEffect, useState } from 'react';

const PARENT_ID = 'parent-dev-01';

type ParentData = {
  child:{displayName:string};
  today:{encountersCompleted:number;checksPassed:number;meaningfulReturn:boolean};
  progress:{currentStation:string;stationLabel:string};
  skills:Array<{skillCode:string;title:string;bucket:string;retention:string}>;
  nextStep:{title:string;reason:string};
  recentLearning:Array<{summary:string;stationCode:string;outcome:string}>;
  simpleHomeActivity:{title:string;description:string}|null;
  assignments:Array<{objective:string;status:string;dueAt:string|null}>;
};

export default function ParentHome(){
  const [data,setData]=useState<ParentData|null>(null);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{ fetch(`/api/v1/parent/${PARENT_ID}/today`).then(async r=>{ if(!r.ok) throw new Error('parent projection failed'); return r.json(); }).then(setData).catch(e=>setError(e instanceof Error?e.message:'خطا')); },[]);
  if(error) return <main className="adult-shell"><h1>والد</h1><p>{error}</p></main>;
  if(!data) return <main className="adult-shell"><h1>والد</h1><p>در حال بارگذاری...</p></main>;
  return <main className="adult-shell" dir="rtl"><div className="adult-header"><div><p className="eyebrow">Parent Lite</p><h1>امروز {data.child.displayName} چطور گذشت؟</h1></div><a href="/">خانه</a></div>
    <section className="grid-3"><article className="card"><h2>امروز</h2><strong>{data.today.encountersCompleted}</strong><span>یادگیری ثبت‌شده</span></article><article className="card"><h2>پیشرفت</h2><strong>{data.progress.currentStation}</strong><span>{data.progress.stationLabel}</span></article><article className="card"><h2>بازگشت معنادار</h2><strong>{data.today.meaningfulReturn?'بله':'هنوز نه'}</strong><span>بر اساس فعالیت واقعی یادگیری</span></article></section>
    <section className="grid-2"><article className="card"><h2>مهارت‌ها</h2>{data.skills.map(s=><div className="row" key={s.skillCode}><span>{s.title}</span><span className={`pill ${s.bucket==='NEEDS_REVIEW'?'warning':s.bucket==='BUILDING'?'info':'ok'}`}>{s.bucket}</span></div>)}</article><article className="card"><h2>قدم بعدی</h2><h3>{data.nextStep.title}</h3><p>{data.nextStep.reason}</p>{data.simpleHomeActivity&&<div className="tip"><strong>{data.simpleHomeActivity.title}</strong><p>{data.simpleHomeActivity.description}</p></div>}</article></section>
    <section className="grid-2"><article className="card"><h2>یادگیری اخیر</h2>{data.recentLearning.map(x=><div className="row" key={x.summary}><span>{x.summary}</span><span className="muted">{x.stationCode}</span></div>)}</article><article className="card"><h2>تکلیف‌های مدرسه</h2>{data.assignments.length===0?<p className="muted">تکلیف فعالی ثبت نشده.</p>:data.assignments.map((x,i)=><div className="row" key={`${x.objective}-${i}`}><span>{x.objective}</span><span className="pill">{x.status}</span></div>)}</article></section>
    <p className="muted">Parent Lite فقط مشاهده و حمایت است؛ Learning State و Path را مستقیماً تغییر نمی‌دهد.</p>
    <style>{css}</style></main>;
}
const css=`body{margin:0;background:#fffaf5;font-family:system-ui}.adult-shell{max-width:1100px;margin:auto;padding:32px}.adult-header{display:flex;justify-content:space-between;align-items:start}.eyebrow{font-size:12px;opacity:.6}.adult-header h1{margin:0 0 24px}.grid-3,.grid-2{display:grid;gap:16px;margin:16px 0}.grid-3{grid-template-columns:repeat(3,1fr)}.grid-2{grid-template-columns:repeat(2,1fr)}.card{background:white;border:1px solid #eadfd4;border-radius:20px;padding:20px}.card h2{margin-top:0}.card strong{display:block;font-size:30px;margin:8px 0}.row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #f0e9e2}.pill{padding:4px 9px;border-radius:999px;background:#f1eee8;font-size:12px}.pill.ok{background:#e8f6ea}.pill.info{background:#e8f0ff}.pill.warning{background:#fff0d8}.tip{background:#fff7e9;border-radius:14px;padding:12px}.muted{opacity:.65;font-size:14px}@media(max-width:800px){.grid-3,.grid-2{grid-template-columns:1fr}.adult-shell{padding:20px}}`;
