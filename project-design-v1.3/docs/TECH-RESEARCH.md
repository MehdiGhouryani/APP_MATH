# ممیزی آمادگی فناوری شومارا (ریاضی فارسی پایهٔ ۱ تا ۶)

تاریخ بررسی منابع و بازنگری: ۲۰۲۶-۱۰-۰۲
محدوده: `APP_MATH-main`، پکیج‌های root/mobile/web، ADRهای ۱ تا ۴، state/auth/offline/animation و قراردادهای عملکرد. این گزارش **ممیزی ایستا** است؛ build، نصب وابستگی، اجرای Expo/Next، EAS یا پروفایل دستگاه انجام نشده و PASS اجرایی ادعا نمی‌شود.

## خلاصهٔ تصمیم

**پشتهٔ فعلی را حفظ کنید و بازنویسی نکنید:** TypeScript مشترک، React Native + Expo Router + Hermes + New Architecture برای موبایل، Next.js App Router + React برای وب، و runtimeهای مشترک learning/offline/contracts. این تصمیم با ADR-0001 (خطوط ۱۲–۱۸) و پکیج‌های root/mobile/web هم‌راستاست. Expo SDK `~57.0.24` با React Native `0.86.0` و React `19.2.3` در `apps/mobile/package.json` همان نگاشت رسمی SDK 57 به RN 0.86/React 19.2.3 است ([مرجع رسمی Expo SDK 57](https://docs.expo.dev/versions/v57.0.0)). `app.json` نیز Hermes و `newArchEnabled: true` را قفل کرده است.

**Rive برای کاراکتر و تعامل‌های برداری مناسب است، اما هنوز در محصول پیاده نشده است.** وابستگی موبایل `@rive-app/react-native: 0.4.20` و `react-native-nitro-modules: ^0.33.2`، از نظر حداقل‌های رسمی runtime جدید، با RN 0.78+/Expo 53+/Nitro 0.33.2+ سازگار است؛ ولی صفحهٔ رسمی Rive، runtime جدید `v0.5` را beta می‌خواند و توصیه می‌کند قبل از مهاجرت، آخرین `v0.4` و APIهای async تثبیت شوند ([React Native](https://rive.app/docs/runtimes/react-native/react-native)، [Migration](https://rive.app/docs/runtimes/react-native/migration-guide)). بنابراین فعلاً **روی 0.4.20 pin بمانید، APIهای async را در نمونهٔ واقعی تأیید کنید، سپس spike کنترل‌شدهٔ 0.5 بسازید؛ ارتقای بی‌دلیل/سراسری ممنوع.**

**وب هنوز Rive ندارد:** `apps/web/package.json` هیچ `@rive-app/react-*` ندارد؛ `RiveCompanionMascot.tsx` نام Rive دارد اما SVG procedural/ CSS است. موبایل هم در مسیر واقعی درس `CharacterSays`/emoji می‌نمایاند؛ `AnimatedCharacter` فقط در آزمایشگاه معنایی import می‌شود. هیچ `.riv` در repository پیدا نشد. پس «character runtime» و parity بین web/mobile آمادهٔ تولید نیست.

## منابع رسمی و نتیجهٔ فنی

### ۱) Rive React Native: Nitrogen، legacy و قرارداد نسخه

- [راهنمای React Native رسمی Rive](https://rive.app/docs/runtimes/react-native/react-native): runtime جدید بر Nitro ساخته شده؛ RN 0.78+، Expo 53+، iOS 15.1+، Android SDK 24+ و Nitro 0.25.2+ را فهرست می‌کند و legacy را جداگانه توضیح می‌دهد.
- [راهنمای افزودن به Expo](https://rive.app/docs/runtimes/react-native/adding-rive-to-expo): نصب جدید `@rive-app/react-native` است؛ کتابخانهٔ native در Expo Go موجود نیست و باید development build استفاده شود.
- [راهنمای مهاجرت](https://rive.app/docs/runtimes/react-native/migration-guide): `v0.5` بازسازی‌شده روی native runtime است و هنوز beta؛ برای `v0.4.19+` مسیر امن، APIهای async است. state-machine inputs، text runs و events قدیمی به سمت Data Binding مهاجرت داده می‌شوند.
- [مخزن/feature support runtime جدید](https://github.com/rive-app/rive-nitro-react-native): state machine، data binding، asset management، `RiveView`/`useRiveFile` و error handling پشتیبانی می‌شوند؛ animation selection برنامه‌ریزی نشده و روش اصلی باید state machine باشد. Accessibility semantics در RN فعلاً وضعیت partial/در حال توسعه دارد.

**اثر برای شومارا:**
1. dependency فعلی از نظر حداقل نسخه قابل دفاع است؛ `react-native-nitro-modules` نیز در حداقل اعلام‌شدهٔ package است.
2. `apps/mobile/src/components/AnimatedCharacter.tsx:22-37` از `useRiveFile`/`RiveView` استفاده می‌کند، اما هیچ state machine name، ViewModel یا binding ندارد. `Fit.Layout` به‌تنهایی اتصال semantic event به Rive نیست.
3. `apps/mobile/src/animation/AnimationController.ts:19-24` فقط event را به enum محلی state نگاشت می‌کند. `StationFlow.tsx:18-19,43-45,98-100,130` controller را dispatch می‌کند ولی component Rive را render نمی‌کند؛ مسیر واقعی همچنان `CharacterSays` در `StationFlow.tsx:397-412` است.
4. قرارداد event باید مستقل بماند (ADR-0002 خطوط ۵–۱۲)، اما mapping نهایی باید در یک adapter ثبت شود: `semantic event → ViewModel bool/trigger → Rive state machine`. نام inputهای قدیمی را به learning code نشت ندهید.

### ۲) Rive وب، state machine و data binding

- [React runtime](https://rive.app/docs/runtimes/react/react): برای کنترل state machine/data binding از hooks استفاده کنید؛ مقداردهی قبل از اولین frame باید در `onRiveReady` انجام شود، چون hookهای binding بعد از load/اولین render اجرا می‌شوند.
- [React state machines](https://rive.app/docs/runtimes/react/state-machines): کنترل مستقیم state محدود و عمدی است؛ state machine از transitionهای شرطی بر اساس Data Binding استفاده می‌کند.
- [Web data binding](https://rive.app/docs/runtimes/web/data-binding): ترجیح با اتصال ViewModel به state machine است؛ این کار artboard را هم اعمال می‌کند.
- [Web renderer انتخابی](https://rive.app/docs/runtimes/web/canvas-vs-webgl): `@rive-app/webgl2` برای fidelity/performance و قابلیت‌های renderer، `@rive-app/canvas` برای گرافیک ساده‌تر/بستهٔ کوچک‌تر، و `canvas-lite` فقط وقتی text/layout/audio/scripting لازم نیست. چند instance وب باید محدود و lifecycle آن‌ها cleanup شود.
- [Rive feature support](https://rive.app/docs/feature-support): runtimeهای قدیمی webgl و `rive-react-native` deprecated هستند؛ state-machine events و text-runهای legacy نیز deprecated و Data Binding روش توصیه‌شده است.

**تصمیم وب:** برای صفحه‌های دارای یک شخصیت پیچیده، یک spike با `@rive-app/react-webgl2` و `autoBind`/`onRiveReady` بسازید؛ برای فهرست‌های متعدد یا دستگاه ضعیف، `react-canvas` را benchmark کنید. package وب فعلاً نصب نشده است؛ تا قبل از asset واقعی، dependency به production اضافه نکنید. در هر دو target، manifest asset باید `fileHash`, `artboard`, `stateMachine`, `schemaVersion`, `reducedMotionPath`, license/owner و fallback را داشته باشد.

### ۳) reduced motion و دسترس‌پذیری

- [Rive Reduced Motion](https://rive.app/docs/editor/accessibility/reduced-motion): Rive خودکار reduced motion را اعمال نمی‌کند؛ اپ باید ترجیح کاربر را بخواند و propertyای مثل `prefersReducedMotion` را با Data Binding وارد فایل کند. راهبردها: مسیر state-machine جدا، سرعت صفر/کم، جایگزینی حرکت با تغییر رنگ/opacity.
- [Rive Semantics web](https://rive.app/docs/runtimes/web/semantics): semantics وب experimental/opt-in است و باید در editor تعریف شود؛ canvas به‌تنهایی برای assistive technology قابل مشاهده نیست.
- [Rive best practices](https://rive.app/docs/getting-started/best-practices): روی دستگاه ضعیف تعداد animationهای هم‌زمان را کم کنید، autoplay را خاموش/فایل static یا artboard سبک ارائه دهید و واقعاً روی دستگاه هدف تست کنید.

در کد فعلی موبایل، reduced-motion فقط در `AnimatedCharacter.tsx:40-79` پیاده شده؛ اما این component در مسیر درس render نمی‌شود. وب در `RiveCompanionMascot.tsx:38-46,74,87-100,303-308` و `InteractiveCompanion.tsx:63-107` CSS animation/bounce/ping دارد و مسیر `prefers-reduced-motion` ندارد. بنابراین گیت reduced-motion **فعلاً قرمز** است. fallback باید همان semantic outcome را به صورت static text/pose منتقل کند، نه صرفاً حذف تصویر.

### ۴) «برداری شبیه 3D» در برابر 3D واقعی

Rive runtime برای شومارا انتخاب **2D vector/state-machine** است، نه game-engine یا مدل 3D. انیمیشن‌های لایه‌ای، depth cue، shadow، parallax و چرخش محدود می‌توانند حس حجم بدهند؛ اما mesh، دوربین، نورپردازی و هندسهٔ 3D واقعی را نباید وعده داد. منبع رسمی Rive در [انتخاب renderer](https://rive.app/docs/runtimes/choose-a-renderer/overview) از rendererهای 2D و نیاز برخی قابلیت‌ها به Rive Renderer صحبت می‌کند؛ مسیرهای 3D در مستندات خاص برخی runtimeها/rendererها هستند و نباید برای RN/Web عمومی فرض شوند. برای mini-gameهایی که واقعاً canvas سفارشی می‌خواهند، ADR-0001 خطوط ۱۵–۱۶ Skia را optional نگه داشته؛ Unity اضافه نکنید.

### ۵) مجوز و هزینه

- [Rive runtimes](https://rive.app/docs/runtimes/getting-started) و [Rive runtimes overview](https://rive.app/runtimes): runtimeهای رسمی open-source و MIT هستند و برای استفادهٔ شخصی/تجاری آزادند.
- [Export for runtime](https://rive.app/docs/editor/exporting/exporting-for-runtime) و [Pricing](https://rive.app/docs/account-admin/pricing): export فایل `.riv` برای runtime در plan پولی است. [اعلام رسمی pricing](https://rive.app/blog/rive-s-new-9-mo-plan) می‌گوید runtime fee ندارد ولی export تولیدی نیاز به plan shipping دارد؛ student plan برای کار شخصی آموزشی است، نه محصول تجاری/تیمی.

**نتیجهٔ حقوقی:** MIT بودن runtime به معنی رایگان‌بودن export/editor یا مجوز assetهای community نیست. قبل از تولید assetها، plan سازمان/تیمی، مالکیت فایل‌های طراحی، فونت/صدا و درج NOTICE مربوط به MIT ثبت شود.

## الگوی Duolingo: چه چیزی قابل اقتباس است و چه چیزی نیست

منابع رسمی:

- [Duolingo: Teaching Owlgebra / math](https://blog.duolingo.com/developing-math/): Math ابتدا iOS و Swift بود؛ برای Android و cross-platform، Rive را برای ورودی‌های برنامه‌پذیر و تعامل‌های پیچیده‌تر به کار بردند، در کنار dynamic drawing کدی برای visualهای ریاضی.
- [Duolingo: world characters/visemes](https://blog.duolingo.com/world-character-visemes/): Rive state machine برای ترکیب pose/mouth و واکنش real-time؛ runtime file کوچک‌تر از ویدئو و handoff به engineer.
- [Duolingo: Android reboot](https://blog.duolingo.com/duolingo-android-reboot-2021/): Android آن‌ها native و مشکل frame/interaction داشت؛ repository + MVVM و اندازه‌گیری frame/ANR، نه ادعای اینکه هر cross-platform stack همان نتیجه را می‌دهد.
- [Rive دربارهٔ creative technologists در Duolingo](https://rive.app/blog/creative-technologists-duolingo-s-solution-to-the-designer-to-developer-handoff): animator در Rive، creative technologist برای state-machine/spec و engineer برای integration؛ complexity کمتر به performance بهتر کمک می‌کند.

**درس معماری:** Duolingo خودِ محصول را با یک game-engine واحد حل نکرد؛ برای math ترکیب dynamic drawing و Rive را انتخاب کرد و تیم/فرایند تخصصی handoff دارد. این از ADR-0001 پشتیبانی می‌کند، اما stack موبایل Duolingo را به‌عنوان الزام شومارا ثابت نمی‌کند. شومارا باید TypeScript/Expo را حفظ کند و برای visualهای عددی data-driven drawing/React native primitives را کنار Rive character به کار ببرد، نه اینکه همهٔ سؤال‌ها را در Rive بسازد.

## ممیزی ایستای پشته و runtime

| حوزه | شواهد repository | ارزیابی |
|---|---|---|
| Mobile stack | root `package.json`; `apps/mobile/package.json` | React Native/Expo/TS/Hermes/New Architecture انتخاب سالم و هم‌راستا با ADR؛ migration به Swift/Kotlin/Unity توجیه ندارد. |
| Web stack | `apps/web/package.json`: Next 16.3.6, React 19.2.3؛ `next.config.ts` | Next App Router/TS انتخاب مناسب برای parent/teacher/API. مستندات رسمی [TS](https://nextjs.org/docs/app/api-reference/config/typescript) آن را built-in می‌داند. |
| Shared domain | `packages/contracts`, `learning-runtime`, `assignment-runtime`, `offline-sync` | مرزهای learning truth و transport خوب جدا شده‌اند؛ ADR-0003 خطوط ۱–۱۸ server-authoritative را قفل کرده است. |
| Rive mobile | dependency 0.4.20 + Nitro؛ `AnimatedCharacter.tsx` | adapter آزمایشی وجود دارد، asset/state binding و route production ندارند. |
| Rive web | package ندارد؛ `RiveCompanionMascot.tsx` SVG است | نام‌گذاری گمراه‌کننده؛ یک registry و adapter مشترک لازم است. |
| persistence | `AppStateContext.tsx:28-45`; `appStateStore.ts:4-79` | local file versioned/atomic queue برای projection و resume خوب است؛ progress learning truth نیست، مطابق ADR-0003. هیچ avatar/equip در schema نیست. |
| offline | `FileSyncQueueStore.ts:4-45`; `OfflineSyncManager:24-40`; `runtimeApi.ts:219-239` | at-least-once/idempotency سرور طراحی شده؛ mobile reconnect listener/flush خودکار دیده نشد و offline remote start در production متوقف می‌شود. |
| auth | `teacher-auth.ts:164-181,220-245`; `request-principal.ts:95-105` | cookie فقط base64 و unsigned است؛ dev path credential را عملاً بررسی نمی‌کند؛ قبل از production باید اصلاح و staging تست شود. |

## یافته‌های پرریسک با خط و اثر UX

### P0 — Rive واقعی و parity وجود ندارد

- هیچ `.riv` در repository یافت نشد.
- `apps/mobile/src/components/CharacterAvatar.tsx:5-15`: emoji placeholder؛ `AnimatedCharacter.tsx:68-79` source اختیاری و fallback emoji.
- `StationFlow.tsx:397-412`: component واقعی نمایش‌دهنده `CharacterSays` است؛ `AnimatedCharacter` فقط در `SemanticAnimationDemo.tsx` استفاده می‌شود.
- وب `RiveCompanionMascot.tsx:103-310` و `InteractiveCompanion.tsx:87-300` SVG دستی است، نه Rive.

**اثر:** اهداف «character equip / production character / semantic animation» قابل تحویل اعلام نشوند تا asset pipeline و runtime adapter واقعی اضافه و روی موبایل/وب parity شود.

### P0 — آواتار کودک و تجهیز اصلاً در app state نیست

`appStateCore.ts:12-17` فقط `childName`, `gradeId`, `consentAt` دارد؛ `AppState` در خطوط 46–54 avatar/equipment ندارد. `apps/mobile/app/(tabs)/profile.tsx:9-29` آریا و دوستان را به‌جای avatar کودک نشان می‌دهد. `apps/web/components/ProfileView.tsx:25-59` نیز companion emoji را نقش profile avatar داده است. در عین حال طراحی canonical در `project-design-v1.2/specs/avatar-options.json` و `implementation/avatar-contract.ts` وجود دارد ولی به runtime وصل نیست.

**اثر:** equip با reload، logout، device دوم و offline قابل اتکا نیست. تصمیم: schema migration additive به v2 برای `profile.avatar`/cosmetic envelope، draft/save/cancel، revision server و fallback deterministic؛ identity guide را با child avatar قاطی نکنید.

### P0 — خطر احراز هویت در teacher web

`apps/web/lib/teacher-auth.ts:164-181` payload session را فقط base64 می‌کند و در cookie می‌گذارد؛ امضای HMAC/JWT/اعتبارسنجی server-side در read مسیر `220-245` دیده نمی‌شود. هر دارندهٔ cookie می‌تواند محتوای نقش را دست‌کاری کند مگر middleware/API دیگری مستقل جلوی آن را بگیرد؛ این یک ریسک قطعیِ static code است، نه اثبات exploit اجراشده.

همچنین dev seed در خطوط 16–34 یک `passwordHashPlaceholder` دارد، اما مسیر `142-149` فقط `password.length < 4` را می‌سنجد و مقدار password را با placeholder مقایسه نمی‌کند. این باید فقط در dev صریح باقی بماند و در production build/route حذف شود. `request-principal.ts:95-105` نیز در non-production یا وقتی Supabase URL نیست، dev identity/header را می‌پذیرد؛ گیت release باید عدم وجود این fallbackها در production را تست کند.

### P1 — خطای save بعد از onboarding به UI برنمی‌گردد

`AppStateContext.tsx:41-45` در `apply` state را فوراً در حافظه و UI اعمال می‌کند و `void saveState(next)` را بدون await/گزارش خطا اجرا می‌کند؛ فقط `completeOnboarding` در خطوط 47–55 نتیجهٔ save را بررسی می‌کند. بنابراین resume، شروع/پایان station یا activity می‌تواند موفق به نظر برسد اما در خطای دیسک/فضا بعد از بستن اپ از بین برود. `appStateStore.ts` خطا را به `false` تبدیل می‌کند، ولی caller عمومی آن را مصرف نمی‌کند. باید save queue نتیجه‌دار، retry و پیام فارسی/نقطهٔ امن داشته باشد؛ تست kill/low-storage نیز لازم است.

### P1 — offline mobile پس از reconnect خودکار flush نمی‌شود

`MobileSyncManager.ts:25-26` manager می‌سازد؛ `runtimeApi.ts:207` فقط بعد از موفقیت network `void syncManager.flush()` دارد. در مسیر network error، `runtimeApi.ts:219-239` action را enqueue می‌کند اما flush نمی‌کند. جست‌وجوی source هیچ `NetInfo`/listener یا `setOnline` موبایل پیدا نکرد؛ `setOnline` فقط در `OfflineSyncManager.ts:14` تعریف شده. در نتیجه صف روی disk می‌ماند مگر مسیر دیگری manager را flush کند.

**اثر:** نتیجهٔ آفلاین persist می‌شود ولی «بازگشت اتصال → ارسال» قابل اثبات نیست؛ action در UI حالت `PENDING_SYNC` دارد و پاسخ correct قطعی نمی‌دهد که با server-authoritative مرزبندی درست است، ولی باید status/pending UX و reconnect worker تکمیل شود.

### P1 — store صف موبایل atomic/serialized نیست

`FileSyncQueueStore.ts:16-27,42-45` هر put/update را read-modify-write می‌کند، بدون mutex/queue و بدون temp+move. app-state store برعکس، queue سریال و temp+move دارد (`appStateStore.ts:4-19,68-79`). هم‌زمانی enqueue/flush یا kill وسط write می‌تواند actionهای دیگر را از فایل حذف/خراب کند؛ تست restart فعلی برای app state است، نه FileSyncQueueStore واقعی.

### P1 — شروع آفلاین production با remote flag ممکن نیست

`StationFlow.tsx:30` با وجود `EXPO_PUBLIC_API_BASE_URL` mode را REMOTE می‌کند. `ensureSession()` در خطوط 64–84 در production failure را به `REMOTE_RUNTIME_UNAVAILABLE` تبدیل می‌کند؛ local fallback فقط `__DEV__` است. بنابراین کاربر production که اینترنت را پیش از start از دست دهد، با وجود localContent/cache نمی‌تواند station را شروع کند. اگر سیاست محصول «offline-first» است باید session/encounter قابل cache/resume و server reconciliation تعریف شود؛ اگر نه، UX باید صریحاً «این درس هنوز آماده نیست» بگوید و ادعای offline کامل نکند.

### P1 — مسیر S09 و auto-start با قرارداد UX ناسازگار

`StationFlow.tsx:316-323` station را خودکار start می‌کند و comment می‌گوید no extra start screen؛ ممیزی طراحی نیز S09 CTA شروع/ادامه را لازم می‌داند (`project-design-v1.2/qa/audit.md:38`). این علاوه بر UX، زمان شروع session و مصرف fast-track را مبهم می‌کند. CTA مشخص باید قبل از `startStation`/session باشد، با «شروع / ادامه / از اول».

### P1 — performance فقط synthetic است

هدف docs [PHASE_10](../../shomara/original/Shomara-Design-v1.2/APP_MATH-main/docs/PHASE_10_E2E_PERFORMANCE_PILOT.md) و `runtimeBudget.ts:1-9`: 60 FPS/16.67ms، sync batch 20، cache 80MB. `scripts/performance/phase10-performance.mjs:7-23` فقط ۱۰ عدد ساختگی را assert می‌کند و صریحاً `lowEndAndroidMeasured: false` چاپ می‌کند. `docs/phases/PHASE_10...` نیز real-device gate را شرط Pilot می‌داند. بنابراین عملکرد measured نیست؛ قبل از pilot باید release build روی low-end Android اندازه‌گیری شود، نه اینکه synthetic pass را به device pass تعبیر کنیم.

## تصمیم‌های فنی پیشنهادی

1. **Keep stack:** Expo/RN/TS/Hermes/New Architecture + Next/TS؛ فقط dependencyهای واقعی و version pin/lockfile را نگه دارید.
2. **Rive mobile:** فعلاً `@rive-app/react-native@0.4.20`؛ یک `RiveCharacterAdapter` بسازید که `CharacterId`, semantic event, reduced-motion و asset manifest را می‌گیرد. از Data Binding/async APIs استفاده کنید. `AnimatedCharacter` را از demo به مسیر production منتقل نکنید مگر `.riv` واقعی و state-machine contract دارد.
3. **Rive web:** ابتدا package و renderer spike جدا، سپس بر اساس یک character واقعی انتخاب webgl2 یا canvas. component نام‌گذاری‌شدهٔ Rive نباید SVG را مخفی کند؛ `SvgCharacterFallback` و `RiveCharacter` صریح باشند.
4. **Shared registry:** یک contract مشترک `characterId/assetKey/fallback/allowedStates/stateMachine/dataBindingSchema/license/hash` برای web/mobile؛ event semantic در `@math/contracts` بماند.
5. **Avatar/equip:** `profile.avatar` schema v2 additive + migration/backup، cosmetic operation با idempotency/revision؛ learning truth و equipment جدا. unlock/equip نباید station pass را محلی تغییر دهد.
6. **Offline:** FileSyncQueueStore را atomic+serialized کنید؛ در app lifecycle/network reconnect flush کنید؛ statusهای pending/retry/rejected و conflict UI را قابل مشاهده و فارسی کنید؛ برای session/encounter offline policy صریح تعیین شود.
7. **Auth:** cookie signed/opaque server session؛ dev credentials فقط dev build؛ API/middleware هر بار principal و role را از منبع معتبر verify کند. قبل از pilot staging Supabase Auth/RLS.
8. **3D scope:** 2D vector illusion برای guide/feedback؛ custom Skia فقط برای mini-game عددی که benchmark ثابت کند لازم است؛ Unity/3D rewrite ممنوع.

## اولویت پیاده‌سازی و release gates

### P0 قبل از هر «Rive production»

- asset واقعی چهار شخصیت یا حداقل Aria برای vertical slice: `.riv`, static fallback, artboard/state machine names, data-binding schema, hash/license/owner.
- adapter موبایل و وب با event contract؛ `ANSWER_*`, `RECOVERY`, `STATION_PASS` نباید در learning engine نام Rive بدانند.
- child avatar schema v2 و equip save/cancel/reload/offline migration.
- signed auth/session و حذف dev fallback از production.

### P1 قبل از Pilot Candidate

- queue موبایل atomic/serialized + restart test؛ reconnect flush test؛ duplicate/idempotency test.
- تصمیم offline start: content manifest/cache و session policy قابل اجرا، یا gate صریح online-required.
- reduced-motion در هر دو target با semantic fallback؛ assessment بدون cue شخصیت/صدا مطابق `motion.json:52-63`.
- route S09 start/resume، server truth traceability و content checksum.

### گیت‌های آزمون

- **Contract/unit:** animation mapping table، registry parity، avatar migration invalid/newer schema، runtime truth tests.
- **Mobile integration:** development build (نه Expo Go) با Rive native؛ load/error/unmount، state transitions، RTL، TalkBack/VoiceOver fallback، low-memory.
- **Web integration:** Next client-only Rive load، SSR boundary، cleanup، resize/DPR، canvas fallback، prefers-reduced-motion.
- **Offline:** kill در PENDING/SYNCING، restore action، reconnect flush، duplicate receipt، 4xx reject، 5xx/429 retry، cache checksum/revocation/80MB.
- **UX learning:** answer → evaluation → semantic event؛ animation نباید block کند؛ assessment silent؛ resume بعد از kill؛ station pass فقط server accepted.
- **Security:** forged cookie/role rejection، production no dev headers/fallback، identity mismatch، RLS staging.
- **Performance:** release EAS Android low-end: cold start، Station 01، idle/think/correct/celebrate، Pattern/Count، recovery/check transitions، cache hit، offline→reconnect؛ frame p95/99، dropped frames، JS/UI thread، RSS/memory، startup و payload bytes. synthetic script فقط smoke gate است.

## وضعیت نهایی readiness

- **معماری پایه:** آماده برای ادامهٔ implementation، بدون rewrite.
- **Rive integration:** NOT READY؛ runtime dependency موجود است اما asset، binding و production route وجود ندارد.
- **Character equip:** NOT READY؛ schema/state/runtime integration وجود ندارد.
- **Offline persistence:** projection/resume محلی نسبتاً آماده و unit-tested؛ sync موبایل reconnect/atomicity و offline start NOT READY.
- **Auth production:** NOT READY تا cookie signing و حذف dev bypass ثابت شود.
- **Performance:** NOT READY برای pilot؛ فقط synthetic contract، low-end Android measured نیست.

### چیزهایی که این ممیزی ثابت نمی‌کند

- build یا نصب native موفق نشده/نشده است؛ به‌دلیل محدودیت محیط، ادعای build run نداریم.
- exploit احراز هویت اجرا نشده؛ ریسک cookie از خواندن static source است و باید با تست staging تأیید/رفع شود.
- هیچ benchmark واقعی Rive، frame/drop، memory یا battery نداریم؛ باید روی release build/device اندازه‌گیری شود.
- کیفیت آموزشی، تلفظ فارسی، طرح‌های Rive و licensing assetهای آینده هنوز با artifact واقعی verify نشده‌اند.
