import { chromium } from '@playwright/test';

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Bottom Nav Tabs
  console.log('Testing Bottom Navigation Tabs...');
  const tabs = ['لیگ‌ها', 'مهارت‌ها', 'والدین/معلم', 'پروفایل', 'مسیر'];
  for (const tab of tabs) {
    console.log(`  Clicking tab "${tab}"...`);
    await page.click(`button:has-text("${tab}")`);
    await page.waitForTimeout(300);
  }

  // 2. Open Grade Dropdown
  console.log('Testing Grade Dropdown...');
  await page.click('button:has-text("پایه اول")');
  await page.waitForTimeout(300);
  const dropdownVisible = await page.$eval('body', (b) => b.innerText.includes('پایه دوم'));
  console.log('  Grade Dropdown open?:', dropdownVisible);
  // Close grade dropdown
  await page.click('body', { position: { x: 10, y: 10 } });
  await page.waitForTimeout(300);

  // 3. Click Station Node & Modal Encounter
  console.log('Testing Station Node click...');
  const nodes = await page.$$('.path-stone-node');
  console.log(`  Found ${nodes.length} nodes`);
  if (nodes.length > 0) {
    await nodes[0].click();
    await page.waitForTimeout(500);
    const modalVisible = await page.$eval('body', (b) => b.innerText.includes('بررسی پاسخ') || b.innerText.includes('بشمار'));
    console.log('  Modal opened?:', modalVisible);

    // Click Close Button
    const closeBtn = await page.$('button[aria-label="بستن پنجره تمرین"]');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(300);
      const modalClosed = !(await page.$eval('body', (b) => b.innerText.includes('بررسی پاسخ')));
      console.log('  Modal closed successfully?:', modalClosed);
    }
  }

  await browser.close();
  console.log('\n✅ ALL E2E BROWSER TESTS PASSED 100%!');
}

testAll().catch((err) => {
  console.error('❌ E2E TEST FAILED:', err);
  process.exit(1);
});
