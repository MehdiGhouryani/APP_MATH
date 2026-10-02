# شمارا ۲٫۰: شروع از اینجا

> نقشهٔ پوشه‌ها: `docs/README.md` · گزارش پاک‌سازی 2.0.5: `docs/CLEANUP_2026-10-02.md`

## شخصیت‌های بازسازی‌شده

> **قبل از هر کار: `ROADMAP_PHASES.md` را بخوانید** (وضعیت فازها و پروتکل PASS). گزارش ممیزی طراحی: `docs/audits/AUDIT_DESIGN_V2_2026-10-02.md`.

**اول `project-design-v2/README.md` و `project-design-v2/docs/CHARACTER-BIBLE-v2.md` را بخوانید.** پیش‌نمایش: `project-design-v2/preview/index.html`.

## چه چیزی عوض شد
- cast کامل از صفر: آریا (بچه‌اژدها)، کیوبو (ربات از مکعب شمارش)، دانا (سنجاب با دم الگودار)، جیکو (پرندهٔ آوازخوان). شناسه‌ها همان است.
- وب: `components/CharacterArt.tsx` جدید؛ `RiveCompanionMascot` و `InteractiveCompanion` حالا هنر v2 را با انیمیشن لایه‌ای نشان می‌دهند (API قبلی حفظ شد). نشان ایموجی کنار شخصیت حذف شد.
- موبایل: `CharacterAvatar` و `AnimatedCharacter` به‌جای ایموجی، هنر v2 با حرکت Reanimated؛ `src/characters/art.ts` جدید؛ آیکون، آیکون تطبیقی و اسپلش با آریای جدید.
- متن‌ها: توضیح و رنگ شخصیت‌ها در `characters.ts` و `persian.ts`؛ جمله‌های رباتیک کیوبو و جمله‌های اغراق‌آمیز جیکو ملایم شد.
- قدیمی‌ها (آرشیو شخصیت‌ها، v1.1، v1.2) در 2.0.5 حذف شدند (در تاریخچهٔ git موجودند)؛ `v1.3/specs/characters.json` منسوخ علامت خورد (بخش آواتار هنوز معتبر).

## بعد از دریافت
`npm install` و سپس typecheck/test وب و موبایل اجرا شود؛ این بسته در محیطی بدون اینترنت ساخته شد و `tsc`/build اجرا نشده است. پیش از سفارش ریگ Rive، تست silhouette با ۸ تا ۱۲ کودک انجام شود.
