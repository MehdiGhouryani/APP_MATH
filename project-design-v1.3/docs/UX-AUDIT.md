# ممیزی طراحی و پیاده‌سازی Shomara — پیشنهاد v1.3

## دامنه و روش

این ممیزی از روی کد موجود و قرارداد طراحی انجام شد، نه بر مبنای ممیزی قبلی: هر ۲۴ رکورد `project-design-v1.2/specs/screens.json`، جدول و قواعد `project-design-v1.2/docs/05-SCREENS.md`، prototype (`project-design-v1.2/prototype/design-preview.html`) و مسیرها/کامپوننت‌های فعلی وب و native بررسی ایستایی شدند. prototype طبق خود قرارداد فقط **visual state explorer** است و اثبات runtime/auth/payment/API/engine نیست؛ هیچ تست مرورگر یا runtime در این کار اجرا نشده است.

فایل دادهٔ اصلی، `screens-v1.3.json`، برای هر صفحه این کلیدها را دارد: `id`, `route`, `title`, `observed_current`, `purpose`, `entry_exit`, `primary_cta`, `required_states`, `child_parent_gates`, `accessibility_rtl`, `issues`, `proposed_corrected_flow`, `mobile_parity`, `evidence`. شدت‌ها در issueها:

- **P0**: مسیر/امنیت/اعتماد داده یا قابلیت ضروری اصلاً قابل handoff نیست.
- **P1**: اختلاف جدی با قرارداد یا شکستن سفر اصلی.
- **P2**: کیفیت، دسترس‌پذیری یا polish که پیش از انتشار باید اصلاح شود.

## جمع‌بندی اجرایی

1. **۲۴/۲۴ قالب خوانده و در JSON ثبت شد.** از این تعداد، مسیرهای مستقل S08، S13، S14، S16، S17، S18، S20، S21، S23 و S24 در implementation فعلی route/component معادل ندارند؛ برخی قالب‌ها فقط به صورت بخشی از modal/profile/backpack دیده می‌شوند.
2. **وب فعلی یک shell با ۳ تب دارد**: مسیر، مهارت‌ها (در کد `BACKPACK`) و پروفایل (`apps/web/components/ChildBottomNav.tsx:7-18`). native نیز سه تب دارد (`apps/mobile/app/(tabs)/_layout.tsx:8-35`). این با «پنج تب» قرارداد v1.2 یکسان نیست و practice/wardrobe به مقصدهای مستقل تبدیل نشده‌اند.
3. **پیشنهاد محصولی این ممیزی (recommendation، نه مشاهده): چهار تب اصلی کودک**: `مسیر`، `تمرین`، `کمد/گنجینه`، `پروفایل`. مهارت‌ها و بازی‌ها زیر «تمرین» قرار گیرند؛ کمد/گنجینه S17/S18 و avatar S20 را یکجا نگه دارد. این چهار تب در عرض ۳۲۰px از پنج تب خواناترند و از تکرار سه مقصد فعلی جلوگیری می‌کنند. این پیشنهاد به معنی اجرای فعلی نیست.
4. **دو implementation سفر onboarding هم‌راستا نیستند**: وب AuthFlow دارای splash/grade/parent gate/auth/OTP/setup است؛ native placement را قبل از consent اجرا می‌کند و grade را `G1` hardcode می‌کند (`apps/mobile/app/onboarding.tsx:13-19,53-60,99-134`).
5. **اعتماد آموزشی باید server-authoritative بماند**: در وب، fallback محلی و callback completion می‌تواند نتیجه را محلی موفق نشان دهد؛ result نیز `+۳` و `۱۰۰٪` را hardcode می‌کند (`apps/web/components/DuolingoLessonModal.tsx:169-195,780-825`). در native، runtime/checkpoint و pending queue غنی‌تر است، اما parity وب وجود ندارد.
6. **parent gate به تنهایی authorization نیست**؛ خود native صراحتاً آن را UX boundary و متن consent را placeholder قانونی می‌داند (`apps/mobile/src/components/ParentGate.tsx:6-9`). گزارش/حساب/خرید باید احراز مالک و backend authorization مستقل داشته باشد.

## نقشهٔ سفر اصلاح‌شده

`S01 خوش‌آمد → S02 حساب بزرگسال → S03 کد → S04 پایه → S05 alias + ChildAvatar → S06 جایابی اختیاری → S07 مسیر → S08 واحد → S09 شروع ایستگاه → S10 یادگیری → S11 بازی انتقال → S12 نتیجه → S07`

شاخه‌های کودک: `S07 → S14 بازی‌ها` و `S15 مهارت‌ها → S16 مفهوم → S07`. شاخهٔ جایزه: `S07/تمرین → S17 گنجینه → S18 آیتم → S20 آواتار`. شاخهٔ والد: `S19 پروفایل → adult confirmation → S22 گزارش → S23 اشتراک` و `S21 تنظیمات → S24 حساب`. هر خروج از S10/S11 checkpoint بسازد؛ sync pending هرگز mastery قطعی نمایش ندهد.

## قاعدهٔ layout و RTL قابل تحویل

- یک **ChildAvatar renderer** برای S05/S19/S20، جدا از mascotهای Aria/Qbo/Dana/Jiko؛ companion جای avatar کودک را نگیرد.
- در هر صحنه فقط یک راهنما؛ S10 سخنگو از encounter metadata تأییدشده بیاید و در check مستقل حذف شود؛ S11/S17/S18 جیکو، S15/S16 دانا، و S05/S19/S20 آواتار کودک.
- مسیر زیگزاگ باید DOM/keyboard order خوانا در RTL داشته باشد؛ اتصال تصویری responsive باشد و به مختصات ثابت SVG وابسته نباشد.
- حداقل touch target برابر ۵۶dp، عنوان دستور کودک ۲۴px، متن کودک ۲۰px، متن والد ۱۶px؛ ۳۲۰px و بزرگ‌نمایی ۲۰۰٪ باید در QA واقعی آزموده شوند. در این assignment آزمون اجرا نشده است.
- حالت‌های بارگذاری، خالی، خطا، آفلاین آماده، sync pending، بسته دریافت‌نشده و قفل مهارتی باید stateهای مستقل باشند؛ pending با قفل پیش‌نیاز یکی نشود.

## وضعیت parity موبایل

| گروه | مشاهدهٔ native | تصمیم handoff |
|---|---|---|
| S01–S06 | onboarding و placement وجود دارد، اما S02/S03 auth و S04 grade ندارند و placement پیش از consent است | یک state machine مشترک، نه دو سفر جدا |
| S07 | path و ۵ station وجود دارد؛ فقط ۳ تب | به چهار تب پیشنهادی و manifest/download state برسد |
| S08–S09 | unit start مستقل نیست؛ station auto-start و ENTRY loading دارد | S08 و S09 به‌صورت destination/state واقعی اضافه شوند |
| S10–S12 | StationFlow از web کامل‌تر است و checkpoint/pending دارد؛ web parity ناقص | contract مشترک encounter/result و copy مشترک |
| S13–S18 | jump/games/skill-detail/treasure/item-detail وجود ندارند | زیر Practice و Wardrobe پیاده‌سازی شوند |
| S19–S21 | profile و parent link هست؛ avatar/settings/report link نیست | profile واقعی + ChildAvatar + settings اضافه شود |
| S22–S24 | parent محلی با summary/delete؛ report کامل، subscription/account/export نیست | adult shell با auth/authorization مستقل |

## معیار آمادگی implementation

1. برای هر ID یک route/state owner، ورودی/خروجی، API contract و pending/error copy تعیین شود؛ هیچ screen صرفاً prototype selector نباشد.
2. ابتدا blockerهای P0: auth واقعی S02/S03، S08/S13، ChildAvatar/S20، adult report/account/subscription S22–S24 و server-authoritative result S10/S12.
3. سپس P1های journey: یکسان‌سازی onboarding، چهار تب، S09 start، S11 game model، S14/S15/S16 practice model، S17/S18 reward model.
4. پیش از release تست‌های accessibility و responsive باید اجرا شوند؛ این گزارش فقط evidence ایستا دارد و به‌جای test result چیزی ادعا نمی‌کند.

## پوشش و محدودیت واقعی

### حساب collection

- هدف قراردادی: ۲۴/۲۴ screen template از `screens.json`.
- رکورد یکتا جمع‌آوری‌شده: ۲۴/۲۴، بدون dedup collision.
- منبع template: `screens.json` (۲۴ رکورد)؛ منبع رفتار: `05-SCREENS.md`، prototype و فایل‌های route/component فهرست‌شده در evidence هر رکورد.
- وضعیت collection: **complete برای جمع‌آوری screen templates و static source evidence**.
- total runtime screen/state یا availability واقعی API: **نامعلوم**؛ از prototype یا کد بدون اجرای runtime استنتاج نشده است.

### حساب processing

- هدف پردازش: ۲۴/۲۴ ID.
- تحلیل موفق: ۲۴/۲۴ در JSON، با purpose، entry/exit، CTA، stateها، gate، RTL/accessibility، issue severity، flow اصلاحی، parity و evidence.
- skipped/failed: صفر رکورد؛ اما runtime behavior، provider واقعی، payment store و visual pixel parity عمداً آزموده نشده‌اند.
- وضعیت processing: **complete برای static design-to-source audit؛ نامعلوم برای runtime validation**.

## فایل‌های خروجی

- `screens-v1.3.json`: آرایهٔ ۲۴ شیء فارسی، یک شیء برای هر screen ID از S01 تا S24.
- `audit-fa.md`: همین گزارش فارسی، جمع‌بندی cross-screen، پیشنهاد چهار تب، parity، handoff و دو حساب پوشش.
