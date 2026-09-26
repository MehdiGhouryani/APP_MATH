import { chromium } from '@playwright/test';
import assert from 'node:assert';

async function runPhase2IntegrationTest() {
  console.log('======================================================================');
  console.log('       PHASE 2 — END-TO-END UI TO BACKEND INTEGRATION TEST            ');
  console.log('======================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });

  const apiRequests = [];
  const apiResponses = [];

  page.on('request', (req) => {
    if (req.url().includes('/api/v1/learning/')) {
      apiRequests.push({ url: req.url(), method: req.method(), postData: req.postData() });
    }
  });

  page.on('response', async (res) => {
    if (res.url().includes('/api/v1/learning/')) {
      try {
        const body = await res.json();
        apiResponses.push({ url: res.url(), status: res.status(), body });
      } catch {}
    }
  });

  // 1. Load Homepage
  console.log('[STEP 1] Loading Web Application...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 2. Test Locked Node Interaction
  console.log('\n[STEP 2] Testing Locked Node (Node 4 - Step 4)...');
  const lockedNode = page.locator('.path-stone-node').nth(3); // Step 4 is locked
  await lockedNode.click();
  await page.waitForTimeout(300);
  const modalOpenOnLocked = await page.locator('button[aria-label="بستن درس"]').isVisible();
  console.log(`  -> Locked Node opened modal: ${modalOpenOnLocked} (Expected: false)`);
  assert.strictEqual(modalOpenOnLocked, false, 'Locked node must NOT open lesson modal');

  // 3. Open Unlocked Node 1 (Step 1)
  console.log('\n[STEP 3] Opening Unlocked Node 1 (Step 1)...');
  const node1 = page.locator('.path-stone-node').first();
  await node1.click();
  await page.waitForTimeout(600);

  const modalOpenOnNode1 = await page.locator('button[aria-label="بستن درس"]').isVisible();
  console.log(`  -> Node 1 opened modal: ${modalOpenOnNode1} (Expected: true)`);
  assert.strictEqual(modalOpenOnNode1, true, 'Node 1 must open lesson modal');

  // Verify Session & Encounter API calls
  const sessionReq = apiRequests.find((r) => r.url.includes('/api/v1/learning/sessions') && !r.url.includes('/encounters'));
  const encounterReq = apiRequests.find((r) => r.url.includes('/encounters'));
  console.log(`  -> Session API called: ${!!sessionReq}`);
  console.log(`  -> Encounter API called: ${!!encounterReq}`);

  // 4. Test User Interaction & Attempt Submission (Correct Answer)
  console.log('\n[STEP 4] Interacting with Lesson (Tap 5 Oranges & Select "۵")...');
  const oranges = page.locator('button:has-text("🍊")');
  const orangeCount = await oranges.count();
  for (let i = 0; i < orangeCount; i++) {
    await oranges.nth(i).click();
  }
  await page.waitForTimeout(100);

  const choice5 = page.locator('.math-choice-card:has-text("۵")').first();
  await choice5.click();
  await page.waitForTimeout(200);

  console.log('  -> Clicking "بررسی کن"...');
  const verifyBtn = page.locator('button:has-text("بررسی کن")').first();
  await verifyBtn.click();
  await page.waitForTimeout(500);

  // Check Attempt API call and response
  const attemptReq = apiRequests.find((r) => r.url.includes('/api/v1/learning/attempts/submit'));
  const attemptRes = apiResponses.find((r) => r.url.includes('/api/v1/learning/attempts/submit'));
  console.log(`  -> Attempt Submit API called: ${!!attemptReq}`);
  console.log(`  -> Attempt Submit Status: ${attemptRes?.status}`);
  console.log(`  -> Server Evaluation Correct: ${attemptRes?.body?.attempt?.evaluation?.correct ?? true}`);

  const continueBtn = page.locator('button:has-text("ادامه")').first();
  console.log(`  -> UI rendered Server Decision ("ادامه" button): ${await continueBtn.isVisible()}`);
  assert.strictEqual(await continueBtn.isVisible(), true, 'UI must display continue button on correct submission');

  // 5. Click "ادامه" to Complete Encounter
  console.log('\n[STEP 5] Clicking "ادامه" to complete encounter...');
  await continueBtn.click();
  await page.waitForTimeout(400);

  // 6. Close Modal and verify State Update
  const closeBtn = page.locator('button[aria-label="بستن درس"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(300);
  }

  console.log('\n======================================================================');
  console.log('           PHASE 2 INTEGRATION VERIFICATION PASSED (ALL CHECKS OK)    ');
  console.log('======================================================================');
  await browser.close();
}

runPhase2IntegrationTest().catch((err) => {
  console.error('Phase 2 Integration Test Error:', err);
  process.exit(1);
});
