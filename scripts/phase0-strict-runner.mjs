import { chromium } from '@playwright/test';

async function runPhase0DiagnosisStrict() {
  const report = {
    rootCause: '',
    affectedElements: [],
    proof: [],
    localVsPreviewResult: '',
    exactFixRequired: [],
  };

  console.log('----------------------------------------------------');
  console.log('      PHASE 0 — STRICT PLAYWRIGHT VERIFICATION      ');
  console.log('----------------------------------------------------\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });

  const consoleLogs = [];
  const uncaughtErrors = [];

  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', (err) => {
    uncaughtErrors.push(err.toString());
  });

  // 1. Homepage load
  console.log('1. Loading Homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const pageTitle = await page.title();
  console.log(`   Page loaded. Title: "${pageTitle}"`);

  // 2 & 3. Errors
  console.log(`2. Page errors count: ${uncaughtErrors.length}`);
  console.log(`3. Console errors count: ${consoleLogs.filter((l) => l.type === 'error').length}`);

  // 4. React Hydration
  const hydrationStatus = await page.evaluate(() => {
    return {
      readyState: document.readyState,
      hasMain: !!document.querySelector('main'),
      hasButtons: document.querySelectorAll('button').length,
    };
  });
  console.log(`4. React Hydration: readyState=${hydrationStatus.readyState}, buttonsCount=${hydrationStatus.hasButtons}`);

  // 5. Isolated State Injected Button
  const isolatedResult = await page.evaluate(async () => {
    let count = 0;
    const btn = document.createElement('button');
    btn.id = 'isolated-test-button';
    btn.textContent = 'Count: 0';
    btn.onclick = () => {
      count++;
      btn.textContent = `Count: ${count}`;
    };
    document.body.appendChild(btn);

    btn.click(); // DOM click
    const domCount = count;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true })); // dispatchEvent
    const dispatchCount = count;

    return { domCount, dispatchCount };
  });
  const testLocator = page.locator('#isolated-test-button');
  await testLocator.click(); // Pointer click
  const pointerText = await testLocator.innerText();
  await page.evaluate(() => document.getElementById('isolated-test-button')?.remove());
  console.log(`5. Isolated Button: DOM click=${isolatedResult.domCount}, dispatchEvent=${isolatedResult.dispatchCount}, Pointer click="${pointerText}" (Expected: Count: 3)`);

  // 6. Bottom Navigation
  console.log('6. Testing Bottom Navigation...');
  const bottomNavTabs = ['مهارت‌ها', 'والدین/معلم', 'پروفایل', 'مسیر'];
  for (const tab of bottomNavTabs) {
    const tabBtn = page.locator(`nav button:has-text("${tab}"), footer button:has-text("${tab}"), button:has-text("${tab}")`).first();
    const isVis = await tabBtn.isVisible();
    const hitData = await tabBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      const style = window.getComputedStyle(el);
      return {
        pointerEvents: style.pointerEvents,
        topTag: top?.tagName,
        isTarget: el.contains(top) || top === el,
      };
    });
    console.log(`   -> Tab [${tab}]: visible=${isVis}, pointerEvents=${hitData.pointerEvents}, isTarget=${hitData.isTarget}`);
    await tabBtn.click();
    await page.waitForTimeout(200);
  }

  // 7. Grade Selector Dropdown
  console.log('7. Testing Grade Selector Dropdown...');
  const gradeBtn = page.locator('button:has-text("پایه اول")').first();
  await gradeBtn.click();
  await page.waitForTimeout(200);
  const grade2 = page.locator('button:has-text("پایه دوم")').first();
  const isMenuOpen = await grade2.isVisible();
  console.log(`   -> Grade Menu opened: ${isMenuOpen}`);
  // Close menu by clicking Grade 1 option
  const grade1Option = page.locator('button:has-text("پایه اول ابتدایی"), button:has-text("پایه اول")').last();
  await grade1Option.click();
  await page.waitForTimeout(200);

  // 8. Path Node 1
  console.log('8. Testing Path Node 1...');
  const node1 = page.locator('.path-stone-node').first();
  const node1Info = await node1.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const style = window.getComputedStyle(el);
    return {
      pointerEvents: style.pointerEvents,
      topTag: top?.tagName,
      topClass: top?.className,
      isTarget: el.contains(top) || top === el,
      rect,
    };
  });
  console.log(`   -> Node 1: pointerEvents=${node1Info.pointerEvents}, topEl=<${node1Info.topTag} class="${node1Info.topClass}">, isTarget=${node1Info.isTarget}`);
  await node1.click();
  await page.waitForTimeout(300);

  // 9. Lesson Modal & Choice Selection
  console.log('9. Inside Lesson Modal: Choice Selection...');
  const choice5 = page.locator('.math-choice-card:has-text("۵"), button.math-choice-card').nth(2);
  const choice5Vis = await choice5.isVisible();
  const choice5Info = await choice5.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const style = window.getComputedStyle(el);
    return {
      pointerEvents: style.pointerEvents,
      topTag: top?.tagName,
      isTarget: el.contains(top) || top === el,
      text: el.innerText.trim(),
    };
  });
  console.log(`   -> Choice Button (text="${choice5Info.text}"): visible=${choice5Vis}, pointerEvents=${choice5Info.pointerEvents}, isTarget=${choice5Info.isTarget}`);
  await choice5.click();
  await page.waitForTimeout(200);

  // 10. "بررسی کن" Button
  console.log('10. Testing "بررسی کن" Button...');
  const verifyBtn = page.locator('button:has-text("بررسی کن")').first();
  const verifyInfo = await verifyBtn.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const style = window.getComputedStyle(el);
    return {
      disabled: el.disabled,
      className: el.className,
      pointerEvents: style.pointerEvents,
      topTag: top?.tagName,
      isTarget: el.contains(top) || top === el,
    };
  });
  console.log(`   -> Verify Button: disabled=${verifyInfo.disabled}, class="${verifyInfo.className}", pointerEvents=${verifyInfo.pointerEvents}, isTarget=${verifyInfo.isTarget}`);
  await verifyBtn.click();
  await page.waitForTimeout(300);

  const continueBtn = page.locator('button:has-text("ادامه")').first();
  const continueVisible = await continueBtn.isVisible();
  console.log(`   -> "ادامه" Feedback button appeared: ${continueVisible}`);

  // Close modal
  const closeBtn = page.locator('button[aria-label="بستن درس"]').first();
  await closeBtn.click();
  await page.waitForTimeout(200);

  console.log('\n----------------------------------------------------');
  console.log('            PHASE 0 VERIFICATION FINISHED           ');
  console.log('----------------------------------------------------');
  await browser.close();
}

runPhase0DiagnosisStrict().catch(console.error);
