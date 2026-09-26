import { chromium } from '@playwright/test';
import assert from 'node:assert';

async function runPhase3HardeningTest() {
  console.log('======================================================================');
  console.log('       PHASE 3 — INTEGRATION HARDENING & PERSISTENCE VERIFICATION      ');
  console.log('======================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();

  const requests = [];
  const responses = [];

  page.on('request', (req) => {
    if (req.url().includes('/api/v1/')) {
      requests.push({ url: req.url(), method: req.method(), postData: req.postData() });
    }
  });

  page.on('response', async (res) => {
    if (res.url().includes('/api/v1/')) {
      try {
        const body = await res.json();
        responses.push({ url: res.url(), status: res.status(), body });
      } catch {}
    }
  });

  // -------------------------------------------------------------------------
  // SCENARIO E: Locked Node (Step 4)
  // -------------------------------------------------------------------------
  console.log('[SCENARIO E — LOCKED NODE]');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const lockedNode = page.locator('.path-stone-node').nth(3); // Step 4 is locked
  await lockedNode.click();
  await page.waitForTimeout(400);

  const modalOpenLocked = await page.locator('button[aria-label="بستن درس"]').isVisible();
  console.log(`  [Evidence E1] Locked Node 4 clicked -> Modal open: ${modalOpenLocked} (Must be false)`);
  assert.strictEqual(modalOpenLocked, false, 'Locked node must not open modal');

  const sessionRequestsDuringLocked = requests.filter((r) => r.url.includes('/sessions'));
  console.log(`  [Evidence E2] Session API requests during locked click: ${sessionRequestsDuringLocked.length} (Must be 0)`);
  assert.strictEqual(sessionRequestsDuringLocked.length, 0, 'No session API calls for locked nodes');

  // -------------------------------------------------------------------------
  // SCENARIO A: Persistence across Refresh
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO A — PERSISTENCE & FLOW]');
  const node1 = page.locator('.path-stone-node').first();
  await node1.click();
  await page.waitForTimeout(600);

  const modalOpen = await page.locator('button[aria-label="بستن درس"]').isVisible();
  console.log(`  [Evidence A1] Unlocked Node 1 clicked -> Modal open: ${modalOpen} (Must be true)`);
  assert.strictEqual(modalOpen, true, 'Node 1 opened modal');

  const oranges = page.locator('button:has-text("🍊")');
  const count = await oranges.count();
  for (let i = 0; i < count; i++) {
    await oranges.nth(i).click();
  }
  await page.waitForTimeout(100);

  const choice5 = page.locator('.math-choice-card:has-text("۵")').first();
  await choice5.click();
  await page.waitForTimeout(200);

  const verifyBtn = page.locator('button:has-text("بررسی کن")').first();
  await verifyBtn.click();
  await page.waitForTimeout(600);

  const continueBtn = page.locator('button:has-text("ادامه")').first();
  console.log(`  [Evidence A2] Correct answer submitted -> UI displayed continue: ${await continueBtn.isVisible()}`);
  assert.strictEqual(await continueBtn.isVisible(), true, 'Continue button must appear');

  await continueBtn.click();
  await page.waitForTimeout(400);

  // Close modal
  const closeBtn = page.locator('button[aria-label="بستن درس"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // Refresh page and verify persistence
  console.log('  -> Reloading / Refreshing page to verify persistence...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const completedInStorage = await page.evaluate(() => localStorage.getItem('math_app_completed_node_ids'));
  console.log(`  [Evidence A3] Rehydrated completed nodes after refresh: ${completedInStorage}`);
  assert.ok(completedInStorage?.includes('step-1'), 'Step 1 must remain completed after refresh');

  // -------------------------------------------------------------------------
  // SCENARIO B: Idempotency Verification via Direct API Test
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO B — IDEMPOTENCY VERIFICATION]');
  const idempotencyKey = `e2e-idempotency-key-${Date.now()}-abc12345`;

  // Start a fresh session
  const sessionRes = await page.request.post('http://localhost:3000/api/v1/learning/sessions', {
    data: {
      gradeId: 'G1',
      curriculumVersionId: 'g1-build-001',
      skillGraphVersionId: 'g1-canonical-v1.0',
      sessionType: 'LEARNING',
    },
  });
  const sessionData = await sessionRes.json();
  const sessionId = sessionData.id;

  // Create an encounter
  const encounterRes = await page.request.post(`http://localhost:3000/api/v1/learning/sessions/${sessionId}/encounters`, {
    data: {
      contentVersionId: '26000000-0000-4000-8000-000000000001',
      stationId: 'G1-ST01',
      skillId: 'G1-SK001',
      sequence: 1,
      learningRole: 'INSTRUCTION',
      experienceForm: 'CONVERSATION_EXPLANATION',
    },
  });
  const encounterData = await encounterRes.json();
  const encounterId = encounterData.id || encounterData.encounter?.id;

  // Submit attempt 1
  const submit1 = await page.request.post('http://localhost:3000/api/v1/learning/attempts/submit', {
    data: {
      sessionId,
      encounterId,
      attemptNumber: 1,
      clientIdempotencyKey: idempotencyKey,
      answers: [{ answerIndex: 0, answerPayload: 1 }],
    },
  });
  const submit1Data = await submit1.json();
  console.log(`  [Evidence B1] Attempt 1 Response -> Status: ${submit1.status()}, Idempotent: ${submit1Data.idempotent}`);
  assert.strictEqual(submit1.status(), 200);
  assert.strictEqual(submit1Data.idempotent, false, 'First submission must be non-idempotent (new)');

  // Submit attempt 2 with same idempotency key
  const submit2 = await page.request.post('http://localhost:3000/api/v1/learning/attempts/submit', {
    data: {
      sessionId,
      encounterId,
      attemptNumber: 1,
      clientIdempotencyKey: idempotencyKey,
      answers: [{ answerIndex: 0, answerPayload: 1 }],
    },
  });
  const submit2Data = await submit2.json();
  console.log(`  [Evidence B2] Attempt 2 (Duplicate) -> Status: ${submit2.status()}, Idempotent: ${submit2Data.idempotent}`);
  assert.strictEqual(submit2.status(), 200);
  assert.strictEqual(submit2Data.idempotent, true, 'Second submission must return idempotent: true');
  assert.strictEqual(submit1Data.attempt.id, submit2Data.attempt.id, 'Must return same attempt record');

  // -------------------------------------------------------------------------
  // SCENARIO C: Server-Driven Recovery Step
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO C — SERVER RECOVERY STEP]');
  const wrongAttemptKey = `e2e-recovery-key-${Date.now()}-xyz98765`;
  const wrongEncounterRes = await page.request.post(`http://localhost:3000/api/v1/learning/sessions/${sessionId}/encounters`, {
    data: {
      contentVersionId: '26000000-0000-4000-8000-000000000002',
      stationId: 'G1-ST01',
      skillId: 'G1-SK001',
      sequence: 2,
      learningRole: 'GUIDED_PRACTICE',
      experienceForm: 'PUZZLE',
    },
  });
  const wrongEncounterData = await wrongEncounterRes.json();
  const wrongEncounterId = wrongEncounterData.id || wrongEncounterData.encounter?.id;

  const wrongSubmit = await page.request.post('http://localhost:3000/api/v1/learning/attempts/submit', {
    data: {
      sessionId,
      encounterId: wrongEncounterId,
      attemptNumber: 1,
      clientIdempotencyKey: wrongAttemptKey,
      answers: [{ answerIndex: 0, answerPayload: 0 }], // Wrong answer
    },
  });
  const wrongData = await wrongSubmit.json();
  console.log(`  [Evidence C1] Wrong answer submission -> Selected Step: ${wrongData.decision?.selectedStep}`);
  console.log(`  [Evidence C2] Wrong answer evaluation -> Correct: ${wrongData.attempt?.evaluation?.correct}, Review Need: ${wrongData.learningState?.reviewNeed}`);
  assert.strictEqual(wrongData.decision?.selectedStep, 'RECOVERY', 'Server must select RECOVERY step on wrong answer');
  assert.strictEqual(wrongData.attempt?.evaluation?.correct, false, 'Evaluation must be incorrect');

  // -------------------------------------------------------------------------
  // SCENARIO D: Offline Batch Sync
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO D — OFFLINE BATCH SYNC]');
  const offlineEncounterRes = await page.request.post(`http://localhost:3000/api/v1/learning/sessions/${sessionId}/encounters`, {
    data: {
      contentVersionId: '26000000-0000-4000-8000-000000000003',
      stationId: 'G1-ST01',
      skillId: 'G1-SK009',
      sequence: 3,
      learningRole: 'GUIDED_PRACTICE',
      experienceForm: 'MINI_GAME',
    },
  });
  const offlineEncounterData = await offlineEncounterRes.json();
  const offlineEncounterId = offlineEncounterData.id || offlineEncounterData.encounter?.id;

  const offlineIdempotencyKey = `e2e-offline-key-${Date.now()}-qwe12345`;
  const batchRes = await page.request.post('http://localhost:3000/api/v1/sync/batch', {
    headers: {
      'X-Client-Installation-Id': '11111111-2222-4000-8000-333333333333',
    },
    data: {
      actions: [
        {
          id: 'offline-action-1',
          operationType: 'SUBMIT_ATTEMPT',
          idempotencyKey: offlineIdempotencyKey,
          clientInstallationId: '11111111-2222-4000-8000-333333333333',
          learningIdentityId: sessionData.learningIdentityId,
          payload: {
            relationshipContextId: 'platform',
            sessionId,
            encounterId: offlineEncounterId,
            attemptNumber: 1,
            clientIdempotencyKey: offlineIdempotencyKey,
            answers: [{ answerIndex: 0, answerPayload: 1 }],
            learningIdentityId: sessionData.learningIdentityId,
          },
        },
      ],
    },
  });
  const batchData = await batchRes.json();
  console.log(`  [Evidence D1] Batch Sync Response Status: ${batchRes.status()}`);
  console.log(`  [Evidence D2] Batch Action Receipt:`, batchData.results?.[0]);
  assert.strictEqual(batchRes.status(), 200);
  assert.ok(batchData.results?.[0]?.status === 'ACKED' || batchData.results?.[0]?.status === 'DUPLICATE', 'Receipt must be ACKED or DUPLICATE');

  console.log('\n======================================================================');
  console.log('       ALL PHASE 3 HARDENING & PERSISTENCE SCENARIOS PASSED (100%)    ');
  console.log('======================================================================\n');
  await browser.close();
}

runPhase3HardeningTest().catch((err) => {
  console.error('Phase 3 Hardening Test Failure:', err);
  process.exit(1);
});
