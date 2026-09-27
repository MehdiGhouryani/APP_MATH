import { chromium } from '@playwright/test';

async function run() {
  console.log('=== DETAILED BROWSING INTERACTION DIAGNOSTICS ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push(`[CONSOLE ${msg.type().toUpperCase()}] ${text}`);
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${text}`);
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err);
    console.error(`[BROWSER UNCAUGHT EXCEPTION]`, err.stack || err.message || err);
  });

  try {
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle', timeout: 5000 });
    console.log('✅ Page loaded successfully');

    console.log('\n--- Clicking "مهارت‌ها" tab ---');
    const backpackTab = page.locator('button:has-text("مهارت‌ها")').first();
    await backpackTab.click();
    await page.waitForTimeout(500);

    console.log('\n--- Checking if view changed ---');
    const pageText = await page.innerText('body');
    console.log('Does body contain "دستاوردهای دانایی" or "کوله‌پشتی"?:', pageText.includes('دستاوردهای دانایی') || pageText.includes('کوله‌پشتی'));

    console.log('\n--- Clicking "پایه اول" Grade Selector ---');
    const gradeBtn = page.locator('button:has-text("پایه اول")').first();
    await gradeBtn.click();
    await page.waitForTimeout(500);

    console.log('\n--- Checking if grade menu visible ---');
    const isMenuVisible = await page.locator('text=انتخاب پایه تحصیلی').first().isVisible();
    console.log('Is Grade Menu visible?:', isMenuVisible);

  } catch (err) {
    console.error('❌ Interaction failed with error:', err.message);
  }

  await browser.close();
  console.log('\n=== DIAGNOSTICS END ===');
  if (pageErrors.length > 0) {
    console.log(`\n❌ Found ${pageErrors.length} uncaught browser errors!`);
  } else {
    console.log('\n✅ Zero uncaught browser errors found!');
  }
}

run().catch(console.error);
