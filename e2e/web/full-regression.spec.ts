import { test, expect } from '@playwright/test';

test.describe('End-to-End Regression & Interaction Test Suite', () => {
  test('1. API endpoints: session creation, content manifest, and RLS historical safety enforcement', async ({
    request,
  }) => {
    // Session Creation
    const sessionRes = await request.post('/api/v1/learning/sessions', {
      data: {
        learningIdentityId: 'child-dev-01',
        relationshipContextId: 'platform',
        gradeId: 'G1',
        curriculumVersionId: 'G1-CV1',
        skillGraphVersionId: 'G1-SG1',
        sessionType: 'LEARNING',
      },
      headers: { 'x-dev-learning-identity-id': 'child-dev-01' },
    });
    expect(sessionRes.status()).toBe(201);
    const sessionBody = await sessionRes.json();
    expect(sessionBody.id || sessionBody.sessionId).toBeDefined();
    expect(sessionBody.gradeId).toBe('G1');

    // Oversize Batch Sync Rejection (Safety Contract)
    const actions = Array.from({ length: 21 }, (_, i) => ({
      id: `a${i}`,
      clientInstallationId: 'install-dev-01',
      learningIdentityId: 'child-dev-01',
      operationType: 'EVENT_INGEST',
      idempotencyKey: `key-${i}`,
      payload: {},
    }));
    const oversizeBatchRes = await request.post('/api/v1/sync/batch', {
      data: { actions },
      headers: { 'X-Client-Installation-Id': 'install-dev-01', 'x-dev-learning-identity-id': 'child-dev-01' },
    });
    expect(oversizeBatchRes.status()).toBe(413);

    // Content Manifest Contract
    const manifestRes = await request.get('/api/v1/content/manifest?gradeId=G1', {
      headers: { 'x-dev-learning-identity-id': 'child-dev-01' },
    });
    expect(manifestRes.ok()).toBeTruthy();
    const manifestBody = await manifestRes.json();
    expect(manifestBody.gradeId).toBe('G1');
    expect(manifestBody.current.length).toBeGreaterThan(0);
  });

  test('2. Web UI: RTL orientation, header grade selector, and tab navigation', async ({
    page,
  }) => {
    await page.goto('http://127.0.0.1:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    // Check RTL direction
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // Check Grade selector existence
    const gradeButton = page.locator('button:has-text("پایه اول")').first();
    await expect(gradeButton).toBeVisible();

    // Click tabs in Bottom Navigation
    // Tab: مهارت‌ها (Backpack)
    const backpackTab = page.locator('button', { hasText: 'مهارت‌ها' }).first();
    await backpackTab.click();
    await page.waitForTimeout(300);
    const backpackHeading = page.locator('text=دفترچه دستاوردهای دانایی').or(page.locator('text=مهارت‌های ریاضی'));
    await expect(backpackHeading.first()).toBeVisible();

    // Tab: لیگ‌ها (Leagues)
    const leaguesTab = page.locator('button', { hasText: 'لیگ‌ها' }).first();
    await leaguesTab.click();
    await page.waitForTimeout(300);
    const leaguesHeading = page.locator('text=لیگ دانایی ریاضی').or(page.locator('text=لیگ الماس'));
    await expect(leaguesHeading.first()).toBeVisible();

    // Tab: پروفایل (Profile)
    const profileTab = page.locator('button', { hasText: 'پروفایل' }).first();
    await profileTab.click();
    await page.waitForTimeout(300);
    await expect(page.getByText('سارا رضایی').first()).toBeVisible();

    // Return to Path tab
    const pathTab = page.locator('button', { hasText: 'مسیر' }).first();
    await pathTab.click();
    await page.waitForTimeout(300);
    await expect(page.getByText(/نگاره ۱/).first()).toBeVisible();
  });

  test('3. Dedicated teacher and parent routes', async ({ page }) => {
    // Parent Route
    await page.goto('http://127.0.0.1:3000/parent');
    await expect(page.getByText('Parent Lite')).toBeVisible();

    // Teacher Route
    await page.goto('http://127.0.0.1:3000/teacher');
    await expect(page.getByRole('heading', { name: 'معلمان' })).toBeVisible();
    await expect(page.getByText('درخواست همکاری / درخواست حساب').first()).toBeVisible();
    await expect(page.getByText('ورود معلم').first()).toBeVisible();
  });
});
