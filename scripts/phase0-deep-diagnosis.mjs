import { chromium } from '@playwright/test';

async function runDetailedPhase0() {
  console.log('=== RUNNING PHASE 0 FULL AUTOMATION DIAGNOSTIC ===');
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

  // 1. Load Homepage
  console.log('\n[TEST 1] Homepage Loading');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const title = await page.title();
  console.log(`  -> Title: "${title}" | Loaded: OK`);

  // 2. Page & Console Errors
  console.log('\n[TEST 2 & 3] Errors Check');
  console.log(`  -> Page Errors: ${uncaughtErrors.length}`);
  console.log(`  -> Console Errors: ${consoleLogs.filter(l => l.startsWith('[ERROR]')).length}`);

  // 4. React Hydration State
  console.log('\n[TEST 4] React Hydration');
  const isHydrated = await page.evaluate(() => {
    return document.readyState === 'complete' && !!document.querySelector('main');
  });
  console.log(`  -> ReadyState Complete & Main element present: ${isHydrated}`);

  // 5. Injected isolated button test
  console.log('\n[TEST 5] Injected Isolated State Test');
  const stateResult = await page.evaluate(() => {
    let state = 0;
    const btn = document.createElement('button');
    btn.id = 'isolated-btn';
    btn.onclick = () => { state += 1; btn.setAttribute('data-state', String(state)); };
    document.body.appendChild(btn);
    btn.click();
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return { state, domState: btn.getAttribute('data-state') };
  });
  console.log(`  -> DOM click & dispatchEvent updated state to: ${stateResult.state} (DOM attr: ${stateResult.domState})`);
  await page.locator('#isolated-btn').click();
  const pointerState = await page.evaluate(() => {
    const btn = document.getElementById('isolated-btn');
    const val = btn.getAttribute('data-state');
    btn.remove();
    return val;
  });
  console.log(`  -> Real Pointer Click updated state to: ${pointerState}`);

  // 6. Bottom Navigation
  console.log('\n[TEST 6] Bottom Navigation');
  for (const tabName of ['مهارت‌ها', 'والدین/معلم', 'پروفایل', 'مسیر']) {
    const tabLocator = page.locator(`button:has-text("${tabName}")`).first();
    const btnVisible = await tabLocator.isVisible();
    const btnEnabled = await tabLocator.isEnabled();
    const hitTest = await tabLocator.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      const style = window.getComputedStyle(el);
      return {
        pointerEvents: style.pointerEvents,
        zIndex: style.zIndex,
        box: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        topElTag: topEl?.tagName,
        isClickTarget: el.contains(topEl) || topEl === el,
      };
    });
    console.log(`  -> Tab [${tabName}]: Visible=${btnVisible}, Enabled=${btnEnabled}, pointer-events=${hitTest.pointerEvents}, topEl=<${hitTest.topElTag}> (target=${hitTest.isClickTarget})`);
    await tabLocator.click();
    await page.waitForTimeout(200);
  }

  // 7. Grade Selector
  console.log('\n[TEST 7] Grade Selector Dropdown');
  const gradeBtn = page.locator('button:has-text("پایه اول")').first();
  console.log(`  -> Grade button visible: ${await gradeBtn.isVisible()}`);
  await gradeBtn.click();
  await page.waitForTimeout(200);
  const grade2Option = page.locator('button:has-text("پایه دوم")').first();
  const dropdownOpened = await grade2Option.isVisible();
  console.log(`  -> Grade Dropdown Opened & "پایه دوم" Visible: ${dropdownOpened}`);
  if (dropdownOpened) {
    await gradeBtn.click(); // close
    await page.waitForTimeout(100);
  }

  // 8. Path Node & Lesson Modal
  console.log('\n[TEST 8] Path Node 1 Interaction');
  // Ensure we are on "مسیر" tab
  await page.locator('button:has-text("مسیر")').first().click();
  await page.waitForTimeout(200);

  const node1 = page.locator('.path-stone-node').first();
  const node1Visible = await node1.isVisible();
  const node1Text = (await node1.innerText()).trim().replace(/\n/g, ' ');
  const node1Hit = await node1.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const style = window.getComputedStyle(el);
    return {
      pointerEvents: style.pointerEvents,
      topElTag: topEl?.tagName,
      topElClass: topEl?.className,
      isTarget: el.contains(topEl) || topEl === el,
      box: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
    };
  });
  console.log(`  -> Node 1: Text="${node1Text}", Visible=${node1Visible}, Box=${JSON.stringify(node1Hit.box)}, topEl=<${node1Hit.topElTag} class="${node1Hit.topElClass}"> (isTarget=${node1Hit.isTarget})`);

  console.log('  -> Clicking Node 1...');
  await node1.click();
  await page.waitForTimeout(400);

  // 9. Inside Lesson Modal: Option Selection
  console.log('\n[TEST 9] Inside Lesson Modal: Option Selection');
  const modalHeader = page.locator('button[aria-label="بستن درس"]').first();
  const isModalOpen = await modalHeader.isVisible();
  console.log(`  -> Modal Visible: ${isModalOpen}`);

  const choices = page.locator('.math-choice-card');
  const choiceCount = await choices.count();
  console.log(`  -> Choice cards found: ${choiceCount}`);

  if (choiceCount > 0) {
    const firstChoice = choices.first();
    const choiceText = (await firstChoice.innerText()).trim();
    const choiceHit = await firstChoice.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      const style = window.getComputedStyle(el);
      return {
        pointerEvents: style.pointerEvents,
        topElTag: topEl?.tagName,
        isTarget: el.contains(topEl) || topEl === el,
      };
    });
    console.log(`  -> First Option: Text="${choiceText}", pointer-events=${choiceHit.pointerEvents}, topEl=<${choiceHit.topElTag}> (isTarget=${choiceHit.isTarget})`);

    console.log(`  -> Clicking option "${choiceText}"...`);
    await firstChoice.click();
    await page.waitForTimeout(300);
    const isSelected = await firstChoice.evaluate((el) => el.classList.contains('math-choice-card-selected') || el.className.includes('selected') || el.className.includes('amber'));
    console.log(`  -> Option selection visual state active: ${isSelected}`);
  }

  // 10. "بررسی کن" Button
  console.log('\n[TEST 10] "بررسی کن" Button');
  const verifyBtn = page.locator('button:has-text("بررسی کن")').first();
  if (await verifyBtn.count() > 0) {
    const verifyInfo = await verifyBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      const style = window.getComputedStyle(el);
      return {
        disabled: el.disabled,
        className: el.className,
        pointerEvents: style.pointerEvents,
        topElTag: topEl?.tagName,
        topElClass: topEl?.className,
      };
    });
    console.log(`  -> Verify Button: Disabled=${verifyInfo.disabled}, Class="${verifyInfo.className}", pointer-events=${verifyInfo.pointerEvents}, topEl=<${verifyInfo.topElTag} class="${verifyInfo.topElClass}">`);

    if (!verifyInfo.disabled) {
      console.log('  -> Clicking "بررسی کن"...');
      await verifyBtn.click();
      await page.waitForTimeout(400);

      // Check feedback message or continue button
      const continueBtn = page.locator('button:has-text("ادامه")').first();
      const hasContinue = await continueBtn.isVisible();
      console.log(`  -> Evaluation triggered & "ادامه" button appeared: ${hasContinue}`);
    }
  }

  // Close modal
  if (await modalHeader.isVisible()) {
    console.log('\n[CLEANUP] Closing lesson modal...');
    await modalHeader.click();
    await page.waitForTimeout(200);
    console.log(`  -> Modal closed: ${!(await modalHeader.isVisible())}`);
  }

  console.log('\n=== PHASE 0 DIAGNOSTIC COMPLETE ===');
  await browser.close();
}

runDetailedPhase0().catch((e) => {
  console.error('Diagnostic error:', e);
  process.exit(1);
});
