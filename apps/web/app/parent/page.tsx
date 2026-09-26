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
      </main>
    );
  }

  if (!data) {
    return (
      <main className="adult-shell">
        <h1>پرتال والدین</h1>
        <p>در حال بارگذاری گزارش...</p>
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
    </main>
  );
}
