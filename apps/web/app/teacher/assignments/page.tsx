'use client';

import { useMemo, useState } from 'react';

const devTeacher = 'teacher-dev-01';
const devClass = 'class-g1-demo';
const devLearners = ['child-dev-01', 'child-dev-02'];

export default function TeacherAssignmentsPage() {
  const [objective, setObjective] = useState('مرور و تمرین الگوهای ساده در ایستگاه ۰۱');
  const [created, setCreated] = useState<string | null>(null);
  const [instances, setInstances] = useState<string[]>([]);
  const generatedId = useMemo(() => `assignment_${Date.now().toString(36)}`, []);

  async function createAndPublish() {
    const create = await fetch('/api/v1/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: generatedId,
        classId: devClass,
        authorAccountId: devTeacher,
        learnerIds: devLearners,
        sharedObjective: objective,
        sharedOutcome: 'کودک بتواند الگوی ساده را تشخیص دهد و ادامه دهد.',
        stationIds: ['ST01'],
        adaptationMode: 'BOUNDED_ADAPTIVE',
        startsAt: new Date().toISOString(),
        dueAt: null,
        completionRule: 'STATION_PASS',
      }),
    });
    if (!create.ok) throw new Error((await create.json()).message ?? 'create failed');
    const publish = await fetch(`/api/v1/assignments/${generatedId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'PUBLISH', learnerIds: devLearners }),
    });
    const result = await publish.json();
    if (!publish.ok) throw new Error(result.message ?? 'publish failed');
    setCreated(result.assignment.id);
    setInstances(result.instances.map((item: { id: string }) => item.id));
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: 32, fontFamily: 'system-ui', direction: 'rtl' }}>
      <h1>تکلیف کلاس</h1>
      <p>معلم فقط هدف و محدوده را تعیین می‌کند؛ اجرای شخصی‌سازی‌شده را Learning Engine انجام می‌دهد.</p>
      <label style={{ display: 'block', marginTop: 24 }}>
        هدف آموزشی
        <textarea value={objective} onChange={(event) => setObjective(event.target.value)} rows={4} style={{ display: 'block', width: '100%', marginTop: 8, padding: 12 }} />
      </label>
      <button onClick={() => void createAndPublish()} style={{ marginTop: 16, padding: '10px 16px' }}>
        ساخت و انتشار تکلیف ST01
      </button>
      {created && <section style={{ marginTop: 28 }}>
        <strong>Assignment:</strong> {created}
        <div style={{ marginTop: 12 }}>
          {instances.map((id) => <div key={id}>Learner Instance: {id}</div>)}
        </div>
      </section>}
    </main>
  );
}
