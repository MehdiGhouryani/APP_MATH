import {test,expect} from '@playwright/test';
import {BASES,OPTIONS,DEFAULT_AVATAR,normalizeAvatar,migrateLegacyAvatar,readAvatar,writeAvatar,lessonResult} from '../src/avatar-core.mjs';
import {characterSvg} from '../src/character-art.mjs';
const selectScreen=async(page,id)=>{
  await page.getByTestId('screen-picker').click();
  await page.getByRole('option',{name:new RegExp(`^${id} ·`)}).click();
};
test('24 screen templates are reachable, with explicit adult demo gate',async({page})=>{
  await page.goto('/');
  for(let i=1;i<=24;i++){
    const id=`S${String(i).padStart(2,'0')}`;
    await selectScreen(page,id);
    if(i===22){await page.getByRole('switch',{name:'تأیید نمونهٔ والد',exact:true}).click();await page.getByTestId('adult-demo').click();}
    await expect(page.getByTestId('screen-content')).toHaveAttribute('data-screen',id);
    await expect(page.getByTestId('screen-content')).not.toBeEmpty();
  }
});
test('avatar save, reload, cancel and dirty navigation',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'من',exact:true}).click();await page.getByTestId('edit-avatar').click();
  await page.getByRole('radio',{name:'شخصیت: ربات',exact:true}).click();
  await page.getByRole('radio',{name:'کلاه: تاج',exact:true}).click();
  await page.getByTestId('avatar-save').click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shomara-design-avatar-v2')))).toMatchObject({base:'robot',hat:'crown'});
  await page.reload();await page.getByRole('button',{name:'من',exact:true}).click();await page.getByTestId('edit-avatar').click();
  await expect(page.getByRole('radio',{name:'شخصیت: ربات',exact:true})).toHaveAttribute('data-state','on');
  await page.getByRole('radio',{name:'کلاه: کپ',exact:true}).click();await page.getByRole('button',{name:'مسیر',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'خروج بدون تغییر',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shomara-design-avatar-v2')).hat)).toBe('crown');
});
test('onboarding avatar returns to child setup, not profile',async({page})=>{
  await page.goto('/');await selectScreen(page,'S05');await page.getByRole('button',{name:'انتخاب ظاهر',exact:true}).click();
  await page.getByRole('radio',{name:'کلاه: تاج',exact:true}).click();await page.getByTestId('avatar-save').click();
  await expect(page.getByTestId('screen-content')).toHaveAttribute('data-screen','S05');
});
test('lesson retries give calculated first-try accuracy, not hardcoded 100',async({page})=>{
  await page.goto('/');await page.getByTestId('node-1').click();await page.getByTestId('start-lesson').click();
  await page.getByTestId('answer-3').click();await page.getByTestId('check-answer').click();await expect(page.locator('.feedback.wrong')).toBeVisible();
  for(const answer of [4,6,3]){await page.getByTestId(`answer-${answer}`).click();await page.getByTestId('check-answer').click();await page.getByTestId('check-answer').click();}
  await expect(page.getByTestId('screen-content')).toHaveAttribute('data-screen','S12');await expect(page.locator('.result-number')).toHaveText('۶۷٪');
});
test('assessment has no mascot or correctness feedback and never unlocks progress',async({page})=>{
  await page.goto('/');await selectScreen(page,'S06');await page.getByRole('button',{name:'دیدن سنجش نمونه',exact:true}).click();
  for(const answer of [3,5,2]){await expect(page.locator('.phone-content .character')).toHaveCount(0);await page.getByTestId(`answer-${answer}`).click();await page.getByTestId('check-answer').click();await expect(page.locator('.phone-content .feedback')).toHaveCount(0);}
  await expect(page.getByTestId('screen-content')).toHaveAttribute('data-screen','S06');await expect(page.getByRole('heading',{name:'سنجش نمونه تمام شد',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'برگشت به مسیر',exact:true}).click();await expect(page.getByTestId('node-2')).toHaveClass(/locked/);
});
test('offline undownloaded start blocked; cached completion does not unlock',async({page})=>{
  await page.goto('/');await page.getByRole('switch',{name:'شبیه‌سازی آفلاین',exact:true}).click();await selectScreen(page,'S08');
  await page.getByRole('switch',{name:'درس دریافت‌شده',exact:true}).click();await page.getByRole('button',{name:'مرحلهٔ بعدی',exact:true}).click();await expect(page.getByTestId('start-lesson')).toBeDisabled();
  await selectScreen(page,'S08');await page.getByRole('switch',{name:'درس دریافت‌شده',exact:true}).click();await page.getByRole('button',{name:'مرحلهٔ بعدی',exact:true}).click();await page.getByTestId('start-lesson').click();
  for(const a of [4,6,3]){await page.getByTestId(`answer-${a}`).click();await page.getByTestId('check-answer').click();await page.getByTestId('check-answer').click();}
  await page.getByRole('button',{name:'برگشت به مسیر',exact:true}).click();await expect(page.getByTestId('node-2')).toHaveClass(/locked/);
});
test('error recovery and narrow viewport do not overflow',async({page})=>{
  await page.setViewportSize({width:320,height:800});await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=320)).toBe(true);
  await page.getByRole('radio',{name:'خطا',exact:true}).click();await expect(page.getByRole('heading',{name:'این بار نشد',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'دوباره امتحان کن',exact:true}).click();await expect(page.getByTestId('node-1')).toBeVisible();
});
test('avatar core normalizes every option, migrates and handles storage failures',()=>{
  for(const base of BASES)for(const [key,values] of Object.entries(OPTIONS))for(const value of values){const a=normalizeAvatar({...DEFAULT_AVATAR,base,[key]:value});expect(BASES).toContain(a.base);expect(characterSvg(a)).not.toMatch(/NaN|undefined/);}
  expect(normalizeAvatar({base:'unknown',hat:'invalid'})).toMatchObject({base:'human',hat:'none'});
  expect(migrateLegacyAvatar({skinId:5,hairId:'curl',hairColorId:2,accessoryId:'cap'})).toMatchObject({base:'human',skinTone:'deep',hair:'curl',hairColor:'copper',hat:'cap'});
  const broken={getItem(){throw Error('storage')},setItem(){throw Error('storage')}};
  expect(readAvatar(broken).error).toBeTruthy();expect(writeAvatar(broken,DEFAULT_AVATAR).ok).toBe(false);
  expect(lessonResult([{firstTryCorrect:true},{firstTryCorrect:false},{firstTryCorrect:true}],3).accuracy).toBe(67);
});
test('selected wardrobe item remains the same in detail and draft',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'کمد',exact:true}).click();
  await page.locator('.item-grid button').first().click();
  await expect(page.getByRole('heading',{name:'کپ بنفش',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'امتحان در کارگاه',exact:true}).click();
  await expect(page.getByRole('radio',{name:'کلاه: کپ',exact:true})).toHaveAttribute('data-state','on');
});
test('lesson is immersive and back requires an explicit exit',async({page})=>{
  await page.goto('/');await page.getByTestId('node-1').click();await page.getByTestId('start-lesson').click();
  await expect(page.locator('.bottom-nav')).toHaveCount(0);
  await page.getByRole('button',{name:'بازگشت به مسیر',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'ادامه می‌دهم',exact:true}).click();await expect(page.getByTestId('screen-content')).toHaveAttribute('data-screen','S10');
});
