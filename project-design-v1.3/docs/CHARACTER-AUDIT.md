# ممیزی بستهٔ شخصیت/برند/آواتار شمارا — پیشنهاد v1.3

**دامنه:** `project-design-v1.2`، rendererهای web/mobile، assetهای SVG/PNG/WEBP و چند منبع رسمی Duolingo. این گزارش فقط خواندنی است؛ هیچ فایل محصولی تغییر نکرده است.

## حکم اجرایی

### انتخاب main نهایی

**main نهایی پیشنهادی: آریا با شناسهٔ پایدار `aria`؛ یک اژدهای دوستانه و کاملاً اصیل شمارا، نه Godzilla و نه بازطراحی یک IP موجود.**

این انتخاب با رفتار واقعی کد سازگار است: صفحهٔ اصلی صریحاً `activeCharId = 'aria'` دارد و آریا را brand/main ثابت معرفی می‌کند (`apps/web/app/page.tsx:19-22`)؛ `RiveCompanionMascot` نیز پیش‌فرض `aria` است (`apps/web/components/RiveCompanionMascot.tsx:19-21`). در مقابل، سند طراحی فعلی تناقض دارد: `01-BRAND-LOCK.md:30-31` و `02-CHARACTER-BIBLE.md:50-58` هُدی را main منتخب می‌خوانند، ولی `specs/characters.json:4-18` هم‌زمان `mainId: aria` و `visualKey: hodi` دارد و `04-MOTION-AUDIO.md:3-4` نگاشت `aria → hodi` را ثبت کرده است. تغییر main به هُدی در این مرحله یعنی مهاجرت presentation و ایجاد drift؛ بهتر است **شناسه و continuity آریا حفظ، فقط visualKey و bible قفل شود**.

آریای نهایی باید اژدهای کودکانهٔ غیرترسناک، گرد و مهربان باشد: شاخک/crest اختصاصی، بال کوتاه، شکم روشن و silhouette قابل تشخیص؛ بدون پولک واقع‌گرایانه، پنجه/دندان تهاجمی، آتش، یا هر نشانهٔ وابسته به Godzilla. برچسب حقوقی «Godzilla-like» برای brief تولید ممنوع؛ brief باید «friendly original dragon» باشد و بررسی علامت/نام مستقل انجام شود.

### cast مستقل، اما modular

چهار guide در قرارداد باقی می‌مانند: `aria` (main dragon)، `qbo` (robot builder)، `dana` (owl pattern guide)، `jiko` (fox/play guide). این انتخاب با bible طراحی (`02-CHARACTER-BIBLE.md:38-48`) سازگارتر از اجرای فعلی است؛ چون کد mobile/web هنوز دانا را سنجاب و جیکو را پرنده می‌نامد (`apps/mobile/src/characters/characters.ts:66-100` و `apps/web/lib/persian.ts:147-179`). `aria`، `qbo`، `dana` و `jiko` **شناسه‌های داده/رویداد هستند و rename نشوند**؛ نام، species و `assetKey` لایهٔ presentation است.

آواتار کودک از guideها جدا بماند، اما دیگر فقط «انسان واحد» نباشد: profile avatar یک **base-character قابل انتخاب** با چند گونه/بدن است، نه speaker پنجم. v1.3 پایه‌های `human`، `dragon`، `bird` و `robot` را تعریف می‌کند؛ پیشرفت آموزشی، grade، `learningIdentityId` و نقش guide را تغییر نمی‌دهد. نگاشت `aria` به avatar base مجاز نیست: آریا mascot/guide برند است، avatar dragon یک نسخهٔ شخصی‌سازی‌شده و از نظر assetKey مستقل است.

## شواهد و ایرادهای فعلی

### ۱) برند و منبع canonical

- قفل برند فعلی رنگ‌ها، نماد و هدهد را قطعی کرده و می‌گوید main باید هُدی باشد (`01-BRAND-LOCK.md:8-17`)، اما همان بسته در قرارداد motion `mainId=aria` دارد (`04-MOTION-AUDIO.md:3-4`). این یک تصمیم حل‌نشده است، نه دو main مجاز.
- `specs/characters.json:1-71` چهار شخصیت را canonical می‌داند، ولی `conceptsAreNotCanonical: true`؛ بنابراین concept image رأی نهایی دربارهٔ شکل نیست.
- `02-CHARACTER-BIBLE.md:50-58` گزینه‌های هُدی/پیستا/سیمک/آریا را «فقط یک main» می‌داند. پیشنهاد v1.3 این است که آریا انتخاب شود و سه گزینهٔ دیگر در archive/alternatives بمانند؛ نه اینکه هم‌زمان main شوند.

### ۲) آرت فعلی بیشتر flat vector است تا 2.5D

- SVGهای هُدی (مثلاً `assets/characters/hodi/idle.svg` و `think.svg`) گروه‌های semantic مثل `feet/body/crest/head/wing` دارند و در THINK فقط چرخش حدود ۸ درجهٔ سر اعمال می‌شود؛ fillها تخت‌اند و عمق نوری، contact shadow یا planeهای حجمی ندارند. این برای fallback خوب است، اما 2.5D نهایی نیست.
- `assets/characters/alternatives/aria-legacy.svg` نیز عمدتاً ellipse/rect/path با fill تخت است؛ یک tail و wing دارد اما lighting/depth ندارد.
- renderer وب آریا در `RiveCompanionMascot.tsx:103-190` inline SVG با circle/ellipse/path و fillهای آبی است؛ تنها عمق محسوس، `drop-shadow` در خطوط 103-109 و glow است. نام کامپوننت Rive است، اما این مسیر Rive نیست.
- `InteractiveCompanion.tsx:87-138` companion را داخل دایرهٔ رنگی، با shadow و badge ایموجی event می‌گذارد. برای prototype قابل فهم است، ولی badge و حباب در درس می‌توانند از محتوای ریاضی جلو بزنند.

**جهت هنری 2.5D پیشنهادی:** silhouette ساده و خوانا حفظ شود، اما هر کاراکتر ۳ تا ۵ plane عمقی داشته باشد: `back`، `body`، `face/feature`، `front/accessory`. یک نور ثابت بالا-چپ، سایهٔ تماس نرم 6–10٪، یک highlight محدود روی volume، و ambient occlusion بسیار کم. از gradientهای براق، realism، texture شلوغ و parallax شدید پرهیز شود. در 40dp فقط silhouette + چشم/نشانهٔ اصلی؛ در 72/128/180dp plane و accessory اضافه شوند. این «2.5D نرم» است، نه flat cartoon و نه 3D بازی.

### ۳) قابلیت واقعی render و Rive

- در کل repository **هیچ فایل `.riv` وجود ندارد** (`find . -name '*.riv'` نتیجهٔ صفر). خود سند نیز صریح است: `04-MOTION-AUDIO.md:18` فایل‌های `hodi.riv/qbo.riv/dana.riv/jiko.riv` را سفارش تولید می‌داند، و `09-ASSET-STATUS.md:12-19` چهار `.riv` و bankهای صوتی را کارِ قبل از انتشار اعلام می‌کند.
- mobile قابلیت مصرف Rive دارد: `AnimatedCharacter.tsx:4,22-37` از `@rive-app/react-native` و `source` اختیاری استفاده می‌کند؛ ولی اگر source نباشد `AnimatedCharacter.tsx:68-79` fallback ایموجی/متن نشان می‌دهد. `CharacterAvatar.tsx:5-15` نیز صریحاً «Emoji placeholder» است.
- web `RiveCompanionMascot.tsx` عملاً SVG procedural است (`:103-112` و branchهای شخصیت در `:112-300`)، نه Rive runtime. پس ادعای «Rive mascot» نباید در release note یا QA نوشته شود.
- 24 SVG state واقعی تحویل شده‌اند (۴ شخصیت × ۶ state)، اما `09-ASSET-STATUS.md:3-13` می‌گوید حالت‌های فرعی عمدتاً fallback هستند و ژست کامل، rig، turnaround، چهار `.riv` و صدای نهایی هنوز نیستند. هدف‌های `<30KB SVG` و `<2MB Rive` در `04-MOTION-AUDIO.md:34-35` target هستند، نه benchmark اندازه‌گیری‌شده.

### ۴) آواتار فعلی در برابر نیاز کاربر

آواتار فعلی یک مدل انسانی واحد با گزینه‌های محدود است: ۶ skin، ۵ hair، ۳ hair-color، ۳ outfit، ۳ outfit-color و ۴ accessory (`specs/avatar-options.json:3-51`). schema هم فقط همین enumها را دارد (`implementation/avatar-contract.ts:3-8`). hair، outfit، glasses/cap/leaf-pin قابل ترکیب‌اند، اما **base character، facial hair/moustache، hat family، face/eye variants، body shape یا species انتخابی** وجود ندارد. سند خودش مدل بدن واحد و backlog تنوع body/mobility را ثبت کرده است (`03-CHILD-AVATAR.md:3-6`).

در نتیجه:

- برای نیاز «چند شخصیت قابل شخصی‌سازی، کلاه/سبیل/مو و…»، `ChildAvatarV1` کافی نیست؛ باید به `ChildAvatarV2`/contract v1.3 مهاجرت additive شود.
- `human` باید انتخاب پیش‌فرض مهاجرت v1 باشد تا ظاهر و progress قبلی حفظ شود؛ `baseCharacter` جدید است و هر enum نامعتبر به human/default برگردد.
- moustache/facialHair باید cosmetic اختیاری و مستقل از gender باشد؛ روی human و فقط baseهایی که anchor دهان دارند فعال شود. برای dragon/bird، به‌جای تحمیل سبیل انسانی، گزینه‌های native مثل `snout-tuft`/`beak-mark` تعریف شود؛ این هم خواستهٔ customization را پوشش می‌دهد و هم anatomy را خراب نمی‌کند.
- کلاه روی crown/crest هر base باید compatibility داشته باشد؛ عینک فقط وقتی چشم‌ها را نمی‌پوشاند؛ موهای پشت/جلوی سر از بدن جدا باشند. قفل cosmetic هیچ‌وقت قفل skin/body/پیشرفت نیست (`03-CHILD-AVATAR.md:14-24`).

### ۵) حضور mascot در درس: sparse، نه قانون مطلق

قرارداد محصول فعلی از نظر آموزشی تصمیم درستی دارد: در assessment هیچ character/audio/answer cue نباشد (`04-MOTION-AUDIO.md:20-27` و `specs/motion.json:60-63`)؛ در سؤال عادی idle ثابت و mascot کوچک/خارج از counted area باشد (`04-MOTION-AUDIO.md:23-27` و `02-CHARACTER-BIBLE.md:47-48`). بنابراین پیشنهاد شمارا: mascot در intro، hint، recovery و outcomeهای معتبر حاضر باشد؛ در assessment حذف واقعی از DOM، نه opacity=0.

اما این را به Duolingo نسبت ندهید که «همیشه mascot را sparse می‌کند». راهنمای رسمی Duo می‌گوید او **mostly stands still** و حرکت‌های کوچک دارد و از text/speech bubble ارتباط می‌گیرد، نه صدا؛ اما مقالهٔ رسمی cast در ۲۰۲۰ می‌گوید شخصیت‌ها را در «majority of exercises» قرار داده‌اند. نتیجه: **دفعات حضور یک انتخاب محصول/پداگوژیِ شماراست، نه واقعیت مطلق یا قانون جهانی Duolingo.**

همچنین Backpack فعلی (`apps/web/components/BackpackView.tsx:25-110`) مهارت/مدال/ابزار دارد و هیچ قرارداد مستقل child avatar یا cast slot در آن ندارد؛ باید آواتار در Profile/Backpack به‌عنوان identity cosmetic جدا بیاید، نه با badge/emojiهای reward قاطی شود.

## قرارداد placement و compositing پیشنهادی

1. **صحنه:** `assessment-silent` بیشترین اولویت؛ سپس `recovery`، `outcome`، `hint`، `explain`، `idle`؛ همان ترتیب `specs/motion.json:52-63`.
2. **درس:** companion حداکثر 96dp، خارج از counted area؛ هیچ نگاه/دست/نشانه‌ای پاسخ را لو ندهد. یک speaker در هر لحظه (`02-CHARACTER-BIBLE.md:3-4`).
3. **خانه/intro:** 128–180dp؛ آریا main ثابت. در splash/brand، icon/symbol از avatar و cast مستقل باشد.
4. **profile/avatar builder:** 180dp preview با تمام layerها؛ بدون narration و بدون تغییر learning truth. آواتار کودک جای mascot راهنما را نمی‌گیرد.
5. **small-size:** زیر 64dp patch/badge حذف؛ زیر 40dp فقط symbol یا bust ساده، مطابق `02-CHARACTER-BIBLE.md:11-14`.
6. **RTL:** direction را با mirror bitmap حل نکنید؛ patch، متن و accessory دارای anchor جهت‌مند باشند (`07-IMPLEMENTATION-HANDOFF.md:39-40`).
7. **occlusion:** back hair/tail/wings پشت body؛ body قبل neck؛ face/eyes/mouth؛ front hair؛ facial hair؛ hat؛ accessory؛ badge بیرون صورت. چشم و focus ring هرگز زیر hat/glasses نرود.
8. **failure:** اگر art asset unavailable بود، SVG static package‌شده نصب شود؛ submit آموزشی نباید به asset failure وابسته باشد (`04-MOTION-AUDIO.md:20-21`).

## نقد منابع رسمی Duolingo و چیز قابل اقتباس

- [Duolingo Brand Guidelines — Characters](https://design.duolingo.com/illustration/characters#body-types): می‌گوید قطعات ساده برای scale و production بهترند، head/body از ۱–۲ شکل پایه ساخته شوند، socket بازو پشت torso پنهان باشد، hair به ۱–۲ شکل ساده محدود شود و pose شخصیت‌دار باشد. این‌ها برای slot/occlusion و 2.5D شمارا مفیدند؛ سبک و anatomy آنها نباید کپی شود.
- [Duolingo Brand Guidelines — Duo](https://design.duolingo.com/writing/duo#duos-voice-and-tone): Duo را mascot و expressive/supportive معرفی می‌کند، اما می‌گوید mostly still، حرکت اندک، ارتباط با text و بدون talk/sound. برای آریا می‌توان «حضور کم‌تحرک و قابل پیش‌بینی» را گرفت؛ guilt/shame و لحن سرزنشگر را با قواعد شمارا رد می‌کنیم.
- [Duolingo Blog — Building character (2020)](https://blog.duolingo.com/building-character/): cast متنوعی را مکمل mascot می‌داند و می‌گوید modern humans با personalityهای quirky را برای cast انتخاب کردند؛ همچنین گزارش می‌کند شخصیت‌ها در majority of exercises حضور داشتند. این منبع نشان می‌دهد cast مکمل و usage پرتکرار هر دو ممکن‌اند، نه اینکه یک نسخه برای همه لازم باشد.
- [Duolingo Blog — Avatar creator (2023)](https://blog.duolingo.com/avatar-creator/): hairstyle، body shape، skin tones، accessories و ترکیب‌های بسیار زیاد را به‌عنوان self-expression رسمی توضیح می‌دهد. برای شمارا، ایدهٔ slotهای مستقل قابل اقتباس است؛ اما قفل پرداخت/عکس/شبکهٔ اجتماعی و گسترهٔ بزرگسالانهٔ آن را وارد کودک نکنید.
- [Duolingo Blog — Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/): وضوح سریع، کمترین جزئیات لازم، silhouette و فضای منفی را برای آموزش ضروری می‌داند و سبک را minimal/playful توصیف می‌کند. بنابراین 2.5D باید عمق کم و خوانایی زیاد داشته باشد، نه جزئیات سینمایی.

این منابع رسمی دربارهٔ «فرکانس دقیق mascot در همهٔ نسخه‌ها» حکم کلی نمی‌دهند؛ تنها شواهد بالا دربارهٔ رفتار Duo و گزارش محصول ۲۰۲۰ دربارهٔ cast موجود است.

## دارایی‌های بررسی‌شده

- conceptها: `assets/concepts/mascot-candidates.webp` و `hodi-expression-concept.webp` هر دو 1536×1024؛ concept هستند و canonical نیستند (`specs/characters.json:71`، `09-ASSET-STATUS.md:6-7`).
- PNGهای قدیمی: `project-design/assets/aria-expression-sheet.png` و `character-family.png` هر دو 1536×1024؛ family/reference تصویری‌اند، نه asset لایه‌ای تولیدی.
- family reference جدید: `assets/characters/family-reference.svg` با viewBox 960×280؛ چهار شخصیت را یک‌جا نشان می‌دهد.
- SVGهای guide: ۲۴ فایل state با viewBox 224×256؛ Hodi حدود 1.8KB، Qbo حدود 1.6KB، Dana حدود 1.37KB و Jiko حدود 1.8KB در نسخهٔ فعلی؛ این کم‌حجمی برای fallback خوب است، نه اثبات rig-ready بودن.
- alternatives: `aria-legacy.svg` (اژدها)، `pista.svg`، `simak.svg` هر کدام 224×256؛ گزینه‌های برداری موجودند، اما سه‌نما/rig تولیدی ندارند.
- brand: `symbol.svg` viewBox 200×200 و `launcher-master.svg` viewBox 1024×1024؛ symbol نباید با face/mascot عوض شود (`01-BRAND-LOCK.md:21-22`).

## handoff عملیاتی

**P0 — قفل تصمیم:** `aria` main + `aria-dragon-v1` assetKey؛ mapping قدیمی `aria→hodi` فقط alias ingest/visual migration، نه rename persisted ID. species/نام Dana/Jiko را در registry واحد اصلاح کنید.

**P0 — ساخت production art:** model front/three-quarter/side آریا؛ لایه‌های 2.5D با IDs ثابت؛ static SVG هر state؛ سپس Rive state machine `Companion/Character`، reduced-motion و asset manifest با hash/owner/license.

**P1 — renderer مشترک:** registry واحد برای web/mobile، `CharacterRenderer` برای guide و `ChildAvatarRenderer` برای avatar؛ حذف branchهای inline چهارگانه و mobile emoji از production path. fallback را اولویت دهید.

**P1 — avatar v1.3:** contract فایل همراه، normalization، compatibility و migration v1→v1.3؛ تست تمام ترکیب‌های معتبر، 40/72/180dp، RTL، contrast، TalkBack و save/cancel/offline.

**P2 — placement QA:** snapshot هر screen، no-mascot assessment، عدم پوشاندن چشم/متن/target، عدم ورود accessory به counted area، و آزمون reduced motion. وجود source واقعی `.riv` و fps/RAM فقط پس از تحویل asset و اجرای device QA قابل ادعاست.

**محدودیت‌های واقعی:** هیچ child test، benchmark device، حقوق‌سنجی نام/علامت، `.riv` واقعی، صدای ضبط‌شده یا production modular wardrobe در این بسته وجود ندارد؛ ادعاهای محبوبیت/اثربخشی/پوشش نمایندگی نباید از این ممیزی استنتاج شوند.
