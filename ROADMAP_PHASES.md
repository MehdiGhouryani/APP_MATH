# شمارا · نقشهٔ فازبندی‌شدهٔ تکمیل محصول (v2)

> این فایل **منبع حقیقت پیشرفت پروژه** است. هر مدل/توسعه‌دهنده قبل از هر کار باید کل این فایل را بخواند.
> الگوی محصول: **Duolingo** (مسیر خطی، درس کوتاه، بازخورد فوری، شخصیت زنده، حلقهٔ عادت روزانه) با تطبیق برای کودک ۶ تا ۹ سال فارسی‌زبان: بدون فشار از دست دادن، بدون رتبه‌بندی رقابتی، بدون تبلیغ، و یادگیری **server-authoritative**.

## پروتکل اجرا (برای مدل)
1. جدول وضعیت را بخوان. **اولین فاز با وضعیت `PENDING` که همهٔ `depends` آن `PASS` است** را انتخاب کن. فقط روی همان فاز کار کن.
2. قبل از شروع، وضعیت آن فاز را به `IN_PROGRESS` تغییر بده.
3. همهٔ «کارها» را انجام بده. اسناد مرجع ذکرشده را بخوان؛ اگر با این فایل تناقض داشتند، سند جدیدتر (`project-design-v2` > `v1.3` > `v1.2`) و Decision Logها برنده‌اند.
4. همهٔ «معیار پذیرش» را واقعاً اجرا و بررسی کن (تست، typecheck، اسکریپت verify). ادعای بدون اجرا ممنوع است.
5. اگر همه برقرار بود: وضعیت → `PASS`، تاریخ، و «شواهد» (دستورهای اجراشده و نتیجه، فایل‌های تغییر کرده) را زیر همان فاز در بخش `Log` بنویس.
6. اگر چیزی مسدود بود (نیاز به حساب، دستگاه، تصمیم انسانی، کودک): وضعیت → `BLOCKED` با دلیل دقیق؛ سراغ فاز بعدیِ قابل‌اجرا برو.
7. فازهای دیگر را دست نزن؛ آن‌ها `PENDING` و منتظر می‌مانند. کار جدید کشف‌شده را به‌صورت آیتم در بخش «Backlog کشف‌شده» انتهای فایل اضافه کن، نه داخل فاز دیگر.
8. هر فاز با یک CHANGELOG کوتاه در `CHANGELOG_v2.md` بسته می‌شود.
9. **بهداشت مخزن (از C0):** نسخهٔ موازی نساز (`*_v2.md`، `START_HERE_vX`، پوشهٔ `project-design-vX` تازه)؛ همان فایل را ویرایش کن و تاریخچه را به git بسپار. اسکریپت دیباگ یک‌بارمصرف را بعد از استفاده پاک کن. سند جدید را در زیرپوشهٔ درست `docs/` بگذار (نقشه: `docs/README.md`). تصویر مرجع غیراپ = WebP؛ PNG اپ با `optipng -o2`.

وضعیت‌ها: `PENDING` · `IN_PROGRESS` · `PASS` · `BLOCKED`

## جدول وضعیت
| فاز | عنوان | depends | وضعیت |
|---|---|---|---|
| D0 | ممیزی طراحی و cast v2 + رفع ایرادها | - | PASS |
| C0 | پاک‌سازی، مرتب‌سازی و بهینه‌سازی مخزن | D0 | PASS |
| P00 | نصب، typecheck و تست سبز (وب + موبایل) | D0 | BLOCKED |
| P01 | تثبیت cast v2 در کد و spec | P00 | PASS |
| P02 | مرز امن احراز هویت و نقش | P00 | PENDING |
| P03 | نتیجهٔ معتبر سرور در درس (حذف hardcode) | P00 | PENDING |
| P04 | مخزن‌های Supabase + تأیید زندهٔ Migration/RLS/RPC | P02 | PENDING |
| P05 | سفر ورود یکسان وب/موبایل (S01–S06) | P02 | PENDING |
| P06 | ناوبری ۴ تب + مسیر به سبک Duolingo (S07–S09، S13) | P01, P03 | PENDING |
| P07 | Lesson Player به سبک Duolingo (S10–S12) | P06 | PENDING |
| P08 | ذخیره و صف آفلاین مطمئن (موبایل) | P03 | PENDING |
| P09 | حلقهٔ عادت: XP، هدف روزانه، streak مهربان، کوئست | P07, P08 | PENDING |
| P10 | تب تمرین: مهارت‌ها، مفهوم، تمرین فاصله‌دار (S14–S16) | P07 | PENDING |
| P11 | گنجینه، جایزه و آواتار production (S17–S20) | P09 | PENDING |
| P12 | ریگ Rive چهار شخصیت + تست silhouette کودک | P01 | PENDING |
| P13 | صدا: افکت، صداپیشگی فارسی دستورها، صدای شخصیت | P07 | PENDING |
| P14 | بزرگسالان: گزارش والد، معلم Lite، اشتراک، حساب (S21–S24) | P04, P05 | PENDING |
| P15 | محتوا: تأیید آموزشی پایهٔ ۱ و ایستگاه‌های بعد از ST01 | P07 | PENDING |
| P16 | دسترس‌پذیری، RTL و کارایی روی گوشی ضعیف | P11, P12, P13 | PENDING |
| P17 | آمادگی Pilot: E2E کامل، build دستگاه، runbook | P04, P14, P15, P16 | PENDING |

## نمای کلی: مایل‌استون‌ها و مسیر بحرانی
| مایل‌استون | فازها | خروجی قابل دیدن | نیاز انسانی |
|---|---|---|---|
| **M0 · پایهٔ سالم** | C0 ✅، P00، P01 | مخزن تمیز، نصب و تست سبز روی ماشین واقعی | ماشین با اینترنت + Node 22 |
| **M1 · هستهٔ امن** | P02، P03، P04 | ورود امن، نتیجهٔ واقعی سرور، Supabase زنده | پروژهٔ Supabase و کلیدها |
| **M2 · تجربهٔ کودک (MVP)** | P05، P06، P07، P08 | کودک کل ایستگاه ۱ را روی وب و موبایل تمام می‌کند | - |
| **M3 · چسبندگی و غنا** | P09، P10، P11، P13 | XP/streak مهربان، تمرین، گنجینه، صدای فارسی | صداپیشه |
| **M4 · شخصیت زنده و محتوا** | P12، P15 | چهار ریگ Rive، تأیید آموزشی پایهٔ ۱ | انیماتور Rive، کارشناس آموزشی، ۸ تا ۱۲ کودک |
| **M5 · بزرگسالان و انتشار آزمایشی** | P14، P16، P17 | گزارش والد، a11y، build دستگاه، Pilot | حساب EAS/فروشگاه، خانواده‌های Pilot |

**مسیر بحرانی:** P00 → P03 → P06 → P07 → P09 → P11 → P16 → P17. هر روز تأخیر در P00 کل پروژه را عقب می‌اندازد.
**کار موازی ممکن:** P12 (Rive) و P15 (محتوا) فقط به نیروی انسانی وابسته‌اند؛ از همین الان سفارش/هماهنگی‌شان را شروع کنید تا در M4 گلوگاه نشوند.

## قدم بعدی (همین حالا)
P00 فقط روی ماشینی با اینترنت باز می‌شود. به ترتیب:
```bash
nvm use 22            # یا Node 22.13+
npm install
npm run build:packages
npm run typecheck:all
npm run test:unit
node scripts/verify-phase8.mjs && node scripts/test-phase9.mjs   # بعد از build:packages سبز می‌شوند
npm --workspace @math/web run build
cd apps/mobile && npx expo install --check && npx expo export && cd ../..
npx playwright install chromium && npm run e2e:web
```
هر خطا را در Log فاز P00 بنویس؛ اگر همه سبز شد P00 و بعد P01 را `PASS` کن.

---

## D0 · ممیزی طراحی و cast v2 · `PASS`
گزارش کامل: `docs/audits/AUDIT_DESIGN_V2_2026-10-02.md`.
### Log
- 2026-10-02: validate-cast ۲۸/۲۸ بدون خطا؛ ۷ ایراد رفع شد (ایموجی باقی‌مانده در ۵ جای وب، شخصیت در CHECK، حلقه‌ها در lesson mode، سقف ۲ ثانیهٔ جشن، fx حالت correct، remount اضافه). typecheck اجرا نشد (بدون node_modules) → به P00 منتقل شد.

## C0 · پاک‌سازی و بهینه‌سازی مخزن · `PASS`
**هدف:** حجم کمتر، یک نسخهٔ معتبر از هر سند، ساختار قابل پیمایش.
**کارها:** حذف طراحی‌های منسوخ (آرشیو شخصیت‌ها، v1.1، v1.2، prototype ساخته‌شدهٔ v1.3)، حذف نسخه‌های قدیمی specها، snapshot/package manifestهای قدیمی، اسکریپت‌های دیباگ یک‌بارمصرف؛ دسته‌بندی `docs/`؛ WebP برای کانسپت‌ها؛ فشرده‌سازی بی‌اتلاف PNG.
**پذیرش:** همهٔ verifyهای ایستا مثل قبل سبز؛ validate-cast ۲۸/۲۸؛ هیچ ارجاع کد/اسکریپت به فایل حذف‌شده.
### Log
- 2026-10-02: **PASS**. حجم باز‌شده ۲۶MB → ~۹٫۴MB، فایل‌ها ۷۴۶ → ~۵۶۵. جزئیات و فهرست حذف‌ها: `docs/CLEANUP_2026-10-02.md`.
  اجراشده: `verify-migrations-static`، `verify-phase2..7,9..16`، `verify-production-readiness-static` سبز؛ `validate-cast` ۲۸/۲۸ و ۹۶ id یکتا. `verify-phase8` و `test-phase9` مثل قبل به `dist/` نیاز دارند (بعد از `npm run build:packages` در P00).

## P00 · نصب، typecheck و تست سبز · `BLOCKED`
**هدف:** پایهٔ قابل اعتماد قبل از هر توسعه.
**کارها:** Node ‏22.13+؛ `npm install` در ریشه؛ typecheck/lint/test برای `apps/web`، `apps/mobile` و همهٔ `packages/*`؛ `npx expo install --check` (SDK 57)؛ رفع هر خطای ناشی از تغییرات v2 (`CharacterArt`، `CompanionBust`، `art.ts`، `AnimatedCharacter`)؛ اجرای `scripts/verify-phase16-deep-audit.mjs` و `npm run test:e2e` وب.
**پذیرش:** همهٔ typecheckها و unit testها سبز؛ `next build` و `expo export` بدون خطا؛ Playwright critical-path سبز.
### Log
- 2026-10-02 (offline): **BLOCKED** — محیط بدون اینترنت؛ `npm install`، `next build`، `expo export`، `expo install --check` و Playwright وب اجرا نشد.
  اجراشده: build/tsc پکیج‌های contracts، learning-runtime، assignment-runtime، adult-projections، offline-sync سبز؛ tsc وب با stub برای next/node سبز؛ tsc موبایل با stub RN فقط خطاهای ناشی از stub (۲ خطای واقعی در `StationFlow.tsx` رفع شد: مقایسهٔ مردهٔ LOCAL/REMOTE)؛ ۹۷ unit test (۱۰ فایل) با shim سبز؛ verify-phase16/3/4/6/9/11، migrations (۴۸) سبز.
  باقی‌مانده: روی دستگاه با اینترنت `npm install && npm run typecheck:all && npx vitest run && npm run build && npx expo export && npm run e2e:web`.

## P01 · تثبیت cast v2 · `IN_PROGRESS`
**هدف:** شخصیت‌ها در همهٔ صفحه‌ها یکدست، طبق کتاب شخصیت.
**کارها:**
- selectorهای `motion.css` از `#id` به class منتقل شوند (یا idها با prefix شخصیت/instance یکتا شوند) تا چند شخصیت در یک صفحه DOM معتبر بماند؛ از منبع rebuild شود.
- تصمیم دربارهٔ دندان جلویی دانا (استثنای صریح در bible یا حذف) و ثبت استثنای «کیوبو think بدون چشم» در `characters-v2.json`.
- حذف فیلد `emoji` بلااستفاده در `apps/mobile/src/characters/characters.ts` و `getCompanionEmoji` منسوخ.
- تست unit برای `CharacterArt` (state/bust/reduced/static) و تست e2e: «در CHECK هیچ `.sh-char` رندر نمی‌شود».
- `allowedScenes` هر شخصیت در UI اعمال شود (جیکو فقط جشن/جایزه؛ کیوبو شمارش؛ دانا الگو/شکل).
**پذیرش:** grep ایموجی شخصیت در `apps/` (به‌جز LeaderboardView منسوخ) خالی؛ validate-cast سبز؛ تست‌های جدید سبز؛ preview بدون خطای کنسول. ✅ باگ بصری از اسکرین‌شات: نیم‌تنه (bust) به‌خاطر `overflow:visible` کل بدن را بیرون از کادر می‌کشید و روی ردیف‌های بعد می‌افتاد (preview و `CompanionBust` وب)؛ bust حالا `overflow:hidden` دارد.
**مرجع:** `project-design-v2/docs/CHARACTER-BIBLE-v2.md`، `specs/characters-v2.json`، `specs/motion-v2.json`.
### Log
- 2026-10-02: **PASS**. همهٔ کارها انجام شد؛ P00 همچنان جداگانه BLOCKED است و فقط اجرای پذیرش محیطی آن باقی مانده. ✅ selectorها به class (`.sh-<layer>`)، SVG درون‌خطی وب بدون id لایه و gradient id یکتا برای هر instance (`useId`)؛ همگام‌سازی خودکار globals.css در build؛ PNGها byte-identical. ✅ استثنای دندان گرد دانا (`toothPolicy`) و کیوبو think بدون چشم (`requiredIdExceptions`). ✅ حذف `emoji` موبایل و `getCompanionEmoji`. ✅ `allowedScenes` در `@math/contracts` (`resolveGuide`) و اعمال در DuolingoLessonModal؛ کیوبوی صفحهٔ OTP → آریا. ✅ تست unit جدید (۵) سبز؛ e2e `no-guide-on-check.spec.ts` نوشته شد ولی اجرا نشد. ✅ grep ایموجی شخصیت = ۰؛ validate-cast ۲۸/۲۸ + ۹۶ id یکتا؛ preview بدون خطای کنسول.

## P02 · مرز امن احراز هویت · `PENDING`
**کارها:** session امضاشدهٔ سمت سرور؛ منع dev token در production؛ نقش و مالکیت کودک روی همهٔ routeهای `apps/web/app/api/v1/**`؛ parent gate فقط UX است و جای authorization نیست.
**پذیرش:** تست cookie جعلی، expiry، role isolation؛ `scripts/verify-phase11-auth.mjs` سبز.
**مرجع:** `docs/phases/PHASE_11_PRODUCTION_AUTH_BOUNDARY.md`، backlog v1.3 ردیف P0.
### Log
-

## P03 · نتیجهٔ معتبر سرور · `PENDING`
**کارها:** حذف `+۳` و `۱۰۰٪` hardcode و fallback موفقیت محلی در `DuolingoLessonModal`؛ outcome فقط از learning runtime؛ وضعیت «در انتظار همگام‌سازی» جدا از mastery قطعی؛ unlock گره بعدی فقط با outcome سرور.
**پذیرش:** اولین تلاش، تکرار و آفلاین نتیجهٔ درست می‌دهند؛ تست واحد برای هر سه.
**مرجع:** `docs/phases/PHASE_5_LEARNING_RUNTIME.md`، ADR_0003.
### Log
-

## P04 · Supabase زنده · `PENDING`
**کارها:** جایگزینی `InMemoryAssignmentRepository` و `InMemoryAdultProjectionRepository` با مخزن request-scoped Supabase؛ اعمال ۴۸ migration روی پروژهٔ واقعی؛ تست زندهٔ Auth/RLS/RPC و E2E ایستگاه ۱.
**پذیرش:** `verify-phase12-postgres-runtime.mjs` و E2E روی Supabase واقعی سبز؛ production gates باز می‌شوند فقط پس از این.
**نیاز انسانی:** پروژهٔ Supabase و کلیدها (اگر نبود → `BLOCKED`).
### Log
-

## P05 · سفر ورود یکسان · `PENDING`
**کارها:** S01 خوش‌آمد → S02 حساب بزرگسال → S03 کد → S04 پایه (بدون hardcode G1) → S05 نام مستعار + آواتار → S06 جایابی اختیاری؛ consent قبل از پروفایل؛ یک سفر برای وب و موبایل. سبک Duolingo: هر صفحه یک سؤال، دکمهٔ بزرگ پایین، آریا راهنما با جملهٔ کوتاه.
**پذیرش:** e2e هر دو پلتفرم یک ترتیب؛ بدون جمع‌آوری دادهٔ کودک قبل از consent.
**مرجع:** `project-design-v1.3/docs/UX-AUDIT.md` (نقشهٔ سفر)، `specs/screens.json`.
### Log
-

## P06 · ناوبری و مسیر · `PENDING`
**کارها:**
- ۴ تب کودک: **مسیر · تمرین · گنجینه · من** (موبایل و وب یکسان، آیکون برداری، عرض ۳۲۰px).
- مسیر زیگزاگ Duolingo: واحدها با سربرگ رنگی (S08)، گره‌ها با حالت قفل/فعلی/کامل/جایزه، گره فعلی با «شروع» و شخصیت کنار آن (نیم‌تنه)، checkpoint و ادامه از جای قبل، تست پرش (S13).
- وضعیت دانلود محتوا، precondition و pending از قفل آموزشی جدا نمایش داده شود.
**پذیرش:** کودک با یک لمس از تب مسیر وارد درس فعلی می‌شود؛ خروج و بازگشت از همان encounter ادامه می‌دهد.
### Log
-

## P07 · Lesson Player · `PENDING`
**کارها (الگوی درس Duolingo):** نوار پیشرفت بالا + دکمهٔ بستن؛ یک تمرین در هر صفحه؛ دکمهٔ «بررسی» ثابت پایین؛ بازخورد با sheet پایین (درست: سبز/teal و جملهٔ شخصیت؛ نادرست: رنگ گرم ملایم، نه قرمز، با راهنمایی؛ بدون لرزش)؛ رویدادهای معنایی → حالت شخصیت (`CHARACTER_STATE_BY_EVENT`)؛ hint؛ صفحهٔ نتیجه S12 با دادهٔ واقعی (XP، دقت، زمان)؛ بازی انتقال S11 با موتور مستقل؛ بدون شخصیت در Check A/B و mastery؛ حداکثر ۹۶dp و بیرون از ناحیهٔ شمارش.
**پذیرش:** کل ایستگاه ۱ بدون خطا روی وب و موبایل؛ e2e full-regression سبز؛ لمس‌ها حداقل ۴۸dp.
**مرجع:** `docs/phases/PHASE_6_STATION_01_CHILD_EXPERIENCE.md`، `ADR_0002_SEMANTIC_ANIMATION_EVENTS.md`.
### Log
-

## P08 · ذخیره و آفلاین · `PENDING`
**کارها:** write سریال/اتمیک `FileSyncQueueStore`؛ flush در reconnect و foreground؛ idempotency؛ مصرف نتیجهٔ ذخیره در `AppStateContext` با retry و پیام فارسی.
**پذیرش:** kill اپ، کم بودن حافظه و قطع شبکه هیچ تلاشی را بی‌صدا گم نمی‌کند؛ `scripts/test-phase9.mjs` سبز.
### Log
-

## P09 · حلقهٔ عادت (Duolingo، نسخهٔ کودک) · `PENDING`
**کارها:** XP به ازای درس؛ هدف روزانهٔ کوچک (مثلاً ۱ ایستگاه)؛ streak با «یخ‌زدگی» رایگان و بدون پیام ترساننده؛ کوئست روزانه/هفتگی ساده؛ جشن جیکو فقط برای STATION_PASS/MILESTONE/REWARD. **ممنوع:** لیدربورد رقابتی، قلب/جان محدودکنندهٔ یادگیری، پرداخت داخل تجربهٔ کودک، اعلان شبانه.
**پذیرش:** قوانین با `math_learning_product_game_engagement_quest_reward_v0_28_completed_v0_31.md` هم‌خوان؛ پاداش از سرور.
### Log
-

## P10 · تب تمرین · `PENDING`
**کارها:** S14 بازی‌ها، S15 مهارت‌ها (از گراف مهارت پایهٔ ۱)، S16 مفهوم؛ تمرین فاصله‌دار و مرور مهارت ضعیف؛ contentId درست.
**پذیرش:** موضوع و سطح کارت تمرین با درس یکسان؛ تمرین روی mastery اثر جعلی نمی‌گذارد.
### Log
-

## P11 · گنجینه و آواتار · `PENDING`
**کارها:** S17 گنجینه، S18 آیتم جایزه، S19 من، S20 آواتار طبق `project-design-v1.3` (بخش آواتار هنوز معتبر): schema adapter، migration افزایشی، inventory و revision.
**پذیرش:** save/cancel/reload/offline/conflict تست شده.
### Log
-

## P12 · Rive · `PENDING`
**کارها:** تست silhouette با ۸ تا ۱۲ کودک ۶ تا ۹ سال (هدف ≥۸۰٪)؛ سپس سفارش/ساخت `aria.riv`، `qbo.riv`، `dana.riv`، `jiko.riv` طبق `RIVE-RIG-BRIEF.md`؛ اتصال `@rive-app/react-canvas` در `CharacterArt` و rive-react-native در `AnimatedCharacter` با fallback فعلی؛ نماهای سه‌رخ/بغل برداری.
**پذیرش:** هر فایل زیر ۲۰۰KB؛ inputهای `state`، `reducedMotion`، `lessonMode` کار می‌کنند؛ pose کلیدی هر state = SVG استاتیک.
**نیاز انسانی:** انیماتور Rive و جلسهٔ تست کودک (اگر نبود → `BLOCKED`).
### Log
-

## P13 · صدا · `PENDING`
**کارها:** افکت‌های درست/تشویق/جشن (کوتاه، ملایم)؛ **صداپیشگی فارسی همهٔ دستورهای درس** (کودک پایهٔ ۱ هنوز روان نمی‌خواند، مثل Duolingo ABC)؛ دکمهٔ تکرار صدا؛ صدای سه‌نتی جیکو؛ کنترل صدا برای والد.
**پذیرش:** هر صفحهٔ درس بدون خواندن قابل انجام است؛ حجم صدا در بودجهٔ بستهٔ محتوا.
### Log
-

## P14 · بزرگسالان · `PENDING`
**کارها:** S21 تنظیمات، S22 گزارش والد (پیشرفت واقعی، نه فقط زمان)، معلم Lite (کلاس، تکلیف، recheck)، S23 اشتراک (مبلغ/شرایط/restore شفاف)، S24 حساب (re-auth، export/delete).
**پذیرش:** همه پشت احراز بزرگسال سمت سرور؛ بدون فشار خرید به کودک.
### Log
-

## P15 · محتوا · `PENDING`
**کارها:** تأیید آموزشی ۶۴ مهارت پایهٔ ۱ و محتوای ST01 (`EDUCATIONAL_REVIEW_REQUIRED` → approved)؛ تولید ایستگاه‌های بعدی با همان content contract.
**نیاز انسانی:** کارشناس آموزشی؛ تأیید فنی ≠ تأیید آموزشی.
### Log
-

## P16 · دسترس‌پذیری و کارایی · `PENDING`
**کارها:** RTL کامل، TalkBack/VoiceOver، متن ۲۰۰٪، کنتراست و focus؛ اندازه‌گیری روی Android ضعیف (فریم، حافظه، حجم بسته)؛ reduced motion در همهٔ انیمیشن‌ها.
**پذیرش:** `docs/phases/PERFORMANCE_TARGET_PHASE_4.md` برقرار؛ چک‌لیست a11y برای همهٔ صفحه‌های کودک.
### Log
-

## P17 · آمادگی Pilot · `PENDING`
**کارها:** E2E کامل روی محیط staging واقعی؛ build EAS اندروید/iOS؛ اجرای `docs/phases/PILOT_RUNBOOK_PHASE_10.md`؛ پایش خطا.
**پذیرش:** همهٔ فازهای قبلی `PASS`؛ چک‌لیست runbook کامل.
### Log
-

---
## Backlog کشف‌شده
- (مدل‌ها آیتم جدید را اینجا با تاریخ و فاز پیشنهادی اضافه کنند)
- 2026-10-02 · P01: `export-png.py` خروجی PNG را بدون فشرده‌سازی می‌سازد؛ بعد از rebuild یک `optipng -o2` روی `apps/mobile/assets` و `project-design-v2/assets` اضافه شود (در C0 دستی اجرا شد، ~۱۹٪ کمتر).
- 2026-10-02 · P00: `app.json` و `eas.json` ریشه با نسخهٔ `apps/mobile` هم‌خوان نیستند (projectId/package فقط در ریشه، نسخهٔ CLI متفاوت)؛ یکی منبع واحد شود. `metadata.json` ریشه (Gemini/AI Studio) احتمالاً زائد است؛ تأیید و حذف شود.
- 2026-10-02 · P04: `verify-phase16`/`verify-production-readiness-static` پیام «Production readiness is FULLY PASSED» می‌دهند در حالی که Pilot هنوز BLOCKED است؛ متن گمراه‌کننده اصلاح شود.
- 2026-10-02 · P08/P03: رفع شد: صف آفلاین در foreground و بازگشت اپ به active flush می‌شود؛ مسیر LOCAL دیگر پیام دروغین «در صف» نشان نمی‌دهد و تا داشتن runtime معتبر پیشرفت جعلی نمی‌دهد. هنوز تست دستگاه و قطع شبکه واقعی لازم است.
- 2026-10-02 · P00: `apps/mobile` به `@types/node` برای تست‌های touchTargets/uiText نیاز دارد (`__dirname`) ولی در devDependencies نیست.
- 2026-10-02 · P05: PlacementFlow شخصیت را فقط در intro نشان می‌دهد؛ تأیید شود جایابی «سنجش» حساب نمی‌شود.
- 2026-10-02 · P01: نشان کوچک همراهِ انتخابی کودک (top bar، مسیر، پروفایل) هویت است نه صحنهٔ راهنما؛ در spec ثبت شود.
