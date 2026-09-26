import { chromium } from '@playwright/test';

async function diagnose() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    console.error(`[BROWSER UNCAUGHT PAGE ERROR]`, err);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('\n--- 1. Testing Tab Navigation ---');
  // Click on Backpack tab
  console.log('Clicking "مهارت‌ها" tab...');
  await page.click('button:has-text("مهارت‌ها")');
  await page.waitForTimeout(500);
  let pageText = await page.innerText('body');
  console.log('Does body contain "کوله‌پشتی"?:', pageText.includes('کوله‌پشتی'));

  // Click on Adults tab
  console.log('Clicking "والدین/معلم" tab...');
  await page.click('button:has-text("والدین/معلم")');
  await page.waitForTimeout(500);
  pageText = await page.innerText('body');
  console.log('Does body contain "پنل همراهان"?:', pageText.includes('پنل همراهان'));

  // Click on Profile tab
  console.log('Clicking "پروفایل" tab...');
  await page.click('button:has-text("پروفایل")');
  await page.waitForTimeout(500);
  pageText = await page.innerText('body');
  console.log('Does body contain "پروفایل دانایی"?:', pageText.includes('پروفایل دانایی'));

  // Switch back to Path tab
  console.log('Clicking "مسیر" tab...');
  await page.click('button:has-text("مسیر")');
  await page.waitForTimeout(500);
  pageText = await page.innerText('body');
  console.log('Does body contain "خانه و صبحانه خانوادگی"?:', pageText.includes('خانه و صبحانه خانوادگی'));

  console.log('\n--- 2. Testing Path Node Click (Opening Lesson Modal) ---');
  const pathNodes = await page.$$('.path-stone-node');
  console.log(`Found ${pathNodes.length} path stone nodes`);
  if (pathNodes.length > 0) {
    console.log('Clicking first node (Step 1)...');
    await pathNodes[0].click();
    await page.waitForTimeout(500);
    pageText = await page.innerText('body');
    console.log('Is lesson modal visible (contains "بررسی پاسخ" or "بشمار")?:', pageText.includes('بررسی پاسخ') || pageText.includes('بشمار'));

    // Check if there are options inside modal and click one
    const optionCards = await page.$$('.math-choice-card');
    console.log(`Found ${optionCards.length} choice cards inside modal`);
    if (optionCards.length > 0) {
      console.log('Clicking on choice option...');
      await optionCards[0].click();
      await page.waitForTimeout(300);
      console.log('Clicked choice option successfully.');
    }

    // Close the modal
    const closeBtn = await page.$('button[aria-label="بستن درس"]');
    if (closeBtn) {
      console.log('Clicking close button in modal...');
      await closeBtn.click();
      await page.waitForTimeout(500);
      pageText = await page.innerText('body');
      console.log('Modal closed, back to path?:', pageText.includes('خانه و صبحانه خانوادگی'));
    }
  }

  console.log('\n--- 3. Testing Grade Selector Dropdown ---');
  const gradeBtn = await page.$('button:has-text("پایه اول")');
  if (gradeBtn) {
    console.log('Clicking grade selector button...');
    await gradeBtn.click();
    await page.waitForTimeout(300);
    pageText = await page.innerText('body');
    console.log('Is Grade dropdown visible (contains "پایه دوم")?:', pageText.includes('پایه دوم'));
  }

  await browser.close();
  console.log('\n--- DIAGNOSTIC COMPLETE ---');
}

diagnose().catch(console.error);
