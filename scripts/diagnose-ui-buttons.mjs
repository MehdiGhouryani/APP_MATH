import { chromium } from '@playwright/test';

async function diagnoseButtonsDetailed() {
  console.log('=== DETAILED UI BUTTON DIAGNOSTICS ===\n');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const uncaughtErrors = [];

  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    uncaughtErrors.push(err.toString());
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('✅ Loaded http://localhost:3000');
  } catch (err) {
    console.error('❌ Failed to load page:', err.message);
    await browser.close();
    return;
  }

  // Check all path nodes
  console.log('\n--- DIAGNOSING PATH STONES ---');
  const nodes = page.locator('.path-stone-node');
  const count = await nodes.count();
  console.log(`Found ${count} path stone nodes.`);

  for (let i = 0; i < count; i++) {
    const nodeBtn = nodes.nth(i);
    const text = await nodeBtn.innerText();
    const isVisible = await nodeBtn.isVisible();
    console.log(`Node ${i + 1}: Visible=${isVisible}, Content="${text.trim().replace(/\n/g, ' ')}"`);

    try {
      await nodeBtn.click({ timeout: 2000 });
      console.log(`  -> Clicked Node ${i + 1}`);
      await page.waitForTimeout(300);

      // Check if modal popped up
      const checkBtn = page.locator('button:has-text("بررسی پاسخ")').first();
      if (await checkBtn.isVisible()) {
        console.log(`  🎉 Modal OPENED successfully for Node ${i + 1}!`);
        // Close it
        const closeBtn = page.locator('button[aria-label="بستن پنجره تمرین"]').first();
        await closeBtn.click();
        await page.waitForTimeout(300);
      } else {
        console.log(`  ⚠️ Modal did NOT open for Node ${i + 1}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed click on Node ${i + 1}:`, err.message);
    }
  }

  console.log('\n--- DIAGNOSING OTHER TAB BUTTONS & INTERACTION ---');
  // Check Backpack view
  const backpackTab = page.locator('button:has-text("مهارت‌ها")').first();
  await backpackTab.click();
  await page.waitForTimeout(300);
  console.log('Clicked Backpack Tab');

  // Check Profile view
  const profileTab = page.locator('button:has-text("پروفایل")').first();
  await profileTab.click();
  await page.waitForTimeout(300);
  console.log('Clicked Profile Tab');

  // Check companion selector in profile
  const companions = page.locator('.companion-card, button:has-text("آریا"), button:has-text("کیوبو")');
  console.log(`Found ${await companions.count()} companion selection buttons in profile`);

  await browser.close();
  console.log('\n=== DIAGNOSTICS COMPLETE ===');
}

diagnoseButtonsDetailed().catch(console.error);
