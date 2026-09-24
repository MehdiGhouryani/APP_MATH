# ممیزی عمیق پروژه Math Learning — 2026-09-25

## نتیجه اجرایی

**Production Pilot هنوز Blocked است.**

دلایل اصلی Blocker:
1. migration `0017_seed_registry.sql` فقط Registry را seed می‌کند و executable Grade 1 runtime seed برای Station/Skill/Content/Package وجود ندارد.
2. ST01 از نظر vertical-slice content هنوز کامل نیست: قرارداد منبع 12 Encounter دارد، اما implementation فعلی فقط E01–E04 و E07–E10 را اجرا/fixture می‌کند.
3. Supabase/PostgreSQL واقعی، Auth واقعی و RLS/transaction واقعی در این محیط اجرا نشده‌اند؛ بنابراین static verification معادل integration verification نیست.

## اصلاحات اعمال‌شده در این ممیزی

- تمام routeهای Assignment/Content که backend gate را خارج از `try` اجرا می‌کردند، به مسیر error-handling استاندارد منتقل شدند.
- route مربوط به learner assignments که gate نداشت، fail-closed شد.
- چند validation branch که `apiErrorStatus(error)` را بدون متغیر `error` استفاده می‌کردند، اصلاح شدند.
- `assignment-instances/outcome` اکنون Assignment backend gate واقعی دارد.
- sync error classification اصلاح شد تا `NOT_FOUND` اشتباهاً retry نشود؛ retry فقط برای خطاهای transient/network/5xx/429 باقی مانده است.
- `exactOptionalPropertyTypes` mismatch در session route اصلاح شد.
- نسخه Policy بین Runtime محلی و PostgreSQL canonical شد:
  - `RUNTIME_POLICY_VERSION = phase13-postgres-v1`
  - `STATION_PASS_POLICY_VERSION = temporary-4-of-5-in-two-checks-v3`
- readiness guard از green کاذب به **fail-closed** تبدیل شد و نبود executable seed را Blocker اعلام می‌کند.
- static guard اکنون parity نسخه Policy و خطاهای route scope را نیز بررسی می‌کند.

## P0 — Blockerهای Production

### P0.1 — Executable Grade 1 seed وجود ندارد

`supabase/migrations/0017_seed_registry.sql` فقط این موارد را ایجاد می‌کند:
- Grade
- Platform Context
- Curriculum Version `g1-build-001`
- Skill Graph Version `g1-provisional-001`

هیچ seed اجرایی برای:
- `stations`
- `skills`
- `station_skills`
- `content_artifacts`
- `content_versions`
- `content_packages`
وجود ندارد.

بنابراین Runtime production می‌تواند Registry را پیدا کند، اما در Encounter creation به domain runtime اجرایی نمی‌رسد.

**تصمیم:** داده آموزشی جدید عمداً جعل/اختراع نشد؛ seed اجرایی باید از Grade Package تأییدشده تولید شود.

### P0.2 — ST01 کامل نیست

قرارداد Station 01 دوازده Encounter تعریف می‌کند:
`E01..E12`.
Implementation فعلی فقط:
`E01,E02,E03,E04,E07,E08,E09,E10`
را دارد.

موارد missing:
- `ST01-E05` Independent Practice
- `ST01-E06` Review Mini Game
- `ST01-E11` Transfer Mini Game
- `ST01-E12` Mastery Check

تا این چهار مورد تکمیل نشده‌اند، ST01 را vertical slice کامل اعلام نمی‌کنیم.

### P0.3 — Live integration هنوز اثبات نشده است

در محیط فعلی:
- `psql`/Supabase CLI/DB container قابل استفاده وجود ندارد.
- Auth واقعی Supabase اجرا نشده.
- migrationهای `0031..0034` روی یک پروژه Postgres واقعی apply نشده‌اند.
- E2E واقعی Auth → RLS → RPC → transaction روی DB واقعی اجرا نشده.

بنابراین وضعیت فعلی **static-contract verified** است، نه production-verified.

## P1 — شکاف‌های مهم معماری/دامنه

### P1.1 — RLS خام با مدل Parent/Teacher یکسان نیست

`can_access_learning_identity()` فعلی هر relationship فعال را مجاز می‌کند و همچنین class-owner teacher را شامل می‌شود.
از طرف دیگر، قرارداد Parent/Teacher می‌گوید Teacher عمدتاً summary/projection می‌بیند، نه raw Learning Truth و telemetry.

این موضوع به‌خصوص برای:
- sessions
- attempts
- answers
- evidence
- learning_states
- learning_decisions
- learning_plans
- progression / quests / rewards

نیازمند یک read boundary جدا برای raw learning truth است.

**اصلاح این مورد عمداً در این snapshot انجام نشد** تا projection DB واقعی بدون حدس‌زدن قرارداد access ساخته نشود.

### P1.2 — Learning Engine هنوز فقط هسته operational V1 است

RPC فعلی Evidence → State → Decision → Plan را transactionally ثبت می‌کند، اما هنوز این بخش‌ها را به‌صورت کامل پیاده نمی‌کند:
- Interpretation / Error Hypothesis persistence در هر transition
- Mastery Contract execution
- Historical Mastery Evaluation
- Diagnostic Probe selection/value logic
- Candidate generation و arbitration چندمنبعی
- خانواده‌محور بودن transitionهای Mastery

این با semantics منبع هم‌سطح نیست؛ در منبع، Interpretation و Mastery Evaluation بخش قابل‌ردگیری pipeline هستند. وضعیت فعلی باید **Rule-Based operational core** نام‌گذاری شود، نه Learning Engine کامل.

### P1.3 — Schema drift بین سند DB و migrationهای اجرایی

مقایسه source schema با migrations، 12 جدول/رابطهٔ مستندشده را نشان می‌دهد که physical migration معادل ندارند:
- `age_profiles`
- `client_pairing_tokens`
- `content_version_objectives`
- `content_version_skills`
- `content_version_stations`
- `diagnostic_probe_skills`
- `diagnostic_sets`
- `error_hypotheses`
- `mastery_contract_versions`
- `mastery_evaluations`
- `pass_policies`
- `recovery_policies`

همه این موارد لزوماً blocker V1 نیستند، اما باید هرکدام صریحاً `IMPLEMENTED / DEFERRED / REPLACED` شوند؛ وضعیت مبهم قابل قبول نیست.

### P1.4 — Assignment / Adult / Content production backends کامل نیستند

Implementation فعلی برای این حوزه‌ها هنوز repository/serviceهای in-memory یا filesystem fixture دارد:
- Assignment Runtime
- Adult Projection Runtime
- Content Delivery Runtime

در production gates عمداً fail-closed شده‌اند؛ بنابراین این featureها هنوز production-ready نیستند.

### P1.5 — reproducibility ناقص است

Repository فاقد:
- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`

است.

Engine پروژه Node 24 را target می‌کند، ولی verification محیط فعلی با Node 22.16.0 انجام شده است. نبود lockfile و dependency workspace نصب‌نشده/ناقص، build کامل وب را قابل‌اعتماد نمی‌کند.

### P1.6 — build کامل Web قابل تأیید نیست

Global TypeScript موجود است، اما dependencyهای runtime وب مثل `next`, `react` و workspace package links در installation فعلی کامل resolve نمی‌شوند.

در مقابل، این typecheckها با موفقیت اجرا شدند:
- contracts
- learning-runtime
- assignment-runtime
- offline-sync

## P2 — موارد غیرمسدودکننده ولی قابل بهبود

### P2.1 — evaluator فعلی عمداً محدود است

Evaluator PostgreSQL فعلی بر پایه `expectedAnswers` و equality مستقیم است. برای runtime واقعی، انواع interaction مثل drag/drop، sort، count و mini-game به evaluatorهای تخصصی و QA نیاز دارند.

### P2.2 — fallback موبایل هنوز fixture محور است

`apps/mobile/src/station/runtimeApi.ts` برای ST01 fixture محلی دارد. این برای development مفید است، اما نباید به‌عنوان Content Delivery production تلقی شود.

### P2.3 — Rive production asset هنوز gate نشده است

Animation controller و event mapping وجود دارد، اما asset نهایی شخصیت و QA آن هنوز production evidence محسوب نمی‌شود.

## Verification فعلی

PASS:
- `node scripts/runtime-tests.mjs` — 5/5
- `node scripts/verify-remediation.mjs`
- `node scripts/verify-phase11-auth.mjs`
- `node scripts/verify-phase12-postgres-runtime.mjs`
- `scripts/verify-production-readiness-static.mjs` از نظر contract checks درست عمل می‌کند و عمداً با Blocker seed exit=2 می‌دهد.
- `tsc --noEmit` برای contracts
- `tsc --noEmit` برای learning-runtime
- `tsc --noEmit` برای assignment-runtime
- `tsc --noEmit` برای offline-sync

NOT VERIFIED:
- Full Web typecheck/build
- Real Supabase migrations
- Real Auth/RLS integration
- Real mobile EAS/device build
- Production content package delivery

## تصمیم نهایی ممیزی

```text
Architecture                 ACCEPT
Production Auth boundary    ACCEPT (static)
Transactional RPC design    ACCEPT (static)
Idempotency                 ACCEPT (static + local tests)
Offline retry semantics     ACCEPT (contract level)
Grade 1 executable seed     BLOCKED
ST01 vertical slice         BLOCKED
Teacher raw-RLS boundary    NEEDS HARDENING
Mastery/Interpretation      NEEDS DOMAIN IMPLEMENTATION
Live Supabase verification  BLOCKED
Production Pilot            DO NOT OPEN
ST02                         DO NOT START
```

## ترتیب اصلاح بعدی

1. Production seed pipeline بر پایه Grade Package تأییدشده
2. ST01 E05/E06/E11/E12
3. Raw Learning Truth RLS boundary + DB projection boundary
4. Mastery Evaluation / Interpretation contract یا ثبت explicit deferral
5. Lockfile + Node 24 CI + dependency reproducibility
6. Supabase integration test روی DB واقعی
7. Auth/RLS/transaction E2E
8. Pilot Gate
9. سپس ST02
