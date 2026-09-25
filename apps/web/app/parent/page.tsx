'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toPersianDigits } from '../../lib/persian';

const PARENT_ID = 'parent-dev-01';

type ParentData = {
  child: { displayName: string };
  today: { encountersCompleted: number; checksPassed: number; meaningfulReturn: boolean };
  progress: { currentStation: string; stationLabel: string };
  skills: Array<{ skillCode: string; title: string; bucket: string; retention: string }>;
  nextStep: { title: string; reason: string };
  recentLearning: Array<{ summary: string; stationCode: string; outcome: string }>;
  simpleHomeActivity: { title: string; description: string } | null;
  assignments: Array<{ objective: string; status: string; dueAt: string | null }>;
};

function formatSkillBucket(bucket: string): { label: string; cls: string } {
  switch (bucket) {
    case 'NEEDS_REVIEW':
      return { label: 'نیاز به مرور', cls: 'warning' };
    case 'BUILDING':
      return { label: 'در حال ساخت', cls: 'info' };
    case 'STABLE':
    case 'MASTERED':
      return { label: 'تثبیت‌شده', cls: 'ok' };
    default:
      return { label: bucket, cls: 'info' };
  }
}

export default function ParentHome() {
  const [data, setData] = useState<ParentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/parent/${PARENT_ID}/today`)
      .then(async (r) => {
        if (!r.ok) throw new Error('دریافت گزارش وضعیت والد با خطا مواجه شد.');
        return r.json();
      })
      .then((res) => setData(res as ParentData))
      .catch((e) => setError(e instanceof Error ? e.message : 'خطای بارگذاری داده'));
  }, []);

  if (error) {
    return (
      <main className="adult-shell">
        <h1>پرتال والدین</h1>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <Link href="/" className="btn-back">بازگشت به خانه</Link>
        <style>{css}</style>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="adult-shell">
        <h1>پرتال والدین</h1>
        <p>در حال بارگذاری گزارش...</p>
        <style>{css}</style>
      </main>
    );
  }

  return (
    <main className="adult-shell" dir="rtl">
      <div className="adult-header">
        <div>
          <p className="eyebrow">گزارش روزانه والد (Parent Lite)</p>
          <h1>امروز {data.child.displayName} چطور گذشت؟</h1>
        </div>
        <Link href="/" className="btn-back">← بازگشت به صفحه کودک</Link>
      </div>

      <section className="grid-3">
        <article className="card">
          <h2>فعالیت امروز</h2>
          <strong>{toPersianDigits(data.today.encountersCompleted)}</strong>
          <span>جلسه یادگیری ثبت‌شده</span>
        </article>
        <article className="card">
          <h2>موقعیت آموزشی</h2>
          <strong style={{ fontSize: 24, color: '#2563eb' }}>
            {data.progress.currentStation}
          </strong>
          <span>{data.progress.stationLabel}</span>
        </article>
        <article className="card">
          <h2>بازگشت معنادار</h2>
          <strong style={{ color: data.today.meaningfulReturn ? '#16a34a' : '#ea580c' }}>
            {data.today.meaningfulReturn ? 'بله' : 'هنوز نه'}
          </strong>
          <span>بر اساس فعالیت واقعی یادگیری</span>
        </article>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>مهارت‌های فعال</h2>
          {data.skills.map((s) => {
            const b = formatSkillBucket(s.bucket);
            return (
              <div className="row" key={s.skillCode}>
                <span>{s.title}</span>
                <span className={`pill ${b.cls}`}>{b.label}</span>
              </div>
            );
          })}
        </article>

        <article className="card">
          <h2>قدم بعدی پیشنهادی</h2>
          <h3 style={{ margin: '8px 0', fontSize: 17, color: '#1e293b' }}>{data.nextStep.title}</h3>
          <p style={{ color: '#475569', fontSize: 14 }}>{data.nextStep.reason}</p>
          {data.simpleHomeActivity && (
            <div className="tip">
              <strong>💡 فعالیت ساده در خانه: {data.simpleHomeActivity.title}</strong>
              <p style={{ margin: '6px 0 0', fontSize: 13 }}>{data.simpleHomeActivity.description}</p>
            </div>
          )}
        </article>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>یادگیری اخیر</h2>
          {data.recentLearning.map((x, idx) => (
            <div className="row" key={`${x.summary}-${idx}`}>
              <span>{x.summary}</span>
              <span className="muted">{x.stationCode}</span>
            </div>
          ))}
        </article>

        <article className="card">
          <h2>تکلیف‌های مدرسه</h2>
          {data.assignments.length === 0 ? (
            <p className="muted">تکلیف فعالی برای امروز ثبت نشده است.</p>
          ) : (
            data.assignments.map((x, i) => (
              <div className="row" key={`${x.objective}-${i}`}>
                <span>{x.objective}</span>
                <span className="pill">{x.status === 'PENDING' ? 'در انتظار' : x.status === 'COMPLETED' ? 'تکمیل‌شده' : x.status}</span>
              </div>
            ))
          )}
        </article>
      </section>

      <p className="muted" style={{ marginTop: 24 }}>
        🛡️ پرتال والدین (Parent Lite) صرفاً جهت آگاهی، مشاهده و حمایت عاطفی است؛ وضعیت تسلط (Learning State) و مسیر یادگیری کودک را مستقیماً تغییر نمی‌دهد.
      </p>
      <style>{css}</style>
    </main>
  );
}

const css = `
  body { margin: 0; background: #fffaf5; font-family: var(--font-vazir, 'Vazirmatn', system-ui); }
  .adult-shell { max-width: 1100px; margin: auto; padding: 32px; }
  .adult-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px; }
  .eyebrow { font-size: 13px; color: #64748b; margin: 0 0 6px; font-weight: 600; }
  .adult-header h1 { margin: 0; font-size: 26px; color: #1e293b; font-weight: 800; }
  .btn-back { padding: 8px 16px; border-radius: 12px; background: #ffffff; border: 1px solid #cbd5e1; text-decoration: none; color: #1e293b; font-weight: 600; font-size: 14px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 16px 0; }
  .card { background: white; border: 1px solid #eadfd4; border-radius: 22px; padding: 22px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
  .card h2 { margin-top: 0; font-size: 18px; color: #1e293b; }
  .card strong { display: block; font-size: 32px; margin: 8px 0; color: #0f172a; font-weight: 800; }
  .row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0e9e2; font-size: 14px; }
  .pill { padding: 4px 12px; border-radius: 999px; background: #f1eee8; font-size: 12px; font-weight: 700; }
  .pill.ok { background: #e8f6ea; color: #166534; }
  .pill.info { background: #e8f0ff; color: #1e40af; }
  .pill.warning { background: #fff0d8; color: #9a3412; }
  .tip { background: #fff7e9; border: 1px solid #fed7aa; border-radius: 14px; padding: 14px; margin-top: 14px; color: #7c2d12; }
  .muted { opacity: .75; font-size: 13px; color: #64748b; }
  @media(max-width:800px){ .grid-3, .grid-2 { grid-template-columns: 1fr; } .adult-shell { padding: 20px; } }
`;
