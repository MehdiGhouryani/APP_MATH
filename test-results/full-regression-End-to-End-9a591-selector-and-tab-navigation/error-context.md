# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-regression.spec.ts >> End-to-End Regression & Interaction Test Suite >> 2. Web UI: RTL orientation, header grade selector, and tab navigation
- Location: e2e/web/full-regression.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=دفترچه دستاوردهای دانایی').or(locator('text=مهارت‌های ریاضی')).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=دفترچه دستاوردهای دانایی').or(locator('text=مهارت‌های ریاضی')).first() with timeout 5000ms
  - waiting for locator('text=دفترچه دستاوردهای دانایی').or(locator('text=مهارت‌های ریاضی')).first()

```

```yaml
- button "🎓 پایه اول ▼"
- text: ⭐ ۱۲۰
- button "📱 ورود"
- button "🐲"
- button "⚙️"
- main:
  - heading "Math Learning Product" [level=1]
  - text: نگاره ۱ از کتاب درسی (نگاره ۱ — ریاضی پایه اول) · ایستگاه ۰۱ از ۲۵
  - heading "خانه و صبحانه خانوادگی (شمارش و الگو)" [level=2]
  - paragraph: آشنایی با شمارش تا ۵، دسته‌های مساوی و جدول شگفت‌انگیز
  - text: "📘 راهنما 🌱 پیشرفت: ۲ از ۸ مرحله تکمیل‌شده"
  - img
  - text: ⭐ ⭐ ⭐
  - button "👑 🐊"
  - text: بشمار و بگو شمارش ترتیبی میوه‌ها و اشیاء تا ۵ ⭐ ⭐ ⭐
  - button "👑 🐒"
  - text: الگویابی شکل‌ها تناوب رنگ‌ها و قطار دایره‌ها شروع یادگیری!
  - button "🧩 🐸"
  - text: جدول شگفت‌انگیز ۲×۲ سودوکوی هندسی و تفکر منطقی بزن بریم آریا! 🐲
  - button "🔒 🦁"
  - text: چوب‌خط‌های جادویی بسته‌های ۵تایی چوب‌خط (صفحه ۳۰)
  - button "🔒 🐸"
  - text: آینه تقارن و خط‌کش کشف نیمه قرینه شکل‌ها (صفحه ۴۲)
  - button "🔒 🦁"
  - text: ترازوی مقایسه دسته‌ها کمتر، بیشتر و مساوی (صفحه ۷۶)
  - button "🔒"
  - text: سنجش مستقل اول (Check 1) اثبات تسلط بدون سرنخ
  - button "🎁"
  - text: صندوق گنجینه دانایی پاداش فتح نگاره اول
- navigation:
  - button "🗺️ مسیر"
  - button "🏆 لیگ‌ها جدید"
  - button "🎒 مهارت‌ها"
  - button "👤 پروفایل"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('End-to-End Regression & Interaction Test Suite', () => {
  4   |   test('1. API endpoints: session creation, content manifest, and RLS historical safety enforcement', async ({
  5   |     request,
  6   |   }) => {
  7   |     // Session Creation
  8   |     const sessionRes = await request.post('/api/v1/learning/sessions', {
  9   |       data: {
  10  |         learningIdentityId: 'child-dev-01',
  11  |         relationshipContextId: 'platform',
  12  |         gradeId: 'G1',
  13  |         curriculumVersionId: 'G1-CV1',
  14  |         skillGraphVersionId: 'G1-SG1',
  15  |         sessionType: 'LEARNING',
  16  |       },
  17  |       headers: { 'x-dev-learning-identity-id': 'child-dev-01' },
  18  |     });
  19  |     expect(sessionRes.status()).toBe(201);
  20  |     const sessionBody = await sessionRes.json();
  21  |     expect(sessionBody.id || sessionBody.sessionId).toBeDefined();
  22  |     expect(sessionBody.gradeId).toBe('G1');
  23  | 
  24  |     // Oversize Batch Sync Rejection (Safety Contract)
  25  |     const actions = Array.from({ length: 21 }, (_, i) => ({
  26  |       id: `a${i}`,
  27  |       clientInstallationId: 'install-dev-01',
  28  |       learningIdentityId: 'child-dev-01',
  29  |       operationType: 'EVENT_INGEST',
  30  |       idempotencyKey: `key-${i}`,
  31  |       payload: {},
  32  |     }));
  33  |     const oversizeBatchRes = await request.post('/api/v1/sync/batch', {
  34  |       data: { actions },
  35  |       headers: { 'X-Client-Installation-Id': 'install-dev-01', 'x-dev-learning-identity-id': 'child-dev-01' },
  36  |     });
  37  |     expect(oversizeBatchRes.status()).toBe(413);
  38  | 
  39  |     // Content Manifest Contract
  40  |     const manifestRes = await request.get('/api/v1/content/manifest?gradeId=G1', {
  41  |       headers: { 'x-dev-learning-identity-id': 'child-dev-01' },
  42  |     });
  43  |     expect(manifestRes.ok()).toBeTruthy();
  44  |     const manifestBody = await manifestRes.json();
  45  |     expect(manifestBody.gradeId).toBe('G1');
  46  |     expect(manifestBody.current.length).toBeGreaterThan(0);
  47  |   });
  48  | 
  49  |   test('2. Web UI: RTL orientation, header grade selector, and tab navigation', async ({
  50  |     page,
  51  |   }) => {
  52  |     await page.goto('http://127.0.0.1:3000/');
  53  |     await page.waitForLoadState('networkidle');
  54  |     await page.waitForTimeout(600);
  55  | 
  56  |     // Check RTL direction
  57  |     await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  58  | 
  59  |     // Check Grade selector existence
  60  |     const gradeButton = page.locator('button:has-text("پایه اول")').first();
  61  |     await expect(gradeButton).toBeVisible();
  62  | 
  63  |     // Click tabs in Bottom Navigation
  64  |     // Tab: مهارت‌ها (Backpack)
  65  |     const backpackTab = page.locator('button', { hasText: 'مهارت‌ها' }).first();
  66  |     await backpackTab.click();
  67  |     await page.waitForTimeout(300);
  68  |     const backpackHeading = page.locator('text=دفترچه دستاوردهای دانایی').or(page.locator('text=مهارت‌های ریاضی'));
> 69  |     await expect(backpackHeading.first()).toBeVisible();
      |                                           ^ Error: expect(locator).toBeVisible() failed
  70  | 
  71  |     // Tab: لیگ‌ها (Leagues)
  72  |     const leaguesTab = page.locator('button', { hasText: 'لیگ‌ها' }).first();
  73  |     await leaguesTab.click();
  74  |     await page.waitForTimeout(300);
  75  |     const leaguesHeading = page.locator('text=لیگ دانایی ریاضی').or(page.locator('text=لیگ الماس'));
  76  |     await expect(leaguesHeading.first()).toBeVisible();
  77  | 
  78  |     // Tab: پروفایل (Profile)
  79  |     const profileTab = page.locator('button', { hasText: 'پروفایل' }).first();
  80  |     await profileTab.click();
  81  |     await page.waitForTimeout(300);
  82  |     await expect(page.getByText('سارا رضایی').first()).toBeVisible();
  83  | 
  84  |     // Return to Path tab
  85  |     const pathTab = page.locator('button', { hasText: 'مسیر' }).first();
  86  |     await pathTab.click();
  87  |     await page.waitForTimeout(300);
  88  |     await expect(page.getByText(/نگاره ۱/).first()).toBeVisible();
  89  |   });
  90  | 
  91  |   test('3. Dedicated teacher and parent routes', async ({ page }) => {
  92  |     // Parent Route
  93  |     await page.goto('http://127.0.0.1:3000/parent');
  94  |     await expect(page.getByText('Parent Lite')).toBeVisible();
  95  | 
  96  |     // Teacher Route
  97  |     await page.goto('http://127.0.0.1:3000/teacher');
  98  |     await expect(page.getByRole('heading', { name: 'معلمان' })).toBeVisible();
  99  |     await expect(page.getByText('درخواست همکاری / درخواست حساب').first()).toBeVisible();
  100 |     await expect(page.getByText('ورود معلم').first()).toBeVisible();
  101 |   });
  102 | });
  103 | 
```