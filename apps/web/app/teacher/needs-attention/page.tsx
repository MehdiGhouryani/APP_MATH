'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const T = 'teacher-dev-01';

export default function NeedsAttention() {
  const [data, setData] = useState<any>({ students: [] });

  useEffect(() => {
    fetch(`/api/v1/teacher/${T}/needs-attention`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <main dir="rtl" className="adult-shell">
      <Link href="/teacher" className="btn-back">← برگشت</Link>
      <h1 style={{ marginTop: 16 }}>دانش‌آموزان نیازمند توجه و مرور</h1>
      {data.students.map((s: any) => (
        <div className="card" key={s.learningIdentityId} style={{ marginTop: 12 }}>
          <Link href={`/teacher/students/${s.learningIdentityId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 style={{ margin: 0 }}>{s.displayName}</h2>
          </Link>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>
            {s.status} · {s.recentDecision}
          </p>
        </div>
      ))}
    </main>
  );
}
