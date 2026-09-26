'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

const T = 'teacher-dev-01';

export default function StudentSnapshot({ params }: { params: Promise<{ learningIdentityId: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [observation, setObservation] = useState('');
  const [message, setMessage] = useState('');

  const load = () =>
    fetch(`/api/v1/teacher/${T}/students/${resolvedParams.learningIdentityId}`)
      .then((r) => r.json())
      .then(setData);

  useEffect(() => {
    void load();
  }, [resolvedParams.learningIdentityId]);

  async function save() {
    const r = await fetch(`/api/v1/teacher/students/${resolvedParams.learningIdentityId}/observations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ teacherAccountId: T, observation }),
    });
    setMessage(r.ok ? 'ثبت شد' : 'ثبت نشد');
    setObservation('');
    void load();
  }

  if (!data)
    return (
      <main className="adult-shell">
        <p>در حال بارگذاری پرونده دانش‌آموز...</p>
      </main>
    );

  return (
    <main dir="rtl" className="adult-shell">
      <Link href="/teacher" className="btn-back">← برگشت</Link>
      <h1 style={{ marginTop: 16 }}>{data.displayName}</h1>
      
      <section className="card">
        <h2>وضعیت فعلی یادگیری</h2>
        <p>{data.currentStation.code} — {data.currentStation.title}</p>
        <p>قدم پیشنهادی: {data.recommendedNextAction}</p>
        {data.currentDecision && (
          <p>
            تصمیم موتور یادگیری: {data.currentDecision.step} / {data.currentDecision.objectiveContext}
          </p>
        )}
      </section>

      <section className="card">
        <h2>مهارت‌ها (Skills)</h2>
        {data.skills.map((s: any) => (
          <div className="row" key={s.skillCode}>
            <span>{s.title}</span>
            <span className={`pill ${s.bucket.toLowerCase()}`}>{s.bucket}</span>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>ثبت مشاهده معلم (Teacher Observation)</h2>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 10, borderRadius: 12, border: '1px solid #cbd5e1' }}
          placeholder="یادداشت در مورد سطح تسلط دانش‌آموز..."
        />
        <button
          type="button"
          onClick={() => void save()}
          style={{
            marginTop: 10,
            padding: '10px 18px',
            backgroundColor: '#3b52d4',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ثبت مشاهده
        </button>
        {message && <p style={{ marginTop: 8, fontWeight: 700 }}>{message}</p>}
        <small style={{ display: 'block', marginTop: 8, color: '#64748b' }}>
          مشاهده معلمان با حفظ منشأ (Provenance) ذخیره شده و وضعیت تسلط را مستقیماً دستکاری نمی‌کند.
        </small>
      </section>
    </main>
  );
}
