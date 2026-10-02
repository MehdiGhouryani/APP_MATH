# ممیزی طراحی و cast نسخهٔ ۲ · ۲۰۲۶-۱۰-۰۲

دامنه: `project-design-v2/` (منبع، ۲۸ SVG، PNGهای موبایل، motion، specs، docs) و هر جای کد که شخصیت نشان می‌دهد (وب و موبایل).
روش: اجرای `validate-cast.mjs`، پارس XML همهٔ SVGها، تطبیق idهای لایه با `motion-v2.json` و `motion.css`، بررسی بصری contact sheet هر ۲۸ حالت، grep کد برای ایموجی و نسخهٔ قدیمی cast، و تطبیق با کتاب شخصیت (§۵ و §۶).

## نتیجهٔ کلی
طرح v2 سالم و قابل استفاده است: ۴ silhouette کاملاً متمایز، ۶ حالت + نیم‌تنه برای هر شخصیت، idهای پایدار، بدون ارجاع شکسته یا id تکراری در یک فایل، منبع واحد و rebuild تکرارپذیر. ایرادهای زیر پیدا و (جز موارد «باز») رفع شد.

## ایرادهای رفع‌شده
| # | شدت | ایراد | رفع |
|---|---|---|---|
| 1 | بالا | وب هنوز در ۵ جا ایموجی قدیمی (🐲🤖🐦🐿️) به‌جای شخصیت نشان می‌داد: `DuolingoPath` (نشان گره + آواتار فعال)، `ProfileView`، `ChildTopBar`، `PlacementFlow` | جایگزینی با `CharacterArt` (bust) و کامپوننت جدید `CompanionBust`؛ `getCompanionEmoji` منسوخ علامت خورد |
| 2 | بالا | در گره سنجش `CHECK` شخصیت رندر می‌شد؛ خلاف کتاب شخصیت §۵ («در سنجش هیچ شخصیتی رندر نمی‌شود») | `DuolingoLessonModal`: همراه در `CHECK` رندر نمی‌شود (موبایل از قبل درست بود) |
| 3 | متوسط | حالت درس (`data-static`): حلقهٔ loading کیوبو در think بی‌پایان می‌چرخید؛ خلاف «بدون حلقه در سؤال» | `motion.css` + `globals.css`: loading در lesson mode متوقف |
| 4 | متوسط | encourage: مکعب شناور کیوبو حلقهٔ بی‌پایان داشت؛ spec می‌گوید یک ژست | تکرار ۲ بار |
| 5 | متوسط | celebrate دانا: جریان الگوی دم ۲×۱٫۲s = ۲٫۴s؛ خلاف سقف ۲ ثانیه. offset ‏−۸۸ هم با دورهٔ dash (۴۶) جور نبود و پرش داشت | ۱ بار، offset ‏−۹۲ (دو دوره، بدون پرش)؛ `motion-v2.json` هم‌خوان شد |
| 6 | پایین | حالت correct آریا و کیوبو لایهٔ `fx` نداشت در حالی که spec برای همه `fx` تعریف کرده (دانا و جیکو داشتند) | افزودن `fx: 'pop'` در منبع و rebuild کامل (SVG، PNG 1x/2x/3x، generated.ts، preview)؛ QA: ۲۸/۲۸ |
| 7 | پایین | `CharacterArt` با nonce در useEffect یک‌بار اضافه remount می‌کرد (انیمیشن one-shot دوبار شروع و flicker) | key پایدار `${id}-${state}` |

## موارد باز (نیازمند تصمیم یا ابزار خارج از این بسته)
- **دندان دانا:** دو دندان جلویی سنجاب در idle و bust دیده می‌شود؛ قانون «بدون دندان» در bible. پیشنهاد: استثنای صریح «دندان جلویی گرد و غیرتیز سنجاب» در bible ثبت شود یا حذف شود. (فاز P01)
- **کیوبو think چشم ندارد** (صفحه loading است) و `requiredIds` شامل `eye-l/r` است؛ عمدی است، باید در spec به‌عنوان استثنا ثبت شود. (P01)
- idهای ثابت (`#head`، `#fx`) وقتی چند شخصیت هم‌زمان inline می‌شوند در DOM تکراری‌اند؛ CSS کار می‌کند ولی HTML معتبر نیست. پیشنهاد: انتقال selectorها به class در منبع. (P01)
- `LeaderboardView` هنوز ایموجی دارد ولی طبق Decision Log از تجربهٔ کودک خارج است؛ دست نخورد.
- فیلد `emoji` در `apps/mobile/src/characters/characters.ts` دیگر جایی مصرف نمی‌شود؛ قابل حذف در P01.
- **فایل .riv، نمای سه‌رخ/بغل برداری، صدا، تست silhouette با کودک، build روی گوشی** هنوز وجود ندارد (خود بسته هم اعلام کرده). فازهای P12 و P13.
- `tsc`/build در این محیط اجرا نشد (وابستگی نصب نیست)؛ تغییرات کد باید در P00 typecheck شوند.

## فایل‌های تغییر کرده
`project-design-v2/source/shomara-cast.mjs`، `project-design-v2/source/motion.css`، `project-design-v2/specs/motion-v2.json`، خروجی‌های rebuild (`project-design-v2/assets/**`، `preview/index.html`، `manifest.json`، `apps/web/lib/characterArt.generated.ts`، `apps/mobile/assets/characters/**`، آیکون‌ها)، `apps/web/app/globals.css`، `apps/web/components/{CharacterArt,DuolingoPath,ProfileView,ChildTopBar,PlacementFlow,DuolingoLessonModal}.tsx`.
