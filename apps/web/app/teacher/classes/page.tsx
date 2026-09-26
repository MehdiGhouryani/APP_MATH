'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const T = 'teacher-dev-01';

export default function TeacherClass() {
  const [rows, setRows] = useState<any[]>([]);
  const [className, setClassName] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.get('classId') || 'class-g1-demo';
    fetch(`/api/v1/teacher/${T}/classes/${id}`)
      .then((r) => r.json())
      .then((x) => {
        setRows(x.students || []);
        setClassName(x.className || id);
      });
  }, []);

  return (
    <main dir="rtl" className="adult-shell">
      <Link href="/teacher" className="btn-back">← برگشت</Link>
      <h1 style={{ marginTop: 16 }}>{className}</h1>
      <section className="grid-2">
        {rows.map((s) => (
          <article className="card" key={s.learningIdentityId}>
            <h2 style={{ marginTop: 0 }}>{s.displayName}</h2>
            <p style={{ color: '#475569', margin: '4px 0' }}>ایستگاه: {s.currentStation}</p>
            <p style={{ color: '#475569', margin: '4px 0' }}>وضعیت: {s.status}</p>
            <p style={{ color: '#475569', margin: '4px 0' }}>تصمیم اخیر: {s.recentDecision}</p>
            <div style={{ marginTop: 12 }}>
              <Link href={`/teacher/students/${s.learningIdentityId}`} className="btn-back">
                مشاهده پروندۀ یادگیری
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
