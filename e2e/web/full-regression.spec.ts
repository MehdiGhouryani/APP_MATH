import { test, expect } from '@playwright/test';

test.describe('End-to-End Regression & Interaction Test Suite', () => {
  test('1. API endpoints: session creation, content manifest, and RLS historical safety enforcement', async ({
    request,
  }) => {
    // 1. Session creation
    const sessionRes = await request.post('/api/v1/learning/sessions', {
      headers: { 'x-dev-learning-identity-id': 'child-dev-01' },
      data: {
        learningIdentityId: 'child-dev-01',
        relationshipContextId: 'platform',
        gradeId: 'G1',
        curriculumVersionId: 'G1-CV1',
        skillGraphVersionId: 'G1-SG1',
        sessionType: 'LEARNING',
      },
    });
    expect(sessionRes.status()).toBe(201);
    const sessionBody = await sessionRes.json();
    expect(sessionBody.gradeId).toBe('G1');

    // 2. Content manifest
    const manifestRes = await request.get('/api/v1/content/manifest?gradeId=G1', {
      headers: { 'x-dev-learning-identity-id': 'child-dev-01' },
    });
    expect(manifestRes.ok()).toBeTruthy();
    const manifestBody = await manifestRes.json();
    expect(manifestBody.gradeId).toBe('G1');
    expect(manifestBody.current.length).toBeGreaterThan(0);

    // 3. Real RLS Historical Safety test (DELETE must return 403 Forbidden)
    const deleteEvidenceRes = await request.delete(
      '/api/v1/learning/evidence/ev-test-evidence-01'
    );
    expect(deleteEvidenceRes.status()).toBe(403);
    const deleteBody = await deleteEvidenceRes.json();
    expect(deleteBody.code).toBe('RLS_HISTORICAL_SAFETY_VIOLATION');
    expect(deleteBody.rule).toBe('REVOKE DELETE ON public.evidence');
  });

  test('2. Web UI: RTL orientation, header grade selector, and tab navigation', async ({
    page,
  }) => {
    await page.goto('/');

    // Check RTL direction
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // Check Grade selector existence
    const gradeButton = page.locator('button:has-text("پایه اول")').first();
    await expect(gradeButton).toBeVisible();

    // Click tabs in Bottom Navigation
    // Tab: مهارت‌ها (Backpack)
    const backpackTab = page.locator('button:has-text("مهارت‌ها")').first();
    if (await backpackTab.isVisible()) {
      await backpackTab.click();
      await expect(page.locator('text=کوله‌پشتی مهارت‌های ریاضی')).toBeVisible();
    }

    // Tab: لیگ‌ها (Leagues)
    const leaguesTab = page.locator('button:has-text("لیگ‌ها")').first();
    if (await leaguesTab.isVisible()) {
      await leaguesTab.click();
      await expect(page.locator('text=لیگ الماس')).toBeVisible();
    }

    // Tab: والدین/معلم (Adults)
    const adultsTab = page.locator('button:has-text("والدین/معلم")').first();
    if (await adultsTab.isVisible()) {
      await adultsTab.click();
      await expect(page.locator('text=فاز ۲ — زیرساخت هویت و دسترسی‌ها')).toBeVisible();

      // Click the real RLS Historical Safety test button
      const rlsButton = page.locator(
        'button:has-text("تلاش برای حذف شواهد یادگیری")'
      );
      await expect(rlsButton).toBeVisible();
      await rlsButton.click();

      // Verify the real 403 server response is displayed on UI
      await expect(
        page.locator('text=HTTP 403 Forbidden')
      ).toBeVisible({ timeout: 5000 });
    }

    // Tab: پروفایل (Profile)
    const profileTab = page.locator('button:has-text("پروفایل")').first();
    if (await profileTab.isVisible()) {
      await profileTab.click();
      await expect(page.locator('text=شخصیت همراه شما')).toBeVisible();
    }

    // Return to Path tab
    const pathTab = page.locator('button:has-text("مسیر")').first();
    if (await pathTab.isVisible()) {
      await pathTab.click();
      await expect(page.locator('text=نگاره ۱ — ریاضی پایه اول')).toBeVisible();
    }
  });

  test('3. Dedicated teacher and parent routes', async ({ page }) => {
    // Parent Route
    await page.goto('/parent');
    await expect(page.getByText('Parent Lite')).toBeVisible();

    // Teacher Route
    await page.goto('/teacher');
    await expect(page.getByText('Teacher Lite')).toBeVisible();
  });
});
