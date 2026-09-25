'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toPersianDigits } from '../../lib/persian';

const TEACHER = 'teacher-dev-01';

type ClassItem = {
  classId: string;
  className: string;
  studentCount: number;
  needsReviewCount: number;
  needsAttentionCount: number;
};

export default function TeacherHome() {
  const [items, setItems] = useState<ClassItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/teacher/${TEACHER}/classes`)
      .then(async (r) => {
        if (!r.ok) throw new Error('دریافت لیست کلاس‌ها با خطا مواجه شد');
        return r.json();
      })
      .then((data) => setItems(data as ClassItem[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'خطای ارتباط با سرور'));
  }, []);

  return (
    <main dir="rtl" className="adult-shell">
      <div className="adult-header">
        <div>
          <p className="eyebrow">پرتال معلم (Teacher Lite)</p>
          <h1>کلاس‌های من</h1>
        </div>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" className="btn-link">← صفحه اصلی</Link>
          <Link href="/teacher/needs-attention" className="btn-link">نیازمند توجه</Link>
          <Link href="/teacher/recheck-queue" className="btn-link">صف بازبینی</Link>
          <Link href="/teacher/assignments" className="btn-link">تکلیف جدید</Link>
        </nav>
      </div>

      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      <section className="grid-2">
        {items.map((c) => (
          <article className="card" key={c.classId}>
            <h2>{c.className}</h2>
            <p style={{ color: '#64748b' }}>{toPersianDigits(c.studentCount)} دانش‌آموز ثبت‌شده</p>
            <div className="row">
              <span>نیازمند مرور (Needs Review)</span>
              <strong style={{ color: '#ea580c' }}>{toPersianDigits(c.needsReviewCount)}</strong>
            </div>
            <div className="row">
              <span>نیازمند توجه ویژه (Needs Attention)</span>
              <strong style={{ color: '#dc2626' }}>{toPersianDigits(c.needsAttentionCount)}</strong>
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href={`/teacher/classes?classId=${c.classId}`} className="btn-action">
                مشاهده دانش‌آموزان و وضعیت یادگیری
              </Link>
            </div>
          </article>
        ))}
      </section>

      <p className="muted" style={{ marginTop: 24 }}>
        🛡️ معلم می‌تواند وضعیت پیشرفت را مشاهده کند، هدف محدود تعریف کند، بازبینی (Recheck) درخواست کند و یادداشت (Observation) ثبت نماید؛ اما وضعیت واقعی یادگیری (Learning State) تنها توسط موتور یادگیری تعیین می‌گردد.
      </p>
      <style>{css}</style>
    </main>
  );
}

const css = `
  body { margin: 0; background: #fffaf5; font-family: var(--font-vazir, 'Vazirmatn', system-ui); }
  .adult-shell { max-width: 1100px; margin: auto; padding: 32px; }
  .adult-header { display: flex; justify-content: space-between; gap: 20px; align-items: start; margin-bottom: 24px; }
  .eyebrow { font-size: 13px; color: #64748b; margin: 0 0 4px; font-weight: 600; }
  .adult-header h1 { margin: 0; font-size: 26px; color: #1e293b; font-weight: 800; }
  .btn-link { padding: 6px 14px; border-radius: 10px; background: #ffffff; border: 1px solid #cbd5e1; text-decoration: none; color: #334155; font-size: 13px; font-weight: 600; }
  .btn-action { display: inline-block; padding: 8px 16px; border-radius: 12px; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 20px; }
  .card { background: #fff; border: 1px solid #eadfd4; border-radius: 22px; padding: 22px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
  .card h2 { margin: 0 0 6px; font-size: 20px; color: #1e293b; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0e9e2; font-size: 14px; }
  .muted { opacity: .75; font-size: 13px; color: #64748b; }
  @media(max-width:800px){ .grid-2 { grid-template-columns: 1fr; } .adult-shell { padding: 20px; } }
`;
