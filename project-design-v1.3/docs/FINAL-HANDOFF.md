# شمارا ۱٫۳: تصمیم طراحی و قرارداد شروع پیاده‌سازی

**حکم:** بستهٔ ۱٫۲ طرح کافی برای پیاده‌سازی بی‌ابهام نبود: آواتار به state وصل نبود، وب/native مسیرهای متفاوت داشتند و Rive واقعی تحویل نشده بود. این بازنگری ساختار را تصمیم‌دار و prototype را آزموده می‌کند؛ نه ادعای رفع همهٔ باگ‌های کد اصلی یا آمادگی انتشار.

تاریخ: ۲۰۲۶-۱۰-۰۲. دامنه: هر ۲۴ قالب S01 تا S24، دارایی/قرارداد شخصیت و sourceهای مرتبط وب و موبایل. تمام backend یا تمام حالت‌های روی گوشی ممیزی اجرایی نشده است.

## آریا: یک انتخاب روشن، نه دو mascot هم‌زمان

۱٫۲ هُدی را با شناسهٔ پایدار `aria` انتخاب کرده بود؛ این نگاشت presentation آگاهانه بود و صرف تفاوت نام/شناسه باگ نیست. این بازنگری با توجه به خواستهٔ تازهٔ شما برای گزینهٔ آریا، انتخاب هنری را به **آریای اژدهای اصیل شمارا** برمی‌گرداند. تعبیر «تناقض حل‌نشده» در CHARACTER-AUDIT با این توضیح اصلاح می‌شود.
شاهد تاریخچه: `project-design-v1.2/README.md`، بخش «اولویت مرجع»، صریحاً می‌نویسد: «aria شناسه پایدار است، hodi نام پوسته و «هُدی» نام نمایشی.» بنابراین نظر اولیهٔ audit در برابر خود مرجع قدیمی اولویت ندارد.

شناسه‌های `aria / qbo / dana / jiko` حفظ شوند. `hodi` پوستهٔ قبلی است؛ alias پیشنهادی audit فقط presentation است، نه مجوز بازنویسی history/account/learning ID. استدلال انتخاب از خواستهٔ شما و هویت مستقل می‌آید، نه اجبار ناشی از hardcode کد قدیمی.

آریا: اژدهای گرد فیروزه‌ای، شاخک کوتاه، بال کوچک، شکم روشن، چشم خوانا و بدون دندان/آتش/پنجهٔ تهاجمی. کیوبو: ربات طلایی برای ساخت/دسته‌بندی؛ دانا: پرندهٔ جغدمانند بنفش برای الگو/شکل؛ جیکو: روباه گرم برای بازی/جشن. زبان شکل، نور و مقیاس مشترک باشد. «گودزیلا» مرجع مدل ساخت نیست؛ طرح باید مستقل باشد.

این‌ها **تصمیم طراح این تحویل** هستند، نه ادعای تأیید نهایی شما، مالکیت حقوقی اثبات‌شده یا محبوبیت آزموده نزد کودک.

## سبک: بردار حجمی نرم ۲٫۵بعدی

نور ثابت بالا-چپ، سه تا پنج plane عمقی و سایهٔ تماس کم. highlight محدود؛ بدون texture شلوغ، پلاستیک براق یا realism. آریا حرکت کوچک سر/بال، کیوبو واکنش مکانیکی نرم، دانا نگاه/مکث و جیکو ژست بازی دارد؛ animation دائمی در سؤال distractor است.

SVGهای این نسخه source واقعی‌اند، اما stateها **مطالعات هنری و fallback** هستند، نه rig-ready یا `.riv`. نمای quarter/side فقط مطالعهٔ حجم با transform است؛ turnaround واقعی و occlusion توسط هنرمند قبل از rig تکمیل شود.

رنگ‌ها: `#218B92` برند/اقدام، `#E9A00E` گام فعال، `#7863B9` هنر/الگو، `#F3F8F6` زمینه، `#23373D` متن. طلایی متن روی سفید نیست. فونت فارسی Vazirmatn با license رسمی داخل اپ بسته‌بندی شود؛ prototype در نبود شبکه از فونت سیستم استفاده می‌کند.

## راهنما و آواتار کودک دو نقش متفاوت‌اند

آریا در نشان، آیکون، خانه، معرفی و موفقیت مهم حاضر است، نه کنار تمام پاسخ‌ها. راهنمای درس از metadata موضوع می‌آید؛ یک speaker، کوچک و بیرون از counted area. در جایابی/سنجش پرش هیچ mascot، اشارهٔ چشم/دست، صوت تشویق یا correctness feedback نداریم.

این تصمیم شماراست، نه قانون مطلق دولینگو: [مقالهٔ رسمی cast](https://blog.duolingo.com/building-character/) از حضور شخصیت‌های مکمل در اکثر تمرین‌های آن نسخه گزارش می‌کند؛ این شاهد غیبت همیشگی Duo یا رفتار همهٔ نسخه‌ها نیست.

آواتار کودک قابل انتخاب و مستقل از راهنماست: انسان، اژدها، پرنده و ربات. تغییر گونه فقط ظاهر را عوض کند، نه پایه، هویت یا پیشرفت. نسخهٔ prototype چهار پایه، سه palette غیرانسانی، شش رنگ پوست انسانی، مو/تاج، سه رنگ مو/سبیل، سبیل/نقش فانتزی، کلاه، لباس و عینک دارد. برای پرنده/اژدها، accessory مناسب منقار/پوزه ساخته شود؛ گزینه‌ها gender-locked یا رنگ پوست پولی نباشند.

لایه‌ها: پشت‌مو/دم/بال → پا/بدن → گردن/صورت → چشم/دهان → جلوی مو → سبیل/نقش → کلاه → عینک/اکسسوری. focus، چشم و خوانایی زیر کلاه پنهان نشود. production به anchor/occlusion mask واقعی نیاز دارد؛ مدل ثابت SVG فقط مطالعهٔ ترکیب است.

saved → draft → preview → save/revision یا cancel. ذخیرهٔ ناموفق موفق نشان داده نشود. خروج سه انتخاب ذخیره/خروج بدون تغییر/ادامهٔ ویرایش دارد. از S05 به S05 برگردد، از کمد/پروفایل به S19. S18 باید همان آیتم انتخاب‌شدهٔ S17 را نشان بدهد. این رفتارها در نمونه اصلاح و آزموده شده‌اند.

`avatar-core.mjs` schema کوچک prototype با `version:2` دارد؛ `characters.json` قرارداد production کامل‌تر است و مستقیماً جایگزین appStateCore نیست. adapter explicit لازم است: `base→baseCharacter`، `hat→hatId`، `moustache→facialHairId` و palette→asset IDs. migration تولیدی باید تمام گزینه‌های قدیمی را بدون حذف خاموش حفظ کند؛ نگاشت محدود prototype اثبات migration کامل نیست.
پیش‌نمایش تازه برای نشان‌دادن تنوع با آواتار اژدهای نمونه باز می‌شود؛ این یک نمونهٔ ازپیش‌انتخاب‌شده است. پیش‌فرض حساب تازه در قرارداد production انسان است؛ migration آواتار قدیمی نیز انسان می‌ماند. این انتخاب نمایشی نباید به migration تولیدی نشت کند.

## چهار مقصد کودک و یک سفر قابل فهم

**مسیر، تمرین، کمد، من**. بازی‌ها/مهارت‌ها زیر تمرین، آیتم‌ها/کارگاه زیر کمد، تنظیمات/خانواده زیر من. گزارش/خرید/حساب در shell بزرگسال با auth و authorization واقعی قرار دارند. leaderboard عمومی کودک و فشار streak وارد این طرح نشود.

زیگزاگ حفظ، اما ترتیب از skill graph و prerequisite می‌آید، نه مختصات تزئینی. گره فعال یکی، گره کامل قابل مرور، قفل پیش‌نیازش را نام می‌برد. pending، دریافت‌نشده و قفل سه وضعیت مستقل‌اند. course بلند به scroll-to-current و virtualized list نیاز دارد. ترتیب DOM/keyboard همان ترتیب واقعی؛ connector از مختصات نرمال‌شدهٔ همان nodeها ساخته شود.

الگوی قابل اقتباس از [learning path رسمی دولینگو](https://blog.duolingo.com/new-duolingo-home-screen-design/): کاهش ابهام «بعد چه کنم؟»، واحد کوچک، مرور در مسیر و guidebook واحد. خود زیگزاگ اثربخشی آموزشی را اثبات نمی‌کند؛ ترتیب و مرور ریاضی فارسی با متخصص محتوا تأیید شود.

آغاز: S01→S02/S03 حساب بزرگسال→S04 پایه→S05 نام مستعار/ظاهر→S06 جایابی اختیاری→S07. درس: S07/S08→S09 شروع/ادامه→S10 یادگیری→S11 بازی انتقال→S12 نتیجه. prototype شمارش برای محدودکردن دامنه S10→S12 می‌رود؛ S11 قالب دارد، موتور مستقل کامل ندارد.

`specs/design-flow.json` برای هر ۲۴ صفحه layout، CTA، مقصد، speaker و قاعدهٔ فارسی دارد. `specs/screens.json` observation، issue، evidence، state و accessibility نسخهٔ موجود را نگه می‌دارد. قرارداد اصلاحی با مشاهدهٔ فعلی یکی نیست.

## آیکون پیشنهادی

چهرهٔ آریا، بدون نوشته، روی زمینهٔ روشن سبز-فیروزه‌ای؛ مستقل از آواتار کودک. SVG/PNG1024 و Android foreground/background همراه‌اند. چشم و silhouette در ۴۰/۶۰/۱۲۸px خوانا بمانند. mask گرد/مربع، monochrome، dark theme و launcher واقعی باید روی دستگاه آزموده شوند؛ این تحویل آزمون launcher یا attractiveness با کودک نیست.

## فناوری: پشتهٔ موجود حفظ شود

TypeScript مشترک، React Native + Expo Router + Hermes/New Architecture موبایل، Next.js/React وب و runtimeهای مشترک موجود حفظ شوند. Flutter/Unity یا بازنویسی Swift/Kotlin فقط برای شباهت به دولینگو توجیه ندارد.

[تجربهٔ Duolingo Math](https://blog.duolingo.com/developing-math/) ترکیب dynamic drawing کدی با Rive و iOS اولیهٔ Swift را شرح می‌دهد. پس برای اعداد/آرایه‌ها rendering data-driven و برای شخصیت/تعامل پیچیده Rive؛ همهٔ سؤال‌ها را داخل artboard دفن نکنید.

Rive موبایل `0.4.20` + Nitro موجود است، اما lesson واقعی rig ندارد؛ وب dependency Rive ندارد و کامپوننت موسوم به Rive، SVG است. هیچ `.riv` در بستهٔ ورودی نبود. [راهنمای رسمی مهاجرت](https://rive.app/docs/runtimes/react-native/migration-guide) v0.5 را beta می‌نامد و async API روی v0.4.19+ را توصیه می‌کند. pin فعلی حفظ، spike جدا و rollback؛ [Expo development build](https://rive.app/docs/runtimes/react-native/adding-rive-to-expo) لازم است، نه Expo Go.

semanticEvent مستقل → adapter → ViewModel/state machine. manifest شامل hash، artboard، VM، stateMachine، schemaVersion، license، fallback و reducedMotion. asset failure نباید submit را متوقف کند. [Rive حرکت کمتر را خودکار اعمال نمی‌کند](https://rive.app/docs/editor/accessibility/reduced-motion)؛ اپ preference را به binding بدهد.

**نکتهٔ تازهٔ محیط ساخت:** root Node>=20 است، ولی [Expo SDK57](https://docs.expo.dev/versions/v57.0.0) حداقل Node22.13.x، RN0.86 و React19.2.3 را فهرست می‌کند. CI باید Node22.13+ مناسب قفل‌نسخه داشته باشد. حداقل OS محدودیت سخت‌تر Expo است: Android7+/iOS16.4+، نه فقط حداقل Rive. expo-build-properties و lockfile با expo install/check در محیط توسعه بررسی شوند؛ سازگاری کامل build اینجا اثبات نشده.
این تغییرهای engine/CI و deployment target در سورس اولیه اعمال نشده‌اند؛ کار مرحلهٔ پیاده‌سازی‌اند. iOS16.4 باید در config/build واقعی enforce شود، نه فقط در سند ذکر شود.

Rive حس ۲٫۵بعدی می‌دهد، نه تضمین mesh/camera سه‌بعدی. MIT runtime را با هزینه/مجوز editor/export یا مالکیت asset یکی نگیرید. `.riv` واقعی نیازمند کار rig و export مناسب است؛ این بسته جای آن را نمی‌گیرد.

## ریسک‌های کد اصلی که قبل از polish باید اصلاح شوند

**P0 امنیت:** `apps/web/lib/teacher-auth.ts:164-181,220-245` cookie را base64 می‌کند و در همین مسیر خواندن امضا یا lookup قابل مشاهده ندارد. `:203-217` dev-token را بدون guard production همان تابع می‌پذیرد. این مشاهدهٔ ایستا است، نه exploit اجراشده یا ادعای نبود کنترل در همهٔ لایه‌ها. session/role از مرجع سرور، حذف dev auth تولیدی و تست forgery/expiry/role isolation لازم است.

**P0 اعتماد آموزشی:** نتیجهٔ وب مقدارهای ثابت دارد (`DuolingoLessonModal.tsx:780-825`). accuracy/unlock/reward از outcome معتبر؛ fallback و pending نباید موفقیت سرور را وانمود کنند.

**P1 ذخیره:** `AppStateContext.tsx:41-45` نتیجهٔ save عمومی را مصرف نمی‌کند. outcome/retry و low-storage/kill test لازم است؛ UI موفق به‌معنی دیسک موفق نیست.

**P1 آفلاین:** `FileSyncQueueStore.ts:16-27,42-45` read-modify-write غیراتمیک/بی‌سریال دارد؛ listener reconnect در مسیر native بررسی‌شده پیدا نشد. queue سریال/اتمیک، idempotency، foreground/reconnect flush و status واقعی لازم است. start آفلاین به manifest/session policy معتبر نیاز دارد.

**P1 جریان:** onboarding native auth/grade واقعی ندارد، جایابی پیش از consent و station auto-start است. ورود/شروع وب و native یک state machine مشترک لازم دارد.

۵۸ رکورد issue UX از همان JSON شمارش شد، نه ۵۸ باگ یکتای اثبات‌شدهٔ تمام پروژه. موارد security/storage/character با این رکوردها هم‌پوشانی دارند.

## ترتیب ساخت

۱. Backend + mobile lead: auth/authorization، نتیجهٔ معتبر، persistence و queue.
۲. Designer + mobile/web lead: state machine ورود، چهار تب، شروع/ادامه و contentId/metadata مشترک؛ pending/error/download با متن مشترک.
۳. Illustrator + animator + creative technologist: سه‌نمای واقعی چهار guide، slot/anchor، Rive rig، fallback، reduced motion و manifest.
۴. QA + curriculum: lesson/result parity، سنجش بی‌راهنما، content graph، RTL/TalkBack/VoiceOver، دستگاه ضعیف، آفلاین/restart/storage، خرید/رضایت.

## دروازهٔ پذیرش

آزمودهٔ این تحویل: render بی‌خطای مرورگر، دسترسی ۲۴ قالب، avatar save/reload/cancel/dirty navigation، برگشت کارگاه onboarding، accuracy با retry، سنجش بدون mascot/feedback/unlock، مسدودشدن شروع دریافت‌نشده و UI انتظار/عدم unlock در شبیه‌سازی محلی آفلاین، viewport320/error recovery، normalization/migration محدود و storage failure هستهٔ نمونه. این آزمایش، queue/reconnect/sync واقعی نیست.

آزموده‌نشده: native build، testهای اصلی محصول، auth/backend واقعی، Rive rig، sync دستگاه، خرید/شرایط، محتوای کامل، آزمون کودک و حقوق برند. prototype browser pass این‌ها را اثبات نمی‌کند.

performance قبلی هدف است: 60FPS/16.67ms، cache80MB، syncbatch20. ابزار synthetic قبلی `lowEndAndroidMeasured:false` دارد. روی گوشی حداقل منتخب fps/frame drops، p95 input latency، cold start، RAM/decode سنجیده شود؛ بودجهٔ عددی تا قبل baseline «هدف» است.

سورس اولیه بی‌تغییر حفظ شده. اصلاح‌های واقعی در prototype و هستهٔ نمونه‌اند؛ رفع ریسک‌های محصول در مرحلهٔ پیاده‌سازی backlog شده است. sandbox برای نصب dependency یا ساخت native اینترنت ندارد؛ این علت عدم اجرای build اصلی است، نه نتیجهٔ شکست آن build.

## منابع

[Learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/) · [Cast](https://blog.duolingo.com/building-character/) · [Avatar creator](https://blog.duolingo.com/avatar-creator/) · [Math/Rive](https://blog.duolingo.com/developing-math/) · [Character design](https://design.duolingo.com/illustration/characters#body-types) · [Rive migration](https://rive.app/docs/runtimes/react-native/migration-guide) · [Expo integration](https://rive.app/docs/runtimes/react-native/adding-rive-to-expo) · [Reduced motion](https://rive.app/docs/editor/accessibility/reduced-motion) · [Expo57](https://docs.expo.dev/versions/v57.0.0)
