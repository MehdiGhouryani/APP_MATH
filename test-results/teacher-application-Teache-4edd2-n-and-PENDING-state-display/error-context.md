# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: teacher-application.spec.ts >> Teacher Application Flow & Lifecycle >> 2. Web UI: Full submission journey from /teacher with instant confirmation and PENDING state display
- Location: e2e/web/teacher-application.spec.ts:61:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/فرم درخواست همکاری \/ درخواست حساب/)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/فرم درخواست همکاری \/ درخواست حساب/) with timeout 5000ms
  - waiting for getByText(/فرم درخواست همکاری \/ درخواست حساب/)

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Teacher Application Flow & Lifecycle', () => {
  4   |   test('1. API: validates input, creates record with strict PENDING status, and serves status by ID', async ({
  5   |     request,
  6   |   }) => {
  7   |     // 1. Rejection on empty payload
  8   |     const emptyRes = await request.post('/api/v1/teacher/applications', {
  9   |       headers: { 'Content-Type': 'application/json' },
  10  |       data: {},
  11  |     });
  12  |     expect(emptyRes.status()).toBe(400);
  13  |     const emptyBody = await emptyRes.json();
  14  |     expect(emptyBody.code).toBe('VALIDATION_ERROR');
  15  | 
  16  |     // 2. Rejection on invalid phone
  17  |     const invalidPhoneRes = await request.post('/api/v1/teacher/applications', {
  18  |       headers: { 'Content-Type': 'application/json' },
  19  |       data: {
  20  |         firstName: 'زهرا',
  21  |         lastName: 'محمدی',
  22  |         phoneNumber: '12345',
  23  |         schoolName: 'دبستان شکوفه‌ها',
  24  |         city: 'اصفهان',
  25  |       },
  26  |     });
  27  |     expect(invalidPhoneRes.status()).toBe(400);
  28  | 
  29  |     // 3. Successful submission
  30  |     const validRes = await request.post('/api/v1/teacher/applications', {
  31  |       headers: { 'Content-Type': 'application/json' },
  32  |       data: {
  33  |         firstName: 'زهرا',
  34  |         lastName: 'محمدی',
  35  |         phoneNumber: '09123456789',
  36  |         schoolName: 'دبستان شکوفه‌ها',
  37  |         city: 'اصفهان',
  38  |         notes: 'آموزگار پایه دوم',
  39  |       },
  40  |     });
  41  |     expect(validRes.status()).toBe(201);
  42  |     const validBody = await validRes.json();
  43  |     expect(validBody.success).toBe(true);
  44  |     expect(validBody.application).toBeDefined();
  45  |     expect(validBody.application.id).toBeDefined();
  46  |     expect(validBody.application.status).toBe('PENDING');
  47  |     expect(validBody.application.firstName).toBe('زهرا');
  48  |     expect(validBody.application.lastName).toBe('محمدی');
  49  |     expect(validBody.application.schoolName).toBe('دبستان شکوفه‌ها');
  50  | 
  51  |     const applicationId = validBody.application.id;
  52  | 
  53  |     // 4. Fetch status by ID
  54  |     const statusRes = await request.get(`/api/v1/teacher/applications/${applicationId}`);
  55  |     expect(statusRes.ok()).toBeTruthy();
  56  |     const statusBody = await statusRes.json();
  57  |     expect(statusBody.id).toBe(applicationId);
  58  |     expect(statusBody.status).toBe('PENDING');
  59  |   });
  60  | 
  61  |   test('2. Web UI: Full submission journey from /teacher with instant confirmation and PENDING state display', async ({
  62  |     page,
  63  |   }) => {
  64  |     await page.goto('http://127.0.0.1:3000/teacher');
  65  |     await page.waitForLoadState('networkidle');
  66  | 
  67  |     // Verify main page elements
  68  |     await expect(page.getByRole('heading', { name: 'معلمان' })).toBeVisible();
  69  | 
  70  |     // Click "ثبت درخواست حساب معلم"
  71  |     const openFormBtn = page.locator('button:has-text("ثبت درخواست حساب معلم")').first();
  72  |     await openFormBtn.click();
  73  |     await page.waitForTimeout(400);
  74  | 
  75  |     // Form elements must be visible
> 76  |     await expect(page.getByText(/فرم درخواست همکاری \/ درخواست حساب/)).toBeVisible();
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  77  |     await expect(page.getByText(/ارسال درخواست به منزله دسترسی فوری نیست/)).toBeVisible();
  78  | 
  79  |     // Fill form
  80  |     await page.locator('input[placeholder="مثال: مریم"]').fill('مریم');
  81  |     await page.locator('input[placeholder="مثال: کریمی"]').fill('کریمی');
  82  |     await page.locator('input[placeholder="۰۹۱۲۳۴۵۶۷۸۹"]').fill('09129876543');
  83  |     await page.locator('input[placeholder="دبستان شهید بهشتی"]').fill('دبستان آفتاب');
  84  |     await page.locator('input[placeholder="تهران - منطقه ۵"]').fill('شیراز - ناحیه ۱');
  85  |     await page.locator('textarea').fill('آموزگار ریاضی پایه اول و دوم');
  86  | 
  87  |     // Submit form
  88  |     const submitBtn = page.locator('button:has-text("ارسال درخواست همکاری و بررسی حساب")').first();
  89  |     await submitBtn.click();
  90  |     await page.waitForTimeout(600);
  91  | 
  92  |     // Verify success confirmation card
  93  |     await expect(page.getByText(/درخواست شما با موفقیت ثبت شد/)).toBeVisible({ timeout: 10000 });
  94  |     await expect(page.getByText(/در انتظار بررسی \(PENDING\)/)).toBeVisible();
  95  |     await expect(page.getByText(/کد پیگیری درخواست:/)).toBeVisible();
  96  |     await expect(page.getByText(/مریم کریمی/)).toBeVisible();
  97  |     await expect(page.getByText(/دبستان آفتاب \(شیراز - ناحیه ۱\)/)).toBeVisible();
  98  |   });
  99  | });
  100 | 
```