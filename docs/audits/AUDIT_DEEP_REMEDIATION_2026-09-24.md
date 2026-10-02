# ممیزی عمیق و اصلاحات سختگیرانه — 2026-09-24

## 1. هدف ممیزی

این سند ادامه ممیزی سختگیرانه Phase 0–10 است و repository را از چهار زاویه بررسی می‌کند:

1. انطباق specification با implementation
2. امنیت و authority boundary
3. منطق Learning Runtime و Station Pass
4. قابلیت build/test و کیفیت snapshot

قاعده این ممیزی این بوده است که «وجود فایل» یا «سبز بودن یک تست static» به‌تنهایی evidence کافی برای readiness محسوب نشود.

---

## 2. نتیجه نهایی

### وضعیت فعلی

**RED — برای Production/Pilot واقعی تأیید نمی‌شود.**

هسته Learning Runtime نسبت به ممیزی قبلی اصلاح شده و تست‌های targeted آن سبز هستند، اما چند blocker معماری هنوز باز است؛ مهم‌ترین آن‌ها production authentication، اتصال واقعی runtime به PostgreSQL/Supabase و اجرای واقعی native/web build با dependencyهای نصب‌شده است.

---

## 3. اصلاحات قطعی انجام‌شده

### 3.1 Learning Runtime

- evaluator bug مربوط به precedence در جمع score اصلاح شد.
- Check رسمی اکنون دقیقاً ۵ آیتم دارد.
- حداقل ۴ پاسخ صحیح از ۵ پاسخ، یک **qualifying Check** است.
- Station Pass فقط با حداقل دو qualifying Check در دو Session متفاوت فعال می‌شود.
- qualifying 4/5 دیگر اشتباهاً به `NEEDS_REVIEW`/Recovery تبدیل نمی‌شود؛ به‌عنوان positive evidence با confidence پایین‌تر از perfect-check ثبت می‌شود.
- idempotency replay با Session / Learning Identity / Relationship Context تطبیق داده می‌شود.
- Decision و Plan در replay از روی Attempt قبلی reuse می‌شوند.
- هر Decision به `sourceAttemptId` متصل است.

### 3.2 Security / Authority

- Principal dev-only برای Child و Adult API اضافه و روی routeهای حساس enforce شد.
- identity موجود در body دیگر نمی‌تواند با principal متفاوت باشد.
- Assignment authoring/publishing به class teacher scope محدود شد.
- learner خارج از class در Assignment publish/create رد می‌شود.
- Teacher recheck فقط برای teacher دارای دسترسی class مجاز است.
- Relationship write از client برداشته و trusted/admin-only شد.
- direct client write روی Station Check، Assignment Targets و Assignment Required Packages بسته شد.
- runtime tables در migration `0030` از client writes قفل شدند؛ از جمله Sessions، Encounters، Attempts، Answers، Evidence، Learning State، Decisions و Plans.

### 3.3 Content Delivery

- content package download اکنون قبل از خروجی bytes entitlement را بررسی می‌کند.
- RLS مربوط به `content_packages` برای Assignment-scoped access اصلاح شد تا package لازم برای یک Assignment فعال، برای learner مربوطه قابل‌دسترسی باشد.
- Mobile Content Manager identity مورد استفاده در entitlement را به download نیز منتقل می‌کند.

### 3.4 Station 01 / Mobile

- یک syntax error واقعی در `runtimeApi.ts` حذف شد.
- Recheck پس از Recovery از Session جدید شروع می‌شود تا شرط «دو Check در دو Session جدا» واقعاً رعایت شود.
- Recheck بعدی نیز در صورت نیاز Session جدید می‌سازد.
- restart محلی Station stateهای قبلی را پاک می‌کند.
- نتیجه offline دیگر Station Pass قطعی تولید نمی‌کند.

### 3.5 Offline Sync

- Submit network-failure اکنون در صف durable فایل قرار می‌گیرد.
- Sync transport هویت learner را به endpoint می‌فرستد.
- `SYNCING` بعد از crash قابل بازیابی است.
- queue برای idempotency keyها upsert می‌شود.
- flush بعد از پاسخ موفق runtime تلاش می‌کند queued actions را ارسال کند.

### 3.6 Repository hygiene

- فایل موقت stale `packages/assignment-runtime/src/service.ts.tmp` حذف شد.
- duplicate principal declarations حذف شدند.
- syntax parser کل `.ts/.tsx` های `apps/packages/scripts` بدون syntax diagnostic پاس شد.

---

## 4. تست‌ها و verificationهای اجراشده

### سبز

- Learning Runtime build
- Learning Runtime: **5/5 targeted runtime tests**
- Phase 2 static verification
- Phase 3 static verification
- Phase 4 static verification
- Phase 5 static + runtime verification
- Phase 6 static verification
- Phase 7 static verification
- Phase 8 static verification
- Phase 9 static verification
- Phase 10 static verification
- Deep remediation static verification
- TypeScript/TSX syntax parse
- `@math/assignment-runtime` build + typecheck
- `@math/offline-sync` build + typecheck
- `@math/adult-projections` build با resolution موقت dependency workspace
- Phase 10 synthetic performance verification

### Performance verification

```text
p95FrameMs = 16.4
frameBudgetMs = 16.67
maxSyncBatch = 20
cacheBudget = 80 MB
lowEndAndroidMeasured = false
```

این نتیجه **synthetic** است، نه measurement واقعی روی Android low-end.

---

## 5. Blockerهای باقی‌مانده

### P0 — Production Authentication

`apps/web/lib/request-principal.ts` هنوز **DEV_ONLY** است و در production `AUTH_REQUIRED` برمی‌گرداند. بنابراین Supabase Auth → server principal → RLS هنوز در اجرای واقعی routeها end-to-end پیاده نشده است.

این باید قبل از Pilot واقعی بسته شود.

### P0 — Runtime Persistence

Web runtime فعلاً از `InMemoryLearningRuntimeRepository` و `InMemoryAssignmentRepository` استفاده می‌کند. بنابراین migrationها و RLS موجود، هنوز backend production runtime را به PostgreSQL وصل نکرده‌اند.

### P0 — Native/Web Dependency Verification

در محیط فعلی dependencyهای Expo/React/Next نصب نیستند. بنابراین full typecheck/build اپ‌ها قابل‌اتکا اجرا نشده است.

در عوض syntax parser کل کد source سبز شد و package-level buildهای مستقل که dependency کامل داخلی داشتند اجرا شدند.

### P1 — Native Build / EAS

Android/iOS build، Hermes runtime واقعی، New Architecture runtime، EAS build و performance واقعی روی device اجرا نشده‌اند.

### P1 — Rive Asset

architecture Rive آماده است، اما فایل نهایی `.riv` شخصیت هنوز داخل repository موجود نیست؛ بنابراین art/animation Definition of Done هنوز کامل نشده است.

### P1 — Offline Cold Start

Offline Submit queue شده است، اما شروع Session/Encounter از حالت cold/offline هنوز مثل یک server-authoritative session به‌طور کامل queue نمی‌شود. همچنین `SESSION_RESUME / SESSION_UPDATE / EVENT_INGEST` در sync API فعلاً transport-ack هستند و هنوز runtime mutation کامل ندارند.

### P1 — Assignment Completion Authority

endpoint `assignment-instances/[instanceId]/outcome` هنوز یک bridge dev-only برای اعمال outcome دارد و completion آن هنوز مستقیماً به یک trusted Learning Decision server-side bind نشده است. این endpoint نباید در production به client authority تبدیل شود.

### P1 — Content Production Backend

Content Delivery هنوز fixture/dev-pack است و به Supabase Storage + DB Manifest production متصل نشده است.

### P1 — Real E2E

Playwright و static contract checks موجودند، اما Pilot هنوز با deployment واقعی، auth واقعی، DB واقعی و device/runtime واقعی اجرا نشده است.

### P1 — Educational Freeze

Skill graph پایه اول شامل 64 Skill است که طبق source هنوز `PROVISIONAL / DERIVED` هستند؛ taxonomy، prerequisiteها و primary/supporting mapping هنوز نیازمند review آموزشی‌اند.

### P2 — Quest/Reward Runtime

schema و contract وجود دارد، ولی authoritative quest/reward persistence و grant lifecycle هنوز به اندازه Learning Runtime operational نشده است.

---

## 6. تصمیم Gate

```text
Learning Runtime Gate          PASS (targeted)
Security hardening Gate        IMPROVED / DEV-BOUND
Repository syntax Gate         PASS
Static Phase 2–10 Gate         PASS
Synthetic performance Gate     PASS

Production Auth Gate           FAIL
Production DB Gate             FAIL
Native Build Gate              NOT VERIFIED
Rive Asset Gate                FAIL
Educational Freeze Gate        OPEN
Real Pilot Gate                FAIL
```

بنابراین **ST02 scaling هنوز نباید شروع شود**. ابتدا باید blockerهای P0 و P1 بالا بسته شوند؛ سپس یک Pilot Gate واقعی اجرا شود و فقط بعد از آن ST02 و batchهای بعدی باز شوند.

---

## 7. Migration state

تعداد migrationهای repository اکنون **30** است:

- `0028_security_hardening_and_runtime_invariants.sql`
- `0029_content_package_assignment_access.sql`
- `0030_runtime_client_write_lockdown.sql`

این سه migration ادامه‌دهنده hardening هستند و باید همراه snapshot فعلی preserve شوند.

---

## 8. اصل ادامه پروژه

تا زمانی که این چهار مسیر سبز نشده‌اند، scaling محتوای 25 Station انجام نشود:

```text
Supabase Auth / Principal
        ↓
Production PostgreSQL Runtime
        ↓
Server-authoritative Learning Truth
        ↓
Real Mobile/Web/E2E/Pilot
```

بعد از آن:

```text
Pilot Gate
   ↓
ST02 Vertical Slice
   ↓
ST02–05 Batch
   ↓
Validation Gate
   ↓
Next Batch
```
