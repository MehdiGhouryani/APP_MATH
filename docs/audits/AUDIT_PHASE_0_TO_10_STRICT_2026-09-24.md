# ممیزی سختگیرانه پروژه Math Learning Product V1 — تا Phase 10

**تاریخ:** 24 سپتامبر 2026  
**دامنه ممیزی:** Specification + Repository + SQL migrations + Runtime packages + Web/Mobile routes + Verification scripts + E2E/Performance artifacts  
**روش:** static inspection, source/spec reconciliation, repository-wide search, Node verification scripts, TypeScript compiler check where executable  
**نتیجه کلی:** **NO-GO برای Pilot واقعی و NO-GO برای Production** تا بسته‌شدن یافته‌های Blocker/High

---

## 1. خلاصه اجرایی

پروژه از نظر **جهت معماری و قرارداد محصول** نسبتاً منسجم است، اما از نظر **اتصال قراردادها به implementation واقعی** هنوز در وضعیت prototype / development harness قرار دارد.

مهم‌ترین مشکل این نیست که «کد کم است». مشکل اصلی این است که چند بخش حیاتی هنوز هم‌زمان دو حقیقت دارند:

1. حقیقت طراحی/Specification؛
2. حقیقت demo/in-memory implementation.

این دو هنوز به یک runtime production-authoritative واحد متصل نشده‌اند.

### حکم ممیزی

```text
Architecture direction        = ACCEPTABLE
Specification discipline     = ACCEPTABLE / NEEDS CLEANUP
Repository discipline        = ACCEPTABLE
Database skeleton             = PRESENT / UNVERIFIED LIVE
RLS security                  = BLOCKED
Auth integration              = BLOCKED
Learning Runtime fidelity     = BLOCKED
Content Delivery integration  = BLOCKED
Offline integration           = BLOCKED
Station 01 completeness       = BLOCKED
Rive production asset         = NOT READY
Quest/Reward runtime          = NOT IMPLEMENTED
E2E                            = NOT EXECUTED
Low-end Android profiling     = NOT EXECUTED
Pilot readiness               = NO-GO
Production readiness          = NO-GO
```

---

# 2. یافته‌های بحرانی — BLOCKER

## B-01 — مسیر runtime فعلی اصلاً با Auth/RLS واقعی متصل نیست

### شواهد

- `apps/web/lib/learning-runtime.ts` از `InMemoryLearningRuntimeRepository` استفاده می‌کند.
- `apps/web/lib/assignment-runtime.ts` از `InMemoryAssignmentRepository` استفاده می‌کند.
- `apps/web/lib/adult-projections.ts` از `InMemoryAdultProjectionRepository` استفاده می‌کند.
- endpointهای learning، assignment، parent و teacher به‌جای principal احراز‌شده، account/learning identity را از body یا URL می‌گیرند.
- `assertDevIdentity()` فقط dev/prod را تفکیک می‌کند؛ authorization واقعی انجام نمی‌دهد.

### نتیجه

RLS موجود در SQL در مسیر واقعی End-to-End این snapshot استفاده نمی‌شود. بنابراین عبارت‌های «server-authoritative» و «RLS boundary» فعلاً قرارداد هستند، نه enforcement کامل runtime.

### حکم

**BLOCKER**

### اقدام لازم

یک `AuthContext / PrincipalContext` سروری canonical ایجاد شود و همه endpointها فقط identity استخراج‌شده از session/token را قبول کنند. سپس repository production به Supabase/PostgreSQL متصل شود. تمام adapterهای in-memory باید فقط در test/dev fixture بمانند.

---

## B-02 — امکان privilege escalation در Relationship RLS

### شواهد

در `supabase/migrations/0004_relationships_and_classes.sql`، policy مربوط به relationship write اجازه می‌دهد هر authenticated user در صورتی که `related_account_id = auth.uid()` باشد، relationship بسازد.

این policy به‌تنهایی اثبات نمی‌کند که user واقعاً از صاحب/والد/معلم بودن نسبت به آن `learning_identity_id` مجاز است. چون `can_access_learning_identity()` نیز relationship فعال را یکی از منابع دسترسی می‌داند، self-created relationship می‌تواند به privilege escalation تبدیل شود.

### نتیجه

مدل فعلی «Relationship invitation / approval / proof» ندارد و ممکن است principal با ساخت relationship برای کودک دیگر، دسترسی بگیرد.

### حکم

**BLOCKER — SECURITY**

### اقدام لازم

Relationship creation از direct self-write خارج شود و یکی از این مسیرها داشته باشد:

```text
Invitation / Pairing Token
→ Acceptance
→ Server validation
→ ACTIVE relationship
```

یا یک server-only relationship mutation service که role/capability/context را اعتبارسنجی کند.

---

## B-03 — Content Package RLS با Assignment Access ناسازگار است

### شواهد

در `supabase/migrations/0022_content_delivery.sql`:

`content_packages_read` تابع `can_access_content_package(id, null)` را صدا می‌زند.

اما branch مربوط به `assignment_required_packages` در همان function نیاز دارد:

```text
ai.learning_identity_id = p_learning_identity_id
```

وقتی مقدار ورودی `NULL` است، Assignment-based access نمی‌تواند match شود.

### نتیجه

قانون canonical پروژه می‌گوید Assignment می‌تواند package لازم را برای learner در دسترس کند، اما RLS فعلی این مسیر را در package read به‌درستی resolve نمی‌کند.

### حکم

**BLOCKER — CONTENT ACCESS**

### اقدام لازم

Policy باید identity واقعی session را از server/auth context بگیرد؛ `NULL` نباید برای resolver authoritative استفاده شود.

---

## B-04 — Station Pass در implementation واقعی 4/5 × 2 نیست

Specification صریحاً:

```text
4/5 correct
+
4/5 correct on a separate Check
```

را به‌عنوان rule موقت V1 تعریف کرده است. fileciteturn26file0L1-L1

اما implementation فعلی:

- هر Check عملیاتی فقط یک answer دارد؛
- `maxScore` در fixture عملاً `1` است؛
- `passedCheck` با `score / maxScore >= 0.8` محاسبه می‌شود؛
- در نتیجه یک پاسخ صحیح single-item می‌تواند یک qualifying check بسازد؛
- دو check جدا کافی می‌شوند.

### نتیجه

تست runtime فعلی «two qualifying checks» را پاس می‌کند، اما محصول واقعی آن qualifying check را به شکل 4/5 اجرا نمی‌کند.

### حکم

**BLOCKER — LEARNING CORRECTNESS**

### اقدام لازم

Check باید یک interaction با حداقل 5 scored items یا معادل canonical evaluator داشته باشد و pass policy از policy/config نسخه‌دار خوانده شود، نه hard-coded `0.8` روی single-answer encounter.

---

## B-05 — Learning State implementation قرارداد v0.29 را اجرا نمی‌کند

Specification می‌گوید State Update باید از history + interpretation + current policy مشتق شود و حداقل confidence، uncertainty، status، review/recovery need را پشتیبانی کند. fileciteturn26file1L1-L1

اما `packages/learning-runtime/src/policies.ts` فعلاً:

- state جدید را تقریباً همیشه `BUILDING` می‌کند؛
- state قبلی را عملاً تغییر معنایی نمی‌دهد؛
- confidence ندارد؛
- uncertainty ندارد؛
- review need ندارد؛
- recovery need ندارد؛
- interpretation واقعی وارد decision نمی‌کند.

### نتیجه

Learning Engine فعلی **runtime harness** است، نه implementation کامل Rule-Based Learning Engine تعریف‌شده در specification.

### حکم

**BLOCKER — LEARNING ENGINE**

### اقدام لازم

State model و Interpretation pipeline باید قبل از Pilot واقعی اجرایی شود و policy versioned داشته باشد.

---

## B-06 — Offline واقعاً به Station Runtime وصل نشده است

`StationFlow.tsx` وقتی اتصال remote شکست بخورد به local demo mode می‌رود، اما نتیجه‌های local را در `OfflineSyncManager` enqueue نمی‌کند.

در نتیجه متن UI که القا می‌کند نتیجه‌ها بعداً از server ثبت می‌شوند، با implementation فعلی تضمین نشده است.

### حکم

**BLOCKER — DATA LOSS RISK**

### اقدام لازم

هر Attempt offline باید:

```text
Attempt
→ local durable queue
→ idempotency key
→ reconnect
→ server evaluation
→ receipt
→ authoritative result
```

را واقعاً طی کند. Local demo fallback نباید شبیه offline production رفتار کند.

---

# 3. یافته‌های سطح HIGH

## H-01 — Content Manager ساخته شده ولی Station 01 از آن استفاده نمی‌کند

`ContentManager` مستقل وجود دارد، اما `StationFlow` همچنان `getLocalContent()` را از `runtimeApi.ts` استفاده می‌کند.

بنابراین جریان واقعی فعلی:

```text
Hard-coded local content
→ UI
```

است، نه:

```text
Manifest
→ Package
→ Cache
→ Content Version
→ Encounter
```

این با اصل Content-Delivery architecture ناسازگار است.

---

## H-02 — Quest/Reward runtime واقعی وجود ندارد

در implementation فعلی:

- migrationهای Quest/Reward وجود دارند؛
- اما service/domain runtime برای Quest/Reward وجود ندارد؛
- reward در Station UI مستقیماً به صورت `⭐` نمایش داده می‌شود.

در نتیجه Reward هنوز authoritative/idempotent نیست و Quest server-triggered نیست.

### حکم

**HIGH**

---

## H-03 — Station 01 ناقص‌تر از specification است

Specification ایستگاه 01 inventory دوازده‌Encounter دارد و Exit Criteria آن QA آموزشی، transfer و mastery/recheck path را نیز در بر می‌گیرد.

اما fixture فعلی فقط 8 content item دارد و StationFlow نیز عملاً همین subset را اجرا می‌کند.

در implementation فعلی مواردی مانند `ST01-E05`, `ST01-E06`, `ST01-E11`, `ST01-E12` در runtime slice وجود ندارند.

### حکم

**HIGH**

---

## H-04 — E2E موجود با API واقعی همین snapshot ناسازگار است

تست `e2e/web/critical-path.spec.ts` انتظار `body.packages` دارد.

اما `ContentManifest` و `getManifest()` فعلی، ساختار:

```text
current
next
recent
future
```

را برمی‌گردانند.

پس حتی بعد از نصب dependencyها نیز این assertion در وضعیت فعلی قابل اتکا نیست.

### حکم

**HIGH — TEST QUALITY**

---

## H-05 — Rive asset واقعی وجود ندارد

`AnimatedCharacter` برای `source` مقدار پیش‌فرض ندارد و وقتی فایل Rive موجود نباشد fallback Emoji/Static UI نشان داده می‌شود.

هیچ `.riv` شخصیت اصلی در repository فعلی وجود ندارد.

این با معماری Rive تناقض ندارد، اما برای محصولی که Animation را first-class قرار داده، Pilot هنوز asset-complete نیست.

### حکم

**HIGH — PRODUCT READINESS**

---

## H-06 — Content Package Descriptor با package fixture یکی نیست

Descriptor delivery در `apps/web/lib/content-delivery.ts` یک `contentVersionId` ساختگی مانند:

```text
G1-ST01:DEV
```

می‌سازد، درحالی‌که خود package fixture هشت `contentVersionId` واقعی دارد.

این نشان می‌دهد package manifest و package payload هنوز یک قرارداد واحد و authoritative ندارند.

### حکم

**HIGH**

---

## H-07 — Authenticated identity از URL/body گرفته می‌شود

نمونه‌ها:

```text
/api/v1/teacher/:teacherAccountId/...
/api/v1/parent/:parentAccountId/...
/api/v1/learning/sessions
/api/v1/learning/attempts/submit
```

در این مسیرها هنوز principal واقعی از Supabase Auth استخراج نمی‌شود.

این صرفاً «demo limitation» نیست؛ اگر route قبل از production auth gate منتشر شود، security boundary شکسته است.

### حکم

**HIGH / SECURITY**

---

## H-08 — Teacher Observation برای Parent قابل‌مشاهده است

در `0025_teacher_observations.sql`، policy select علاوه بر teacher access، `public.can_access_learning_identity()` را نیز قبول می‌کند.

چون parent relationship می‌تواند `can_access_learning_identity()` را true کند، raw teacher observation بالقوه به Parent قابل‌دسترسی می‌شود.

این با اصل privacy محصول که raw teacher notes را نباید به صورت پیش‌فرض در Parent سطح نمایش دهد، ناسازگار است.

### حکم

**HIGH — PRIVACY**

---

## H-09 — `client_installations` اجازه bind کردن identity را بدون اثبات رابطه می‌دهد

Policy فعلی ownership را بر `account_id = auth.uid()` محدود می‌کند، اما `learning_identity_id` را مستقل از رابطه/ownership معتبرسازی نمی‌کند.

### حکم

**HIGH — SECURITY HARDENING**

---

## H-10 — Version Pinning ناقص است

`LearningRuntime.createEncounter()` فقط grade/station/skill را کنترل می‌کند.

`curriculum_version_id` و `skill_graph_version_id` از Session در Encounter/Content compatibility واقعاً validate نمی‌شوند.

در نتیجه مفهوم «historical content pinning» کامل نشده است.

### حکم

**HIGH — DATA INTEGRITY**

---

## H-11 — Client می‌تواند learningRole/experienceForm را در createEncounter پیشنهاد کند

API request این فیلدها را می‌پذیرد و runtime در نبودشان از content استفاده می‌کند؛ اما canonical content contract باید source اصلی role/form باشد.

در حالت فعلی باید server آن‌ها را از persisted Content Version مشتق کند، نه از client trust.

### حکم

**HIGH**

---

# 4. یافته‌های MEDIUM / Engineering Debt

## M-01 — TypeScript root compile واقعاً سبز نیست

اجرای:

```text
tsc -p tsconfig.base.json --noEmit
```

در repository فعلی شکست خورد:

```text
packages/adult-projections/src/index.ts(6,20): error TS1109
packages/adult-projections/src/index.ts(7,23): error TS1109
```

کد فعلی از فرم invalid زیر استفاده می‌کند:

```ts
new import('./repository.js').InMemoryAdultProjectionRepository()
```

در نتیجه `PHASE8_STATIC_VERIFICATION_PASS` به معنی «کل repository typecheck شده» نیست.

---

## M-02 — Verification scripts بیش از حد string/static هستند

چند verify script صرفاً وجود فایل/رشته/الگو را بررسی می‌کنند و به integration correctness نمی‌رسند.

مثال:

- Pass logic واقعی 4/5 را detect نمی‌کنند؛
- E2E manifest mismatch را detect نمی‌کنند؛
- Auth enforcement را اجرا نمی‌کنند؛
- RLS را live اجرا نمی‌کنند؛
- production adapter wiring را enforce نمی‌کنند.

Verification باید layerized شود:

```text
Static
→ Typecheck
→ Unit
→ Integration
→ RLS Integration
→ API E2E
→ Device E2E
```

---

## M-03 — `package-lock.json` / reproducible install lock وجود ندارد

برای snapshot قابل‌تحویل، dependency versions کافی نیستند؛ transitive dependency graph نیز باید lock شود.

همچنین Node 24 target شده، اما `.nvmrc` / `.node-version` یا CI engine enforcement داخل repository نیست.

---

## M-04 — generated `dist/` و فایل موقت `service.ts.tmp` داخل snapshot هستند

نمونه:

```text
packages/assignment-runtime/dist/*
packages/offline-sync/dist/*
packages/adult-projections/dist/*
packages/assignment-runtime/src/service.ts.tmp
```

این وضعیت مرز source/generated artifact را نامشخص می‌کند و ریسک stale build artifact دارد.

---

## M-05 — README به Phase 8 اشاره می‌کند ولی snapshot فعلی تا Phase 10 است

`README.md` هنوز current phase را `Phase 8` اعلام می‌کند، در حالی که Phase 9 و Phase 10 نیز در repository وجود دارند.

این از نظر هندسی کوچک است ولی برای handoff تیمی خطرناک است چون «single source of current status» را مخدوش می‌کند.

---

## M-06 — Adult Projection داده mock دارد و بعضی mappingها آموزشیِ غلط دارند

مثلاً در `InMemoryAdultProjectionRepository` عنوان/meaning برخی skillها با taxonomy Grade 1 منطبق نیست.

این داده‌ها برای UI smoke قابل‌قبول‌اند، اما نباید در acceptance test یا pilot evidence به‌عنوان learning truth استفاده شوند.

---

## M-07 — ID generation با `Math.random()`

در runtimeهای production-grade باید برای identifierهای authoritative از UUID/ULID یا crypto-safe ID generator استفاده شود.

---

## M-08 — Session lifecycle در Check B می‌تواند sessionهای ACTIVE اضافی بسازد

مسیر `beginFreshCheckEncounter()` یک Session جدید ایجاد می‌کند، ولی implementation فعلی lifecycle session قبلی را به‌شکل روشن `INTERRUPTED/COMPLETED` نمی‌کند.

این باعث state hygiene ضعیف و گزارش‌های مبهم می‌شود.

---

# 5. مواردی که خوب طراحی شده‌اند و باید حفظ شوند

## P-01 — No Unity تصمیم معماری درستاً enforce شده

ADR صریح وجود دارد و repository search و phase verification نبود dependencyهای Unity/Unreal/Godot را کنترل می‌کند.

این تصمیم را باید **حفظ کنیم** و دیگر بحث Unity را وارد roadmap نکنیم.

## P-02 — جداسازی Learning Identity از Account درست است

مدل domain این تفکیک را حفظ کرده و با Product Core هم‌خوان است.

## P-03 — Assignment به‌عنوان Shared Intent + Instance درست است

از نظر domain، تفکیک هدف معلم از اجرای شخصی کودک درست است و با اصل:

```text
Teacher chooses WHAT
Engine chooses HOW
```

هم‌جهت است.

## P-04 — Cache policy درست جهت‌گیری شده

CURRENT / NEXT / RECENT / FUTURE و entitlement ≠ cache state، انتخاب معماری مناسبی برای پروژه است.

## P-05 — Evidence append-only و Station Pass ≠ Mastery درست نگه داشته شده

این دو boundary مهم در specification و schema وجود دارند و نباید در implementation قربانی shortcut شوند.

---

# 6. چیزی که الان نباید انجام دهیم

تا زمانی که Blockerهای بالا بسته نشده‌اند:

- ST02–ST05 را تولید انبوه نکنیم.
- Grade 1 را scale نکنیم.
- Feature جدید اضافه نکنیم.
- Payment را اضافه نکنیم.
- Social / leaderboard / co-op نسازیم.
- AI/ML اضافه نکنیم.
- animation assetهای زیاد تولید نکنیم.

---

# 7. ترتیب اصلاح پیشنهادی — Mandatory Fix Sequence

## Gate A — Security / Auth

1. PrincipalContext از Supabase Auth
2. حذف identity/account ID از trust boundary endpoint
3. Relationship invitation/approval
4. client installation ownership
5. Teacher/Parent RLS isolation
6. Teacher Observation privacy
7. live RLS tests

## Gate B — Learning Truth

8. canonical Content Version loading از DB/manifest
9. version pin validation کامل
10. evaluator چند-item
11. 4/5 × two-check واقعی
12. Learning State policy واقعی
13. Interpretation / confidence / uncertainty
14. Decision/Plan واقعی
15. idempotency DB-backed

## Gate C — Delivery / Offline

16. Manifest DB-backed
17. package entitlement enforcement
18. assignment-required package resolution
19. ContentManager → Station runtime integration
20. offline queue → actual Station submit integration
21. sync receipts واقعی
22. restart/resume test

## Gate D — Station 01 Fidelity

23. full 12-encounter inventory
24. E05/E06/E11/E12
25. all required content pack items
26. Game 001/002/003/004
27. Recovery + Recheck
28. Quest runtime
29. Reward runtime/idempotent grant
30. actual Rive character asset

## Gate E — Verification

31. root TypeScript clean
32. lockfile + Node 24 environment file
33. live Supabase migration run
34. live RLS test matrix
35. Playwright E2E against real app
36. Android low-end profiling
37. resume/offline E2E
38. educational review sign-off

---

# 8. Final Audit Verdict

```text
ARCHITECTURE:            ACCEPT / KEEP
DOMAIN MODEL:            ACCEPT WITH GAPS
SPECIFICATION:           ACCEPT WITH RECONCILIATION DEBT
DATABASE SKELETON:       PRESENT / LIVE-UNVERIFIED
SECURITY:                BLOCKED
AUTH:                    BLOCKED
LEARNING ENGINE:         BLOCKED
CONTENT DELIVERY:        BLOCKED
OFFLINE:                 BLOCKED
STATION 01:              INCOMPLETE
ANIMATION:               FOUNDATION ONLY
QUEST/REWARD:            NOT IMPLEMENTED
E2E:                     NOT EXECUTED
ANDROID PERFORMANCE:    NOT EXECUTED
PILOT:                   NO-GO
PRODUCTION:              NO-GO
```

### مهم‌ترین نتیجه

پروژه را دور نمی‌اندازیم و معماری را عوض نمی‌کنیم.

مشکل اصلی **معماری بد نیست؛ فاصله بین معماری و implementation واقعی است.**

پس گام بعدی نباید ST02 باشد.

**گام بعدی باید `Remediation Sprint — Security + Learning Truth + Runtime Integration` باشد.**

فقط بعد از سبز شدن Gateهای A تا E، ST02 را شروع می‌کنیم.
