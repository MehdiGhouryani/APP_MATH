'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const T = 'teacher-dev-01';

export default function RecheckQueue() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/teacher/${T}/recheck-queue`)
      .then((r) => r.json())
      .then(setRows);
  }, []);

  return (
    <main dir="rtl" className="adult-shell">
      <Link href="/teacher" className="btn-back">← برگشت</Link>
      <h1 style={{ marginTop: 16 }}>صف بازبینی یادگیری (Recheck)</h1>
      {rows.length === 0 ? (
        <p style={{ color: '#64748b' }}>موردی برای بازبینی در حال حاضر وجود ندارد.</p>
      ) : (
        rows.map((r) => (
          <div className="card" key={r.instanceId} style={{ marginTop: 12 }}>
            <h2 style={{ margin: 0 }}>{r.studentName}</h2>
            <p style={{ margin: '6px 0 0', color: '#475569' }}>{r.reason || 'بدون توضیح'}</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>{r.requestedAt}</p>
          </div>
        ))
      )}
    </main>
  );
}
