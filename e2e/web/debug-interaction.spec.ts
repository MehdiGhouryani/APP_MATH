import { test, expect } from '@playwright/test';

test('verify full interactivity across all app buttons and tabs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);

  // 1. Test Grade Dropdown interaction
  const gradeBtn = page.locator('button:has-text("پایه اول")').first();
  await expect(gradeBtn).toBeVisible({ timeout: 10000 });
  await gradeBtn.click();
  await page.waitForTimeout(300);
  const gradeMenuTitle = page.locator('text=انتخاب پایه تحصیلی (۱ تا ۶)');
  if (await gradeMenuTitle.isVisible()) {
    console.log('Grade dropdown opened successfully!');
    const grade2Btn = page.locator('button:has-text("پایه دوم ابتدایی")').first();
    if (await grade2Btn.isVisible()) {
      await grade2Btn.click();
      await page.waitForTimeout(300);
      console.log('Grade switched to Grade 2!');
      const grade2SelectedBtn = page.locator('button:has-text("پایه دوم")').first();
      await grade2SelectedBtn.click();
      await page.waitForTimeout(200);
      const grade1Option = page.locator('button:has-text("پایه اول ابتدایی")').first();
      await grade1Option.click();
      await page.waitForTimeout(300);
    }
  }

  // 2. Test Navigation Tabs (Child-focused tabs)
  // Tab: پروفایل (Profile)
  const profileTab = page.locator('button:has-text("پروفایل")').first();
  await profileTab.click();
  await page.waitForTimeout(300);
  const profileName = page.getByText('سارا رضایی').first();
  await expect(profileName).toBeVisible();
  console.log('Profile tab navigation verified!');

  // Tab: لیگ‌ها (Leagues)
  const leaguesTab = page.locator('button:has-text("لیگ‌ها")').first();
  await leaguesTab.click();
  await page.waitForTimeout(300);
  const leaguesHeading = page.locator('text=لیگ دانایی ریاضی').or(page.locator('text=لیگ الماس'));
  await expect(leaguesHeading.first()).toBeVisible();
  console.log('Leagues tab navigation verified!');

  // Tab: مهارت‌ها (Skills / Backpack)
  const backpackTab = page.locator('button:has-text("مهارت‌ها")').first();
  await backpackTab.click();
  await page.waitForTimeout(300);
  const backpackHeading = page.locator('text=دفترچه دستاوردهای دانایی').or(page.locator('text=مهارت‌های ریاضی'));
  await expect(backpackHeading.first()).toBeVisible();
  console.log('Skills/Backpack tab navigation verified!');

  // Test Secondary Menu: معلمان
  const secondaryMenuBtn = page.locator('button[title="منوی فرعی تنظیمات و دسترسی‌ها"]').first();
  if (await secondaryMenuBtn.isVisible()) {
    await secondaryMenuBtn.click();
    await page.waitForTimeout(200);
    const teacherLink = page.locator('a:has-text("معلمان")').first();
    await expect(teacherLink).toBeVisible();
    console.log('Secondary menu "معلمان" verified!');
    // Close secondary menu with Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Tab: مسیر (Path - Return to Home)
  const pathTab = page.locator('button:has-text("مسیر")').first();
  await pathTab.click();
  await page.waitForTimeout(300);
  await expect(page.getByText(/نگاره ۱/).first()).toBeVisible();
  console.log('Returned to Learning Path verified!');

  // 3. Test Active Learning Stage click (Step 3 or Step 1)
  const activeNode = page.locator('.path-stone-active').first();
  if (await activeNode.isVisible()) {
    await activeNode.click();
    await page.waitForTimeout(400);
    const modalCheck = page.locator('text=ماموریت یادگیری').or(page.locator('text=پایان جلسه'));
    await expect(modalCheck.first()).toBeVisible();
    console.log('Learning lesson modal opened successfully on node click!');

    // Close modal
    const closeBtn = page.locator('button:has-text("✕")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(300);
      console.log('Lesson modal closed successfully!');
    }
  }

  // 4. Test Auth Modal (ورود)
  const authBtn = page.locator('button:has-text("ورود")').first();
  if (await authBtn.isVisible()) {
    await authBtn.click();
    await page.waitForTimeout(300);
    const authModalHeading = page.locator('text=ورود به ماجراجویی ریاضی');
    await expect(authModalHeading).toBeVisible();
    console.log('Auth modal opened successfully!');

    // Close Auth modal
    const closeAuthBtn = page.locator('button:has-text("انصراف")').or(page.locator('button:has-text("✕")')).first();
    if (await closeAuthBtn.isVisible()) {
      await closeAuthBtn.click();
      await page.waitForTimeout(300);
      console.log('Auth modal closed successfully!');
    }
  }

  expect(errors).toEqual([]);
  console.log('ALL INTERACTIONS PASSED WITH ZERO ERRORS!');
});
