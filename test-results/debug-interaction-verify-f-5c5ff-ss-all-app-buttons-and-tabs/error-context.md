# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: debug-interaction.spec.ts >> verify full interactivity across all app buttons and tabs
- Location: e2e/web/debug-interaction.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('سارا رضایی').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('سارا رضایی').first() with timeout 5000ms
  - waiting for getByText('سارا رضایی').first()

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
  3   | test('verify full interactivity across all app buttons and tabs', async ({ page }) => {
  4   |   const errors: string[] = [];
  5   |   page.on('pageerror', (err) => errors.push(err.message));
  6   | 
  7   |   await page.goto('http://127.0.0.1:3000/');
  8   |   await page.waitForLoadState('networkidle');
  9   |   await page.waitForTimeout(600);
  10  | 
  11  |   // 1. Test Grade Dropdown interaction
  12  |   const gradeBtn = page.locator('button:has-text("پایه اول")').first();
  13  |   await expect(gradeBtn).toBeVisible({ timeout: 10000 });
  14  |   await gradeBtn.click();
  15  |   await page.waitForTimeout(300);
  16  |   const gradeMenuTitle = page.locator('text=انتخاب پایه تحصیلی (۱ تا ۶)');
  17  |   if (await gradeMenuTitle.isVisible()) {
  18  |     console.log('Grade dropdown opened successfully!');
  19  |     const grade2Btn = page.locator('button:has-text("پایه دوم ابتدایی")').first();
  20  |     if (await grade2Btn.isVisible()) {
  21  |       await grade2Btn.click();
  22  |       await page.waitForTimeout(300);
  23  |       console.log('Grade switched to Grade 2!');
  24  |       const grade2SelectedBtn = page.locator('button:has-text("پایه دوم")').first();
  25  |       await grade2SelectedBtn.click();
  26  |       await page.waitForTimeout(200);
  27  |       const grade1Option = page.locator('button:has-text("پایه اول ابتدایی")').first();
  28  |       await grade1Option.click();
  29  |       await page.waitForTimeout(300);
  30  |     }
  31  |   }
  32  | 
  33  |   // 2. Test Navigation Tabs (Child-focused tabs)
  34  |   // Tab: پروفایل (Profile)
  35  |   const profileTab = page.locator('button:has-text("پروفایل")').first();
  36  |   await profileTab.click();
  37  |   await page.waitForTimeout(300);
  38  |   const profileName = page.getByText('سارا رضایی').first();
> 39  |   await expect(profileName).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  40  |   console.log('Profile tab navigation verified!');
  41  | 
  42  |   // Tab: لیگ‌ها (Leagues)
  43  |   const leaguesTab = page.locator('button:has-text("لیگ‌ها")').first();
  44  |   await leaguesTab.click();
  45  |   await page.waitForTimeout(300);
  46  |   const leaguesHeading = page.locator('text=لیگ دانایی ریاضی').or(page.locator('text=لیگ الماس'));
  47  |   await expect(leaguesHeading.first()).toBeVisible();
  48  |   console.log('Leagues tab navigation verified!');
  49  | 
  50  |   // Tab: مهارت‌ها (Skills / Backpack)
  51  |   const backpackTab = page.locator('button:has-text("مهارت‌ها")').first();
  52  |   await backpackTab.click();
  53  |   await page.waitForTimeout(300);
  54  |   const backpackHeading = page.locator('text=دفترچه دستاوردهای دانایی').or(page.locator('text=مهارت‌های ریاضی'));
  55  |   await expect(backpackHeading.first()).toBeVisible();
  56  |   console.log('Skills/Backpack tab navigation verified!');
  57  | 
  58  |   // Test Secondary Menu: معلمان
  59  |   const secondaryMenuBtn = page.locator('button[title="منوی فرعی تنظیمات و دسترسی‌ها"]').first();
  60  |   if (await secondaryMenuBtn.isVisible()) {
  61  |     await secondaryMenuBtn.click();
  62  |     await page.waitForTimeout(200);
  63  |     const teacherLink = page.locator('a:has-text("معلمان")').first();
  64  |     await expect(teacherLink).toBeVisible();
  65  |     console.log('Secondary menu "معلمان" verified!');
  66  |     // Close secondary menu with Escape key
  67  |     await page.keyboard.press('Escape');
  68  |     await page.waitForTimeout(200);
  69  |   }
  70  | 
  71  |   // Tab: مسیر (Path - Return to Home)
  72  |   const pathTab = page.locator('button:has-text("مسیر")').first();
  73  |   await pathTab.click();
  74  |   await page.waitForTimeout(300);
  75  |   await expect(page.getByText(/نگاره ۱/).first()).toBeVisible();
  76  |   console.log('Returned to Learning Path verified!');
  77  | 
  78  |   // 3. Test Active Learning Stage click (Step 3 or Step 1)
  79  |   const activeNode = page.locator('.path-stone-active').first();
  80  |   if (await activeNode.isVisible()) {
  81  |     await activeNode.click();
  82  |     await page.waitForTimeout(400);
  83  |     const modalCheck = page.locator('text=ماموریت یادگیری').or(page.locator('text=پایان جلسه'));
  84  |     await expect(modalCheck.first()).toBeVisible();
  85  |     console.log('Learning lesson modal opened successfully on node click!');
  86  | 
  87  |     // Close modal
  88  |     const closeBtn = page.locator('button:has-text("✕")').first();
  89  |     if (await closeBtn.isVisible()) {
  90  |       await closeBtn.click();
  91  |       await page.waitForTimeout(300);
  92  |       console.log('Lesson modal closed successfully!');
  93  |     }
  94  |   }
  95  | 
  96  |   // 4. Test Auth Modal (ورود)
  97  |   const authBtn = page.locator('button:has-text("ورود")').first();
  98  |   if (await authBtn.isVisible()) {
  99  |     await authBtn.click();
  100 |     await page.waitForTimeout(300);
  101 |     const authModalHeading = page.locator('text=ورود به ماجراجویی ریاضی');
  102 |     await expect(authModalHeading).toBeVisible();
  103 |     console.log('Auth modal opened successfully!');
  104 | 
  105 |     // Close Auth modal
  106 |     const closeAuthBtn = page.locator('button:has-text("انصراف")').or(page.locator('button:has-text("✕")')).first();
  107 |     if (await closeAuthBtn.isVisible()) {
  108 |       await closeAuthBtn.click();
  109 |       await page.waitForTimeout(300);
  110 |       console.log('Auth modal closed successfully!');
  111 |     }
  112 |   }
  113 | 
  114 |   expect(errors).toEqual([]);
  115 |   console.log('ALL INTERACTIONS PASSED WITH ZERO ERRORS!');
  116 | });
  117 | 
```