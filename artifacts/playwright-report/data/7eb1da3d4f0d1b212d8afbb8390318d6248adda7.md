# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: teacher-auth.spec.ts >> Teacher Authentication & Direct Role Resolution (Prompt 3.5) >> 2. Full Browser Journey: Login -> Direct Teacher Area Entrance -> Session Refresh -> Logout
- Location: e2e/web/teacher-auth.spec.ts:44:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[autoComplete="username"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('input[autoComplete="username"]') with timeout 5000ms
  - waiting for locator('input[autoComplete="username"]')

```

```yaml
- main:
  - text: 👩‍🏫
  - heading "معلمان" [level=1]
  - paragraph: پرتال معلم (Teacher Lite) — سامانه اختصاصی معلمان، همکاران آموزشی و مدارس
  - link "← بازگشت به برنامه کودک":
    - /url: /
  - paragraph: به بخش معلمان خوش آمدید. این فضا به صورت مستقل جهت ارزیابی میزان تسلط، مدیریت تکالیف و پایش پیشرفت تحصیلی دانش‌آموزان در نظر گرفته شده است.
  - paragraph: "لطفاً یکی از مسیرهای زیر را برای ادامه انتخاب فرمایید:"
  - text: 📝
  - heading "درخواست همکاری / درخواست حساب" [level=2]
  - paragraph: ثبت مشخصات مدرسه یا مرکز آموزشی جهت بررسی مدارک، دریافت تاییدیه معلم و تخصیص کد کلاس.
  - button "ثبت درخواست حساب معلم"
  - text: 🔑
  - heading "ورود معلم" [level=2]
  - paragraph: ورود اختصاصی معلمان با نام کاربری و رمز عبور به Teacher Area (تشخیص خودکار نقش توسط سیستم).
  - button "ورود به حساب معلمان"
  - text: "دسترسی‌های سریع ابزارهای کلاس (محیط آزمایشی):"
  - link "📋 تکلیف جدید":
    - /url: /teacher/assignments
  - link "⚠️ نیازمند توجه":
    - /url: /teacher/needs-attention
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Teacher Authentication & Direct Role Resolution (Prompt 3.5)', () => {
  4  |   test('1. API: Rejects invalid credentials and non-teacher accounts, accepts approved teacher and returns database roles', async ({
  5  |     request,
  6  |   }) => {
  7  |     // A. Rejection on missing username/password
  8  |     const missingRes = await request.post('/api/v1/teacher/auth/login', {
  9  |       headers: { 'Content-Type': 'application/json' },
  10 |       data: { username: '' },
  11 |     });
  12 |     expect(missingRes.status()).toBe(400);
  13 | 
  14 |     // B. Rejection on non-existent credentials
  15 |     const invalidRes = await request.post('/api/v1/teacher/auth/login', {
  16 |       headers: { 'Content-Type': 'application/json' },
  17 |       data: { username: 'unknown_user_123', password: 'wrongpassword' },
  18 |     });
  19 |     expect(invalidRes.status()).toBe(401);
  20 | 
  21 |     // C. Rejection on non-teacher account (parent_user has PARENT role, not TEACHER)
  22 |     const nonTeacherRes = await request.post('/api/v1/teacher/auth/login', {
  23 |       headers: { 'Content-Type': 'application/json' },
  24 |       data: { username: 'parent_user', password: 'ParentPass123!' },
  25 |     });
  26 |     expect(nonTeacherRes.status()).toBe(403);
  27 |     const nonTeacherBody = await nonTeacherRes.json();
  28 |     expect(nonTeacherBody.code).toBe('FORBIDDEN');
  29 | 
  30 |     // D. Successful login with approved teacher credentials
  31 |     const teacherRes = await request.post('/api/v1/teacher/auth/login', {
  32 |       headers: { 'Content-Type': 'application/json' },
  33 |       data: { username: 'teacher_zahra', password: 'TeacherPass123!' },
  34 |     });
  35 |     expect(teacherRes.status()).toBe(200);
  36 |     const teacherBody = await teacherRes.json();
  37 |     expect(teacherBody.success).toBe(true);
  38 |     expect(teacherBody.session).toBeDefined();
  39 |     expect(teacherBody.session.username).toBe('teacher_zahra');
  40 |     expect(teacherBody.session.roles).toContain('TEACHER');
  41 |     expect(teacherBody.session.isTeacher).toBe(true);
  42 |   });
  43 | 
  44 |   test('2. Full Browser Journey: Login -> Direct Teacher Area Entrance -> Session Refresh -> Logout', async ({
  45 |     page,
  46 |   }) => {
  47 |     // 1. Visit /teacher
  48 |     await page.goto('http://127.0.0.1:3000/teacher');
  49 |     await page.waitForLoadState('networkidle');
  50 | 
  51 |     // 2. Click "ورود به حساب معلمان"
  52 |     const loginMenuBtn = page.locator('button:has-text("ورود به حساب معلمان")').first();
  53 |     await loginMenuBtn.click();
  54 |     await page.waitForTimeout(300);
  55 | 
  56 |     // 3. Verify Login Screen has NO role picker and only username/password
  57 |     await expect(page.locator('text=ورود به حساب معلمان')).toBeVisible();
> 58 |     await expect(page.locator('input[autoComplete="username"]')).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  59 |     await expect(page.locator('input[autoComplete="current-password"]')).toBeVisible();
  60 |     // Ensure no role select or role radio button is present
  61 |     await expect(page.locator('select')).toHaveCount(0);
  62 | 
  63 |     // 4. Fill credentials of verified teacher
  64 |     await page.locator('input[autoComplete="username"]').fill('teacher_zahra');
  65 |     await page.locator('input[autoComplete="current-password"]').fill('TeacherPass123!');
  66 | 
  67 |     // 5. Submit form
  68 |     const submitBtn = page.locator('button:has-text("ورود")').first();
  69 |     await submitBtn.click();
  70 | 
  71 |     // 6. Must navigate directly to Teacher Area
  72 |     await page.waitForURL('**/teacher/area', { timeout: 10000 });
  73 |     await expect(page.getByRole('heading', { name: 'Teacher Area' })).toBeVisible();
  74 |     await expect(page.locator('text=تأییدشده ✓')).toBeVisible();
  75 |     await expect(page.locator('text=TEACHER')).toBeVisible();
  76 |     await expect(page.locator('text=مریم کریمی')).toBeVisible();
  77 | 
  78 |     // 7. Verify session persistence on page reload
  79 |     await page.reload();
  80 |     await page.waitForLoadState('networkidle');
  81 |     await expect(page.getByRole('heading', { name: 'Teacher Area' })).toBeVisible();
  82 |     await expect(page.locator('text=تأییدشده ✓')).toBeVisible();
  83 | 
  84 |     // 8. Test Real Logout
  85 |     const logoutBtn = page.locator('button:has-text("خروج از حساب")').first();
  86 |     await logoutBtn.click();
  87 |     await page.waitForTimeout(600);
  88 | 
  89 |     // Must navigate back to /teacher
  90 |     await expect(page.getByRole('heading', { name: 'معلمان' })).toBeVisible();
  91 | 
  92 |     // 9. Unauthorized direct access to /teacher/area should be prevented
  93 |     await page.goto('http://127.0.0.1:3000/teacher/area');
  94 |     await page.waitForLoadState('networkidle');
  95 |     await expect(page.locator('text=دسترسی غیرمجاز').or(page.getByRole('heading', { name: 'معلمان' }))).toBeVisible();
  96 |   });
  97 | });
  98 | 
```