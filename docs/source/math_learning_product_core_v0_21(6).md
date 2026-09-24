<div dir="rtl" align="right">

# Product Core — پلتفرم یادگیری شخصی ریاضی دبستان

**نوع سند:** Living Source of Truth / سند مرجع طرح کلی و Blueprint سطح‌بالای V1  
**نسخه:** `v0.21`  
**Current Revision:** `v0.21-MA4`  
**آخرین به‌روزرسانی:** ۲۴ سپتامبر ۲۰۲۶  
**دامنه:** ریاضیات دبستان، پایه‌های ۱ تا ۶

> این سند هسته ایده، اصول، تصمیم‌های فعلی، فرضیه‌ها و شواهد را ثبت می‌کند. هنوز PRD، backlog یا Technical Implementation Spec نیست. بخش‌های Technical Core در ادامه، domain semantics و قراردادهای غیر-PHYSICAL را تثبیت می‌کنند؛ schema، API، infrastructure و Stack خارج از این سند باقی می‌مانند.

### وضعیت‌ها

- `PRINCIPLE` — اصل راهنما
- `LOCKED` — تصمیم فعلی
- `HYPOTHESIS` — فرضیه قابل‌آزمایش
- `OPEN` — هنوز برای تصمیم نهایی زود است
- `EVIDENCE NEEDED` — شواهد کافی نداریم

</div>

<div dir="rtl" align="right">

# 0. خلاصه

## ایده

> **یک سفر شخصی یادگیری ریاضی برای کودک دبستانی.**  
> سیستم وضعیت مهارتی کودک را پیوسته می‌فهمد، قدم بعدی را انتخاب می‌کند و پیشرفت را برای کودک، والد و معلم به زبان مناسب هرکدام نشان می‌دهد.

## مسئله

- **والد:** نمی‌داند کودک دقیقاً کجا مشکل دارد و قدم بعد چیست.
- **کودک:** تمرین تکراری و بی‌معنا را ادامه نمی‌دهد.
- **معلم:** برای تشخیص و مداخله فردی زمان محدودی دارد.

## هسته

```text
Evidence
  ↓
Current Learning State
  ↓
Learning Decision
  ↓
Learning Plan
  ↓
Child Experience
  ↓
New Evidence
  ↓
Progress / Mastery
```

## سه تجربه

| نقش | سؤال اصلی | ارزش |
|---|---|---|
| کودک | الان چه کار کنم؟ | چالش مناسب، حس توانستن، پیشرفت |
| والد | فرزندم کجاست و قدم بعد چیست؟ | Insight، Confidence، Proof |
| معلم | با کدام دانش‌آموز/گروه چه کار کنم؟ | تشخیص، مداخله، بازسنجی |

## اصل مرکزی

> **Learning Progress → World Progress**  
> progression بازی باید به پیشرفت واقعی یادگیری متصل باشد.

## محصول نیست

- بانک سؤال صرف
- بازی مستقل با ریاضی تزئینی
- مدرسه مجازی
- Chatbot عمومی به‌عنوان مغز محصول
- کتابخانه عظیم ویدئو

</div>

<div dir="rtl" align="right">

# 0.0 برش بسته V1 — Product Blueprint

> **Conceptual richness ≠ V1 complexity.** هسته مفهومی سند حفظ می‌شود، اما V1 فقط کوچک‌ترین حلقه‌ای را می‌سازد که بتواند ارزش آموزشی واقعی را نشان دهد.

## حلقه اصلی V1

```text
Placement کوتاه
      ↓
نقطه شروع + مهارت‌های نیازمند توجه
      ↓
تمرین کوتاه
      ↓
پاسخ + بازخورد
      ↓
Evidence
      ↓
به‌روزرسانی وضعیت Skill
      ↓
Practice / Review / Recovery / Check / Next
      ↓
Progress
```

موتور تطبیق V1 **Rule-Based** است؛ AI/ML مغز تصمیم‌گیری V1 نیست.

## مرزبندی بنیادی V1

```text
BOOK SECTION = ترتیب و ناوبری محصول
STATION      = بسته‌بندی تجربه کودک
SKILL        = واحد واقعی یادگیری و تصمیم‌گیری
EVIDENCE     = مشاهده عملکرد
MASTERY      = ارزیابی جداگانه بر اساس Contract
```

> **V1: مسیر تجربه = Stationها؛ واحد تصمیم‌گیری = Skill.**

### رابطه Station و Skill

هر Station روی **یک یا چند Skill** از Skill Graph نسخه جاری پایه اول نگاشت می‌شود. ترتیب Stationها از کتاب C105 می‌آید، اما انتخاب تمرین، Recovery، Review و Check بر اساس وضعیت Skill انجام می‌شود.

عدد دقیق Skillهای هر Station در فایل `math_learning_product_grade1_skill_graph_v0_27.md` تعیین می‌شود و تا قبل از آن، قاعده `1..N Skills per Station` است؛ عدد ثابتی مانند «۲ تا ۵» در هسته محصول قفل نمی‌شود.

## تصمیم‌های V1

| موضوع | تصمیم | وضعیت |
|---|---|---|
| بازار | فقط ایران | `LOCKED` (V1) |
| پوشش پایه‌ها | محصول برای پایه‌های ۱ تا ۶؛ **V1 فقط پایه اول** | `LOCKED` |
| ثبت‌نام | مسیر ورود ساده؛ هر نقش می‌تواند شروع کند، اما مدل نهایی سابقه همیشه `Learning Identity = یک کودک` است | `LOCKED` (V1) |
| حساب | V1 از یک ورود ساده برای کودک استفاده می‌کند؛ والد در همان حساب/پنل به نمای والد دسترسی می‌گیرد. در Domain Model، `Account / Principal ≠ Learning Identity` باقی می‌ماند | `LOCKED` (V1) |
| رضایت/حریم خصوصی کودک | flow پیچیده رضایت در V1 ساخته نمی‌شود؛ الزام حقوقی هنوز نهایی نشده است | `PROVISIONAL / LEGAL REVIEW REQUIRED` |
| Free Diagnostic | Guest مجاز؛ نگهداری موقت داده برای تبدیل به حساب. مدت دقیق retention به Privacy Policy و بررسی حقوقی وابسته است | `PROVISIONAL / LEGAL REVIEW REQUIRED` |
| دسترسی به داده | کودک و نمای مجاز والد عملکرد را می‌بینند؛ خروجی داده در V1 نیست | `LOCKED` (V1) |
| معلم | معلم تأییدشده و Admin در V1 | `LOCKED` (V1) |
| Class | یک Class ساده در V1 وجود دارد؛ روش Join و جزئیات visibility باز می‌ماند | `LOCKED CONCEPT / OPEN MECHANISM` |
| ارزش معلم | مشاهده عملکرد خلاصه، Skillهای نیازمند توجه و وضعیت Review دانش‌آموزان Class | `LOCKED` (V1) |
| محتوای V1 | کتاب ریاضی اول دبستان C105، به ترتیب ۲۵ بخش؛ استفاده مستقیم از تصاویر کتاب نیازمند بررسی حقوقی | `LOCKED` (V1) |
| ساختار مسیر | هر بخش کتاب یک Station؛ Stationها ترتیب مسیر را می‌سازند | `LOCKED` (V1) |
| نگاشت Skill↔Station | هر Station به یک یا چند Skill نگاشت می‌شود؛ تصمیم آموزشی داخل/بین Stationها Skill-driven است | `LOCKED` (V1) |
| رابط کودک | صوت، تصویر، نماد و تعامل لمسی؛ وابستگی حداقلی به خواندن | `LOCKED` (V1) |
| Placement | کوتاه و Rule-Based؛ نقطه شروع و ضعف‌های اولیه را پیدا می‌کند، نه diagnosis کامل | `LOCKED` (V1) |
| Station Pass | قاعده عملیاتی اولیه: ۴ از ۵ پاسخ صحیح در دو Check جدا | `HYPOTHESIS / V1 TEMPORARY RULE` |
| Mastery | از Station Pass جداست؛ Mastery Contract خانواده‌محور و شواهد-محور باقی می‌ماند | `LOCKED` در semantics |
| موتور تطبیق | Rule-Based | `LOCKED` (V1) |
| مدل AI | AI Tutor / ML Recommendation در V1 ساخته نمی‌شود | `LOCKED` (V1) |
| معماری | Modular Monolith | `LOCKED` |
| معماری Client | Public Web + Parent Web + Teacher Web + Admin Web + Child Mobile App روی Shared Platform | `LOCKED (V1)` |
| Backend interface | Shared application/domain core؛ Web می‌تواند Server Actions/Route Handlers داشته باشد و Mobile از API contract رسمی استفاده می‌کند | `LOCKED (V1)` |
| زبان اصلی | TypeScript | `LOCKED` |
| فرانت‌اند | Next.js + React + App Router | `LOCKED` |
| بک‌اند | Server-side داخل Next.js؛ بدون سرویس backend جدا در V1 | `LOCKED` |
| پایگاه داده | PostgreSQL | `LOCKED` |
| Auth | Supabase Auth | `LOCKED` |
| Storage | Supabase Storage | `LOCKED` |
| Runtime | Node.js 24 LTS در شروع پیاده‌سازی | `LOCKED` |
| تست E2E | Playwright | `LOCKED` |
| تست Unit | TypeScript test runner؛ انتخاب runner نهایی در شروع repo | `OPEN — implementation detail` |
| Graph Database | در V1 استفاده نمی‌شود؛ Skill Graph با relational tables پیاده می‌شود | `LOCKED` |
| Microservices / Kafka / GraphQL / Kubernetes | در V1 ساخته نمی‌شوند | `LOCKED` |
| Redis | در V1 لازم نیست؛ فقط در صورت نیاز واقعی اضافه می‌شود | `LOCKED` |
| مدل تجاری | هنوز تصمیم نهایی ندارد | `OPEN` |
| کانال جذب | هنوز تصمیم نهایی ندارد | `OPEN` |
| برند و Art Direction | هنوز تصمیم نهایی ندارد | `OPEN` |
| کانال کودک | **Mobile App به‌عنوان Client اصلی تجربه یادگیری کودک**؛ Android/iOS در معماری واحد و با backend مشترک | `LOCKED (V1)` |
| مدل Child Experience | **Animated Onboarding → Mini Diagnostic → Personalized Starting Point → Guided Learning Path → Station Sessions**؛ این توالی در سطح UX قفل است، اما جزئیات بصری در سند Child Experience Specification نگهداری می‌شود | `LOCKED (V1)` |
| Learning Path | نمای بصری گام‌به‌گام از مسیر کودک؛ یک **Projection/Experience View** است و منبع مستقل Learning Truth یا Curriculum نیست | `LOCKED` در semantics |
| Onboarding | کوتاه، تصویری، کم‌خواندن و کودک‌محور؛ انتخاب Grade و چند preference کم‌ریسک قبل از Mini Diagnostic؛ سؤال‌های onboarding به‌خودی‌خود Evidence یادگیری نیستند | `LOCKED` در اصول |
| Animation / Character | Character و Motion بخشی از تجربه‌اند، اما animation باید Explain / React / Reveal Progress باشد و از decorative overload جلوگیری شود | `LOCKED` در اصول |
| Path adaptation | مسیر از بیرون قابل‌فهم و step-by-step است؛ انتخاب واقعی قدم بعدی می‌تواند با Skill State، Evidence، Review و Recovery تغییر کند | `LOCKED` در semantics |
| کانال عمومی | Public Web برای معرفی، اعتماد، Free Diagnostic، ورود و Account lifecycle | `LOCKED (V1)` |
| کانال والد | Parent Web برای Progress، Insight، Next Step و تنظیمات | `LOCKED (V1)` |
| کانال معلم | Teacher Web برای Class، Skill Status، Assignment، Intervention و Recheck | `LOCKED (V1)` |
| کانال ادمین | Admin Web برای approval، content operations، configuration و audit | `LOCKED (V1)` |
| Shared Platform | یک Platform Core و یک backend برای تمام Clientها و Gradeها | `LOCKED (V1)` |
| زبان رابط کاربری | فارسی / RTL به‌عنوان baseline V1؛ wording و reading load در طراحی پایه اول نهایی می‌شود | `LOCKED BASELINE / OPEN DETAIL` |

## تجربه هر Station

```text
1. Learn
   ↓
2. Guided Practice
   ↓
3. Check
   ↓
4. Result
```

### Learn
- تصویر و نمایش مناسب سن
- صدای فارسی
- نمونه حل‌شده
- انیمیشن کوتاه در حد نیاز
- نمونه با کمک

### Guided Practice
- چند سؤال کوتاه
- بازخورد فوری
- Hint در صورت نیاز

### Check
- Check امتیازدهی‌شده برای تصمیم Station
- بدون تایمر
- بدون علامت شکست
- جمع‌آوری Evidence

### Result

```text
Pass → Next Station

Not Pass
   ↓
Recovery
   ↓
Recheck
```

کودک به خاطر چند پاسخ غلط متوقف نمی‌شود؛ مسیر ادامه پیدا می‌کند و Skill برای Review/Recovery علامت می‌خورد.

## Station Pass ≠ Mastery

قاعده اولیه `4/5 in two separate checks` فقط برای یک تصمیم عملی V1 مثل عبور از Station یا بازشدن مرحله بعد است.

این قاعده **تعریف نهایی Mastery نیست**. Mastery همچنان بر اساس `Mastery Contract` و `Mastery Evaluation` ارزیابی می‌شود.

## چیزی که در V1 نمی‌سازیم

- microservices
- Kafka / Event Bus پیچیده
- GraphQL
- Kubernetes / Service Mesh
- Full Event Sourcing / Full CQRS
- Graph Database
- ML/RL/LLM به‌عنوان موتور اصلی یادگیری
- AI Tutor عمومی
- Relationship/Delegation کامل چندلایه
- Analytics سنگین و داشبوردهای پیچیده
- Teacher Assignment Orchestration کامل
- Parent Analytics / Export پیچیده
- همه پایه‌های ۱ تا ۶
- Mobile App به‌عنوان Child Client جزو V1 است؛ قابلیت‌های اضافی خارج از Child Learning باید جداگانه اثبات شوند.


# 0.1 واژه‌های کلیدی

| اصطلاح | تعریف |
|---|---|
| **Skill** | توانایی مشخصی که آموزش، تمرین و سنجش مستقل دارد. |
| **Skill Family** | گروهی از Skillها که Mastery Contract، spacing/interleaving و Evidence Decay مشترک دارند؛ پیکربندی در Skill Graph است، نه سطح جدیدی از سلسله‌مراتب Domain → Skill → Subskill. |
| **Evidence** | مشاهده معتبر از عملکرد/یادگیری کودک، با provenance و زمان؛ اگر از artifact داخلی آمده باشد، Content Version نیز reference می‌شود. |
| **Learning Truth** | مجموعه Evidence و Interpretation معتبر درباره وضعیت یادگیری؛ نه یک نمره یا verdict واحد. |
| **Learning State** | وضعیت جاری کودک در یک Skill و Learning Relationship Context طبق policy؛ state جاری از history/interpretation مشتق می‌شود. |
| **Learning Relationship Context** | محیط/دامنه‌ای که یک Learning Relationship در آن معتبر است؛ مثل Home، School Class، Tutor یا Learning Center. |
| **Platform Context** | Learning Relationship Context پیش‌فرض و system-owned برای Evidenceای که رابطه آموزشی مشخصی ندارد (مثل استفاده مستقیم کودک از پلتفرم پیش از ایجاد رابطه یا Assessment بیرونی)؛ خودش هیچ دسترسی نمی‌دهد. |
| **Learning Objective** | هدف مشخص یادگیری در یک بخش از مسیر؛ Decision و Content به آن اشاره می‌کنند. |
| **Learning Objective Context** | نوع اجرای هدف آموزشی؛ مثل Practice، Review، Assignment، Exam Prep یا Recovery. |
| **Learning Decision** | تعیین مهم‌ترین نیاز یا قدم آموزشی در یک لحظه. |
| **Learning Orchestration** | حل تعارض و اولویت‌گذاری بین هدف‌ها، محدودیت‌ها، منابع و Contextها. |
| **Learning Plan** | قرارداد اجرایی Decision در یک Context و بازه مشخص؛ در V1 تا حد لازم lightweight است. |
| **Journey** | مسیر شخصی کودک در محصول؛ بالاترین سطح قاب تجربه که Missionها را در بر می‌گیرد. World / Region / Adventure لایه‌های روایی آن‌اند (بخش 4.3). |
| **Mission** | واحد هدف/سفر محصولی و reusable؛ اجرای child-specific آن در Technical Model به‌صورت `Mission Instance` نگهداری می‌شود. |
| **Mission Instance** | اجرای child-specific یک Mission؛ به Session و Encounterها متصل می‌شود و lifecycle runtime دارد. |
| **Session** | اجرای واقعی کودک از یک یا چند Mission. |
| **Encounter** | کوچک‌ترین واحد تعامل آموزشی/تجربی که می‌تواند Evidence تولید کند. |
| **Learning Role** | نقش آموزشی Encounter؛ مثل Diagnostic Probe، Instruction / Representation، Guided Practice، Independent Practice، Review، Transfer یا Mastery Check. |
| **Experience Form** | شکل ارائه Encounter؛ مثل Story، Puzzle، Challenge یا Boss. |
| **Error Hypothesis** | توضیح موقت و قابل‌آزمون برای یک الگوی خطا؛ نه diagnosis قطعی. |
| **Uncertainty** | میزان بازبودن تفسیر درباره State، Hypothesis یا Decision؛ از Confidence متمایز است. |
| **Constraint** | محدودیتی که از System، Teacher، Parent، Exam یا Context می‌آید و می‌تواند hard/soft باشد. |
| **Content Version** | نسخه مشخص Question/Encounter/Representation که Evidence به آن اشاره می‌کند. |
| **Mastery** | شواهد کافی، متنوع و نسبتاً پایدار از یادگیری یک Skill طبق Mastery Contract. |
| **Intervention** | اقدام هدفمند برای تغییر وضعیت Skill یا گروه. |
| **Placement** | نقطه شروع تشخیص کودک؛ از Encounterهایی با Learning Role = Diagnostic Probe تشکیل می‌شود و Evidence معمولی تولید می‌کند. هدف آن تعیین نقطه شروع است، نه diagnosis کامل (بخش 3.2). |
| **Math Passport** | فرضیه: نمای طولی (Projection) از سابقه یادگیری کودک در طول پایه‌ها؛ در V1 فقط حفظ Learning Identity / History در معماری لازم است و تجربه کامل بعداً می‌آید (`HYPOTHESIS`). |

> نام انگلیسی Canonical پس از اولین معرفی ثابت می‌ماند.

</div>

<div dir="rtl" align="right">

# 1. Product Thesis — فرضیه مرکزی

## وعده

> **هر کودک مسیر ریاضی مخصوص خودش را دارد؛ سیستم قدم بعدی را پیدا می‌کند و تجربه متناسب را ارائه می‌دهد.**

## تمایز مورد انتظار

مزیت در یک feature نیست؛ در ترکیب زیر است:

1. **Error Intelligence** — خطا به فرضیه قابل‌بررسی تبدیل می‌شود.
2. **Prerequisite Recovery** — گلوگاه پیش‌نیاز پیدا می‌شود.
3. **Adaptive Journey** — مسیر شخصی می‌شود، نه فقط سؤال.
4. **Longitudinal Progress** — سابقه یادگیری در طول پایه‌ها حفظ می‌شود.
5. **Teacher Intervention** — داده به اقدام آموزشی تبدیل می‌شود.

**Status:** `PRINCIPLE`

</div>

<div dir="rtl" align="right">

# 2. Product Principles — اصول ثابت

### P1 — Learning First
بازی باید به یادگیری خدمت کند.

### P2 — Math as Game Mechanic
مکانیک بازی باید از مفهوم ریاضی بیاید، نه فقط از ظاهر بازی.

### P3 — Healthy Habit
هدف، علاقه به ادامه مسیر است؛ نه FOMO، فشار یا streak تنبیهی.

### P4 — Visible Progress
پیشرفت باید در توانایی و تجربه قابل‌دیدن باشد؛ نه فقط درصد و XP.

### P5 — Evidence Before Diagnosis
یک خطا تشخیص قطعی نیست؛ برای تصمیم‌های مهم باید شواهد کافی جمع شود.

### P6 — Choice of Experience, Not Curriculum
کودک در شیوه تجربه انتخاب دارد، نه در حذف یک نیاز آموزشی مهم.

### P7 — Teacher Value Before Referral
معلم ابتدا باید ارزش مستقیم بگیرد؛ referral پیامد اعتماد است.

### P8 — One Child Learning Identity
یک کودک می‌تواند چند رابطه آموزشی داشته باشد، اما سابقه یادگیری مشترک دارد.

### P9 — Evidence → Action
ارزیابی زمانی ارزشمندتر است که تصمیم یا اقدام بعدی را بهتر کند.

### P10 — Implementation Is Part of Product
اگر ابزار برای معلم یا والد سخت اجرا شود، کیفیت آموزشی آن روی کاغذ کافی نیست.

**Status:** `PRINCIPLE`

</div>

<div dir="rtl" align="right">

# 2.1 Core Contracts — قراردادهای هسته

این قراردادها مرز بین اصل محصول و پیاده‌سازی را روشن می‌کنند. هدف آن‌ها سنگین‌کردن V1 نیست؛ جلوگیری از چندتفسیرشدن مفاهیم مرکزی است.

### Canonical Learning Loop

```text
Child Learning Identity
        ↓
Learning Relationship Context
        ↓
Evidence
        ↓
Interpretation + Confidence + Uncertainty
        ↓
Context-aware Learning State
        ↓
Learning Decision
        ↓
Constraint / Source Arbitration
        ↓
Learning Plan
        ↓
Mission / Session
        ↓
Encounter
        ↓
New Evidence
```

### Canonical Experience Boundary

```text
Journey
  ↓
Mission
  ↓
Session
  ↓
Encounter
  ↓
Evidence
```

`Learning Role` و `Experience Form` دو محور مستقل‌اند؛ مثلاً یک Encounter می‌تواند `Transfer + Puzzle` یا `Diagnostic Probe + Story` باشد. `Boss` شکل تجربه است، نه مرحله‌ای هم‌سطح با Transfer یا Mastery.

### V1 Contract vs Conceptual Expansion

در V1 فقط بخشی از این قراردادها باید به‌صورت object مستقل ساخته شوند؛ مفاهیمی مثل Learning Plan، Arbitration و Aggregate State تا سطح لازم برای تصمیم‌گیری traceable پیاده می‌شوند و نباید بدون نیاز به پیچیدگی domain model تبدیل شوند.

**Status:** `LOCKED` — مرز مفهومی؛ جزئیات schema هنوز ممکن است تغییر کند.

</div>

<div dir="rtl" align="right">

# 3. Learning Core — مغز محصول

## 3.1 Skill Graph

واحد اصلی یادگیری **Skill** است، نه سؤال، نه Station و نه فصل کتاب.

```text
Book / Section
      ↓ mapping
   Station
      ↓ contains
   1..N Skills
      ↓
 Skill Graph
      ↓
 Evidence / State / Decision
```

### Contract: Skill ↔ Station

- Station برای navigation و تجربه کودک است.
- Skill برای learning state و تصمیم‌گیری است.
- یک Station می‌تواند چند Skill داشته باشد.
- یک Skill می‌تواند در بیش از یک Station ظاهر شود، اگر evidence آن برای همان Skill معتبر باشد.
- ترتیب Stationها کتاب‌محور است؛ انتخاب تمرین داخل مسیر Skill-driven است.
- محتوای دقیق mapping در `math_learning_product_grade1_skill_graph_v0_27.md` نگهداری می‌شود.

> **V1: Station مسیر را می‌سازد؛ Skill تصمیم را هدایت می‌کند.**

`Skill Family` گروه‌بندی سیاستی Skillها برای Mastery Contract، Spacing/Interleaving و Evidence Decay است؛ جایگزین Domain/Subskill نیست.

**Status:** `LOCKED` در قرارداد Skill↔Station؛ جزئیات mapping پایه اول در artifact محتوایی همان پایه تعیین می‌شود.

## 3.2 Continuous Diagnosis

Placement فقط نقطه شروع است؛ diagnosis در طول استفاده به‌روز می‌شود.

```text
Placement
→ Initial Skill State
→ Targeted Practice / Probe
→ New Evidence
→ Updated State
→ Recheck
```

Placement در V1 با مجموعه‌ای کوچک از Probeها فقط این دو کار را انجام می‌دهد:

1. تخمین نقطه شروع کودک.
2. پیدا کردن چند Skill نیازمند توجه یا بررسی بیشتر.

Placement **diagnosis کامل ریاضی** نیست.

تعداد Probeها در prototype تعیین می‌شود؛ «حدود ۹ Probe» فقط یک Hypothesis اولیه است.

**Status:** `LOCKED` در semantics؛ تعداد دقیق Probeها `HYPOTHESIS`.


## 3.3 Error Intelligence

> **Error ≠ Diagnosis**

خطا ممکن است:

- **Learning Signal:** مفهومی، procedural، strategy، representation، fluency
- **Performance / Observation Signal:** خطای اجرا/ثبت، زبان/درک دستور، شواهد ناکافی

فقط خطاهایی وارد موتور اجرایی می‌شوند که با شواهد کافی قابل‌اعتماد باشند.

**Status:** `PRINCIPLE`

## 3.4 Evidence Model

حداقل Evidence باید این ابعاد را داشته باشد:

- **Child / Learning Identity**
- **Skill / Subskill**
- **Learning Objective**
- **Learning Relationship Context**
- **Learning Objective Context**
- **Encounter / Question / Content Version**
- **Response / Attempt / Hint / Representation** در صورت مرتبط‌بودن
- **Error Signal / Performance Signal** در صورت وجود
- **Source / Actor**
- **Time**
- **Provenance**

اصل مهم: Evidence باید source/provenance مشخص داشته باشد. اگر از artifact داخلی تولید شده باشد، `Content Version` reference می‌شود؛ اگر از Teacher/Parent Observation یا Assessment بیرونی آمده باشد، Source Reference کافی است.

### Evidence Quality

Evidence صرفاً «درست/غلط» نیست. کیفیت آن می‌تواند تحت‌تأثیر این موارد باشد:

- استقلال پاسخ
- استفاده از Hint یا Guidance
- تنوع Representation
- انتقال به Context جدید
- تازگی evidence
- سازگاری با evidenceهای قبلی
- قابلیت تفسیر محتوای مورد استفاده

**Status:** `LOCKED` در سطح مفهومی؛ schema جزئی‌تر بعداً تعیین می‌شود.

## 3.5 Learning Objective و Context

### Learning Objective
هدف مشخص یادگیری در یک بخش از مسیر.

### Learning Relationship Context
رابطه/محیطی که Evidence و Action در آن معنا پیدا می‌کند؛ مثل Home، School، Tutor یا Learning Center.

### Learning Objective Context
نحوه یا موقعیت اجرای هدف؛ مثل Practice، Review، Assignment، Exam Prep یا Recovery.

این دو مفهوم عمداً جدا هستند؛ یک کودک می‌تواند در School Context و در Exam Prep Objective Context روی همان Skill کار کند.

**Status:** `LOCKED` در سطح واژگان؛ granularity جزئی‌تر هنوز `OPEN` است.

## 3.6 Learning Role و Experience Form

### Learning Role

| Role | کاربرد |
|---|---|
| Diagnostic Probe | کاهش عدم‌قطعیت |
| Instruction / Representation | ساختن فهم |
| Guided Practice | تمرین با کمک |
| Independent Practice | تمرین مستقل |
| Review | بازیابی فاصله‌دار |
| Transfer | کاربرد در موقعیت جدید |
| Mastery Check | جمع‌آوری شواهد کافی |

### Experience Form

شکل ارائه تجربه مستقل از Learning Role است:

- Story
- Puzzle
- Challenge
- Boss
- Build / Explore
- Conversation / Explanation

توجه: `Challenge` در این فهرست یک **قالب ارائه** است؛ سطح دشواری یا stretch آموزشی به Learning Role و Learning Decision تعلق دارد، نه به Experience Form.

یک Encounter می‌تواند یک Learning Role اصلی و یک Experience Form داشته باشد. اگر چند Role هم‌زمان ثبت شوند، باید مشخص باشد کدام Role، **intent اصلی** و کدام Role، **evaluation function** است؛ تا سؤال واحد به‌صورت مبهم چند کار مختلف انجام ندهد.

**Status:** `PRINCIPLE`

## 3.7 Prerequisite Recovery

اگر Skill فعلی به یک پیش‌نیاز مشکل‌دار وابسته باشد، مسیر موقتاً به آن گلوگاه برمی‌گردد.

> Recovery باید در همان سفر تجربه شود، نه به شکل «عقب‌رفتن در پایه».

## 3.8 Mastery Model

Mastery یک verdict یا عدد واحد نیست. حداقل سه بعد باید از هم جدا بمانند:

1. **Skill State** — وضعیت جاری یادگیری Skill
2. **Diagnostic Confidence** — اطمینان از interpretation فعلی
3. **Retention State** — نیاز به مرور/تثبیت

برای cross-product vocabulary، این stateها قابل استفاده‌اند:

```text
NEW / EMERGING / DEVELOPING / STABLE / TRANSFER-READY / MASTERED
```

این فهرست **vocabulary مشترک** است، نه یک ladder اجباری برای همه Skill Familyها. ترتیب، transition، امکان skip و demotion باید توسط Mastery Contract خانواده Skill تعیین شود.

Retention State (`FRESH / REVIEW-DUE / AT-RISK`) مستقل از Skill State است و به‌صورت **یک overlay انحصاری** نگهداری می‌شود.

### Mastery Contract — V1 baseline

Mastery برای هر Skill Family باید بر پایه ترکیبی از این محورها تعیین شود:

```text
Evidence Sufficiency
+ Evidence Diversity
+ Confidence
+ Persistence / Recency
+ Transfer when relevant
+ Retention / Review state
```

`Mastered` نباید صرفاً از یک پاسخ صحیح یا یک encounter نتیجه‌گیری شود. حداقل قرارداد V1 باید بتواند بین **یادگیری لحظه‌ای، یادگیری پایدار و توانایی انتقال** تفاوت بگذارد.

جزئیات thresholdها بر اساس خانواده Skill در آزمایش‌های محصول تعیین می‌شوند؛ یک threshold واحد برای تمام مهارت‌ها معتبر فرض نمی‌شود.

**Status:** `LOCKED` در سطح قرارداد؛ thresholdهای family-specific هنوز `HYPOTHESIS / EVIDENCE NEEDED` هستند.

## 3.9 Spacing & Interleaving

Review بخشی از مسیر عادی است.

> **Practice + Review + Interleaving + Transfer**

زمان‌بندی دقیق باید با آزمایش و داده تنظیم شود.

## 3.10 Learning Decision / Orchestration / Plan

این سه اصطلاح عمداً جدا هستند:

- **Learning Decision:** چه نیاز یا قدم آموزشی در اولویت است؟
- **Learning Orchestration:** وقتی چند هدف، Context یا Constraint هم‌زمان وجود دارند، چگونه تعارض و اولویت حل شود؟
- **Learning Plan:** این تصمیم در یک Context و بازه مشخص چگونه اجرا شود؟

### Canonical pipeline

```text
Evidence + Goals + Constraints
            ↓
     Current Learning State
            ↓
       Learning Decision
            ↓
   Source / Constraint Arbitration
            ↓
        Learning Plan
            ↓
 Mission / Session / Encounter
```

### ورودی‌های اصلی

- Learning State
- Confidence
- Uncertainty
- Retention
- Error Hypothesis
- Prerequisites
- Learning Objective
- Learning Relationship Context
- Learning Objective Context
- Recent Evidence
- Session Capacity
- Teacher / Exam / Parent / System Constraints

### Constraint model

هر Constraint حداقل باید این ویژگی‌ها را داشته باشد:

`Source + Type + Hard/Soft + Scope + Priority + Validity + Effect`

مثال: «امتحان فردا» می‌تواند Constraint زمانی قوی باشد؛ «ترجیح والد به session کوتاه» می‌تواند soft constraint باشد.

### Arbitration principle

اگر چند منبع تعارض دارند، Evidenceها حذف یا overwrite نمی‌شوند؛ provenance آن‌ها حفظ می‌شود و Arbitration فقط برای **تصمیم جاری** انجام می‌شود.

اصل V1:

> **Learning Truth is evidence-rich; Learning Decision is context-aware.**

Constraintها باید روی Candidate/Plan اثر بگذارند؛ نباید historical Learning State را rewrite کنند.

### Decision Candidate Model

`Learning Decision` نباید مستقیماً از یک rule واحد به «یک قدم» پرش کند. موتور ابتدا مجموعه‌ای از **Candidate Learning Steps** می‌سازد؛ سپس آن‌ها را با Constraint/Arbitration بررسی می‌کند.

```text
Learning State + Goals + Evidence
            ↓
   Candidate Learning Steps
            ↓
 Hard-Constraint / Safety Filter
            ↓
 Candidate Ranking / Arbitration
            ↓
      Selected Decision
```

Candidate می‌تواند شامل این نوع Stepها باشد:

- diagnostic probe
- instruction / representation
- guided practice
- independent practice
- review
- transfer
- mastery check
- prerequisite recovery — Skill هدف یک پیش‌نیاز است
- teacher-directed assignment step — منشأ Candidate یک Assignment است

هر Candidate یک Learning Role (بخش 3.6) روی یک Skill/Objective هدف است؛ دو مورد آخر منشأ/هدف Candidate را مشخص می‌کنند، نه Role جدید. `Challenge` یک Experience Form است و در سطح Candidate نمی‌آید؛ افزایش چالش آموزشی با Candidateهای Transfer / Independent Practice در دشواری بالاتر بیان می‌شود.

`Candidate` در V1 یک runtime concept است و الزاماً persisted entity نیست.

### Constraint Semantics

Constraint **هدف آموزشی نیست**؛ قید تصمیم و اجراست. هر Constraint باید حداقل این semantics را داشته باشد:

`Source + Type + Hard/Soft + Scope + Priority + Validity + Effect`

`Effect` مشخص می‌کند Constraint چگونه اعمال می‌شود:

- **Filter** — candidate را غیرمجاز می‌کند.
- **Modify** — زمان/طول/Experience/Boundary را تغییر می‌دهد.
- **Rank** — یک candidate را نسبت به دیگری ترجیح می‌دهد.

نمونه:

- Safety/Privacy policy → معمولاً `Filter`
- Parent session-length preference → معمولاً `Modify`
- Teacher pinned method/resource → `Filter` یا `Modify` در boundary اعلام‌شده
- Child preference for Story/Puzzle → معمولاً `Rank` در Experience Form، نه حذف Learning Objective
- Exam deadline → معمولاً `Rank/Modify` در Plan و sequencing، نه تغییر Learning State

### Authority / Arbitration Principle

هیچ Sourceای globally «همیشه برتر» نیست. **Authority به scope تصمیم وابسته است.**

قاعده V1:

1. Safety / Privacy / Product Hard Constraints می‌توانند candidate را block کنند.
2. Learning Policy تعیین می‌کند چه نیازهای آموزشی از نظر validity قابل‌قبول‌اند.
3. Shared Teacher Objective / Boundary در محدوده اعلام‌شده بر execution و selection اثر می‌گذارد.
4. Exam/Assignment urgency می‌تواند sequencing و dosage را تغییر دهد، نه Learning Truth را.
5. Parent constraints می‌توانند orchestration را محدود کنند، نه با overwrite کردن Learning State نیاز مهم آموزشی را حذف کنند.
6. Child agency ترجیحاً روی Experience Form / presentation اعمال می‌شود؛ حذف یک need آموزشی مهم مجاز نیست.

### Arbitration Result

Arbitration باید علاوه بر candidate منتخب، علت تصمیم را قابل‌ردگیری نگه دارد:

```text
Candidate Set
+ Applied Constraints
+ Applicable Policy Versions
+ Rejected / Modified Candidates
+ Selected Candidate
+ Conflict / Feasibility Result
```

اگر هیچ candidateای با Constraintهای hard سازگار نباشد، سیستم نباید silently یک Constraint را نادیده بگیرد؛ باید `Conflict / No Feasible Plan` قابل‌ردگیری تولید کند تا replan یا human action ممکن شود.

### Decision Pipeline — مفهومی

```text
1. آیا Evidence/Interpretation برای تصمیم فعلی کافی است یا Probe لازم است؟
2. Candidateهای آموزشی معتبر کدام‌اند؟
3. Hard Constraint / Safety Filter کدام candidateها را حذف یا محدود می‌کند؟
4. میان Candidateهای باقی‌مانده، learning value / urgency / policy priority چگونه مقایسه می‌شوند؟
5. Selected Decision یا explicit Conflict / Deferred کدام است؟
6. Learning Plan و سپس Experience Form چگونه اجرا می‌شوند؟
```

اصل مهم: Constraint نباید جای Learning Need را بگیرد؛ candidateها ابتدا از State/Objective/Evidence ساخته می‌شوند، سپس hard constraints و safety آن‌ها را محدود می‌کنند و soft constraints می‌توانند rank/modify کنند.

`Conflict / No Feasible Plan` و `Deferred / Needs More Evidence` خروجی معتبرند و نباید با silent relaxation حل شوند.

**Status:** `LOCKED` در مرز pipeline و Constraint semantics؛ candidate set، arbitration weights، scoring و precedence جزئی هنوز `HYPOTHESIS / EVIDENCE NEEDED` هستند.

## 3.11 Learning Truth

```text
Evidence + Validity
  ↓
Source + Time + Context + Artifact Version (when applicable)
  ↓
Interpretation + Confidence + Uncertainty
  ↓
Context-aware Learning State
  ↓
Aggregate Learning View (when needed)
```

`Learning Truth` یک verdict واحد نیست. Evidenceهای متعارض باید قابل‌مشاهده بمانند و تصمیم فعلی می‌تواند context-specific باشد.

### Context-specific vs Aggregate State

اصل V1:

- State می‌تواند در یک Learning Relationship Context متفاوت باشد.
- برای Parent/Teacher/Child، محصول در صورت نیاز یک **Aggregate Learning View** می‌سازد؛ این aggregate نباید provenance یا uncertainty را حذف کند.

### Evidence Source

- System
- Teacher
- Parent
- Assessment
- Assignment

هر Evidence باید provenance داشته باشد.

### Source Arbitration

هیچ Sourceای به‌صورت پیش‌فرض «همیشه درست» فرض نمی‌شود. وزن Evidence به Skill، Context، recency، directness و confidence وابسته است.

**Status:** `PRINCIPLE` — قرارداد aggregate/arbitration در حال اعتبارسنجی است.

## 3.12 Evidence → Action

```text
Evidence
  ↓
Interpretation
  ↓
Recommendation
  ↓
Action
  ↓
Outcome
```

این زنجیره برای Child، Parent و Teacher با زبان متفاوت ظاهر می‌شود.

> **ارزیابی زمانی ارزشمند است که شواهد آن تصمیم بعدی را بهتر کند.**

مرور نظام‌مند ۲۰۲۵ روی formative assessment در ریاضی، ۴۵ مطالعه را بررسی کرد و نتایج mixed گزارش کرد؛ مدل مرور بر learning intentions، eliciting evidence، interpretation، feedback و adaptation تأکید دارد. implication محصولی «Evidence → Action» یک Product Interpretation از این چارچوب است.

[منبع E-L6](https://link.springer.com/article/10.1007/s11858-025-01696-x)

## 3.13 Uncertainty & Evidence Decay

### Uncertainty

`Confidence` می‌گوید سیستم چقدر به یک Interpretation اعتماد دارد؛ `Uncertainty` نشان می‌دهد چه مقدار از تصمیم هنوز باز است. این دو برای جلوگیری از false certainty جدا نگه داشته می‌شوند.

### Evidence Decay

Evidence قدیمی نباید خودکار حذف شود؛ اما می‌تواند برای برخی تصمیم‌ها وزن کمتری پیدا کند، مخصوصاً برای Skillهایی که نیاز به retention monitoring دارند.

اصل:

> **History is preserved; decision weight may decay.**

این decay باید بر مبنای Skill Family و نوع Evidence آزمایش شود.

**Status:** `HYPOTHESIS`

## 3.14 Diagnostic Budget

تشخیص پیوسته نباید تجربه را به آزمون دائمی تبدیل کند.

> فقط وقتی Probe اضافه شود که عدم‌قطعیت روی تصمیم آموزشی اثر داشته باشد.

**Status:** `PRINCIPLE`

## 3.15 کیفیت Learning Engine

- تصمیم قابل‌ردگیری
- evidence کافی
- recovery قابل‌فهم
- بار جلسه کنترل‌شده
- کاهش تکرار خطا
- progress واقعی، نه فقط engagement

## 3.16 شواهد adaptive tutoring

کارآزمایی EEF روی Maths-Whizz در ۶۳ مدرسه انگلیسی، به‌طور میانگین یک ماه پیشرفت اضافی در ریاضی گزارش کرد؛ برنامه شامل tutoring آنلاین، آموزش کارکنان و پشتیبانی implementation بود. صفحه پروژه EEF در مشخصات کلی عدد ۶۴ مدرسه را نیز نمایش می‌دهد، اما در خلاصه و بخش «Were the schools…» تعداد مدارس trial برابر ۶۳ ذکر شده است. این شواهد از پتانسیل یک برنامه adaptive tutoring **به‌همراه implementation support** پشتیبانی می‌کند، اما اثر را نمی‌توان فقط به الگوریتم شخصی‌سازی نسبت داد.

[منبع E-T1](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/maths-whizz-23-24-trial)

## 3.17 یک مثال

> آریا، کلاس چهارم، در دو سؤال مقایسه کسرها الگوی خطای مشابه دارد.

```text
Evidence
→ Error Hypothesis
→ Teacher Objective: مقایسه کسرها
→ Learning Decision: probe تصویری
→ Learning Plan: guided practice + recheck
→ Child Session
→ New Evidence
→ Parent View: «در حال تثبیت»
→ Teacher View: «recheck لازم است»
```

این مثال فقط رابطه اجزا را نشان می‌دهد؛ منطق نهایی موتور را تعریف نمی‌کند.

</div>

<div dir="rtl" align="right">

# 4. Child Journey — سفر کودک

## 4.1 اصل

کودک تجربه‌ای شبیه سفر دارد؛ diagnosis در پس‌زمینه انجام می‌شود.

## 4.2 Child State

`NEW → ACTIVATED → RETURNING → PROGRESSING → MASTERY-SEEKING → INDEPENDENT`

این Stateها برای تصمیم‌گیری محصول‌اند و لزوماً در UI نمایش داده نمی‌شوند.

### Activation — تعریف موقت

- اولین Mission معنادار کامل شود.
- حداقل یک Learning Signal ثبت شود.
- نشانه‌ای از ادامه/بازگشت دیده شود.

**Status:** `OPEN`

## 4.3A Child Onboarding & Path Contract

### تجربه آغازین V1

```text
Animated Welcome
      ↓
Grade / Learning Context Selection
      ↓
Minimal Experience Preferences
      ↓
Mini Diagnostic Adventure
      ↓
Starting Point
      ↓
Path Reveal
      ↓
First Station
```

Onboarding باید از دید کودک شبیه «ورود به یک ماجراجویی» باشد، نه فرم ثبت‌نام یا آزمون رسمی.

### Separation of concerns

- انتخاب Grade یک **Context Selection** است.
- Preferenceهای تجربه، در صورت نیاز، **Experience Preferences** هستند و Learning Truth محسوب نمی‌شوند.
- Mini Diagnostic شواهد یادگیری تولید می‌کند و Placement را تغذیه می‌کند.
- Path Reveal یک **Projection** از وضعیت و progression فعلی است.

### Child-facing Learning Path

Path برای کودک باید: 

- گام فعلی را واضح نشان دهد.
- قدم بعدی را برجسته کند.
- پیشرفت انجام‌شده را قابل‌دیدن کند.
- Review / Recovery / Milestone را در همان سفر نشان دهد.
- کودک را مجبور به انتخاب curriculum از میان گزینه‌های زیاد نکند.

اما Path نباید به یک sequence ثابت و غیرقابل‌تغییر تبدیل شود:

```text
Visible Path
     ≠
Fixed Learning Decision
```

ترتیب navigation می‌تواند Grade/Station-aware باشد، در حالی که Learning Engine بر اساس Skill State و Evidence، داخل مسیر تمرین، Review، Probe یا Recovery را انتخاب می‌کند.

**Status:** `LOCKED` در سطح Product UX contract؛ جزئیات screen، component، animation و copy در `v0.24 — Child App Experience & Journey Specification` نگهداری می‌شود.

## 4.3 Stage Model

### Canonical execution hierarchy

```text
JOURNEY
  ↓
MISSION
  ↓
SESSION
  ↓
ENCOUNTER
  ↓
EVIDENCE
```

- **Mission:** هدف و قاب روایی
- **Session:** اجرای واقعی کودک
- **Encounter:** واحد کوچک تعامل که می‌تواند Evidence تولید کند

`World / Region / Adventure` لایه‌های روایی/ناوبری هستند، نه لزوماً entityهای Learning Core.

`Boss` یک Experience Form است؛ `Transfer` و `Mastery Check` Learning Roles هستند.

تعداد واقعی World/Region/Adventure هنوز `OPEN` است.

## 4.4 Dual Progression

### Learning Progress
چه چیزی را بهتر می‌تواند؟

### World Progress
چه چیزی در جهانش به‌خاطر آن تغییر کرده؟

> **World Progress بدون Learning Evidence کافی و قابل‌تفسیر مجاز نیست.**

### Progression Contract

```text
Evidence
  ↓
Learning State Update
  ↓
Mastery / Milestone Condition
  ↓
World Progress
  ↓
Unlock / Next Experience
```

`Evidence` به‌تنهایی الزاماً Unlock ایجاد نمی‌کند؛ باید شرط progression تعریف‌شده را برآورده کند.

اصل مهم: reward و unlock نباید جایگزین mastery یا evidence شوند.

**Status:** `LOCKED` در سطح جهت؛ thresholdهای دقیق هنوز `HYPOTHESIS`.

## 4.5 Recovery Path

```text
Wrong / Uncertain
→ Hint / Representation
→ Micro Teaching
→ Easier / Different Path
→ Re-attempt
→ Original Objective
```

## 4.6 Day 0 → Day 90

Day 0 تا Day 90 باید بر مبنای **Learning + Experience Milestones** طراحی شود، نه فقط بازه زمانی.

| بازه | Milestone مورد انتظار |
|---|---|
| Day 0 | اولین Mission معنادار + اولین Evidence معتبر |
| Day 1–3 | اولین Learning Decision قابل‌مشاهده + اولین تجربه Recovery/Challenge متناسب |
| Week 1 | اولین Visible Learning Progress + اولین بازگشت معنادار |
| Week 2–4 | اولین Milestone/Review cycle + شروع identity/path personalization |
| Month 2 | شواهد استقلال بیشتر + Transfer/Challenge مناسب |
| Month 3 | پیشرفت طولی قابل‌اثبات + مسیر چالش بعدی |

این timeline هنوز hypothesis است. معیار موفقیت باید همزمان شامل learning outcome، quality of evidence، child return و friction باشد.

**Status:** `HYPOTHESIS`

## 4.7 Teacher Assignment در Child Session

هدف این است که کودک چند منبع هدف را به‌صورت یک تجربه یکپارچه ببیند، نه چند تکلیف جدا.

**Status:** `OPEN`

## 4.8 Dosage

جلسه کوتاه یک فرضیه طراحی است، نه یک قانون علمی قفل‌شده.

EEF در Maths-Whizz استفاده ۴۵–۶۰ دقیقه در هفته را توصیه کرده که می‌تواند در بیش از یک Session تقسیم شود. یک مرور ۲۰۲۶ روی بازی‌های تبلتی ریاضی در preschool نیز نشان می‌دهد dosage و طراحی اجرا بر اثرگذاری اثر دارند؛ این evidence را نباید مستقیماً به کل Grades 1–6 تعمیم داد. بنابراین طول و تعداد Sessionها باید با آزمایش خود محصول تعیین شوند، نه با یک عدد ثابت از ابتدا.

**Status:** `HYPOTHESIS`

</div>

<div dir="rtl" align="right">

# 5. Engagement & Retention — علاقه و بازگشت

## سه محرک

| اصل | زبان کودک |
|---|---|
| Curiosity | مرحله بعد چیست؟ |
| Competence | دارم بهتر می‌شوم. |
| Agency | در شیوه تجربه انتخاب دارم. |

## حلقه هدف

`Curiosity → First Success → Agency → Challenge → Progress → Unlock → Identity → Mastery → New Challenge`

## چهار مقیاس Retention

- **Immediate:** یک تعامل خوب
- **Session:** مأموریت کامل
- **Weekly:** پیشرفت قابل‌دیدن
- **Long-term:** هویت و مسیر رشد

## Child Pull

بازگشت باید از علاقه به ادامه رشد بیاید، نه فشار یا FOMO.

> **Early retention:** novelty / story  
> **Later retention:** progress / mastery / identity

این یک `HYPOTHESIS` است.

### شواهد

مرور ۲۰۲۶ روی DGBL در Early Childhood و Primary Mathematics، 103 مطالعه تجربی تا سن 12 سال را جمع‌بندی می‌کند و شواهد امیدوارکننده اما وابسته به طراحی و شرایط اجرا گزارش می‌کند. مرور دیگری در 2026، مشخصاً preschool و کودکان 3–6 سال را بررسی کرده و 29 مورد از 33 مطالعه اثر مثبت گزارش کرده‌اند؛ این evidence برای Grade 1–6 باید با scope محدود تفسیر شود.

[منبع E-G2](https://www.syncsci.com/journal/AMLER/article/view/AMLER.2026.02.004)  
[منبع E-G3](https://link.springer.com/article/10.1007/s11423-026-10626-x)

</div>

<div dir="rtl" align="right">

# 6. Game / World Design — تجربه بازی

## 6.1 World as Learning Metaphor

جهان باید با مفهوم یادگیری هم‌راستا باشد.

| حوزه | استعاره احتمالی |
|---|---|
| عدد و الگو | کشف |
| عملیات | ساختن |
| کسر | تقسیم / تخصیص |
| هندسه | ساخت‌وساز |
| اندازه‌گیری | ابزار / کاوش |
| داده | کشف / تصمیم |

Mapping نهایی `OPEN` است.

## 6.2 Reward

اصل: کمینه‌گرایی.

ممکن است XP، Stars و Unlock/Collectibles وجود داشته باشد؛ اقتصاد دقیق `OPEN` است.

> Reward باید به learning progress متصل باشد، نه login یا time spent.

## 6.3 Feedback

> **Learning Moment = Calm**  
> **Reward Moment = Exciting**

## 6.4 Animation

سه نقش اصلی: 

1. **Explain** — animation به فهم مفهوم یا رابطه ریاضی کمک کند.
2. **React** — پاسخ/نتیجه را با شخصیت و motion قابل‌فهم و دلنشین کند.
3. **Reveal Progress** — بازشدن مسیر، milestone و پیشرفت را نشان دهد.

### Motion Guardrail

Animation نباید صرفاً برای پرکردن صفحه یا تولید novelty اضافه شود. در تجربه کودک، interactive cue باید قابل‌تشخیص و مرتبط با هدف باشد؛ motion غیرمرتبط، افکت‌های شلوغ و simultaneous feedbackهای بیش از حد باید محدود شوند.

## 6.5 Game Fatigue

Novelty نباید تنها موتور retention باشد. با گذر زمان باید سهم Progress، Mastery و Identity بیشتر شود.

> **Game mechanics are useful when aligned with learning goals; reward alone is not the strategy.**

</div>

<div dir="rtl" align="right">

# 7. Parent Value — ارزش والد

## Parent Value

> **Insight + Confidence + Proof of Progress**

والد برای حجم سؤال پول نمی‌دهد؛ برای تصمیم بهتر و مشاهده پیشرفت می‌دهد.

## گزارش

- **Mastered:** چه چیزی تثبیت شده؟
- **Building:** چه چیزی در حال ساخته‌شدن است؟
- **Next:** قدم بعد چیست؟

## Micro-Coaching

فعالیت کوتاه خانگی؛ `HYPOTHESIS`.

## Value Journey

`Problem Recognition → Trial → Personal Insight → Trust → Purchase → First Value → Proof → Renewal`

Referral در Growth بررسی می‌شود.

## Trust Stack

- Demo واقعی
- نمونه گزارش
- توضیح روش انتخاب سؤال
- روش QA محتوا
- تیم/کارشناسان
- شواهد واقعی پس از جمع‌آوری داده
- Privacy/Safety شفاف

مطالعه ۲۰۲۵ روی انتخاب اپ نشان می‌دهد والدین به rating/review مثبت حساس‌اند، اما اثر benchmarkهای آموزشی در انتخاب آن‌ها روشن نیست؛ بنابراین demo، evidence و توضیح روش آموزشی می‌تواند بخشی از Trust Stack باشد، ولی این نتیجه یک **Product Interpretation** است نه یافته مستقیم همان مطالعه.

[منبع E-P1](https://www.sciencedirect.com/science/article/pii/S0360131525001782)

## Parent Constraints

Parent constraint باید در محصول ثبت و از learning truth جدا باشد. مثال‌ها:

- محدودیت زمانی
- ترجیح طول Session
- زمان‌های مجاز
- ترجیح برای homework/review
- ترجیح در تعداد پیام‌ها

Parent constraint می‌تواند `hard` یا `soft` باشد و مستقیماً نباید Learning State را تغییر دهد؛ فقط روی Orchestration اثر می‌گذارد.

**Status:** `HYPOTHESIS`

## Parent Communication

اصل موقت: پیام کم، خلاصه و قابل‌اقدام.

**Status:** `HYPOTHESIS`

</div>

<div dir="rtl" align="right">

# 8. Teacher & Learning Context — معلم، کلاس و مداخله

> **معلم یک کاربر با Learning Relationship Context اختصاصی است؛ هم هدف آموزشی تعیین می‌کند و هم می‌تواند منبع Evidence باشد.**

## 8.1 ساختار

```text
Child Learning Identity
        ↓
Learning Relationship Context
├── Home / Parent
├── School Class / Teacher
├── Tutor
└── Learning Center
```

## 8.2 Access

در V1 semantics دسترسی ساده است، اما مرزهای اصلی حفظ می‌شوند:

`Principal + Relationship + Scope/Context + Purpose + Policy → Authorization`

> `Role` به‌تنهایی permission نیست و UI مرجع نهایی authorization نیست.

مدل کاربری V1:

- Child account / learning identity برای تجربه کودک
- Parent view در همان مسیر حساب V1
- Teacher account تأییدشده
- Admin برای مدیریت معلم و عملیات حساس

در Domain Model همچنان:

```text
Account / Principal
        ≠
Learning Identity
```

**Status:** `LOCKED` در semantics؛ جزئیات provider در Architecture V1 مشخص شده است.


## 8.3 Relationship Lifecycle

`PENDING → ACTIVE → SUSPENDED → EXPIRED / REMOVED`

پایان رابطه، Learning History را حذف نمی‌کند.

## 8.4 Teacher Goal و Control

معلم هدف را تعیین می‌کند؛ موتور اجرا را شخصی می‌کند.

| سطح | اختیار |
|---|---|
| Open Adaptive | هدف با معلم، مسیر باز |
| Bounded Adaptive | هدف + محدوده مشخص |
| Pinned | منبع/روش/سؤال مشخص |

> **Teacher chooses WHAT; Engine chooses HOW — within the declared boundary.**

اصل bounded control `PRINCIPLE` است؛ سطح‌های دقیق `OPEN`.

## 8.5 Shared Objective + Bounded Adaptation

```text
Teacher Objective
      ↓
Shared Outcome / Boundary
      ↓
Student State
      ↓
Personalized Learning Plan
      ↓
Practice / Recovery / Transfer
```

یک Assignment می‌تواند مسیرهای متفاوت داشته باشد؛ outcome مشترک باقی می‌ماند.

## 8.6 Teacher Loop

`Observe → Interpret → Group → Intervene → Recheck → Reflect`

## 8.7 Action Queue

صفحه اصلی معلم باید با Action شروع شود:

- چه کسی نیاز به توجه دارد؟
- کدام گروه مشکل مشترک دارد؟
- کدام Assignment نیاز به بررسی دارد؟
- کدام Intervention باید دوباره سنجیده شود؟

## 8.8 Class Diagnosis

`HYPOTHESIS`

سیستم می‌تواند الگوهای کلاس را به‌صورت Class Learning Signal نشان دهد و برای Grouping یا Review مشترک پیشنهاد بدهد.

## 8.9 Teacher Action Controls

Teacher Action باید بتواند یکی از این حالت‌ها را داشته باشد:

`Accept → Modify → Dismiss → Recheck`

در صورت override مهم، Reason کوتاه و provenance ثبت می‌شود. Override نباید Evidence قبلی را حذف کند؛ فقط می‌تواند Decision/Plan جاری را تغییر دهد.

## 8.10 Teacher as Evidence Source

```text
Teacher Observation
→ Evidence + Provenance
→ Interpretation + Confidence
→ Recommendation
```

Observation معلم نباید مستقیماً diagnosis قطعی شود.

## 8.11 Implementation Burden

> **هر Teacher Action باید ارزان، روشن و قابل‌اجرا باشد.**

شواهد EEF از Maths-Whizz نشان می‌دهد adaptive tutoring همراه با آموزش و implementation support می‌تواند اثر مثبت داشته باشد؛ در مقابل، در کارآزمایی Digital Feedback in Primary Maths، اجرای بخش دیجیتال برای معلمان دشوار بود و اثر معناداری بر attainment نشان نداد. مرور ۲۰۲۴ پذیرش فناوری معلمان نیز usefulness و ease of use را از عوامل مهم adoption می‌داند.

[منبع E-T1](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/maths-whizz-23-24-trial)  
[منبع E-T2](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/digital-feedback-in-primary-maths)  
[منبع E-T3](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1436724/full)

## 8.12 Teacher Wedge

در V1، ارزش معلم عمداً کوچک است:

```text
Approved Teacher
      ↓
Class
      ↓
Students
      ↓
Current Skill Status
      ↓
Needs Review / Needs Attention
```

معلم در V1 قرار نیست موتور آموزشی کامل را مدیریت کند. Assignment orchestration، Group Diagnosis پیشرفته و delegation چندلایه بعداً اضافه می‌شوند.

روش اتصال دانش‌آموز به Class و جزئیات visibility هنوز `OPEN` هستند و در فاز implementation با یک workflow ساده انتخاب می‌شوند.

**Status:** `LOCKED` در ارزش محصول؛ `OPEN` در مکانیزم اتصال.


</div>

<div dir="rtl" align="right">

# 9. Growth / Acquisition — جذب و رشد

## مدل

> **Public Web / Adult-led acquisition → Free Diagnostic → Insight → Account → Child App activation → Child pull → Parent/Teacher trust**

## کانال‌ها

### Parent-led
`Search / Ads / Referral → Public Web → Free Diagnostic → Insight → Account → Install / Open Child App → Learning Journey`

### Teacher-led
`Teacher Web → Student Invite → Child App → Mission → Parent Visibility → Family Activation`

### Content / SEO
`Search Intent → Public Web → Assessment / Challenge → Personalized Result → Account → Child App`

## Landing Page

`Promise → Interactive Demo → Evidence → Assessment → Insight → Offer / Continue in App → Trust`

### Channel principle

Public Web نقش acquisition و trust دارد؛ Mobile App محل اصلی تجربه روزمره Child است؛ Parent و Teacher تجربه مدیریتی خود را در Web دارند. هیچ Client مستقلی مالک Learning Truth یا Learning State نیست.

## Acquisition Wedge

`OPEN` — Parent-led، Teacher-led، Tutor-led یا Assessment-led.

> فعلاً هیچ کانال به‌عنوان کانال اصلی رشد قفل نشده است.

**پیشنهاد V1 (`HYPOTHESIS`):** شروع کوچک با پایلوت روی چند خانواده و معلم آشنا، و Free Diagnostic به‌صورت Guest به‌عنوان اولین تجربه.

</div>

<div dir="rtl" align="right">

# 10. Business Model — فرضیه تجاری

**Status:** `OPEN`

| مدل | منطق |
|---|---|
| A — Paid Learning | ارزیابی/نمونه رایگان → اشتراک |
| B — Paid Intelligence | تمرین پایه رایگان → شخصی‌سازی/گزارش/مسیر پولی |
| C — Teacher Free / Family or School Paid | Teacher layer رایگان → خانواده/سازمان پولی |

اصل قیمت‌گذاری:

> ارزش باید بر اساس **Personalized Learning Service** توضیح داده شود، نه تعداد سؤال.

**پیشنهاد V1 (`HYPOTHESIS`):** در فاز پایلوت همه‌چیز رایگان باشد؛ مدل تجاری بعد از دیدن شواهد بازگشت کودک انتخاب شود.

</div>

<div dir="rtl" align="right">

# 11. Technical Principles — اصول فنی اولیه

> این بخش جهت معماری است، نه specification.

> **Revision v0.21-MA:** Product Core دیگر Web-first نیست. معماری Clientها به‌صورت multi-client تعریف می‌شود: Public/Parent/Teacher/Admin Web + Child Mobile App، روی یک Platform Core مشترک.

## 11.0 Client / Channel Architecture

```text
                         ONE PLATFORM
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
     PUBLIC WEB          CHILD MOBILE          ADULT WEB
                          APP                    │
                                               ├── Parent
                                               ├── Teacher
                                               └── Admin
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                     SHARED PLATFORM CORE
                              │
                    PostgreSQL + Storage
```

### Public Web
- معرفی محصول، Trust، FAQ و Legal
- Free Diagnostic / Guest Assessment
- Login / Signup / Account lifecycle
- ادامه مسیر از Web به Child App

### Child Mobile App
- Client اصلی تجربه یادگیری روزمره کودک در V1
- Onboarding، Placement، Learn، Guided Practice، Check، Result
- Recovery، Review، Progress، Journey و Notification
- touch / audio / visual / کم‌خواندن
- session persistence و offline queue در حد policy اجرایی

### Parent Web
- Progress، Skill View، Recent Learning، Next Step، preferences و account settings

### Teacher Web
- Classes، student overview، Skillهای نیازمند توجه، Assignment، Intervention و Recheck

### Admin Web
- Teacher approval، content operations، Grade Package operations، audit و platform administration

### Client Boundary
هیچ Clientای نباید Learning Engine یا Learning Truth مستقل داشته باشد. Client فقط Presentation / Interaction / Local State / Transport را مدیریت می‌کند و تصمیم‌های canonical از Shared Platform Core می‌آیند.

## Web / PWA Position

Web برای Public، Parent، Teacher و Admin سطح اصلی است. PWA برای Web می‌تواند در جاهایی که مفید است استفاده شود، اما **PWA جای Child Mobile App را نمی‌گیرد** و Child Learning در V1 به‌صورت Mobile-first طراحی می‌شود.

## Mobile App Boundary

فریم‌ورک Mobile در این revision قفل می‌شود: **React Native + Expo + Expo Router با TypeScript**. اپ Android/iOS روی یک codebase اجرا می‌شود و از **React Native New Architecture** استفاده می‌کند؛ build/release موبایل با **EAS** انجام می‌شود. نسخه دقیق React Native / Expo / Node toolchain هنگام ایجاد repository pin می‌شود و در Product Core به شماره نسخه خاص وابسته نمی‌ماند. Client موبایل فقط API contract رسمی Platform را مصرف می‌کند و منطق آموزشی canonical را fork نمی‌کند.

## Child Client

- prefetch برای asset و تجربه بعدی
- feedback فوری و تا حد ممکن محلی
- session مقاوم در برابر قطع اینترنت
- local state + background sync در حد policy اجرایی
- idempotent submission
- resume از آخرین server-accepted state

## 11.1 Canonical Technical Domain Model — مدل دامنه فنی

> این بخش Product Core را به **Technical Source of Truth** نزدیک می‌کند، بدون اینکه هنوز وارد schema نهایی، API یا انتخاب Stack شود. هدف: هر مفهوم مرکزی یک owner، مرز و رابطه روشن داشته باشد.

### اصل معماری

> **A concept is not automatically a persisted entity.**

ممکن است یک مفهوم در Product Core مهم باشد، اما در فنی به‌صورت `Entity`، `State`، `Value Object`، `Event` یا `Projection` پیاده شود. این تمایز برای جلوگیری از over-engineering در V1 الزامی است.

### Canonical Domain Map

```text
Child / Learning Identity
        │
        ├── Learning Relationship ──→ scoped membership / access
        │                                  │
        │                                  ▼
        └────────────────────────── Learning Relationship Context
                                           │
                                           ▼
                                      Skill / Objective

Learning Objective Context
  = execution dimension on Evidence / Decision / Plan

              Skill Graph
                 │
                 ▼
       Mission → Session → Encounter
                 │            │
                 │            └── Content / Content Version
                 ▼
              Evidence
                 │
                 ▼
          Interpretation
           / Error Hypothesis
                 │
       Confidence / Uncertainty
                 │
                 ▼
          Learning State
                 │
          ┌──────┴──────┐
          ▼             ▼
       Mastery       Retention
          │
          ▼
   Mastery Evaluation
          │
          ▼
       Milestone
          │
          ▼
   Progression Rule
          │
          ▼
        Unlock
          │
          ▼
      World Progress
```

Decision branch:

```text
Learning State + Goals + Constraints
                 ↓
        Learning Decision
                 ↓
   Source / Constraint Arbitration
                 ↓
          Learning Plan
                 ↓
       Mission / Session / Encounter
```

Teacher branch:

```text
Teacher Relationship
        ↓
Assignment (Shared Intent)
        ↓
Assignment Instance (per Child)
        ↓
Shared Objective / Boundary
        ↓
Learning Plan
        ↓
Teacher Action
        ↓
Recheck / New Evidence
```

### Entity / State / Projection Classification

| Concept | Type در دامنه | Persistence در V1 | توضیح |
|---|---|---:|---|
| Child | Entity | بله | هویت کاربر کودک؛ جزئیات identity از learning history جداست. |
| Learning Identity | Entity / Aggregate Root | بله | مرجع یکتای سابقه یادگیری کودک. |
| Learning Relationship | Entity | بله | رابطه کودک با Parent / Teacher / Tutor / Center و lifecycle آن. |
| Learning Relationship Context | Entity | بله | محیط/دامنه رابطه آموزشی؛ مثل Class یا Home. |
| Platform Context | Learning Relationship Context (system-owned default) | بله | Context پیش‌فرض برای Evidence بدون رابطه آموزشی؛ فقط برای keying State/Evidence است و Permission نمی‌دهد. |
| Learning Objective Context | Value / Classification | احتمالاً خیر | Practice / Review / Exam Prep / Recovery؛ نباید با Relationship Context یکی شود. |
| Skill | Entity | بله | واحد canonical یادگیری در Skill Graph. |
| Skill Graph | Domain Structure | بله | Skill + prerequisite / supporting / related relations و نسخه‌بندی در صورت نیاز. |
| Skill Family | Configuration / Domain Structure | بله | گروه‌بندی سیاستی Skillها؛ Mastery Contract، spacing و decay بر اساس آن نسخه‌بندی می‌شوند. |
| Learning Objective | Entity | بله | هدف آموزشی مشخص که Decision و Content به آن اشاره می‌کنند. |
| Content Artifact | Entity | بله | Question/Prompt، Representation، Hint، Instruction/Micro-Teaching یا تجربه محتوایی؛ Encounter runtime entity است، نه Content Artifact. |
| Content Version | Entity / Immutable Version | بله | نسخه دقیق artifact که Evidence باید به آن قابل‌ردگیری باشد. |
| Journey | Product concept / Projection | خیر در V1 | مسیر شخصی کودک؛ view روی Mission Instanceها، Plan و World Progress. اگر بعداً state پایدار لازم شد، به Entity ارتقا می‌یابد. |
| Mission | Product concept / Experience Definition reference | بله/بسته به runtime | اصطلاح محصولی برای هدف/سفر؛ تعریف reusable از Experience/Content می‌آید و اجرای child-specific با `Mission Instance` نگهداری می‌شود. |
| Mission Instance | Entity / Experience Runtime | بله | اجرای child-specific یک Mission؛ lifecycle اجرای کودک را نگه می‌دارد و به Sessionها/Encounterها متصل می‌شود. |
| Session | Entity | بله | اجرای واقعی کودک از Missionها. |
| Encounter | Entity | بله | کوچک‌ترین واحد interaction که می‌تواند Evidence تولید کند. |
| Evidence | Immutable Entity / Fact | بله | مشاهده/واقعیت یادگیری‌معنادار؛ historical fact نباید overwrite شود. |
| Evidence Validity Record | Immutable Record (Overlay) | بله | تغییر اعتبار Evidence با actor/reason؛ خود fact تاریخی را تغییر نمی‌دهد. |
| Interpretation | Entity / Derived Record | بله | تفسیر Evidence با Confidence و Uncertainty. |
| Error Hypothesis | Specialized Interpretation / Derived Record | بله | نوع تخصصی Interpretation برای توضیح موقت و قابل‌آزمون یک الگوی خطا. |
| Learning State | State / Projection | بله | وضعیت جاری Skill برای کودک و Learning Relationship Context canonical؛ از Evidence/Interpretation و policy مشتق می‌شود. |
| Mastery Contract | Configuration / Policy | بله | قواعد خانواده Skill برای ارزیابی Mastery؛ version و thresholdها قابل‌تنظیم‌اند. |
| Mastery Evaluation | Derived Decision Record | بله در حد traceability | ارزیابی نقطه‌ای بر اساس Contract Version و evidence set؛ خروجی آن می‌تواند State/Progression را تغییر دهد. |
| Constraint | Entity / Policy Input | بله | محدودیت Source-based برای Orchestration. |
| Learning Decision | Decision Record | بله | تصمیم قابل‌ردگیری درباره قدم آموزشی؛ source of truth تصمیم‌گیری. |
| Arbitration Result | Decision Record | بله | نتیجه حل تعارض (SELECTED / CONFLICT / DEFERRED)؛ همه‌ی خروجی‌ها ثبت می‌شوند، ولی Learning Decision فقط برای SELECTED ساخته می‌شود. |
| Learning Plan | Execution Model | در V1 lightweight | قرارداد اجرایی Decision؛ فقط در حد لازم برای traceability و runtime پایدار می‌شود. |
| Assignment | Entity / Shared Intent | بله | هدف، Shared Outcome و Boundary ایجادشده توسط Teacher/Context؛ execution هر کودک با Assignment Instance نگهداری می‌شود. |
| Assignment Instance | Entity / Execution Record | بله | binding یک Assignment به یک Child/Identity و وضعیت اجرای آن؛ مسیر شخصی کودک را بدون تغییر Shared Outcome نگه می‌دارد. |
| Teacher Intervention | Entity | بله | اقدام teacher-facing که باید recheck و outcome داشته باشد. |
| Milestone | Policy-linked Achievement Record | بله/محاسبه‌ای | achievement قابل‌مشاهده ناشی از شرط learning/experience؛ تعریف شرط از Progression Rule می‌آید. |
| Progression Rule | Policy | بله | قواعد اتصال Learning Evidence/State به World Progress. |
| Unlock | Durable Access State / Record | بله در حد لازم | نتیجه تحقق Progression Rule؛ event آن را ایجاد/ثبت می‌کند، اما Unlock خودش state/record پایدار است. |
| World Progress | Projection / Experience State | بله در حد لازم | نمایش وضعیت جهان بر اساس learning milestoneها. |
| Learning Truth | Projection | خیر به‌عنوان entity مستقل | view از Evidence + Interpretation + State؛ verdict واحد نیست. |
| Aggregate Learning View | Projection | خیر | representation context-aware برای Child / Parent / Teacher. |
| Recommendation | Output / Projection | خیر | presentation of a Decision؛ نباید source of truth مستقل بسازد. |
| Action Queue | Projection | خیر | teacher-facing view از Intervention / Assignment / Recheck. |
| Principal / Account | Entity | بله | actor قابل‌احراز برای Authentication/Authorization؛ از Learning Identity جداست. |
| Consent / Authorization Grant | Entity / Policy Record | بله | اجازه‌ی اضافی برای action یا استفاده از داده؛ با Relationship یکی نیست. |
| Delegation | Entity / Policy Record | بله | واگذاری scoped، زمان‌دار و revocable؛ ارث‌بری نامحدود ندارد. |
| Audit Record | Immutable Record | بله | ردگیری accessها و عملیات حساس؛ بدون کپی raw child data. |

### پنج مرز فنی که اکنون باید Canonical باشند

#### 1. Evidence ≠ Interpretation

```text
Evidence
= what happened / was observed

Interpretation
= what the system currently believes it may mean
```

`Evidence` historical fact است و نباید overwrite شود. `Interpretation` می‌تواند اصلاح، جایگزین یا ضعیف شود.

`Confidence` و `Uncertainty` در سطح Interpretation/Decision قرار می‌گیرند، نه به‌عنوان جایگزین fact خام.

#### 2. Learning Relationship ≠ Learning Relationship Context

`Relationship` مشخص می‌کند چه کسی با چه scope و purpose به کودک مرتبط است.

`Relationship Context` محیط/دامنه‌ای است که آن رابطه در آن معنا پیدا می‌کند.

مثال:

```text
Teacher T1
   ↓ relationship
Child C1
   ↓ context
Class 4A
```

این تفکیک برای Permission، lifecycle و multi-context learning الزامی است.

#### 3. Learning Objective Context ≠ Learning State Identity

Practice، Review، Exam Prep و Recovery باید dimensionهای Evidence/Decision/Plan باشند؛ نباید بدون دلیل برای یک Skill چند Learning State مستقل بسازند.

### Canonical Learning State Key — V1

به‌صورت پیش‌فرض:

```text
Learning State
= Child Learning Identity
+ Skill
+ Learning Relationship Context
```

`Learning Objective Context` و Session/Encounter در Evidence و Decision ثبت می‌شوند و به‌صورت پیش‌فرض بخشی از identity دائمی State نیستند.

استثناء فقط وقتی مجاز است که آزمایش یا نیاز domain نشان دهد یک Skill واقعاً stateهای context-specific پایدار دارد.

**Status:** `LOCKED` در سطح مدل مفهومی؛ schema فیزیکی هنوز `OPEN`.

### Platform Context — Context پیش‌فرض

هر Evidence و هر Learning State باید Relationship Context داشته باشد. اگر Evidence به هیچ Learning Relationship وابسته نیست (مثل استفاده مستقیم کودک از پلتفرم پیش از ایجاد رابطه، یا Assessment بیرونی)، به `Platform Context` نسبت داده می‌شود. این Context system-owned است و **هیچ Permission ایجاد نمی‌کند** (Relationship ≠ Context).

Aggregate Learning View می‌تواند Stateهای Platform Context و Contextهای دیگر را طبق aggregation policy کنار هم نشان دهد؛ نحوه aggregate شدن هنوز `OPEN` است (P1-4).

**Status:** `LOCKED` در سطح semantics؛ aggregation policy `OPEN`.

#### 4. Decision ≠ Recommendation

```text
Learning Decision
→ Recommendation / Presentation
→ Action
```

`Learning Decision` منبع اصلی تصمیم است.

`Recommendation` شکل ارائه همان تصمیم است و نباید یک موتور تصمیم‌گیری مستقل و موازی ایجاد کند.

#### 5. Learning Role ≠ Experience Form

```text
Learning Role:
Diagnostic Probe / Instruction / Guided Practice / Independent Practice / Review / Transfer / Mastery Check

Experience Form:
Story / Puzzle / Challenge / Boss / Build / Explore ...
```

`Boss` یک form است، نه learning state یا learning stage.

### Evidence Ownership Rule

برای هر Evidence باید مشخص باشد:

```text
Child Learning Identity
+ Primary Skill / Objective
+ Relationship Context (always; Platform Context when no relationship applies)
+ Objective Context (when applicable)
+ Source Type / Actor
+ Occurred At + Recorded At
+ Provenance
```

`Encounter / Content Version` در صورتی لازم است که Evidence از یک artifact اجرایی آمده باشد؛ برای Teacher/Parent Observation یا Assessment بیرونی ممکن است artifact داخلی وجود نداشته باشد و به‌جای آن `Source Reference` ثبت می‌شود.

قاعده مهم:

> **Artifact reference is optional; provenance/source reference is mandatory.**

بنابراین نبودن Content Version به‌تنهایی Evidence را نامعتبر نمی‌کند؛ باید روش تولید و scope آن قابل‌ردگیری باشد.

### Event ≠ Evidence

`Event` رخداد فنی/اجرایی سیستم است؛ `Evidence` مشاهده یا fact یادگیری‌معناداری است که می‌تواند از یک یا چند Event، Teacher Observation، Parent Report یا Assessment ساخته شود.

```text
Runtime Event
     ↓ 0..n
Evidence Candidate / Evidence
     ↓
Interpretation
```

پس:

- هر Event الزاماً Evidence نیست.
- یک Event می‌تواند هیچ Evidenceی تولید نکند.
- یک Evidence می‌تواند از چند Event یا یک observation بیرونی ساخته شود.
- `answer_submitted` یک Event است؛ «عملکرد مستقل کودک روی Skill X» می‌تواند Evidence حاصل از آن Event باشد.

این مرز برای جلوگیری از آمیختن telemetry با Learning Truth در Data Model الزامی است.

### Evidence Validity / Correction

Historical Evidence از نظر محتوای fact immutable است، اما metadata اعتبار آن می‌تواند با ثبت یک **Validity Overlay** تغییر کند؛ مثلاً:

```text
UNREVIEWED → USABLE
              ├→ LIMITED
              └→ RETRACTED
```

`RETRACTED` به معنی حذف fact تاریخی نیست؛ یعنی نباید در تصمیم‌های آموزشی جدید به‌عنوان evidence قابل‌اتکا استفاده شود.

علت می‌تواند duplicate، artifact معیوب، source correction، یا invalid observation باشد و باید provenance/actor آن ثبت شود.

### Evidence Quality ≠ Interpretation Confidence

- **Evidence Quality** درباره کامل‌بودن/مستقیم‌بودن/قابل‌تفسیر بودن مشاهده است.
- **Interpretation Confidence** درباره میزان اطمینان به معنایی است که سیستم از Evidence ساخته است.

این دو نباید در یک scalar مخلوط شوند.

### Persistence Principle

در V1:

- Historical Evidence immutable است؛ فقط Validity Overlay و privacy lifecycle می‌تواند وضعیت استفاده از آن را تغییر دهد، نه محتوای fact تاریخی.
- Interpretationها versionable / replaceable هستند و به Evidence references + method/policy version متصل‌اند.
- Learning State قابل recompute یا rebuild از history طراحی می‌شود و recomputation باید policy/contract versions مورد استفاده در هر evaluation/transition را حفظ کند.
- Projectionها source of truth مستقل نیستند.
- Policyها مثل Mastery Contract و Progression Rule configuration-driven نگه داشته می‌شوند.
- جزئیات schema و storage بعد از State Machine و Evidence Contract تعیین می‌شوند.

### Technical Domain Model Gate

برای خروج از این مرحله، این موارد باید تثبیت شده باشند:

- entity boundary
- ownership
- canonical identifiers
- state vs projection distinction
- Evidence/Interpretation separation
- Context separation
- Learning State key
- Decision vs Recommendation boundary
- Progression primitives
- Event ≠ Evidence boundary
- Evidence / Interpretation / Error contracts
- Mastery Evaluation and Retention semantics
- Assignment vs Assignment Instance boundary
- Mission Instance vs Content Artifact boundary
- Decision / Candidate / Constraint / Recommendation boundary
- Conflict and reproducibility semantics

**Status:** `LOCKED` در سطح domain semantics؛ physical data model و storage `OPEN`.

## State Machine Registry — رجیستری وضعیت‌ها و Transitionها

این بخش مرز بین «state واقعی دامنه»، «overlay محاسباتی» و «lifecycle اجرایی» را مشخص می‌کند. هدف آن تعیین رفتار قابل‌پیاده‌سازی است؛ جزئیات persistence، concurrency و schema فیزیکی در مرحله Data/Event Model تعیین می‌شوند.

### State Semantics — قواعد عمومی

1. هر State Machine باید `owner` مشخص داشته باشد؛ transition بدون actor یا system owner معتبر نیست.
2. هر transition باید حداقل `from + trigger + actor/source + timestamp + to` داشته باشد. `reason / policy reference` برای transitionهای manual، override و exception اجباری است؛ transitionهای عادی سیستم می‌توانند به policy/rule مشخص ارجاع دهند.
3. Historical factها overwrite نمی‌شوند؛ state جاری باید قابل بازسازی یا حداقل audit/replay باشد.
4. Transitionهای دستی مهم باید audit شوند و provenance آن‌ها حفظ شود.
5. Stateهای آموزشی لزوماً monotonic نیستند؛ evidence جدید می‌تواند state جاری را تقویت، تثبیت یا در شرایط کافی تضعیف کند.
6. `Retention State` (`FRESH / REVIEW-DUE / AT-RISK`) در V1 **یک overlay انحصاری** است، نه state اصلی Skill.
7. `Confidence` و `Uncertainty` state machine مستقل نیستند؛ ویژگی Interpretation/Decision هستند.
8. transition ناموفق نباید historical Evidence را حذف یا اصلاح کند؛ باید failure/result اصلاحی قابل‌ردگیری ایجاد شود.
9. duplicate event نباید transition دوم ایجاد کند؛ idempotency / deduplication contract در Data/Event Model تعیین می‌شود.
10. State machine نباید با Projection/Overlay یکی گرفته شود؛ هر مفهوم باید صریحاً در یکی از این سه دسته قرار گیرد.

### Registry Summary

| Concept | نوع | State / Status | وضعیت قرارداد |
|---|---|---|---|
| Learning Relationship | Lifecycle | PENDING → ACTIVE → SUSPENDED → EXPIRED / REMOVED | `LOCKED` |
| Content Version | Lifecycle + availability overlay | DRAFT → REVIEW → QA → PILOT → ACTIVE → RETIRED | `LOCKED` در سطح process |
| Learning State | Educational State | NEW / EMERGING / DEVELOPING / STABLE / TRANSFER-READY / MASTERED | `LOCKED` در state set؛ transition policy باز |
| Error Hypothesis | Derived Lifecycle | PROPOSED → ACTIVE → REJECTED / SUPERSEDED / EXPIRED | `HYPOTHESIS` |
| Interpretation | Derived Record | ACTIVE → SUPERSEDED | `PRINCIPLE` |
| Mission Instance | Experience Runtime Lifecycle | PLANNED → STARTED → COMPLETED / ABANDONED | `HYPOTHESIS` |
| Session | Runtime Lifecycle | CREATED → ACTIVE → INTERRUPTED → ACTIVE / ABANDONED; ACTIVE → COMPLETED | `HYPOTHESIS` |
| Encounter | Runtime Lifecycle | PLANNED → PRESENTED → RESPONDED → EVALUATED → CLOSED؛ PLANNED/PRESENTED → SKIPPED | `HYPOTHESIS` |
| Assignment | Teacher Workflow / Shared Intent | DRAFT → SENT → CLOSED؛ DRAFT/SENT → CANCELLED | `HYPOTHESIS` |
| Assignment Instance | Child Execution | CREATED → IN_PROGRESS → COMPLETED → CLOSED / RECHECK_REQUIRED؛ RECHECK_REQUIRED → CLOSED؛ CREATED/IN_PROGRESS → CANCELLED | `HYPOTHESIS` |
| Teacher Intervention | Action Lifecycle | PROPOSED → ACCEPTED / DISMISSED → IN_PROGRESS → RECHECK_REQUIRED → CLOSED | `HYPOTHESIS` |
| Constraint | Policy Lifecycle | PROPOSED → ACTIVE → EXPIRED / REVOKED | `HYPOTHESIS` |
| Learning Decision | Decision Record | PROPOSED → COMMITTED → SUPERSEDED | `HYPOTHESIS` |
| Learning Plan | Execution Lifecycle | DRAFT → ACTIVE → COMPLETED / CANCELLED / SUPERSEDED | `HYPOTHESIS` |
| Progression Eligibility | Derived Eligibility | NOT-ELIGIBLE → ELIGIBLE | `HYPOTHESIS` |
| Unlock State | Durable Experience State | LOCKED → UNLOCKED | `HYPOTHESIS` |
| World Progress | Projection | derived | `PROJECTION` |

### 1. Learning Relationship Lifecycle — LOCKED

```text
PENDING
  ↓ activate
ACTIVE
  ↓ suspend            ↓ expire/remove
SUSPENDED           EXPIRED / REMOVED
  ↓ resume
ACTIVE
```

قواعد:

- پایان Relationship نباید Learning History را حذف کند.
- Permission و scope باید از Relationship محاسبه شوند و با Learning State یکی نباشند.
- ایجاد دوباره Relationship به‌معنی ایجاد Learning Identity جدید نیست.

### 2. Content Version Lifecycle — LOCKED در سطح process

```text
DRAFT → REVIEW → QA → PILOT → ACTIVE → RETIRED
```

`QUARANTINED` یک **availability/safety overlay** است، نه مرحله‌ای از lifecycle اصلی؛ می‌تواند روی Content Versionای که قبلاً قابل‌استفاده بوده اعمال شود.

قواعد:

- هر `Content Version` پس از `ACTIVE` immutable است؛ اصلاح محتوا یعنی ایجاد نسخه جدید.
- `QUARANTINED` یعنی نسخه فعلی نباید برای Evidence جدید یا exposure عادی استفاده شود؛ Historical Evidence باقی می‌ماند.
- quarantine نباید Content Version را «تغییرمحتوا» بدهد؛ فقط availability آن را محدود می‌کند.
- عبور از QA/PILOT باید gate مشخص داشته باشد؛ جزئیات approval workflow در Content Architecture تعیین می‌شود.

### 3. Learning State — LOCKED در سطح state set

```text
NEW
EMERGING
DEVELOPING
STABLE
TRANSFER-READY
MASTERED
```

این‌ها **مقادیر state** هستند، نه اینکه همه transitionهای رفت‌وبرگشت بین آن‌ها مجاز باشند. Policy تعیین می‌کند چه transitionهایی در هر خانواده Skill معتبر است.

قواعد مهم:

- `MASTERED` به معنی «هرگز نباید پایین بیاید» نیست؛ evidence متناقض کافی می‌تواند State جاری را بازبینی کند.
- Retention State (`FRESH / REVIEW-DUE / AT-RISK`) یک overlay انحصاری است و کنار State نگهداری می‌شود.
- Evidence Decay به‌تنهایی نباید historical stateهای قبلی را rewrite کند؛ باید وزن تصمیم/مرور را تغییر دهد.
- تغییر State باید traceable به Evidence/Interpretation یا policy-trigger مشخص باشد.
- transition مستقیم بین stateهای دورتر فقط با policy صریح مجاز است؛ یک rule عمومی برای «پرش آزاد» وجود ندارد.

### 4. Error Hypothesis Lifecycle — HYPOTHESIS

```text
PROPOSED → ACTIVE → REJECTED
                  ├→ SUPERSEDED
                  └→ EXPIRED
```

`Strengthened / Weakened` state نیستند؛ revision روی confidence/weight Hypothesis هستند.

قواعد:

- یک Evidence می‌تواند چند Hypothesis رقیب ایجاد کند.
- active بودن Hypothesis به‌معنی diagnosis قطعی نیست.
- Reject/Supersede/Expire باید reason و evidence/policy reference داشته باشد.
- Hypothesis جدید می‌تواند interpretation قبلی را supersede کند بدون حذف historical record.

### 5. Interpretation Lifecycle — PRINCIPLE

```text
ACTIVE → SUPERSEDED
```

Interpretation versionable است. اگر تفسیر جدیدی برای همان Evidence ایجاد شد:

```text
Old Interpretation → SUPERSEDED
New Interpretation → ACTIVE
```

خود Evidence تغییر نمی‌کند.

### 6. Mission Instance Lifecycle — HYPOTHESIS

در Technical Model، `Mission Instance` یک **child-specific experience execution** است؛ اصطلاح محصولی `Mission` به هدف/سفر اشاره می‌کند و reusable content/experience definition در Content/Experience layer قرار می‌گیرد.

```text
PLANNED → STARTED → COMPLETED
               └→ ABANDONED
```

`ABANDONED` به‌معنی failure یادگیری نیست؛ فقط execution ناقص است. resume/re-entry در صورت نیاز باید با Mission/Session rules انجام شود، نه با state جداگانه‌ای مثل `RESUMABLE`.

### 7. Session Runtime Lifecycle — HYPOTHESIS

```text
CREATED → ACTIVE → COMPLETED
             │
             └→ INTERRUPTED → ACTIVE
                         └→ ABANDONED
```

قواعد:

- `INTERRUPTED` می‌تواند ناشی از قطع اینترنت، خروج کودک یا interruption دیگر باشد و الزاماً نتیجه یادگیری ندارد.
- `INTERRUPTED` یک state واقعی runtime است؛ `RESUMABLE` status مستقل نیست.
- Completion مستقل از Mastery است؛ یک Session می‌تواند complete شود بدون اینکه mastery حاصل شده باشد.
- Session مرز زمانی/اجرایی Evidenceهای داخل خود را مشخص می‌کند.

### 8. Encounter Runtime Lifecycle — HYPOTHESIS

```text
PLANNED → PRESENTED → RESPONDED → EVALUATED → CLOSED
     │           │
     └→ SKIPPED  └→ SKIPPED
```

قواعد:

- `RESPONDED` یعنی interaction ثبت شده؛ لزوماً پاسخ صحیح نیست.
- `EVALUATED` مرحله‌ای است که Evidence/Interpretation لازم برای Encounter تولید یا queue می‌شود.
- اگر Encounter فقط display شود و child پاسخ ندهد، Evidence یادگیری تولیدشده تلقی نمی‌شود مگر policy صریح دیگری وجود داشته باشد.
- `SKIPPED` باید قبل از `RESPONDED/EVALUATED` رخ دهد؛ `SKIPPED` نتیجه evaluation نیست.

### 9. Assignment Lifecycle — HYPOTHESIS

`Assignment` فقط Shared Intent / Outcome / Boundary را نگه می‌دارد:

```text
DRAFT → SENT → CLOSED
  │       │
  └───────┴→ CANCELLED
```

Execution هر Child در `Assignment Instance` نگه داشته می‌شود:

```text
CREATED → IN_PROGRESS → COMPLETED → CLOSED
                            │
                            └→ RECHECK_REQUIRED → CLOSED

CREATED / IN_PROGRESS → CANCELLED
```

قواعد:

- Assignment حامل Shared Objective / Boundary است، نه Learning State و نه child-specific progress.
- یک Assignment می‌تواند چند Assignment Instance داشته باشد؛ مسیرها می‌توانند متفاوت باشند ولی Shared Outcome باقی می‌ماند.
- `RECHECK_REQUIRED` مربوط به Instance است، نه Assignment مشترک.
- از v0.19: `COMPLETED` هم می‌تواند مستقیم به `CLOSED` برود و هم به `RECHECK_REQUIRED`؛ `RECHECK_REQUIRED` از `IN_PROGRESS` مستقیم نیست.
- Cancellation فقط تا زمانی مجاز است که قرارداد اجرایی/permission اجازه دهد.

### 10. Teacher Intervention Lifecycle — HYPOTHESIS

```text
PROPOSED
   ├→ ACCEPTED → IN_PROGRESS → RECHECK_REQUIRED → CLOSED
   └→ DISMISSED
```

`MODIFIED` state نیست؛ **یک action/versioning operation** است که نسخه یا boundary جدید Intervention را ایجاد می‌کند و نتیجه آن دوباره در مسیر `ACCEPTED → IN_PROGRESS` قرار می‌گیرد.

قواعد:

- `DISMISSED` یعنی action جاری اجرا نمی‌شود؛ Evidence و Recommendation قبلی حذف نمی‌شوند.
- هر `MODIFY` باید تغییر boundary/parameters و actor/reason را ثبت کند.
- `RECHECK_REQUIRED` باید به Evidence یا Observation جدید ختم شود یا با reason بسته شود.

### 11. Constraint Lifecycle — HYPOTHESIS

```text
PROPOSED → ACTIVE → EXPIRED / REVOKED
```

هر Constraint حداقل:

`Source + Type + Hard/Soft + Scope + Priority + Validity + Effect`

دارد.

`REVISED` state مستقل نیست؛ تغییر Constraint باید version/revision قابل‌ردگیری ایجاد کند.

Constraint مستقیماً Learning State را تغییر نمی‌دهد؛ بر Decision / Orchestration / Plan اثر می‌گذارد.

### 12. Learning Decision Lifecycle — HYPOTHESIS

```text
PROPOSED → COMMITTED → SUPERSEDED
```

در V1 Decision باید به این موارد قابل‌ردگیری باشد:

```text
Input State
+ Evidence References
+ Constraints
+ Arbitration Result
+ Decision Reason / Policy Reference
+ Selected Step
```

یک Decision قدیمی با Decision جدید overwrite نمی‌شود؛ `SUPERSEDED` می‌شود.

Decision فقط برای Arbitration Result با نتیجه‌ی `SELECTED` ایجاد می‌شود؛ `CONFLICT / DEFERRED` state Decision نیستند و روی Arbitration Result ثبت می‌شوند (بخش 11.5).

### 13. Learning Plan Lifecycle — HYPOTHESIS

```text
DRAFT → ACTIVE → COMPLETED
              ├→ CANCELLED
              └→ SUPERSEDED
```

Plan باید lightweight بماند؛ هدف آن traceability و اجرای Decision است، نه تبدیل‌شدن به curriculum engine مستقل.

### 14. Progression / Unlock — HYPOTHESIS

دو مفهوم باید جدا بمانند:

```text
Progression Eligibility
NOT-ELIGIBLE → ELIGIBLE

Unlock State
LOCKED → UNLOCKED
```

`ELIGIBLE` یک وضعیت derived است: شرط progression برآورده شده، اما Experience هنوز الزاماً نمایش داده نشده است.

`UNLOCKED` نتیجه‌ی durable progression است. در V1، Unlock به‌صورت پیش‌فرض **برگشت‌ناپذیر** است مگر policy صریحاً access را به‌دلیل content safety، account state یا redesign محدود کند؛ افت Learning State نباید خودکار جهان قبلی را قفل کند.

reward economy می‌تواند همراه Unlock باشد، ولی شرط learning را جایگزین نمی‌کند.

### State Transition Invariants — باید قبل از Data Model حفظ شوند

- هیچ transition آموزشی بدون reference به input evidence، policy/rule یا human action معتبر نیست.
- reason برای manual override، exception و transitionهای policy-sensitive اجباری است؛ transition عادی سیستم باید حداقل policy/rule reference داشته باشد.
- هیچ manual override نباید historical Evidence را حذف یا overwrite کند.
- stateهای derived باید قابل بازسازی باشند یا حداقل مسیر audit/replay داشته باشند.
- duplicate event نباید باعث transition دوگانه شود.
- transitionهای ناسازگار باید reject شوند؛ silent correction مجاز نیست.
- همه transitionهای teacher-facing که روی Decision/Plan اثر می‌گذارند باید actor و provenance داشته باشند.
- Overlay و Projection نباید بدون ثبت علت دوباره به source state تبدیل شوند.
- تغییر Content Version هرگز نباید Evidence تاریخی را بازنویسی کند.

**Status:** `LOCKED` در سطح semantics؛ transition guards، concurrency، retries و persistence mechanics در مرحله Data/Event Model تعیین می‌شوند.

### State Machine Audit — v0.13

این ممیزی چهار اصلاح معماری ایجاد کرد:

1. `QUARANTINED` از lifecycle اصلی Content Version جدا و به availability/safety overlay تبدیل شد.
2. `RESUMABLE` از Session حذف شد؛ `INTERRUPTED → ACTIVE` transition است و resumability یک runtime property است.
3. `SKIPPED` از بعد از Evaluation حذف شد و به مسیر قبل از Evidence-producing response منتقل شد.
4. `MODIFIED` در Teacher Intervention از state به revision/action تبدیل شد؛ `Progression Eligibility` نیز از `Unlock State` جدا شد.

هدف این اصلاح‌ها جلوگیری از تبدیل شدن event، overlay یا operation به entity/state کاذب در Data Model است.

**Status:** `LOCKED` در سطح semantics؛ implementation/storage هنوز `OPEN`.

## 11.2 Evidence / Interpretation / Error Contract — قرارداد Evidence و تفسیر

### Evidence Record — حداقل قرارداد مفهومی

هر Evidence باید بتواند این ابعاد را نگه دارد:

```text
Evidence ID
Child Learning Identity
Primary Skill / Objective
Relationship Context (required; Platform Context when no relationship applies)
Objective Context (optional)
Source Type / Source Actor / Source Reference
Occurred At
Recorded At
Provenance / Causation Reference
Encounter ID (optional)
Content Version ID (optional)
Observation / Response Payload Reference
Evidence Quality Flags
Validity Overlay (separate append-only record; not part of the immutable fact)
```

Evidence باید **append-only از نظر fact** باشد. اصلاح یک observation با overwrite انجام نمی‌شود؛ correction/retraction به‌صورت record یا overlay جدید ثبت می‌شود.

### Provenance Chain

حداقل باید بتوان مسیر زیر را بازسازی کرد:

```text
Source / Actor
→ Runtime Event / External Observation
→ Evidence
→ Interpretation / Hypothesis
→ Learning State / Mastery Evaluation
→ Learning Decision
→ Action / Outcome
```

در تصمیم‌های مهم، نبودن یک حلقه از این زنجیره باید قابل‌مشاهده باشد، نه اینکه سیستم خلأ را با فرض پر کند.

### Interpretation Contract

هر Interpretation باید حداقل به این موارد متصل باشد:

`Evidence Set + Interpretation Type + Method/Policy Version + Confidence + Uncertainty + Created At + Status`

چند Interpretation رقیب می‌توانند هم‌زمان وجود داشته باشند. `ACTIVE` به معنی «حقیقت قطعی» نیست؛ یعنی فعلاً در تصمیم‌گیری قابل‌استفاده است.

### Error Hypothesis Contract

`Error Hypothesis` یک نوع تخصصی Interpretation است و باید:

- Skill/Objective scope داشته باشد.
- به یک Evidence Set متکی باشد، نه الزاماً یک خطا.
- بتواند با Hypothesisهای رقیب هم‌زمان باشد.
- revisionهای confidence/weight را حفظ کند.
- برای `REJECTED / SUPERSEDED / EXPIRED` علت و reference داشته باشد.
- به‌تنهایی Learning State یا Mastery را تغییر ندهد؛ این تغییر فقط از طریق Decision/State policy انجام می‌شود.

### Diagnostic Probe Contract

Probe فقط وقتی ارزش دارد که انتظار برود عدم‌قطعیت درباره یک تصمیم را کاهش دهد:

```text
Current Uncertainty
        ↓
Probe Candidate
        ↓
Expected Decision Value
        ↓
Run / Skip
```

بنابراین تعداد Probeها هدف نیست؛ **ارزش کاهش عدم‌قطعیت نسبت به هزینه تعامل** معیار اصلی است.

**Status:** `LOCKED` در مرزهای مفهومی؛ scoring، calibration و implementation در مرحله Learning Engine تعیین می‌شوند.

## 11.3 Mastery / Retention Execution Rules — اجرای Mastery و Retention

### Mastery State Set ≠ Universal Ladder

Stateهای زیر یک vocabulary مشترک‌اند، نه الزاماً یک مسیر اجباری برای همه Skill Familyها:

```text
NEW / EMERGING / DEVELOPING / STABLE / TRANSFER-READY / MASTERED
```

- برخی Skillها ممکن است `TRANSFER-READY` را اصلاً نداشته باشند.
- برخی Skillها ممکن است برای رسیدن به `MASTERED` به Transfer evidence نیاز داشته باشند.
- transition policy باید family-specific باشد و مجاز نیست همه Skillها را مجبور به یک sequence یکسان کند.
- هیچ transition الگوریتمی بدون `Mastery Contract Version` قابل‌اعتماد برای بازسازی تاریخی نیست.

### Mastery Evaluation

`Mastered` یک **claim قابل‌ردگیری درباره وضعیت فعلی evidence** است، نه یک حقیقت غیرقابل‌بازگشت.

هر Mastery Evaluation باید به این موارد متکی باشد:

```text
Skill Family
+ Mastery Contract Version
+ Evidence Set / Time Window
+ Evidence Sufficiency
+ Evidence Diversity
+ Independence / Guidance level
+ Persistence / Recency
+ Transfer requirement when relevant
+ Retention signal when relevant
→ Evaluation Result
```

حداقل invariantهای V1:

- یک پاسخ صحیح یا یک Encounter به‌تنهایی Mastery تولید نمی‌کند.
- Mastery Evaluation باید قابل بازسازی از evidence set و contract version باشد.
- threshold واحد برای همه Skill Familyها فرض نمی‌شود.
- تغییر Mastery باید به Evaluation/Policy یا evidence contradictory قابل‌ردگیری متصل باشد.
- historical Mastery Evaluation حفظ می‌شود؛ current state از آخرین ارزیابی معتبر/قابل‌اعتماد مشتق می‌شود.

### Retention

Retention یک **dimension/overlay** مستقل از Skill State است:

```text
FRESH / REVIEW-DUE / AT-RISK
```

- در هر لحظه فقط یکی از این سه مقدار برقرار است (overlay انحصاری).
- `REVIEW-DUE` به‌تنهایی به معنی افت Skill State نیست.
- `AT-RISK` محرک Review/Recheck است؛ demotion خودکار فقط با policy صریح و evidence جدید مجاز است.
- Evidence Decay وزن تصمیم را تغییر می‌دهد؛ historical evidence یا historical mastery evaluation را پاک نمی‌کند.
- spacing/interleaving policy باید family-specific و versioned باشد.

### Re-evaluation Triggers

Mastery/Retention می‌تواند با این triggerها دوباره ارزیابی شود:

- evidence جدید معنادار
- review/recheck
- teacher intervention
- scheduled retention check
- تغییر Mastery Contract version
- contradiction قابل‌اعتماد در evidence

**Status:** `LOCKED` در قرارداد؛ thresholdها، scoring و calibration هنوز `HYPOTHESIS / EVIDENCE NEEDED` هستند.

## Evidence / Mastery Audit — v0.14

این دور پنج نقص معماری مهم را اصلاح کرد:

1. `Event` از `Evidence` جدا شد؛ telemetry به‌صورت خودکار Learning Truth محسوب نمی‌شود.
2. `Evidence` می‌تواند بدون Content Version معتبر باشد، مشروط به provenance/source reference؛ این برای Teacher/Parent Observation و Assessment بیرونی ضروری است.
3. `Error Hypothesis` به‌عنوان تخصصی از Interpretation تعریف شد تا دو مسیر موازی برای تفسیر ایجاد نشود.
4. `Mastery` از یک universal ladder به family-specific state vocabulary تبدیل شد؛ `Mastery Evaluation` واسط قابل‌ردگیری بین Evidence و current Learning State است.
5. `Assignment` از `Assignment Instance` جدا شد تا Shared Outcome از child-specific execution مستقل بماند.

**Status:** `LOCKED` در سطح domain semantics؛ calibration و physical persistence در مراحل بعدی باقی می‌مانند.

## 11.4 Event / Evidence Boundary — قاعده اجرایی

Eventهای runtime بخشی از trace فنی‌اند؛ Evidence بخشی از Learning Truth است. یک Event ممکن است Evidence تولید کند، ولی این تبدیل باید explicit و قابل‌ردگیری باشد.

```text
session_started ─┐
question_viewed ─┼→ runtime trace
answer_submitted ┘
        │
        └→ evidence_created (only when learning-relevant)
                    ↓
              interpretation
```

این rule باید در Data/Event Model حفظ شود.

## 11.5 Decision / Arbitration / Constraint Contract — قرارداد تصمیم و تعارض

### Domain separation

```text
Learning Need / Goal
      ≠
Constraint
      ≠
Decision
      ≠
Recommendation
      ≠
Action
```

- **Learning Need / Goal:** چیزی که از State، Objective، Assignment یا Context به‌عنوان نیاز/هدف مطرح می‌شود.
- **Constraint:** محدودیت یا boundary برای انتخاب/اجرای Step.
- **Decision:** انتخاب canonical سیستم برای قدم بعدی.
- **Recommendation:** نحوه ارائه Decision به Child/Parent/Teacher.
- **Action:** اجرای واقعی توسط سیستم یا انسان.

### Decision Record — حداقل قرارداد

هر committed Decision باید به این موارد اشاره کند:

```text
Decision ID
Child Learning Identity
Target Skill / Objective
Relationship Context / Objective Context
Goal References (Objective / Assignment Instance, when applicable)
Input State Reference / Snapshot
Evidence Set / Interpretation References
Candidate Set (or reproducible candidate-generation policy)
Applicable Constraints
Arbitration Result
Selected Step
Policy / Rule Versions
Created At
Actor / System
Status
```

### Conflict handling

Arbitration سه خروجی canonical دارد:

```text
SELECTED
CONFLICT / NO-FEASIBLE-PLAN
DEFERRED / NEEDS-MORE-EVIDENCE
```

`CONFLICT` نباید با انتخاب تصادفی یا silent relaxation حل شود. `DEFERRED` می‌تواند به Diagnostic Probe یا Human Intervention منتهی شود.

هر Arbitration Result با هر سه خروجی (`SELECTED / CONFLICT / DEFERRED`) ثبت می‌شود؛ `Learning Decision` فقط از نتیجه‌ی `SELECTED` ساخته می‌شود و `CONFLICT / DEFERRED` روی Arbitration Result باقی می‌مانند تا replan یا human action به آن‌ها ارجاع بدهد.

### Human override

Teacher/Authorized Human می‌تواند Decision/Plan جاری را override/modify کند، اما:

- historical Evidence را تغییر نمی‌دهد.
- Decision قبلی را overwrite نمی‌کند؛ supersede/revision ثبت می‌شود.
- actor + scope + reason + timestamp ثبت می‌شود.
- اگر override با Hard Constraint سیستم تعارض دارد، باید reject یا conflict صریح تولید شود.

### Reproducibility

برای بازسازی یک Decision تاریخی، حداقل این‌ها باید versioned باشند:

`Input State Reference + Evidence/Interpretation References + Constraint Versions + Policy/Rule Versions + Candidate Generation Version`

هدف این نیست که هر Decision یک model prediction پیچیده باشد؛ هدف این است که **چرایی Decision قابل بازسازی و audit باشد.**

**Status:** `LOCKED` در semantics؛ weights/scoring و implementation mechanics هنوز `HYPOTHESIS / EVIDENCE NEEDED` هستند.


## 11.6 Data Model Contract — قرارداد مدل داده

این بخش از Product Core وارد **physical database schema** نمی‌شود؛ ابتدا canonical data semantics، ownership، identity، immutability، versioning، references و rebuild behavior را مشخص می‌کند تا انتخاب storage بعداً تابع domain باشد، نه برعکس.

### اصل 1 — Domain Data ≠ Telemetry ≠ Projection

سه نوع داده باید از هم جدا بمانند:

```text
Domain Fact / State
      ≠
Runtime / Product Event
      ≠
Read Projection / Analytics View
```

- **Domain Fact / State:** داده‌ای که برای فهم و اجرای learning domain به آن اتکا می‌کنیم.
- **Runtime Event:** رخداد قابل‌ردگیری از اجرای محصول یا تغییر domain.
- **Projection:** نمایش محاسبه‌شده برای query یا تجربه کاربر؛ source of truth مستقل نیست.

اصل V1:

> **وجود Event به‌معنی وجود Evidence نیست؛ وجود Projection به‌معنی وجود Truth مستقل نیست.**

### اصل 2 — Immutable History, Mutable Current View

Historical facts و records مهم باید overwrite نشوند. State جاری می‌تواند تغییر کند، اما مسیر تغییر باید قابل‌ردگیری باشد.

```text
Historical Evidence / Decision / Evaluation
                ↓
        Current State Projection
```

این به‌معنی full event-sourcing برای تمام Domain نیست. V1 می‌تواند از **state storage + append-only event/audit trail + rebuildable projections** استفاده کند؛ انتخاب physical pattern در Architecture باقی می‌ماند.

### Canonical Identity Rules

هر domain record باید یک شناسه canonical پایدار داشته باشد؛ identity نباید از label، position، timestamp یا content text ساخته شود.

حداقل identity familyها:

```text
Child ID
Principal / Account ID
Learning Identity ID
Relationship ID
Relationship Context ID
Skill ID
Skill Graph Version ID
Skill Family ID
Learning Objective ID
Content Artifact ID
Content Version ID
Mission Definition / Reference ID
Mission Instance ID
Session ID
Encounter ID
Evidence ID
Evidence Validity Record ID
Interpretation ID
Error Hypothesis ID
Learning State ID / State Key
Mastery Contract Version ID
Mastery Evaluation ID
Constraint ID / Constraint Version ID
Decision ID
Arbitration Result ID
Learning Plan ID / Plan Revision ID
Assignment ID
Assignment Instance ID
Teacher Intervention ID
Milestone ID
Progression Rule Version ID
Unlock ID
Consent / Authorization Grant ID
Delegation ID
Audit Record ID
Event ID
```

IDها باید opaque و مستقل از business meaning باشند؛ semantic slugها و human-readable codes می‌توانند فیلد جداگانه باشند.

### Ownership / Aggregate Boundaries — V1 پیشنهادی

| Aggregate / Owner | داده‌های اصلی | مرز تغییر |
|---|---|---|
| Learning Identity | Child learning identity + learning-level references | مالک سابقه یادگیری، نه حساب کاربری عمومی |
| Relationship | actor + child + scope + purpose + lifecycle | permission/scope؛ نباید evidence را مالک شود |
| Skill Graph | Skill + graph relations + graph version | curriculum/domain governance |
| Content | Artifact + Versions + QA lifecycle | authoring/content governance |
| Learning Runtime | Mission Instance / Session / Encounter | execution؛ نباید Learning Truth را مستقیم overwrite کند |
| Evidence | immutable learning facts | append-only / correction by validity record |
| Interpretation | Evidence interpretation revisions | derived meaning |
| Learning State | current skill-context state | rebuildable/derivable current view |
| Decision | canonical learning decision + arbitration | decision history |
| Plan | execution contract for Decision | runtime planning |
| Assignment | shared objective/boundary | teacher-authored intent |
| Assignment Instance | per-child execution | child-specific progress |
| Progression | Milestone / Rule / Unlock | learning-to-world bridge |
| Teacher Intervention | human action + recheck | intervention workflow |

این Aggregateها الزاماً microservice boundary یا database schema boundary نیستند؛ صرفاً مرزهای ownership و consistency هستند.

### Identity Boundary — Account / Principal / Learning Identity

`Learning Identity` نباید با authentication account یا PII profile یکی فرض شود.

```text
Platform Principal / Account
        ↓ optional binding
Learning Identity
        ↓
Learning History
```

- Principal/Account برای authentication، authorization و contact است.
- Learning Identity برای سابقه یادگیری کودک است.
- جداکردن این دو، امکان تغییر login/guardian relationship را بدون تغییر historical learning identity فراهم می‌کند.
- PII غیرضروری نباید داخل Evidence، Event payload یا Learning State کپی شود.
- identity merge / duplicate resolution باید operation صریح با audit باشد؛ دو Learning Identity نباید silent merge شوند.

### Canonical Cardinality & Uniqueness — V1 defaults

این‌ها semantic uniqueness هستند؛ نحوه اجرای unique index بعداً تعیین می‌شود:

| Relation / Key | V1 semantic rule |
|---|---|
| Learning Identity ↔ learner | هر Learning Identity به یک learner canonical اشاره می‌کند؛ یک learner در محصول یک Learning Identity canonical دارد. |
| Learning Identity ↔ Relationship | یک Learning Identity می‌تواند چند Relationship فعال/تاریخی داشته باشد. |
| Relationship ↔ Context | یک Relationship باید scope/context قابل‌تشخیص داشته باشد؛ یک actor می‌تواند در چند Context رابطه جدا داشته باشد. |
| Context ↔ Learner | یک Context می‌تواند چند Learning Identity داشته باشد. |
| Learning State key | `(Learning Identity, Skill, Learning Relationship Context)` در یک revision جاری نباید duplicate شود. |
| Content Artifact ↔ Content Version | یک Artifact چند Version دارد؛ هر Version فقط به یک parent Artifact تعلق دارد. |
| Assignment ↔ Instance | یک Assignment می‌تواند چند Assignment Instance داشته باشد؛ هر Instance فقط به یک Assignment و یک Learning Identity متصل است. |
| Decision ↔ Plan | هر active Plan باید Decision/Revision مشخصی را reference کند؛ چند Plan هم‌زمان فقط با policy صریح مجاز است. |
| Unlock | برای یک `(Learning Identity, Unlock Target, Progression Rule Version)` اثر تکراری نباید دو unlock مستقل بسازد. |

### Time Semantics

در Data Model باید زمان‌های متفاوت با هم قاطی نشوند:

```text
occurred_at  = زمان وقوع در source context
recorded_at  = زمان ثبت/دریافت توسط platform
valid_from   = شروع اعتبار semantic record
valid_to     = پایان اعتبار، در صورت وجود
updated_at   = آخرین تغییر record جاری
```

هیچ کدام به‌تنهایی order کل سیستم را تعیین نمی‌کنند. برای offline/device scenarios، causal/sequence metadata معیار تکمیلی است.

### Snapshot / Revision Semantics

هر تصمیم یا evaluation مهم باید بتواند به نسخه state‌ای که بر اساس آن گرفته شده اشاره کند:

```text
Current State Revision
        ↓ snapshot/reference
Decision / Evaluation
```

هدف snapshot، freeze کردن truth تاریخی نیست؛ هدف حفظ **input context** برای reproducibility است.

### Consistency Classes

Domain data از نظر freshness یکسان نیست:

| کلاس | نمونه | اصل |
|---|---|---|
| Critical decision state | Learning State مورد استفاده برای next-step | قبل از تصمیم high-impact باید freshness قابل‌قبول validate شود. |
| User-facing projection | Parent Report / Teacher Queue | eventual consistency قابل‌قبول است، با نمایش/refresh مناسب. |
| Analytics | cohort / dashboard | eventual consistency طبیعی است. |
| Telemetry | UI/performance | loss/lag ممکن است در حد policy مجاز باشد مگر برای eventهای learning-critical. |

### Deletion / Redaction Semantics

برای entityهای تاریخی، این سه operation باید جدا باشند:

```text
Archive / Retire
Soft invalidation
Legal / Policy deletion or redaction
```

Archive یا Retire دسترسی جاری را می‌بندد ولی historical trace را نگه می‌دارد. Legal deletion ممکن است reference integrity را تحت تأثیر قرار دهد؛ در آن حالت باید redaction marker و impact policy مشخص باشد، نه حذف خامی که audit graph را silently بشکند.

### Scope / Organization Boundary

اگر محصول School / Class / Center داشته باشد، scope باید domain-level باشد و فقط با role UI تعیین نشود.

```text
Principal
→ Relationship
→ Scope / Context
→ Allowed Data Set
```

نباید فرض شود که «Teacher role» به‌تنهایی اجازه دیدن تمام Learning Identity را ایجاد می‌کند.

### Reference Rules

1. Reference به رکورد تاریخی باید stable ID داشته باشد.
2. Reference به version باید **version ID** داشته باشد، نه فقط parent ID.
3. Reference به state جاری باید snapshot/reference زمان تصمیم را نیز در صورت high-stakes بودن حفظ کند.
4. Deletion یک historical reference را نباید silently بشکند؛ در صورت حذف قانونی، redaction/deletion metadata جدا ثبت می‌شود.
5. Cross-domain reference نباید وابستگی implicit به ترتیب transaction داشته باشد.

### Versioning Matrix

| Concept | Versioning | قاعده |
|---|---|---|
| Skill | graph/version | تغییر ساختاری graph نباید historical evidence را redefine کند |
| Learning Objective | revision/version | تغییر معنی هدف باید قابل‌ردگیری باشد |
| Content | immutable version | ACTIVE version هرگز in-place تغییر نمی‌کند |
| Mastery Contract | version | Evaluation باید contract version مورد استفاده را نگه دارد |
| Progression Rule | version | گذشته با rule جدید rewrite نمی‌شود |
| Constraint | revision / validity window | تغییر policy باید از نسخه قبلی قابل‌تفکیک باشد |
| Decision Policy | version | برای reproducibility باید reference شود |
| Plan | revision | plan جدید supersede می‌کند، نه overwrite |
| Interpretation | revision | interpretation قبلی حفظ و supersede می‌شود |

### Validity vs Deletion

برای داده‌های learning، این سه حالت باید از هم جدا بمانند:

```text
VALID
INVALID / SUSPECTED
LEGALLY REMOVED / REDACTED
```

`Invalid` یعنی برای تصمیم‌های جاری نباید به‌عنوان evidence معتبر استفاده شود، اما historical trace برای audit/impact analysis حفظ می‌شود؛ مگر قانون/سیاست حذف الزام کند.

### Evidence Data Contract — حداقل canonical shape

```text
Evidence
├── evidence_id
├── learning_identity_id
├── skill_ref (optional when evidence is broader)
├── objective_ref (optional)
├── relationship_context_ref   # required; defaults to Platform Context
├── objective_context
├── encounter_ref (optional)
├── content_version_ref (optional)
├── source_type
├── actor_ref (when applicable)
├── occurred_at
├── recorded_at
├── observation / response payload reference
├── evidence_quality attributes
├── provenance reference
├── source_event_ref           # required when built from an internal Event
├── source_reference           # required when there is no internal artifact
└── schema_version
```

`confidence` و `uncertainty` در صورت نیاز به **Interpretation** تعلق دارند؛ آن‌ها نباید کیفیت fact خام را با certainty درباره interpretation مخلوط کنند.

اعتبار Evidence (`UNREVIEWED / USABLE / LIMITED / RETRACTED`) داخل خود Evidence نگه داشته نمی‌شود؛ با `Evidence Validity Record` جدا (overlay append-only) ثبت می‌شود و validity جاری از آخرین رکورد معتبر مشتق می‌شود.

```text
Evidence Validity Record
├── validity_record_id
├── evidence_id
├── validity_status
├── reason
├── actor_ref / policy_ref
├── recorded_at
└── supersedes_ref (optional)
```

### Learning State Data Contract — حداقل canonical shape

```text
Learning State
├── learning_identity_id
├── skill_id
├── relationship_context_id
├── state_vocabulary / state
├── state_version / revision
├── last_evidence_at
├── active_mastery_evaluation_ref (optional)
├── retention_state          # overlay انحصاری: FRESH / REVIEW-DUE / AT-RISK
├── current_interpretation_refs (optional)
└── updated_at
```

State جاری باید با historical evidence و evaluation history قابل audit/rebuild باشد؛ لازم نیست هر محاسبه داخلی یک record دائمی داشته باشد.

### Decision Data Contract — حداقل canonical shape

```text
Decision
├── decision_id
├── learning_identity_id
├── target_skill/objective
├── relationship_context_ref
├── objective_context
├── goal_refs (learning objective / assignment instance, when applicable)
├── input_state_snapshot_ref
├── evidence_refs
├── interpretation_refs
├── candidate_set_ref / generation_version
├── applicable_constraint_refs
├── arbitration_result_ref
├── selected_step
├── decision_policy_version
├── actor/system
├── status
├── created_at
└── supersedes_ref (optional)
```

### Assignment / Assignment Instance Data Contract

```text
Assignment
├── assignment_id
├── author_relationship_ref
├── shared_objective
├── shared_outcome
├── boundary
├── validity_window
└── assignment_revision

Assignment Instance
├── assignment_instance_id
├── assignment_id
├── learning_identity_id
├── execution_state
├── personalized_plan_ref
├── completion / recheck refs
└── instance_revision
```

Shared Intent نباید با child-specific execution قاطی شود.

### Projection Rules

Projectionهای مهم:

```text
Learning Truth View
Aggregate Learning View
Parent Report
Teacher Action Queue
Class Learning Signal
World Progress View
```

برای هر Projection باید مشخص باشد:

- source records چیستند؟
- refresh/invalidating trigger چیست؟
- stale بودن تا چه حد قابل‌قبول است؟
- آیا rebuildable است؟
- آیا user می‌تواند آن را source of truth فرض کند؟ → خیر، مگر صریحاً domain record باشد.

### Rebuild Principle

هر projection بحرانی باید حداقل یکی از این دو را داشته باشد:

```text
Rebuild from domain history
یا
Verified recovery snapshot + audit trail
```

Projectionی که نه rebuild شود و نه source-of-truth باشد، برای V1 مجاز نیست.

### Concurrency / Consistency Principle

در این مرحله هنوز database locking یا transaction strategy قفل نمی‌شود، اما semantics باید روشن باشد:

1. دو event تکراری نباید یک اثر دوگانه ایجاد کنند.
2. دو update هم‌زمان روی یک Decision/Plan نباید silently یکی را حذف کند.
3. state transition باید بر مبنای version/revision قابل‌تشخیص باشد.
4. Historical Evidence نباید به‌خاطر race condition تغییر کند.
5. اگر conflict قابل‌حل نیست، باید explicit conflict تولید شود، نه silent last-write-wins برای learning truth.

### Offline / Sync Semantics — V1

Client می‌تواند eventهای runtime را locally buffer کند، اما نباید به‌صورت مستقل Learning Truth نهایی را authoritative اعلام کند مگر اینکه policy صریحاً آن را مجاز کرده باشد.

```text
Local Runtime Event
→ local queue
→ sync
→ dedup / ordering checks
→ server/domain processing
→ Evidence / State update
→ acknowledgement
```

اگر دو دستگاه هم‌زمان کار کنند:

- event history حفظ می‌شود؛
- conflict باید در domain layer حل شود؛
- آخرین timestamp به‌تنهایی authority کافی نیست.

### Data Retention Classes — مفهومی

| Class | مثال | سیاست اولیه |
|---|---|---|
| Learning History | Evidence / Decision / Evaluation | طولانی‌مدت تا طبق privacy policy |
| Runtime Telemetry | UI / performance trace | کوتاه‌تر از learning history در صورت عدم نیاز |
| Content History | Content Versions | طولانی‌مدت برای provenance |
| Relationship Data | Teacher/Parent relationship | تا پایان نیاز/قانون + audit لازم |
| Derived Projections | Reports / Queues | قابل rebuild و retention کوتاه‌تر در صورت امکان |

**Status:** `LOCKED` در semantics؛ physical tables/indexes/storage/partitioning `OPEN`.

## 11.7 Event Model Contract — قرارداد رخداد

Event باید **fact of occurrence** را ثبت کند، نه نتیجه تفسیر را مگر اینکه خود رخداد واقعاً تغییر domain بوده باشد.

### Event Categories

```text
1. Runtime / Telemetry Event
2. Domain Event
3. Audit / Governance Event
4. Product / Billing / Administrative Event
```

`Learning Event` زیرمجموعه Domain Event با `domain_area=learning` است، نه یک category موازی. در V1، categoryها می‌توانند در یک transport/log ذخیره شوند، اما semantics، retention و access policy آن‌ها باید از هم جدا بماند.

### Event Envelope — canonical

```text
Event
├── event_id
├── event_type
├── event_schema_version
├── producer
├── occurred_at        # when it happened in source context
├── recorded_at        # when accepted by platform
├── actor_ref           # human/system/device when relevant
├── subject_ref         # entity the event is about
├── aggregate_ref       # aggregate/owner when applicable
├── correlation_id      # journey/request/session lineage
├── causation_id        # event/action that caused this event
├── idempotency_key     # deduplication key where needed
├── producer_instance   # device/client/service instance when relevant
├── client_sequence     # local sequence for offline ordering when relevant
├── sequence / revision # aggregate/domain revision when ordering is required
├── payload
└── provenance / metadata
```

### `occurred_at` vs `recorded_at`

این دو عمداً جدا هستند. در offline mode، event ممکن است ساعت 10 رخ دهد و ساعت 11 به server برسد. ترتیب domain بر اساس timestamp خام به‌تنهایی تعیین نمی‌شود.
`occurred_at` از client می‌تواند به‌عنوان source metadata ثبت شود، اما clock دستگاه authority نهایی برای ordering یا security-sensitive decisions نیست.

### Event Idempotency

برای eventهای قابل‌تکرار:

```text
same idempotency key + same semantic payload
→ one domain effect
```

اگر payload ناسازگار باشد:

```text
same idempotency key + different payload
→ explicit integrity conflict
```

### Event Ordering

سه سطح ordering از هم جدا می‌شوند:

```text
Global order          = not assumed
Aggregate order       = when domain requires
Causal order          = via causation_id / sequence when needed
```

سیستم نباید برای correctness به global total ordering وابسته شود.

### Event → Evidence Mapping

برخی eventها Evidence بالقوه تولید می‌کنند، اما mapping باید explicit باشد:

```text
answer_submitted
  └→ Evidence candidate
       ├→ accepted as Evidence
       ├→ ignored as telemetry
       └→ rejected / invalid
```

برای هر Evidence ساخته‌شده از Event داخلی، `source_event_id` باید قابل‌ردگیری باشد.

### Event → Domain State Mapping

Domain Eventهایی مثل:

```text
learning_state_changed
mastery_evaluated
learning_decision_made
unlock_granted
```

باید به record/state مشخص قابل‌اشاره باشند. Event صرفاً log نمایشی نیست.

### At-least-once vs Exactly-once

برای V1، semantics باید **at-least-once delivery + idempotent processing** را فرض کند؛ exactly-once در transport نباید requirement دامنه باشد.

### Event Schema Evolution

- event schema version مستقل از Product version است.
- event قدیمی نباید با تغییر code تاریخی rewrite شود.
- consumer جدید باید بتواند versionهای قبلی را handle یا migrate کند.
- حذف event type بدون migration policy مجاز نیست.

### Event Payload Principle

Payload باید به اندازه‌ای باشد که event بدون coupling شدید قابل‌تفسیر باشد، اما duplicate کردن کل domain object در هر event مجاز نیست.

اصل:

> **Event carries what changed/happened; Domain Record carries current truth.**

### Event Privacy

Eventهای telemetry نباید بی‌دلیل PII یا child-sensitive data تکراری حمل کنند. برای داده‌های حساس باید reference/tokenization یا payload حداقلی در نظر گرفته شود.

### Outbox / Publication Principle

در صورتی که domain change و event publication هر دو transactional باشند، باید از یک الگوی قابل‌اعتماد برای جلوگیری از «state تغییر کرد ولی event گم شد» استفاده شود؛ انتخاب Outbox/queue/database mechanics در Architecture باز است.

### Auditability Matrix

| Event / Record | باید بتوانیم چه چیزی را بفهمیم؟ |
|---|---|
| Evidence Created | چه چیزی، برای چه کودک/Skill، از کجا و چه زمانی ثبت شد؟ |
| Interpretation Changed | چه interpretation قبلی supersede شد و چرا؟ |
| State Changed | چه input/policyی باعث تغییر شد؟ |
| Mastery Evaluated | کدام evidence set و contract version استفاده شد؟ |
| Decision Made | چرا این candidate انتخاب شد؟ |
| Plan Changed | چه کسی/چه policyی آن را تغییر داد؟ |
| Teacher Override | چه کسی، روی چه scopeی، با چه reasonی override کرد؟ |
| Unlock Granted | کدام milestone/rule آن را مجاز کرد؟ |

### Data / Event Model Gate

برای خروج از این مرحله، این موارد باید canonical باشند:

- immutable vs mutable data
- identity and versioning rules
- aggregate / ownership boundaries
- Evidence / Interpretation storage semantics
- Assignment / Assignment Instance separation
- Projection rebuildability
- event envelope
- idempotency semantics
- causal / aggregate ordering
- offline sync semantics
- auditability
- privacy boundary for event payloads

**Status:** `LOCKED` در semantics؛ physical schema، indexes، partitioning، queue/transport، transaction strategy و storage engine `OPEN`.

## 11.7A Data / Event Model Audit Findings — ممیزی این مرحله

### Resolved / Locked

1. **Domain State ≠ Event ≠ Projection** — event log جای domain truth را نمی‌گیرد.
2. **Evidence ≠ telemetry** — event فقط در صورت explicit mapping می‌تواند Evidence بسازد.
3. **Immutable learning history** — correction با validity/revision انجام می‌شود، نه overwrite.
4. **Identity separation** — Principal/Account از Learning Identity جداست.
5. **Mission terminology** — Mission اصطلاح محصولی و Mission Instance runtime entity canonical است.
6. **Assignment separation** — Shared Intent از per-child execution جداست.
7. **Versioned policy** — Mastery / Progression / Decision policy بدون نسخه تاریخی معتبر نیست.
8. **Reproducible decisions** — Decisionهای high-impact به input state/evidence/constraint/policy references متصل‌اند.
9. **At-least-once + idempotent semantics** — exactly-once transport شرط domain نیست.
10. **Offline ordering** — device timestamp به‌تنهایی authority نیست.

### Deferred / Open by design

- table/collection schema
- index design
- partitioning/sharding
- transaction boundaries
- event broker / queue choice
- snapshot frequency
- cache strategy
- API representation
- storage engine

### Critical anti-patterns — مجاز نیست

```text
Telemetry → directly updates Learning State
Event timestamp → global truth ordering
Last write wins → overwrite learning truth
Projection → independent source of truth
Content edit in place → changes historical Evidence meaning
Teacher override → deletes previous Decision/Evidence
Duplicate delivery → duplicate mastery/unlock
PII copy → into every event/evidence payload
```

## Event Model

### Experience events

```text
session_started
question_viewed
answer_submitted
hint_opened
recovery_started
mission_completed
report_opened
assignment_sent
subscription_started
subscription_renewed
```

دسته‌بندی طبق 11.7: `session_started / question_viewed / answer_submitted / hint_opened / recovery_started / report_opened` → Runtime / Telemetry (و فقط با mapping صریح منبع Evidence)؛ `mission_completed / assignment_sent` → Domain Event؛ `subscription_started / subscription_renewed` → Product / Billing / Administrative (Category 4).

### Learning Engine events

```text
evidence_created
evidence_validity_changed
evidence_interpreted
interpretation_superseded
error_hypothesis_created
error_hypothesis_updated
learning_state_changed
mastery_evaluated
retention_evaluated
learning_decision_made
learning_decision_superseded
learning_plan_created
learning_plan_superseded
milestone_reached
unlock_granted
assignment_instance_started
assignment_instance_completed
teacher_observation_recorded
teacher_override
content_version_used
```

`mastery_rechecked` می‌تواند به‌عنوان نوع/attribute اجرای `mastery_evaluated` ثبت شود؛ event مستقل برای آن الزام مفهومی ندارد.

### Lifecycle / Governance events — نام‌های canonical

```text
relationship_activated / relationship_suspended / relationship_resumed / relationship_expired / relationship_removed
relationship_scope_changed
content_version_state_changed / content_version_quarantined / content_version_quarantine_lifted
mission_instance_started / mission_instance_abandoned
session_completed / session_interrupted / session_resumed / session_abandoned
encounter_presented / encounter_responded / encounter_evaluated / encounter_skipped
assignment_created / assignment_closed / assignment_cancelled
assignment_instance_recheck_required / assignment_instance_closed / assignment_instance_cancelled
teacher_intervention_proposed / teacher_intervention_accepted / teacher_intervention_dismissed
teacher_intervention_recheck_required / teacher_intervention_closed
constraint_activated / constraint_expired / constraint_revoked
error_hypothesis_closed          # REJECTED / SUPERSEDED / EXPIRED
arbitration_resolved             # outcome: SELECTED / CONFLICT / DEFERRED
learning_plan_activated / learning_plan_completed / learning_plan_cancelled
progression_eligibility_reached
consent_changed / delegation_changed
sensitive_data_accessed / break_glass_access_used / identity_merge_completed
```

هر transition در State Machine Registry باید یک event canonical داشته باشد؛ این فهرست فقط قرارداد نام‌گذاری است و اینکه کدام eventها در V1 پیاده شوند `OPEN` است (برش V1 هنوز تعیین نشده).

هر event باید یک envelope استاندارد داشته باشد:

`event_id + event_type + schema_version + occurred_at + recorded_at + actor/source + subject/reference + correlation_id + causation_id`

`learning_identity_id` (به‌جای `child_id`) برای eventهای child-scoped معمولاً لازم است، اما اجباری برای تمام eventهای account/billing/administrative نیست. eventهای تصمیم‌گیری باید reason/policy reference و provenance قابل‌بازسازی داشته باشند.

## 11.8 Identity / Relationship / Permission Contract — قرارداد هویت، رابطه و دسترسی

این بخش مرز بین authentication، identity، relationship، authorization و data visibility را مشخص می‌کند. هدف، تبدیل Principleهای Privacy/Safety و Teacher Context به semantics قابل‌پیاده‌سازی است؛ جزئیات provider/SDK/DB در Architecture باز می‌مانند.

### 11.8.1 پنج مفهوم مستقل

```text
Authentication
= آیا این Principal واقعاً همان actor ادعاشده است؟

Principal / Account
= actor قابل‌احراز در platform

Learning Identity
= سابقه یادگیری canonical کودک

Learning Relationship
= edge بین Principal/Actor و Learning Identity با scope/purpose/lifecycle

Authorization
= آیا این action روی این resource در این scope و purpose مجاز است؟

Data Visibility
= دقیقاً کدام representation از data به actor نشان داده می‌شود؟
```

> **Role به‌تنهایی permission نیست. Relationship به‌تنهایی visibility نیست.**

### 11.8.2 Canonical Authorization Input

تصمیم دسترسی باید مفهوماً از این ورودی‌ها ساخته شود:

```text
Principal
+ Relationship
+ Relationship Status
+ Scope / Context
+ Requested Action
+ Resource Type / Resource Owner
+ Data Sensitivity
+ Purpose
+ Policy / Consent / Delegation State
+ Current Time / Validity Window
→ Authorization Decision
```

خروجی canonical:

```text
ALLOW
DENY
ALLOW_WITH_REDACTION
REQUIRE_AUTHORIZATION / CONSENT
```

در V1، default باید **deny** باشد مگر policy صریحاً دسترسی را مجاز کرده باشد.

### 11.8.3 Relationship ≠ Capability

Relationship باید نشان دهد:

```text
Actor
→ Child / Learning Identity
→ Role
→ Context / Scope
→ Purpose
→ Lifecycle
```

Capabilityها از Relationship + Policy مشتق می‌شوند و نباید صرفاً به‌صورت پرچم‌های آزاد توسط UI تنظیم شوند.

نمونه Capabilityها:

```text
view_own_learning
view_child_progress_summary
view_child_detailed_learning_view
create_assignment
write_observation
modify_assignment_boundary
override_current_plan
view_class_signal
manage_relationship
manage_account
manage_parent_constraint
manage_consent
merge_identity
use_break_glass_access
export_sensitive_data
author_content
review_content
approve_content_gate
```

وجود یک Capability در یک role به معنی دسترسی global نیست؛ scope همیشه بخشی از تصمیم است.

Capabilityهای حساس (`merge_identity`، `use_break_glass_access`، `export_sensitive_data` و `manage_consent`) مشمول Sensitive-operation policy بخش 11.9 هستند.

### 11.8.4 Visibility Tiers — V1

داده Learning باید حداقل این سطح‌ها را از هم جدا کند:

| Tier | نمونه | قاعده اولیه |
|---|---|---|
| T0 — Public/Product | محتوای عمومی، توضیح روش | بدون child data |
| T1 — Own Experience | Journey، Encounter outcome، progress کودک برای خودش | فقط subject/child خودش |
| T2 — Summary Learning View | Mastered/Building/Next، aggregate progress | بر اساس Relationship + Scope |
| T3 — Detailed Learning Data | Evidence summaries، error patterns، mastery details | نیازمند purpose و authority مشخص |
| T4 — Sensitive / Source Data | raw observation، private teacher note، consent/safety record | محدود، حداقل‌گرایانه، audit‌شده |
| T5 — Security / Governance | credential، consent record، security audit | فقط authority تخصصی و purpose مجاز |

### 11.8.5 Source Visibility Rule

یک Evidence یا Observation لزوماً به همان صورت خام برای تمام Actorها قابل‌نمایش نیست.

```text
Raw Source Record
       ↓ policy / redaction
Context-specific Representation
       ↓
Child / Parent / Teacher View
```

مثلاً Teacher Observation می‌تواند برای Learning Engine استفاده شود، اما raw note آن نباید خودکار در Parent View نمایش داده شود؛ Parent باید representation متناسب با policy دریافت کند. بالعکس، Parent Report یا parent constraint نیز نباید خودکار به raw teacher evidence تبدیل شود.

### 11.8.6 Role / Scope Defaults — V1 semantic baseline

#### Child

- مجاز به اجرای تجربه خودش.
- مجاز به مشاهده progress/feedback طراحی‌شده برای خودش.
- نباید raw Teacher/Parent/Safety records را صرفاً به‌دلیل داشتن Learning Identity ببیند.

#### Parent / Guardian

- در صورت Relationship معتبر، دسترسی به Parent-facing Aggregate Learning View.
- مدیریت Parent Constraints و تنظیمات مجاز.
- دسترسی به raw teacher notes یا سایر source records فقط در صورت policy صریح؛ default آن **خیر**.

#### Teacher

- فقط Childهای داخل authorized Class/Context را می‌بیند.
- می‌تواند Shared Assignment ایجاد کند و Teacher Observation ثبت کند.
- access خارج از scope کلاس/رابطه نباید صرفاً با role=Teacher ممکن باشد.
- دیدن raw source data باید purpose و policy مشخص داشته باشد؛ summary برای بسیاری از use caseها کافی است.

#### Tutor / Learning Center

- scope باید explicit باشد و از relationship/context مشتق شود.
- access پایان رابطه را دنبال می‌کند و نباید به‌صورت permanent global grant باقی بماند.

#### Content Author / Reviewer / QA

- دسترسی به lifecycle محتوا (`DRAFT → REVIEW → QA → PILOT → ACTIVE`) فقط با capabilityهای `author_content`، `review_content` و `approve_content_gate`.
- بدون دسترسی به Learning Identity، Evidence یا Learning State کودک؛ impact analysis روی Evidence (بخش 12) فقط با purpose مشخص، دسترسی خلاصه و audit انجام می‌شود.

#### Platform / Support Admin

- دسترسی operational نباید معادل learning authority باشد.
- break-glass access فقط برای purpose مشخص، زمان محدود و audit اجباری مجاز است.
- admin نباید بدون policy صریح Learning Decision را به‌جای engine/teacher تغییر دهد.

### 11.8.7 Relationship Lifecycle and Access

```text
PENDING
→ فقط داده لازم برای invitation / relationship setup

ACTIVE
→ access طبق scope/policy

SUSPENDED
→ new learning-management actions blocked؛ access موجود نیز طبق policy محدود می‌شود

EXPIRED / REMOVED
→ access جدید قطع می‌شود؛ historical Learning History حفظ می‌شود مگر retention/deletion policy دیگری لازم باشد
```

لغو Relationship نباید historical Evidence، Decision یا Learning Identity را حذف کند.

### 11.8.8 Assignment / Relationship Interaction

Assignment فقط زمانی قابل ایجاد یا اجراست که author دارای authority لازم در Relationship Context باشد.

```text
Teacher Relationship ACTIVE
        ↓
Authorized Context
        ↓
Assignment
        ↓
Assignment Instance per Child
```

اگر Relationship قبل از completion منقضی/حذف شود:

- Assignment Instance نباید به‌صورت silent continue کند.
- ادامه execution فقط اگر policy صریح اجازه دهد.
- historical execution و Evidence حفظ می‌شود.
- actions جدید teacher-facing باید permission check مجدد داشته باشند.

### 11.8.9 Consent / Delegation Boundary

Consent/authorization record را نباید با Relationship یکی گرفت.

```text
Relationship
= who is connected

Consent / Authorization Grant
= which additional action/data use is allowed
```

یک Relationship می‌تواند بدون grant اضافی دسترسی محدود داشته باشد و برای بعضی عملیات به authorization/consent جداگانه نیاز داشته باشد.

Delegation نیز باید explicit، scoped، time-bound و revocable باشد. delegation نباید به‌صورت inheritance نامحدود به actor بعدی منتقل شود مگر policy صریح وجود داشته باشد.

### 11.8.10 Access Audit

حداقل این accessهای حساس باید audit شوند:

- مشاهده raw/sensitive learning data
- مشاهده یا تغییر consent/authorization
- break-glass access
- تغییر Relationship scope
- تغییر capabilityهای حساس
- teacher override با اثر آموزشی
- identity merge / duplicate resolution

Audit access نباید raw child data را دوباره در payload خود کپی کند؛ reference حداقلی کافی است.

### 11.8.11 Identity Merge / Unmerge

دو Learning Identity نباید silent merge شوند.

Merge باید:

```text
Detect / Review
→ Authorize
→ Merge Operation
→ Audit Record
→ Re-link / reconcile references
→ Verify projections
```

و باید مشخص باشد آیا `unmerge` ممکن است یا خیر. در V1 اگر unmerge کامل قابل‌اعتماد نیست، merge باید operation حساس با review انسانی باشد.

### 11.8.12 Privacy Principles — Technical Semantics

- Least privilege
- Purpose limitation
- Data minimization
- Default deny
- Scoped authorization
- Separation of raw source data from user-facing projections
- No PII duplication در Event/Evidence مگر ضرورت domain
- Historical traceability بدون نگهداری بی‌هدف raw sensitive content

### 11.8.13 Permission Anti-patterns — مجاز نیست

```text
Role → blanket child access
Teacher role → all school learning history
Parent relation → raw source access to every teacher note
Relationship removal → delete Learning History
UI hiding → treated as authorization
Admin role → unrestricted learning mutation
Inherited delegation → unlimited scope/time
Capability flag in client → trusted authorization
```

### Identity / Permission Gate

برای خروج از این مرحله باید این semantics canonical باشند:

- Principal vs Learning Identity
- Relationship lifecycle
- Scope / Context boundary
- Role vs Capability
- Resource vs Data Visibility
- Default deny
- Consent / Delegation separation
- Revocation semantics
- Sensitive-data audit
- Identity merge handling

**Status:** `LOCKED` در سطح domain/security semantics؛ V1 provider = Supabase Auth، ولی token/session mechanics و جزئیات policy implementation در فاز ساخت تعیین می‌شوند.

## 11.9 Security / Privacy Implementation Boundary — مرز اجرایی امنیت و حریم خصوصی

این بخش هنوز implementation specification نیست؛ فقط مسئولیت‌ها را روشن می‌کند.

> **V1 baseline:** فقط ایران؛ ورود ساده؛ جمع‌آوری حداقل داده؛ Guest با retention موقت و policy-dependent؛ خروجی داده در V1 نیست. flow رضایت پیچیده در V1 ساخته نمی‌شود، اما الزامات child-privacy/parental-consent پیش از pilot واقعی و production باید legal review شوند.

### Authentication boundary

Authentication مسئول اثبات Principal است؛ نباید مستقیماً تصمیم Learning Authorization بگیرد.

### Authorization boundary

Authorization باید server/domain-side enforce شود؛ client/UI فقط presentation/filtering کمکی است و authority نهایی نیست.

### Data boundary

PII، Learning History، Teacher Observation، Consent/Safety و Billing باید از نظر access policy و retention قابل تفکیک باشند، حتی اگر در یک physical storage باشند.

### Secret / Token boundary

credential، refresh token و secret نباید در Learning Evidence/Event payload یا client analytics ذخیره شوند.

### Sensitive-operation policy

عملیات زیر باید re-auth / elevated policy یا حداقل audit قوی‌تر داشته باشند، بسته به threat model:

- identity merge
- permission escalation
- relationship scope change
- raw sensitive data export
- break-glass support access
- deletion/redaction

### Security failure semantics

اگر authorization service/policy lookup unavailable باشد، برای sensitive read/write نباید fail-open رخ دهد. در موارد low-risk ممکن است cache محدود policy طبق expiration استفاده شود؛ این تصمیم در Architecture جزئی می‌شود.

**Status:** `LOCKED` در اصول fail-safe و separation؛ threat model، protocol و infrastructure controls `OPEN`.

### Permission / Security Audit — v0.16

این دور مشخص کرد که Model فنی فقط با تعریف `Role` کامل نمی‌شود. پنج مرز باید مستقل باقی بمانند: Authentication، Principal، Learning Identity، Relationship و Authorization؛ سپس Data Visibility به‌صورت policy-derived تعیین شود. همچنین raw source data از user-facing projection جدا شد، Relationship lifecycle به access lifecycle متصل شد، revocation و delegation semantics تعریف شد، identity merge به operation حساس تبدیل شد و fail-safe authorization برای عملیات حساس ثبت شد.

**Status:** `LOCKED` در domain/security semantics.

## Measurement Model

### Learning
- Mastery / retention / transfer
- Repeated-error reduction
- Learning gain

### Diagnostic
- Decision quality / outcome validity
- Confidence calibration
- Information gain / Probe value
- False-positive / false-negative diagnosis when a reference label or adjudication exists

### Experience
- Mission completion
- Recovery success
- Return behavior
- Friction / drop-off

### Human workflow
- Teacher action rate
- Time-to-action
- Recheck completion
- Parent comprehension / action

هیچ metric واحدی جایگزین Learning Outcome نیست.

## Conceptual Modules

`Learning Domain / Curriculum & Skill Graph / Content & Authoring / Learning Engine / Decision & Arbitration / Progression / Experience Runtime / Identity & Permissions / Teacher Intervention / Analytics`

مرز دقیق moduleها در مرحله Architecture مشخص می‌شود؛ فعلاً source of truth دامنه، قراردادهای بالاست.

## V1 Technical Architecture — معماری فنی بسته‌شده

> هدف این بخش انتخاب یک معماری **ساده، قابل‌توسعه و کم‌ریسک** برای V1 است. در revision `v0.21-MA` معماری Clientها از Web-first به Multi-Client تغییر کرده، بدون اینکه Shared Learning Core به Clientها fork شود.

### Architecture Style

**Modular Monolith + Multi-Client**

```text
 Public Web       Child Mobile App       Parent Web
      │                   │                    │
      ├───────────────┬───┴────────────┬───────┤
      │               │                │       │
      └───────────────▼────────────────▼───────┘
                  Shared Platform
                       │
                Application Core
                       │
             ┌─────────┼─────────┐
             │         │         │
          Learning   Content   Identity
             │         │         │
             └─────────┼─────────┘
                       │
             PostgreSQL + Storage
```

یک repository، یک Web application، یک Mobile application، یک database و module boundary داخل codebase. برای Grade یا Client سرویس مستقل در V1 ساخته نمی‌شود.

### Technology Stack

| لایه | انتخاب V1 |
|---|---|
| Language | **TypeScript** |
| Web | **Next.js + React + App Router** |
| Mobile | **React Native + Expo + Expo Router**؛ TypeScript؛ Android/iOS؛ New Architecture؛ EAS برای build/release |
| Styling | Shared design tokens؛ implementation جدا برای Web/Mobile در صورت نیاز |
| Web Server | Next.js Server Components + Server Actions / Route Handlers در محل نیاز |
| Mobile Transport | **Versioned HTTPS API** روی Application Core |
| Database | **PostgreSQL** |
| Auth | **Supabase Auth** |
| File / Media | **Supabase Storage** |
| DB Security | **Postgres RLS + application authorization** |
| Runtime | **Node.js 24 LTS** |
| Web E2E | **Playwright** |
| Mobile testing | implementation detail؛ ابزار باید lifecycle، offline و deep-link flows را پوشش دهد |
| Validation | Schema validation در مرزهای ورودی |
| ORM | **عدم الزام ORM در V1**؛ SQL migrations + generated DB types + repository layer |
| API style | REST/JSON-style Route Handlers برای Mobile؛ **GraphQL ندارد** |
| Deployment | Managed Web hosting + Supabase + Mobile store distribution؛ provider نهایی بعد از region/legal review |

### Primary Coding Language

```text
TypeScript = زبان اصلی Web / Mobile / shared modules
SQL        = schema / migration / RLS / queryهای لازم
Python     = فقط برای research / analytics / ML آینده، نه core runtime V1
```

### Project Structure — Logical

```text
math-platform/
├── apps/
│   ├── web/
│   └── mobile/
├── modules/
│   ├── learning/
│   ├── content/
│   ├── diagnostic/
│   ├── session/
│   ├── progression/
│   ├── identity/
│   └── notifications/
├── packages/
│   ├── domain-contracts/
│   ├── api-contracts/
│   ├── design-tokens/
│   └── grade-packages/
├── supabase/
│   ├── migrations/
│   └── tests/
├── tests/
│   ├── unit/
│   ├── web-e2e/
│   └── mobile/
└── content/
    └── grades/
        ├── grade-1/
        ├── grade-2/
        ├── grade-3/
        ├── grade-4/
        ├── grade-5/
        └── grade-6/
```

این ساختار logical است؛ layout فیزیکی repository در Implementation Setup انتخاب می‌شود، ولی module boundaries باید حفظ شوند.

### Backend Boundary

```text
Web / Mobile Client
        ↓
Transport / API Boundary
        ↓
Application Service
        ↓
Learning / Domain Logic
        ↓
Repository
        ↓
PostgreSQL / Storage
```

منطق آموزشی نباید مستقیماً داخل componentهای UI، Mobile screenها یا queryهای پراکنده نوشته شود.

### Database Baseline

در V1 مدل relational است. حداقل خانواده داده‌ها: account، learning identity، relationship، class، grade package، skill graph، station، content، diagnostic، session، attempt، answer، evidence، learning state، decision/plan، progression، event، audit و client installation/push metadata.

موجودیت‌های بسیار پیشرفته مثل ArbitrationResult، Delegation و مدل کامل Aggregate State فقط در صورت نیاز واقعی وارد schema اجرایی می‌شوند.

### Multi-Client API Boundary

Mobile باید از API contract رسمی استفاده کند. Web می‌تواند Server Actions/Route Handlers داشته باشد، اما آن‌ها باید همان Application/Domain Services را مصرف کنند.

```text
Child Mobile
     ↓
/api/v1
     ↓
Application Service
     ↓
Same Learning Engine
```

### Offline Boundary

**Server source of truth است.**

Child Mobile می‌تواند:

- assetهای لازم را cache کند
- interaction جاری را تا حد لازم local نگه دارد
- actionهای idempotent را queue کند
- Session را بعد از قطع کوتاه اینترنت resume کند

اما offline mode به‌تنهایی Learning Truth، Mastery، Station Pass یا authorization را نهایی نمی‌کند.

### Push / Notification Boundary

Push Notification یک transport capability است. تصمیم آموزشی همچنان در Learning Engine/Policy layer می‌ماند. Token و subscription data نباید وارد Evidence یا raw event payload شوند.

### Security Baseline

- Default Deny
- Least Privilege
- Server-side authorization
- RLS برای داده‌های حساس و child-scoped
- عدم نگهداری service-role secret در client
- audit برای accessهای حساس
- data minimization
- App token / session lifecycle محافظت‌شده
- retention/deletion policy قبل از Production

### Testing Baseline

حداقل تست‌های V1:

```text
Unit
 ├── adaptive rules
 ├── Station Pass
 ├── progression
 ├── diagnostic scoring
 ├── authorization policies
 └── idempotency / resume

Web E2E
 ├── Guest Diagnostic
 ├── Register / Continue
 ├── Parent progress
 ├── Teacher class
 └── Admin operations

Mobile
 ├── onboarding
 ├── station flow
 ├── offline queue
 ├── duplicate submission
 ├── resume
 ├── deep link
 └── push permission
```

### Architecture Decisions Explicitly Rejected for V1

- Microservices
- Kafka / Event Bus پیچیده
- GraphQL
- Kubernetes
- Service Mesh
- Graph Database
- Full CQRS
- Full Event Sourcing
- ML Recommendation Engine
- LLM Tutor به‌عنوان مغز V1
- Separate backend per client
- Separate database per grade/client
- Generic multi-platform rules engine

**Status:** `CLOSED FOR V1 BLUEPRINT` در سطح architecture؛ schema/API/infrastructure detail در specificationهای اجرایی بعدی تعیین می‌شوند.

</div>

<div dir="rtl" align="right">

# 12. Content Operating System — تولید و کیفیت محتوا

```text
Skill / Objective
→ Author
→ Review
→ QA
→ Pilot
→ Analytics
→ Revision / Retirement
```

### Quality gates

هر Question/Encounter باید حداقل این چهار QA را عبور دهد:

- Mathematical correctness
- Pedagogical validity
- Age / language appropriateness
- Diagnostic validity when used diagnostically

برای Persian-native experience، QA باید RTL، notation، number format، wording و ambiguity را نیز پوشش دهد.

> سؤال تولیدشده ولی اندازه‌گیری‌نشده، دارایی کامل محصول نیست.

هر Question/Encounter باید provenance، review status، content version و داده عملکرد داشته باشد.

### Content Failure Policy

اگر یک artifact بعداً مشکوک یا معیوب شناخته شد:

```text
Flag
→ Quarantine
→ Impact analysis on evidence
→ Revision
→ Revalidation
```

Historical evidence حذف نمی‌شود؛ ارتباط آن با نسخه معیوب باید قابل‌ردگیری باشد.

</div>

<div dir="rtl" align="right">

# 13. Product Guardrails — مرزهای محصول

## فعلاً نمی‌سازیم / محور نمی‌کنیم

- شبکه اجتماعی کودک
- چت عمومی کودک
- leaderboard عمومی
- streak تنبیهی
- فشار خرید به کودک
- بازی مستقل با ریاضی تزئینی
- کتابخانه عظیم ویدئو
- AI Tutor عمومی به‌عنوان مغز V1
- اقتصاد بازی چندلایه و پیچیده

## Experiment Guardrails

همه چیز قابل A/B test نیست. تغییرات مربوط به:

- Mathematical correctness
- Privacy / Safety
- Evidence integrity
- Mastery logic

باید قبل از rollout کامل، validation مشخص داشته باشند.

## Accessibility & Persian-native Product Quality

Accessibility و Persian-native experience بخشی از کیفیت محصول‌اند، نه polish نهایی. حداقل باید برای typography، RTL، notation، reading load، color dependence، motor interaction و alternative representation معیار داشته باشیم.

## Conceptual Core vs V1

| حوزه | هسته مفهومی | V1 | بعداً |
|---|---|---|---|
| Skill Graph | کامل و قابل‌گسترش | ۶۴ Skill پایه اول + نگاشت به ۲۵ Station | پوشش پایه‌های ۲ تا ۶ |
| Diagnosis | مستمر | rule-based ساده | مدل عمیق‌تر |
| Teacher Context | چندزمینه‌ای | یک Class محدود | School / Center |
| Teacher Control | سه سطح | ساده‌سازی‌شده | کامل |
| Learning Orchestration | چندمنبعی | arbitration حداقلی | conflict resolution کامل |
| Class Diagnosis | concept | سیگنال ساده | تحلیل عمیق |
| Math Passport | طولی | identity در معماری | تجربه کامل |
| Game Journey | personal | یک مسیر محدود | Worldهای بیشتر |
| Skill ↔ Station | Skill-driven learning + Station-driven navigation | mapping پایه اول | تعمیم به پایه‌های بعد |
| Mastery Model | family-specific + evidence-based | Station Pass موقت ۴/۵ جدا از Mastery | کالیبراسیون family-specific |
| ثبت‌نام و رضایت | جداسازی Consent / Delegation | flow ساده V1؛ تصمیم حقوقی provisional | Consent پیشرفته در صورت نیاز |
| Free Diagnostic | Assessment-led entry | Guest با retention موقت و policy-dependent | ذخیره‌ی بلندمدت و اتصال به حساب |
| دسترسی به داده | Visibility tiers / Export | مشاهده‌ی عملکرد؛ بدون خروجی | خروجی داده در صورت نیاز |
| قراردادهای 11.1–11.9 | کامل | مدل داده‌ی ساده | پیاده‌سازی تدریجی |

> **Conceptual richness ≠ MVP complexity.**

</div>

<div dir="rtl" align="right">

# 14. Competitive Positioning — زمین رقابت

این بخش benchmark است، نه رتبه‌بندی.

| Benchmark | سیگنال | Implication |
|---|---|---|
| AnyMath | game + pet + progression + short practice | game UI به‌تنهایی مزیت نیست |
| Prodigy | world + quest + adaptive + teacher reports | game باید learning-driven باشد |
| IXL | diagnostic + recommendation + longitudinal progress | continuous diagnosis و next-step مهم‌اند |
| DreamBox | continuous assessment + adaptive pathway | assessment باید داخل مسیر باشد |
| Maths-Whizz | adaptive tutoring + implementation support | teacher workflow و implementation مهم‌اند |
| Khan Academy Kids | child + family + teacher ecosystem | multi-role architecture مهم است |
| محصولات محتوایی ایرانی | محتوای وسیع + آزمون + والد | رقابت بر سر حجم محتوا اولویت نیست |

### جایگاه مورد انتظار

> **Learning Intelligence + Personal Journey + Teacher Intervention + Persian-native Experience**

</div>

<div dir="rtl" align="right">

# 15. Status of Decisions — تصمیم‌های مهم

| موضوع | وضعیت |
|---|---|
| محصول = ریاضیات کل دبستان؛ پایه فقط context/filter | `LOCKED` | |
| Skill Graph هسته است | `LOCKED` |
| V1: مسیر تجربه = Station؛ واحد تصمیم‌گیری = Skill | `LOCKED` |
| Skill ↔ Station mapping: هر Station روی یک یا چند Skill | `LOCKED` در contract؛ mapping artifact پایه اول جداست |
| Diagnosis مستمر است | `LOCKED` |
| Error ابتدا Hypothesis است | `LOCKED` |
| Learning Decision قبل از Question/Encounter Selection است | `LOCKED` |
| Learning Role و Experience Form از هم جدا هستند | `LOCKED` |
| Mastery چندبعدی و evidence-based است | `PRINCIPLE` |
| Mastery Contract family-specific است | `LOCKED` در سطح قرارداد؛ threshold نهایی `HYPOTHESIS` |
| Station Pass = 4/5 در دو Check جدا به‌عنوان rule موقت V1 | `HYPOTHESIS / TEMPORARY OVERRIDE` |
| Event ≠ Evidence | `LOCKED` |
| Evidence fact immutable؛ validity overlay جداست | `LOCKED` |
| Error Hypothesis نوع تخصصی Interpretation است | `LOCKED` در semantics |
| Mastery Stateها vocabulary مشترک‌اند، نه universal ladder | `LOCKED` در semantics |
| Assignment و Assignment Instance از هم جدا هستند | `LOCKED` در semantics |
| Learning Truth verdict واحد نیست | `PRINCIPLE` |
| State می‌تواند context-specific باشد | `PRINCIPLE` |
| Aggregate Learning View باید provenance را حفظ کند | `PRINCIPLE` |
| Child Learning Identity چند Context را پشتیبانی می‌کند | `PRINCIPLE` |
| Teacher باید ارزش مستقیم بگیرد | `LOCKED` |
| Teacher Assignment حول Shared Objective است | `PRINCIPLE` |
| Teacher Control bounded است | `PRINCIPLE` |
| Teacher override یک evidence قبلی را حذف نمی‌کند | `LOCKED` |
| Progression به learning evidence و milestone متصل است | `LOCKED` |
| Mastery Evaluation واسط traceable بین evidence و current mastery state است | `LOCKED` در semantics |
| Mission runtime instance از Content Artifact جداست | `LOCKED` در semantics |
| Privacy/Safety از architecture شروع می‌شود | `LOCKED` |
| Client Architecture = Public/Parent/Teacher/Admin Web + Child Mobile App؛ PWA در Web یک enhancement است و Child App جایگزین اصلی Child Experience است | `LOCKED (V1)` |
| AI Tutor عمومی مغز V1 نیست | `LOCKED` |
| Assessment/Feedback باید به action متصل شود | `PRINCIPLE` |
| Constraint هدف آموزشی نیست؛ بر candidate/plan اثر می‌گذارد | `LOCKED` در semantics |
| Arbitration conflict باید explicit و قابل‌ردگیری باشد | `LOCKED` در semantics |
| Decision canonical است؛ Recommendation source of truth مستقل نیست | `LOCKED` در semantics |
| Teacher implementation burden بخشی از product design است | `PRINCIPLE` |
| Evidence باید content version داشته باشد وقتی Evidence از artifact داخلی آمده است | `LOCKED` |
| Historical evidence حفظ می‌شود؛ weight ممکن است decay کند و validity overlay تغییر کند | `LOCKED` در semantics |
| V1 فقط برای ایران است | `LOCKED` (V1) |
| V1 فقط پایه اول است | `LOCKED` (V1) |
| V1 = Modular Monolith / Next.js / React / TypeScript / PostgreSQL + Mobile Client روی Shared Platform | `LOCKED` |
| V1 = Supabase Auth + Storage + Postgres RLS برای Web و Mobile | `LOCKED` |
| V1 = Node.js 24 LTS | `LOCKED` |
| V1 = Rule-Based adaptation، بدون AI/ML core | `LOCKED` |
| ثبت‌نام باز و ساده؛ flow رضایت پیچیده ساخته نمی‌شود | `PROVISIONAL / LEGAL REVIEW REQUIRED` |
| یک حساب ساده V1؛ Account و Learning Identity در semantics جدا هستند | `LOCKED` در Product/Domain |
| Free Diagnostic با Guest؛ retention موقت و policy-dependent | `PROVISIONAL / LEGAL REVIEW REQUIRED` |
| معلم با درخواست و تأیید ادمین یا افزودن مستقیم ادمین | `LOCKED` (V1) |
| خروجی داده در V1 نیست؛ فقط مشاهده‌ی عملکرد | `LOCKED` (V1) |
| Assignment Instance: COMPLETED به CLOSED یا RECHECK_REQUIRED می‌رود | `LOCKED` در semantics |
| eventهای child-scoped با `learning_identity_id` مشخص می‌شوند | `LOCKED` در semantics |
| قراردادهای 11.1–11.9 مرجع فاز بعدند، نه شرط V1 | `PRINCIPLE` |
| محتوای V1 از کتاب C105 و به همان ترتیب بخش‌ها | `LOCKED` (V1) |
| هر بخش کتاب یک ایستگاه با چهار مرحله (آموزش، تمرین، آزمون، نتیجه) | `LOCKED` (V1) |
| رابط کودک بدون نیاز به خواندن (صوت، نماد، تصویر) | `LOCKED` (V1) |
</div>

<div dir="rtl" align="right">

# 16. Active Hypotheses — فرضیه‌های فعال

| فرضیه | روش سنجش |
|---|---|
| Parent Constraintهای ثبت‌شده بدون افت learning outcome friction را کم می‌کنند | session experiment |
| Child Pull بعد از اولین Mission معنادار شکل می‌گیرد | return behavior + learning milestone |
| Recovery بهتر از retry ساده است | mastery + recovery success + return |
| World Unlock وقتی به milestone یادگیری وصل باشد از reward عددی معنادارتر است | UX + learning cohort |
| Action Queue adoption و intervention quality معلم را بهتر می‌کند | pilot + time-to-action + recheck |
| یک Assignment با مسیرهای متفاوت برای معلم ارزش دارد بدون از دست رفتن Shared Outcome | teacher pilot |
| Context-specific State و Aggregate View هم‌زمان قابل‌فهم‌اند | multi-context prototype |
| Teacher Control bounded تعادل مناسبی میان agency و consistency می‌دهد | teacher usability + override rate |
| Diagnostic Budget دقت را با اصطکاک کم حفظ می‌کند | decision-quality/session experiment |
| Mastery Contract family-specific از threshold واحد reliableتر است | learning experiment |
| Evidence decay برای retention بهتر از reset/overwrite تاریخ است | longitudinal cohort |
| Math Passport با Visible Progress value واقعی ایجاد می‌کند | longitudinal cohort |
| Experience personalization علاوه بر content value ارزش مستقل دارد | presentation/choice test |
| Rich Skill Model با implementation ساده قابل‌اجراست | engine prototype |
| workflow ساده و onboarding سبک adoption معلم را بالا می‌برد | teacher pilot |
| پیام کم‌حجم برای والد مناسب‌تر از اعلان‌های متعدد است | parent cohort |
| dosage کوتاه و قابل‌تطبیق برای محصول ما مناسب‌تر از dosage ثابت است | retention + learning experiment |
| Learning Plan در V1 فقط تا حد traceability لازم است و abstraction اضافی ایجاد نمی‌کند | prototype complexity test |
| Event → Evidence explicit mapping، false evidence ناشی از telemetry را کاهش می‌دهد | event/evidence audit + learning quality review |
| Evidence Quality جدا از Interpretation Confidence، calibration بهتری می‌دهد | calibration experiment |
| Assignment Instance مدل multi-child workflow را بدون تغییر Shared Outcome نگه می‌دارد | teacher pilot |
| AT-RISK به‌عنوان overlay بهتر از demotion خودکار، continuity مسیر کودک را حفظ می‌کند | retention/recovery cohort |
| Candidate generation قبل از Arbitration، decision consistency را بهتر از rule مستقیم تضمین می‌کند | decision audit / simulation |
| Explicit conflict handling از silent relaxation constraintها بهتر است | teacher/system pilot |
| Relationship-scoped authorization بهتر از role-only access برای جلوگیری از overexposure است | permission audit + usability test |
| Projection-based data visibility نیاز کاربران را با exposure کمتر به raw source برآورده می‌کند | role-based prototype + access audit |
| Revocation سریع Relationship بدون حذف history از نظر workflow قابل‌فهم و ایمن است | relationship lifecycle pilot |

</div>

<div dir="rtl" align="right">

# 17. Open Questions — پرسش‌های بازِ غیرمسدودکننده

> در v0.21، **طرح کلی محصول و معماری سطح‌بالای V1 بسته شده‌اند**. موارد زیر برای شروع ساخت core مانع نیستند و در Prototype / Grade-1 Content / Pilot / Business تصمیم‌گیری می‌شوند.

## Grade 1 Content

- mapping دقیق ۶۴ Skill به ۲۵ Station اکنون در `math_learning_product_grade1_skill_graph_v0_27.md` موجود است؛ taxonomy و mapping تا review آموزشی `PROVISIONAL / DERIVED` هستند.
- قالب نهایی فعالیت‌های دیجیتال هر Skill
- مجموعه دقیق Placement Probeها؛ فرض اولیه حدود ۹ Probe
- asset و voice pack هر Station
- calibration اولیه Station Pass

## Child UX / Game

- نام و شخصیت‌ها
- Art Direction و World theme
- exact session dosage
- reward / unlock economy
- Activation و milestoneهای Day 0–90

## Parent / Teacher

- workflow نهایی Parent View
- روش Join دانش‌آموز به Class
- جزئیات visibility معلم
- wedge اولیه معلم: Classroom / Tutor / Center

## Business / Growth

- مدل تجاری
- acquisition channel
- pricing / trial / renewal

## Legal / Privacy

- final child-privacy / parental-consent review
- Guest retention و deletion policy نهایی
- وضعیت حقوقی استفاده از تصاویر/محتوای C105
- data-region / deployment policy نهایی

## Implementation Details

- schema نهایی PostgreSQL، indexها و migrations
- RLS policy دقیق هر جدول
- Server Action / Route Handler contracts
- design system و component inventory
- unit test runner دقیق

> این موارد **معماری V1 را تغییر نمی‌دهند** مگر اینکه prototype، pilot یا legal review نتیجه‌ای بدهد که نیازمند بازنگری باشد.

</div>

<div dir="rtl" align="right">

# 18. Research Evidence — منابع کلیدی

> این بخش فقط **منبع + implication** را نگه می‌دارد. جزئیات استدلال در بدنه سند تکرار نمی‌شود.

## Learning

- **E-L1 — IES / WWC: Assisting Students Struggling with Mathematics** — آموزش نظام‌مند، بازنمایی‌ها، محور اعداد و حل مسئله.  
  https://ies.ed.gov/ncee/wwc/PracticeGuide/26
- **E-L2 — IES / WWC: Organizing Instruction and Study** — spacing، interleaving و worked examples.  
  https://ies.ed.gov/ncee/wwc/PracticeGuide/1
- **E-L3 — IES: Interleaved Mathematics Practice** — مرور و interleaving.  
  https://ies.ed.gov/use-work/awards/interleaved-mathematics-practice
- **E-L4 — IES / WWC: Fractions Instruction** — progression مفهومی کسر و number line.  
  https://ies.ed.gov/ncee/WWC/PracticeGuide/15/Published
- **E-L5 — IES / WWC: Mathematical Problem Solving** — بازنمایی و حل مسئله.  
  https://ies.ed.gov/ncee/wwc/PracticeGuide/16
- **E-L6 — 2025 Systematic Review: Formative Assessment in Mathematics** — 45 مطالعه؛ نتایج mixed؛ مرور بر learning intentions، eliciting evidence، interpretation/feedback و adaptation تأکید دارد.  
  https://link.springer.com/article/10.1007/s11858-025-01696-x

## Diagnostic

- **E-D1 — IES: EM2** — probeهای هدفمند برای misconception.  
  https://ies.ed.gov/use-work/awards/eliciting-mathematics-misconceptions-em2-cognitive-diagnostic-assessment-system
- **E-D2 — IES: mCLASS:Math** — screening و progress monitoring.  
  https://ies.ed.gov/use-work/awards/mclassmath-development-and-analysis-integrated-screening-progress-monitoring-and-cognitive
- **E-D3 — IES: Adaptive Testing for Mathematics Difficulties** — assessment تطبیقی و item bank.  
  https://ies.ed.gov/use-work/awards/adaptive-testing-system-diagnosing-sources-mathematics-difficulties

## Game / Motivation

- **E-G1 — Meta-analysis on gamification and motivation** — gamification می‌تواند انگیزش را بهبود دهد، اما اثرها به مکانیک و نیازهای انگیزشی وابسته‌اند.  
  https://link.springer.com/article/10.1007/s11423-023-10337-7
- **E-G2 — 2026 Systematic Review: Digital Game-Based Learning in Early Childhood and Primary Mathematics** — 103 مطالعه تجربی تا سن 12 سال؛ شواهد امیدوارکننده اما وابسته به طراحی و شرایط اجرا.  
  https://www.syncsci.com/journal/AMLER/article/view/AMLER.2026.02.004
- **E-G3 — 2026 Tablet Math Games Review** — 30 مقاله / 33 مطالعه در preschool، برای کودکان 3–6 سال؛ 29 مطالعه اثر مثبت گزارش کردند. این منبع برای Grade 1–6 فقط supporting evidence با scope محدود است.  
  https://link.springer.com/article/10.1007/s11423-026-10626-x
- **E-G4 — Gamification fatigue** — در یک مطالعه روی 307 کاربر Duolingo، game layer و gaming motivation با fatigue و discontinuance رابطه‌های پیچیده‌ای داشتند؛ این منبع evidence مستقیم برای کودکان یا ریاضی دبستان نیست، اما از احتیاط در طراحی gamification بلندمدت پشتیبانی می‌کند.  
  https://doi.org/10.1016/j.im.2025.104133

## Adaptive / Teacher

- **E-T1 — EEF: Maths-Whizz RCT** — RCT در 63 مدرسه؛ +1 ماه پیشرفت متوسط؛ برنامه همراه با training و implementation support بود. صفحه پروژه در Project Info عدد 64 را نیز نشان می‌دهد، اما trial در summary و school count برابر 63 ذکر شده است.  
  https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/maths-whizz-23-24-trial
- **E-T2 — EEF: Digital Feedback in Primary Maths** — اثر معنادار بر attainment پیدا نشد و اجرای دیجیتال برای معلمان دشوار بود؛ diagnostic assessment مفیدتر گزارش شد.  
  https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/digital-feedback-in-primary-maths
- **E-T3 — Teacher Technology Acceptance Review** — perceived usefulness و ease of use از عوامل کلیدی پذیرش هستند؛ training نیز مهم است.  
  https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1436724/full
- **E-T4 — Educator App Choice Study** — معلمان به benchmarkهای آموزشی و rating/review مثبت حساس‌اند.  
  https://www.sciencedirect.com/science/article/pii/S0360131524000940

## Parent / Trust / Safety

- **E-P1 — Parent App Choice Study** — مطالعه روی 149 والد دارای کودک K–6؛ والدین به rating/review مثبت حساس بودند، اما اثر benchmarkهای آموزشی بر انتخاب روشن نبود.  
  https://www.sciencedirect.com/science/article/pii/S0360131525001782
- **E-S1 — UK ICO Age-Appropriate Design Code** — privacy-by-default، data minimization و پرهیز از nudge دستکاری‌کننده.  
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/

## Evidence Classification

در این registry باید بین سه نوع statement تفاوت حفظ شود:

- **Research Finding** — مستقیماً از مطالعه/منبع
- **Product Interpretation** — برداشت طراحی از یافته
- **Product Hypothesis** — چیزی که باید با داده خود محصول آزمایش شود

نام mechanics یا اولویت‌های محصول نباید به‌عنوان «شاهد پژوهشی» نمایش داده شوند مگر آنکه منبع دقیقاً همان claim را بررسی کرده باشد.

## Product Benchmarks

- **AnyMath** — https://play.google.com/store/apps/details?id=com.studyo.studyo
- **Prodigy Math** — https://www.prodigygame.com/main-en/prodigy-math
- **IXL Analytics / Diagnostic** — https://www.ixl.com/analytics
- **DreamBox** — https://www.dreambox.com/
- **Khan Academy Kids** — https://www.khanacademy.org/kids/math

</div>

<div dir="rtl" align="right">


<div dir="rtl" align="right">

# 19. Holistic Product + Technical Audit — ممیزی جامع v0.21

## P0 — مواردی که برای بستن طرح باید یکسان می‌شدند

### P0-1 — Station در برابر Skill

حل شد:

```text
Book Section → Station → 1..N Skills → Evidence / State / Decision
```

Station مسیر و تجربه را می‌سازد؛ Skill واحد یادگیری و تصمیم است.

### P0-2 — Station Pass در برابر Mastery

حل شد. قاعده `4/5 در دو Check جدا` فقط یک **V1 operational rule** برای عبور از Station است؛ Mastery همچنان family-specific و evidence-based است.

### P0-3 — Event ≠ Evidence

حفظ شد. telemetry یا runtime event به‌تنهایی learning evidence محسوب نمی‌شود.

### P0-4 — Account ≠ Learning Identity

حفظ شد. UX V1 ساده است، اما domain semantics این دو را جدا نگه می‌دارد.

### P0-5 — Consent / Guest retention

از `LOCKED legal fact` به `PROVISIONAL / LEGAL REVIEW REQUIRED` تبدیل شد. این موارد نباید بدون بررسی حقوقی به‌عنوان واقعیت نهایی سیستم ثبت شوند.

## P1 — تنش‌های حل‌شده / محدودشده

- Placement به‌صراحت starting-point assessment است، نه diagnosis کامل.
- Class وجود دارد، ولی Join/visibility mechanism هنوز implementation decision است.
- مسیر تجربه کتاب‌محور است، اما practice/selection Skill-driven است.
- Learning Decision در V1 Rule-Based است و Candidate/Arbitration فقط تا سطح لازم ساده می‌شود.
- Architecture سطح‌بالا بسته شده است و domain model آینده الزاماً به microservice تبدیل نمی‌شود.

## P2 — مواردی که عمداً باز مانده‌اند

- exact schema / API / indexes
- exact Grade-1 content mapping
- calibration Mastery/Station Pass
- جزئیات بصری Child App، Character Art، Motion Tokens و micro-interactionها (در `v0.24`)
- business/growth
- legal/privacy finalization

## Readiness Gate

### Product Core

`CLOSED FOR V1 BLUEPRINT`

هسته محصول، دامنه V1، مدل Station/Skill، حلقه یادگیری، نقش‌ها، guardrailها و اصول evidence/decision برای شروع فاز Grade-1 کافی و هم‌گام هستند.

### High-Level Technical Architecture

`CLOSED FOR V1`

انتخاب‌های اصلی: Modular Monolith، Next.js/React/TypeScript، PostgreSQL، Supabase Auth/Storage، Node.js 24 LTS و Playwright.

### Child Experience Specification

`CLOSED — v0.24`

Onboarding، Guided Path، Station Node، Character/Motion، feedback choreography و mobile information architecture در `v0.24` بسته شده‌اند؛ visual art و timing tokens همچنان validation-driven هستند.

### Detailed Implementation

`OPEN FOR BUILD PHASE`

schema، migrations، RLS policies، server actions/routes، runtime state، content mapping و test cases در فاز بعدی ساخته می‌شوند؛ این‌ها نباید دوباره architecture را از نو بازتعریف کنند مگر در صورت evidence/constraint جدید.

## نتیجه ممیزی

> **این revision یک تصمیم channel معماری را اضافه می‌کند: Child Mobile App، Public/Parent/Teacher/Admin Web و یک Shared Platform Core. Learning Core و Grade model تغییر مفهومی نکرده‌اند؛ مرحله بعد، بسته‌شدن `v0.25 Platform Technical Architecture & API` و سپس Auth/Skill/Content/Runtime specifications است.**


- **v0.21-MA3** — تثبیت Child Experience pattern: Animated Onboarding، Mini Diagnostic، Guided Learning Path، Character/Motion guardrails و مرزبندی Path به‌عنوان Projection.

# 20. Current State — وضعیت فعلی

## قفل‌شده برای V1

- بازار: ایران
- دامنه ساخت: Grade 1
- 25 Station مطابق ترتیب C105
- Station = experience/navigation؛ Skill = learning/decision
- Skill Graph v0.1 با 64 Skill به‌عنوان artifact پایه اول
- Placement کوتاه و starting-point assessment
- Continuous Diagnosis در طول استفاده
- Station چهارمرحله‌ای: Learn → Guided Practice → Check → Result
- Station Pass موقت: 4/5 در دو Check جدا
- Station Pass ≠ Mastery
- Rule-Based adaptation
- Evidence ≠ raw event؛ Answer ≠ Diagnosis
- Child / Parent / Teacher / Admin به‌عنوان نقش‌های اصلی V1
- Account ≠ Learning Identity در semantics
- Class ساده در V1؛ mechanism اتصال OPEN
- Parent view ساده؛ Teacher view ساده
- Public/Parent/Teacher/Admin Web + Child Mobile App
- Animated onboarding و mini diagnostic framing
- Child-facing Guided Learning Path به‌عنوان Projection، نه domain entity مستقل
- Path شامل current / next / review / recovery / milestone states در همان سفر
- Character و animation با guardrailهای Explain / React / Reveal Progress
- PWA فقط به‌عنوان enhancement در Web؛ نه جایگزین Child App
- Modular Monolith
- Next.js + React + App Router
- TypeScript
- Next.js server-side؛ بدون backend service جدا
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Postgres RLS + application authorization
- Node.js 24 LTS
- Playwright E2E
- بدون microservices / Kafka / GraphQL / Kubernetes / Graph DB
- AI/ML/LLM به‌عنوان مغز V1 ساخته نمی‌شود
- Privacy/Safety از architecture شروع می‌شود

## نیازمند validation در حین ساخت

- exact Skill ↔ Station mapping
- exact Diagnostic Probes
- Station Pass calibration
- recovery rules
- dosage
- parent/teacher UX details
- mobile information architecture and interaction details
- push notification policy
- mobile offline/sync behavior
- reward/world design
- business/growth

## نیازمند Legal Review پیش از pilot واقعی / production

- parental consent / child privacy policy
- Guest retention/deletion period
- C105 content/image usage
- deployment/data-region policy

## ترتیب ساخت

Product Core فقط ترتیب سطح‌بالا را ثبت می‌کند؛ جزئیات اجرایی در `v0.22` و specificationهای بعدی تعیین می‌شود:

```text
v0.24 Child App Experience & Journey
        ↓
v0.25 Platform Technical Architecture & API
        ↓
v0.26 Auth / Permission / RLS
        ↓
v0.27 Grade 1 Skill Graph + Station Contract
        ↓
v0.28 Content Contract
        ↓
v0.29 Session Runtime + Learning Rules
        ↓
Implementation Baseline
        ↓
Station 01 Vertical Slice
        ↓
Diagnostic + Parent + Teacher
        ↓
Staging → Pilot → Store Release
```

**Production-quality feature implementation should begin after v0.29 is closed and Grade 1 artifacts are verified.** Repository/bootstrap work may begin after `v0.25` is closed; Auth/RLS baseline follows `v0.26`.

## مرز نسخه بعد

هر چیزی که در این فهرست نیست، تا زمانی که prototype یا evidence واقعی نیاز آن را ثابت نکند، نباید به پیچیدگی V1 اضافه شود.


# 21. Version History — تاریخچه نسخه‌ها

- **v0.1–v0.5** — شکل‌گیری هسته یادگیری، Child Identity و Teacher Context.
- **v0.6–v0.8** — refactor، واژه‌نامه، مثال end-to-end و مرزبندی V1.
- **v0.9** — evidence-to-action، implementation burden و research update.
- **v0.10** — ممیزی نهایی: دقت منابع، dosage، Parent Constraints و فشرده‌سازی متن/ساختار.
- **v0.11** — Core Contracts audit و تثبیت ontology، Evidence/Uncertainty/Decay، Arbitration/Constraints، Progression و Content QA.
- **v0.11 / Technical Domain Pass** — ادغام Canonical Technical Domain Model و مرزبندی Entity/State/Projection.
- **v0.12–v0.16** — ممیزی State Machine، Evidence/Mastery/Decision، Data/Event و Identity/Permission/Security.
- **v0.17** — Holistic Product + Technical Core Audit و پاک‌سازی cross-layer.
- **v0.18-draft** — Consistency & Completeness Pass؛ تکمیل semantics و versioning foundations.
- **v0.19-draft** — ساده‌سازی V1: ایران، Grade scope باز، ثبت‌نام ساده، Guest، Class، و کاهش scope قراردادهای فنی.
- **v0.20-draft** — قفل‌شدن V1 روی Grade 1، محتوای C105، 25 Station، چهار مرحله تجربه و رابط کم‌خواندن.
- **v0.21-draft** — Product Blueprint + Consistency Closure: حل تناقض Station/Skill، تفکیک Station Pass از Mastery، تصریح Placement، همگام‌سازی Class/Account/Learning Identity، provisional کردن Consent/Guest retention برای legal review، بسته‌شدن High-Level Technical Architecture و کوچک‌سازی Open Questions.
- **v0.21-MA (superseded)** — بازتعریف Channel Architecture: Child Mobile App به‌عنوان Client اصلی یادگیری؛ Public/Parent/Teacher/Admin Web برای acquisition و تجربه‌های adult/operational؛ Shared Platform Core و API boundary مشترک؛ Product Core و Learning Semantics بدون تغییر.
- **v0.21-MA2 (superseded)** — نهایی‌سازی Mobile Stack: React Native + Expo + Expo Router + TypeScript + New Architecture + EAS؛ اصلاح ترتیب implementation و تعیین Implementation Baseline.

> **Current revision:** `v0.21` / `v0.21-MA4` semantics. Technical implementation is delegated to `v0.22–v0.29`; the latest current technical architecture is `v0.25`.

</div>

<div dir="rtl" align="right">

# 22. منابع فنی انتخاب Stack — Technical References

- Next.js Documentation — https://nextjs.org/docs
- Node.js Releases — https://nodejs.org/en/about/previous-releases
- Supabase Auth — https://supabase.com/docs/guides/auth
- Supabase RLS — https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage Access Control — https://supabase.com/docs/guides/storage/security/access-control
- Playwright TypeScript — https://playwright.dev/docs/test-typescript

</div>
