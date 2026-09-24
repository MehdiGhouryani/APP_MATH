# Database Schema & Data Model Specification — پلتفرم یادگیری شخصی ریاضی دبستان

**نسخه:** `v0.23`  
**نوع سند:** Database Schema & Data Model Specification  
**تاریخ:** ۲۴ سپتامبر ۲۰۲۶  
**مبنای محصول:** `math_learning_product_core_v0_21.md`  
**مبنای اجرایی:** `math_learning_product_implementation_spec_v0_22.md`
**Revision:** `v0.23-MA4` — Child Experience / Guided Path Data Boundary Finalization

> این سند Product Core را بازتعریف نمی‌کند. هدف آن تبدیل قراردادهای داده‌ای و runtime به یک مدل relational قابل‌پیاده‌سازی برای PostgreSQL است؛ با این تفاوت که V1 اکنون یک Child Mobile App و چند Web Client دارد. Database باید **Client-agnostic** بماند و Mobile-specific concerns را فقط در حد installation/device/sync metadata مدل کند.

---

# 0. وضعیت و مرز این نسخه

## 0.1 آنچه این سند می‌بندد

این نسخه برای اولین migrationهای PostgreSQL این موارد را مشخص می‌کند:

- canonical IDs
- ownership و cardinality
- جدول‌های Shared Platform Core
- جدول‌های Grade Package
- Session / Attempt / Answer / Evidence runtime
- versioning و immutability
- حداقل index / unique / foreign key / check constraint
- deletion و retention baseline
- event و audit envelope
- Mobile Client Installation / Push Subscription baseline
- offline/idempotency metadata baseline
- RLS boundary در سطح طراحی

## 0.2 آنچه عمداً هنوز schema مستقل ندارد

برای جلوگیری از over-modeling، این مفاهیم در V1 الزاماً table مستقل ندارند مگر در milestone بعدی نیاز واقعی ثابت شود:

- ArbitrationResult به‌عنوان aggregate مستقل
- Delegation به‌عنوان سیستم مستقل
- Journey / World / Region / Adventure به‌عنوان learning entity
- generic Rules Engine platform
- Recommendation model
- Graph Database
- full Event Sourcing / CQRS
- advanced analytics warehouse

این انتخاب با مرزبندی v0.21 سازگار است: event جای Evidence نیست، projection جای Truth مستقل نیست، و مدل‌های پیشرفته فقط در صورت نیاز واقعی persistent می‌شوند.

---

# 1. اصول غیرقابل‌مذاکره داده

## 1.1 Identity

هر domain record یک UUID opaque دارد. business code، slug و label نباید به‌عنوان primary key استفاده شوند.

```text
id = UUID
code = human-readable / semantic identifier
```

## 1.2 Immutable History

Evidence و Content Version و رکوردهای تاریخی مهم overwrite نمی‌شوند.

```text
Historical Fact
    ↓
Validity / Revision Overlay
    ↓
Current Projection
```

## 1.3 Event ≠ Evidence

هر event یک telemetry/audit fact است. فقط eventهایی که صریحاً در server-side mapping تعریف شده‌اند می‌توانند Evidence ایجاد کنند.

## 1.4 Account ≠ Learning Identity

```text
Supabase Auth Account
        ↓ optional binding
Learning Identity
        ↓
Learning History
```

این جداسازی باید در database نیز واقعی باشد، نه فقط مفهومی.

## 1.5 Client Installation Scope

`client_installation_id` در تمام جدول‌ها یک reference **فقط برای Mobile Client Installation** است. اگر همان رکورد از Web ایجاد یا به‌روزرسانی شود، این reference باید `NULL` بماند و Web provenance از request/session/event/audit metadata ردیابی شود.

```text
Mobile App → client_installation_id = Mobile Installation
Web        → client_installation_id = NULL
```

این قاعده مانع از آن می‌شود که browser session با Mobile installation در یک مفهوم persistence ادغام شود.

## 1.5 Child Learning Path is a Projection, not a Domain Entity

The child-facing Guided Path introduced in the UX contract is resolved from existing domain data:

```text
Grade Package
+ Station / Mission definitions
+ Learning State
+ Progression Milestones / Unlocks
+ Review / Recovery state
+ Current Learning Plan
        ↓
Child Path Projection
```

V1 must **not** create a `paths` table merely to render the UI. A Path node is a presentation/progression view unless a later product decision promotes a concept to a durable domain entity.

Path state must remain rebuildable from canonical records. Historical learning truth is never stored as a mutable path snapshot that can overwrite Evidence.

### Persisted onboarding boundary

- `learning_identities.current_grade_id` stores the selected/current Grade context.
- Diagnostic answers that are educationally meaningful flow through Attempt/Answer/Evidence contracts.
- Experience preferences are not Learning Truth; they should only become persistent domain data if a later contract establishes a real need.
- Character presentation, animation state, and visual path position are client/projection concerns and are not persisted as canonical learning state.

## 1.5 Grade یک context است، نه database مستقل

```text
ONE DATABASE
  ├── Grade 1 data
  ├── Grade 2 data
  └── ... Grade 6 data
```

## 1.6 Version Reference

هر runtime record که روی configuration یا content نسخه‌دار اجرا شده باید بتواند نسخه مورد استفاده را بازسازی کند.

حداقل برای Session:

```text
grade_id
curriculum_version_id
skill_graph_version_id
content_version references
```

---

# 2. PostgreSQL Conventions

| موضوع | تصمیم v0.23 |
|---|---|
| Primary Key | `uuid` |
| FK | `uuid` |
| زمان | `timestamptz` |
| متن | `text` |
| JSON | `jsonb` |
| عدد اعشاری | `numeric` |
| شمارنده | `integer` / `bigint` در صورت نیاز |
| Boolean | `boolean` |
| حذف تاریخی | status / validity؛ نه hard delete عادی |
| timezone | UTC در DB، نمایش local در application |
| naming | `snake_case` |
| table names | plural |
| ID naming | `<entity>_id` |
| code | text + unique در scope مربوطه |

برای state/statusهای domain، در V1 ترجیح با `text + CHECK` است تا migrationهای PostgreSQL برای تغییر enumهای سخت کم شود.

---

# 3. لایه‌های Schema

```text
PLATFORM CORE
├── Identity & Access
├── Relationships & Classes
├── Runtime
├── Evidence & Learning State
├── Events & Audit
│
GRADE PACKAGE
├── Grades
├── Curriculum
├── Skill Graph
├── Stations
├── Diagnostics
├── Content
├── Policies
└── Progression
```

---

# 4. Identity & Access Tables

## 4.1 `accounts`

نماینده Principal / Account متصل به Supabase Auth.

| Column | Type | Null | Key / Rule |
|---|---|---:|---|
| `id` | uuid | no | PK؛ ترجیحاً همان `auth.users.id` |
| `status` | text | no | `ACTIVE / SUSPENDED / DELETED` |
| `auth_kind` | text | no | `PERMANENT / ANONYMOUS` |
| `display_name` | text | yes | UI name؛ PII-sensitive |
| `locale` | text | no | default `fa-IR` |
| `timezone` | text | no | default مناسب محصول |
| `created_at` | timestamptz | no | default now |
| `updated_at` | timestamptz | no | server-managed |

**Constraint:** `id` به `auth.users(id)` متصل می‌شود.

---

## 4.2 `account_roles`

Role صرفاً primitive authorization است؛ scope از Relationship / Class membership می‌آید.

| Column | Type | Null | Key / Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `account_id` | uuid | no | FK accounts |
| `role` | text | no | `CHILD / PARENT / TEACHER / ADMIN` |
| `status` | text | no | `ACTIVE / REVOKED` |
| `granted_at` | timestamptz | no | |
| `revoked_at` | timestamptz | yes | |

`UNIQUE(account_id, role)` برای role فعال.

---

## 4.3 `client_installations`

هر **Mobile installation** یک شناسه Client عملیاتی مستقل دارد؛ **Learning Identity نیست**. یک Learning Identity می‌تواند چند Mobile installation داشته باشد. Web session یا browser context در این جدول ثبت نمی‌شود و از طریق `sessions` و `events/audit_records` trace می‌شود.

| Column | Type | Null | Key / Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `account_id` | uuid | yes | FK accounts؛ Guest mobile قبل از binding می‌تواند null باشد |
| `learning_identity_id` | uuid | yes | FK؛ در صورت اتصال Child Mobile Client |
| `client_type` | text | no | `MOBILE_IOS / MOBILE_ANDROID` |
| `app_version` | text | yes | Mobile app version |
| `build_number` | text | yes | release/build identifier |
| `platform_version` | text | yes | Mobile OS version؛ حداقل لازم |
| `installation_key_hash` | text | no | opaque, unique; raw installation secret ذخیره نمی‌شود |
| `status` | text | no | `ACTIVE / REVOKED / EXPIRED` |
| `last_seen_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |
| `revoked_at` | timestamptz | yes | |

### Rules

- `client_installations` فقط برای Mobile trace، session resume، push و compatibility است؛ منبع Learning Truth نیست.
- Web Client installation persistent در V1 ندارد؛ Web context از طریق Session، request metadata و Event/Audit trace می‌شود.
- اگر account یا learning identity حذف/غیرفعال شود، installationهای وابسته باید طبق policy revoke شوند.
- raw device fingerprint، contacts یا telemetry سخت‌افزاری غیرضروری در این جدول نگهداری نمی‌شود.

## 4.4 `push_subscriptions`

Subscription یک capability برای ارسال notification است؛ notification policy و learning decision در domain دیگری باقی می‌مانند.

| Column | Type | Null | Key / Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `client_installation_id` | uuid | no | FK client_installations |
| `provider` | text | no | `APNS / FCM` |
| `token_hash` | text | no | lookup/dedup hash |
| `token_ciphertext` | text | yes | اگر delivery provider نیاز دارد؛ secret-sensitive |
| `status` | text | no | `ACTIVE / REVOKED / EXPIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |
| `revoked_at` | timestamptz | yes | |

### Rules

- tokenها نباید در Event payload یا Evidence کپی شوند.
- یک installation می‌تواند چند subscription historical داشته باشد، ولی subscription فعال duplicate نباید ایجاد شود.

---

## 4.5 `client_pairing_tokens`

Token موقت برای pair کردن Child Mobile Installation با یک Learning Identity موجود است. این token بخشی از Learning Truth نیست.

| Column | Type | Null | Key / Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK learning_identities |
| `created_by_account_id` | uuid | no | FK accounts؛ Parent/Admin actor |
| `token_hash` | text | no | unique |
| `status` | text | no | `ACTIVE / CONSUMED / EXPIRED / REVOKED` |
| `expires_at` | timestamptz | no | short TTL |
| `consumed_by_client_installation_id` | uuid | yes | FK client_installations |
| `consumed_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

### Rules

- raw token ذخیره نمی‌شود.
- یک token فقط یک بار مصرف می‌شود.
- token expiration باید server-side enforce شود.
- ایجاد/مصرف/revoke باید audit شود.
- token نباید permission مستقل و دائمی بسازد؛ فقط installation binding را انجام می‌دهد.

---

## 4.6 `learning_identities`

Canonical learning identity کودک.

| Column | Type | Null | Key / Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `account_id` | uuid | yes | FK accounts؛ برای Guest می‌تواند null باشد |
| `status` | text | no | `ACTIVE / ARCHIVED / DELETION_PENDING / DELETED` |
| `source` | text | no | `REGISTERED / GUEST_CONVERTED / ADMIN_CREATED` |
| `current_grade_id` | uuid | yes | FK grades؛ cache/context، source of truth برای history نیست |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

### Uniqueness

- یک Account نباید به‌صورت تصادفی چند Learning Identity canonical فعال ایجاد کند.
- Guestها می‌توانند قبل از binding شدن به account بدون `account_id` وجود داشته باشند.

**توجه:** چون `current_grade_id` به Grade وابسته است، migration اجرای واقعی می‌تواند این FK را deferred یا بعد از ایجاد `grades` اضافه کند.

---

# 5. Learning Relationship & Context

## 5.1 `relationship_contexts`

دامنه‌ای که Relationship در آن معتبر است.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `type` | text | no | `PLATFORM / HOME / CLASS / TUTOR / CENTER` |
| `name` | text | yes | |
| `owner_account_id` | uuid | yes | FK accounts |
| `class_id` | uuid | yes | FK classes برای context نوع CLASS |
| `status` | text | no | `ACTIVE / ARCHIVED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`PLATFORM` فقط system-owned است و permission ایجاد نمی‌کند.

---

## 5.2 `relationships`

رابطه actor با Learning Identity.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `actor_account_id` | uuid | no | FK accounts |
| `context_id` | uuid | no | FK relationship_contexts |
| `relationship_type` | text | no | `PARENT / TEACHER / TUTOR / CENTER / SELF` |
| `purpose` | text | no | مثال: `CARE / TEACH / SUPPORT` |
| `scope` | jsonb | no | structured scope؛ permission engine آن را مصرف می‌کند |
| `status` | text | no | `PENDING / ACTIVE / SUSPENDED / EXPIRED / REMOVED` |
| `starts_at` | timestamptz | yes | |
| `ends_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

**Rule:** حذف Relationship سابقه Learning را حذف نمی‌کند.

---

# 6. Class Tables

## 6.1 `classes`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `name` | text | no | |
| `owner_account_id` | uuid | no | teacher/admin owner |
| `grade_id` | uuid | yes | FK grades؛ class V1 grade-specific |
| `status` | text | no | `ACTIVE / ARCHIVED` |
| `join_mode` | text | no | mechanism مشخص می‌شود؛ baseline `INVITE_CODE` |
| `join_code_hash` | text | yes | خام code ذخیره نمی‌شود |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

## 6.2 `class_memberships`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `class_id` | uuid | no | FK |
| `learning_identity_id` | uuid | no | FK؛ برای student |
| `member_account_id` | uuid | yes | FK؛ در مواردی که actor مستقیم است |
| `role` | text | no | `STUDENT / TEACHER` |
| `status` | text | no | `INVITED / ACTIVE / REMOVED` |
| `joined_at` | timestamptz | yes | |
| `removed_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

Unique active membership بر اساس `(class_id, learning_identity_id, role)`.

---

# 7. Grade Package Tables

## 7.1 `grades`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_number` | smallint | no | CHECK 1..6 |
| `code` | text | no | `G1` ... `G6` |
| `title` | text | no | |
| `language` | text | no | default `fa-IR` |
| `status` | text | no | `DRAFT / ACTIVE / ARCHIVED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(grade_number)`, `UNIQUE(code)`.

---

## 7.2 `curriculum_versions`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `version` | text | no | semantic/package version |
| `source_reference` | text | yes | منبع curriculum |
| `effective_from` | timestamptz | yes | |
| `effective_to` | timestamptz | yes | |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(grade_id, version)`.

---

## 7.3 `skill_graph_versions`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `curriculum_version_id` | uuid | no | FK |
| `version` | text | no | |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(grade_id, version)`.

---

## 7.4 `skill_families`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `code` | text | no | |
| `title` | text | no | |
| `description` | text | yes | |
| `status` | text | no | `ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(grade_id, code)`.

---

# 8. Skill Identity Decision — مهم

`Skill` باید هویت canonical پایدار داشته باشد؛ version graph نباید باعث تغییر identity مهارت شود.

بنابراین v0.23 از دو لایه استفاده می‌کند:

```text
skills
  ↓ membership
skill_graph_nodes
  ↓
skill_graph_versions
```

این یک تصمیم اجرایی برای حل هم‌زمان دو نیاز است:

1. `Skill ID` در Evidence و Learning History پایدار بماند.
2. نسخه‌های متفاوت Skill Graph بتوانند mapping و composition متفاوت داشته باشند.

## 8.1 `skills`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `owning_grade_id` | uuid | yes | FK grades؛ می‌تواند برای cross-grade skill null باشد |
| `family_id` | uuid | yes | FK skill_families |
| `code` | text | no | canonical semantic code |
| `title` | text | no | |
| `description` | text | yes | |
| `status` | text | no | `ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(code)` در کل platform پیشنهاد می‌شود؛ اگر cross-grade ownership code مشترک نباشد، scope بر اساس grade اعمال می‌شود.

## 8.2 `skill_graph_nodes`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `skill_graph_version_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `display_order` | integer | yes | navigation/admin only |
| `status` | text | no | `ACTIVE / EXCLUDED` |

`UNIQUE(skill_graph_version_id, skill_id)`.

---

## 8.3 `skill_relations`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `skill_graph_version_id` | uuid | no | FK |
| `source_skill_id` | uuid | no | FK skills |
| `target_skill_id` | uuid | no | FK skills |
| `relation_type` | text | no | `PREREQUISITE / SUPPORTING / RELATED` |
| `weight` | numeric(6,3) | yes | optional; semantic only until calibrated |
| `created_at` | timestamptz | no | |

Checks:

- source != target
- unique `(skill_graph_version_id, source_skill_id, target_skill_id, relation_type)`

---

# 9. Station Tables

برای Station نیز definition و version باید از هم قابل‌تفکیک باشند، اما در V1 یک Station definition می‌تواند به یک curriculum version تعلق داشته باشد و پس از انتشار immutable باشد.

## 9.1 `stations`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `curriculum_version_id` | uuid | no | FK |
| `code` | text | no | مثل `G1-S01` |
| `sequence` | integer | no | مسیر کتاب/grade |
| `title` | text | no | |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(curriculum_version_id, code)`, `UNIQUE(curriculum_version_id, sequence)`.

## 9.2 `station_skills`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `station_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `mapping_role` | text | no | `PRIMARY / SUPPORTING` |
| `is_decision_target` | boolean | no | default true |

PK: `(station_id, skill_id)`.

---

# 10. Learning Objective Tables

## 10.1 `learning_objectives`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `code` | text | no | |
| `title` | text | no | |
| `description` | text | yes | |
| `status` | text | no | `ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(grade_id, code)`.

`Learning Objective Context` به‌عنوان value/classification در runtime ذخیره می‌شود و table مستقل ندارد.

---

# 11. Content Tables

## 11.1 `content_artifacts`

Artifact هویت پایدار محتواست؛ نسخه‌ها در `content_versions` هستند.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `artifact_code` | text | no | |
| `artifact_type` | text | no | `QUESTION / REPRESENTATION / HINT / INSTRUCTION / EXPERIENCE` |
| `title` | text | yes | internal/admin |
| `status` | text | no | `ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

`UNIQUE(grade_id, artifact_code)`.

## 11.2 `content_versions`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `content_artifact_id` | uuid | no | FK |
| `version_number` | integer | no | >=1 |
| `status` | text | no | `DRAFT / REVIEW / QA / PILOT / ACTIVE / RETIRED` |
| `availability_overlay` | text | no | `NORMAL / QUARANTINED` |
| `interaction_type` | text | yes | V1 canonical set |
| `prompt` | jsonb | no | renderable content structure |
| `answer_schema` | jsonb | yes | expected answer contract |
| `evaluator_config` | jsonb | yes | evaluator/version reference |
| `feedback_config` | jsonb | yes | correct/incorrect feedback |
| `hint_config` | jsonb | yes | hint structure |
| `metadata` | jsonb | no | age/language/rendering metadata |
| `provenance` | jsonb | no | author/source/reference |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |
| `published_at` | timestamptz | yes | |

Canonical interaction types for V1:

```text
MULTIPLE_CHOICE
TAP
DRAG_DROP
SORT
COUNT
COLOR
NUMBER_LINE
MATCH
```

After `ACTIVE`, row content is immutable. اصلاح = version جدید.

## 11.3 `content_version_skills`

چون یک content version ممکن است چند Skill را هدف بگیرد.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `content_version_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `role` | text | no | `PRIMARY / SUPPORTING / SIGNAL` |

PK `(content_version_id, skill_id)`.

## 11.4 `content_version_stations`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `content_version_id` | uuid | no | FK |
| `station_id` | uuid | no | FK |
| `role` | text | no | `PRIMARY / SUPPORTING` |

PK `(content_version_id, station_id)`.

## 11.5 `content_version_objectives`

PK `(content_version_id, learning_objective_id)`.

## 11.6 `content_assets`

reference به Supabase Storage؛ bytes در DB ذخیره نمی‌شوند.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `content_version_id` | uuid | no | FK |
| `asset_type` | text | no | `AUDIO / IMAGE / ANIMATION / FILE` |
| `storage_bucket` | text | no | |
| `storage_path` | text | no | |
| `mime_type` | text | no | |
| `byte_size` | bigint | yes | |
| `checksum` | text | yes | content hash |
| `status` | text | no | `ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |

`UNIQUE(storage_bucket, storage_path)`.

---

# 12. Diagnostic Tables

## 12.1 `diagnostic_sets`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `curriculum_version_id` | uuid | no | FK |
| `version` | text | no | |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `config` | jsonb | no | budget/scoring config |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

## 12.2 `diagnostic_probes`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `diagnostic_set_id` | uuid | no | FK |
| `content_version_id` | uuid | no | FK |
| `sequence` | integer | no | |
| `status` | text | no | `ACTIVE / RETIRED` |
| `max_attempts` | smallint | no | default 1 |
| `skip_allowed` | boolean | no | default true |
| `metadata` | jsonb | no | |

`UNIQUE(diagnostic_set_id, sequence)`.

## 12.3 `diagnostic_probe_skills`

برای Probeهای multi-skill.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `diagnostic_probe_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `signal_weight` | numeric(6,3) | yes | optional |
| `is_primary` | boolean | no | default false |

PK `(diagnostic_probe_id, skill_id)`.

---

# 13. Policy Tables

## 13.1 `mastery_contract_versions`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `skill_family_id` | uuid | no | FK |
| `version` | text | no | |
| `policy` | jsonb | no | sufficiency/diversity/confidence/retention/transfer |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `effective_from` | timestamptz | yes | |
| `effective_to` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

`UNIQUE(skill_family_id, version)`.

## 13.2 `mastery_evaluations`

Historical evaluation record.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `context_id` | uuid | no | FK |
| `contract_version_id` | uuid | no | FK |
| `result` | text | no | `NOT_MET / MET / UNCERTAIN` |
| `evidence_snapshot` | jsonb | no | IDs / summary فقط؛ raw evidence duplicated نمی‌شود |
| `evaluated_at` | timestamptz | no | |
| `decision_id` | uuid | yes | FK learning_decisions |

## 13.3 `pass_policies`

برای gate عملی Station، جدا از Mastery.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `station_id` | uuid | no | FK |
| `version` | text | no | |
| `config` | jsonb | no | مثلاً 4/5 × two checks |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |

## 13.4 `recovery_policies`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `station_id` | uuid | yes | null = grade default |
| `version` | text | no | |
| `config` | jsonb | no | recovery steps |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |

## 13.5 `age_profiles`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `version` | text | no | |
| `config` | jsonb | no | readingLoad / visualDensity / interactionMode / animationLevel / feedbackStyle |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |

---

# 14. Runtime Tables

## 14.1 `mission_instances`

Mission definition یک Product/Experience reference است؛ اجرای کودک در این table persistent می‌شود.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `grade_id` | uuid | no | FK |
| `mission_code` | text | no | reusable definition reference |
| `status` | text | no | `PLANNED / STARTED / COMPLETED / ABANDONED` |
| `started_at` | timestamptz | yes | |
| `completed_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

## 14.2 `sessions`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `mission_instance_id` | uuid | yes | FK |
| `grade_id` | uuid | no | FK |
| `curriculum_version_id` | uuid | no | FK |
| `skill_graph_version_id` | uuid | no | FK |
| `relationship_context_id` | uuid | no | FK |
| `created_by_client_installation_id` | uuid | yes | FK client_installations؛ فقط Mobile؛ installation ایجادکننده Session |
| `last_resumed_by_client_installation_id` | uuid | yes | FK client_installations؛ فقط Mobile؛ آخرین Mobile client برای resume trace |
| `session_type` | text | no | `LEARNING / DIAGNOSTIC / RECOVERY / REVIEW` |
| `status` | text | no | `CREATED / ACTIVE / INTERRUPTED / COMPLETED / ABANDONED` |
| `resume_token` | text | yes | opaque server-side token/reference |
| `started_at` | timestamptz | yes | |
| `last_activity_at` | timestamptz | yes | |
| `completed_at` | timestamptz | yes | |
| `abandoned_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

### Session invariants

- refresh نباید session جدید بسازد.
- duplicate submit نباید Attempt دوم ایجاد کند؛ idempotency layer لازم است.
- session نسخه grade/curriculum/graph خود را pin می‌کند.
- server source of truth است؛ offline فقط pending action را نگه می‌دارد.
- یک Session می‌تواند بعداً از Mobile installation دیگری resume شود؛ `created_by_client_installation_id` فقط provenance ایجاد Session را نگه می‌دارد و `last_resumed_by_client_installation_id` فقط آخرین Mobile client برای trace را ثبت می‌کند؛ هیچ‌کدام مالک Session نیستند.
- اگر Session روی Web ایجاد شود، این دو فیلد `NULL` می‌مانند و Web provenance از Session/Event metadata و audit trace قابل‌ردگیری است.

---

## 14.3 `encounters`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `session_id` | uuid | no | FK |
| `station_id` | uuid | yes | FK |
| `content_version_id` | uuid | yes | FK |
| `learning_role` | text | no | `DIAGNOSTIC_PROBE / INSTRUCTION / GUIDED_PRACTICE / INDEPENDENT_PRACTICE / REVIEW / TRANSFER / MASTERY_CHECK` |
| `experience_form` | text | no | `STORY / PUZZLE / CHALLENGE / BOSS / BUILD_EXPLORE / CONVERSATION` |
| `sequence` | integer | no | |
| `status` | text | no | `PLANNED / PRESENTED / RESPONDED / EVALUATED / CLOSED / SKIPPED` |
| `presented_at` | timestamptz | yes | |
| `completed_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

`UNIQUE(session_id, sequence)`.

---

## 14.4 `attempts`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `encounter_id` | uuid | no | FK |
| `attempt_number` | smallint | no | >=1 |
| `status` | text | no | `PRESENTED / ANSWERED / EVALUATED` |
| `hint_used` | boolean | no | |
| `hint_count` | smallint | no | >=0 |
| `started_at` | timestamptz | yes | |
| `submitted_at` | timestamptz | yes | |
| `evaluated_at` | timestamptz | yes | |
| `idempotency_key` | text | yes | unique per operation/session/installation scope |
| `client_installation_id` | uuid | yes | FK client_installations |
| `client_event_id` | text | yes | client-generated action ID for offline dedupe |
| `created_at` | timestamptz | no | |

`UNIQUE(encounter_id, attempt_number)`.

---

## 14.5 `answers`

هر Attempt حداقل یک answer دارد؛ برخی interactionها ممکن است multi-part باشند.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `attempt_id` | uuid | no | FK |
| `part_key` | text | yes | multi-part interaction |
| `raw_response` | jsonb | no | exact user response |
| `normalized_response` | jsonb | yes | evaluator normalization |
| `is_correct` | boolean | yes | set only after evaluation |
| `score` | numeric(8,4) | yes | optional |
| `evaluator_version` | text | yes | evaluator contract |
| `feedback_code` | text | yes | machine-stable code |
| `response_latency_ms` | integer | yes | |
| `submitted_at` | timestamptz | no | |
| `evaluated_at` | timestamptz | yes | |

برای پاسخ‌های child، `raw_response` نباید PII غیرضروری داشته باشد.

---

# 15. Evidence & Interpretation

## 15.1 `evidence`

Evidence immutable learning fact است.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `grade_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `learning_objective_id` | uuid | yes | FK |
| `relationship_context_id` | uuid | no | FK؛ می‌تواند Platform Context باشد |
| `objective_context` | text | no | `PRACTICE / REVIEW / ASSIGNMENT / EXAM_PREP / RECOVERY / DIAGNOSTIC` |
| `encounter_id` | uuid | yes | FK |
| `content_version_id` | uuid | yes | FK |
| `attempt_id` | uuid | yes | FK |
| `answer_id` | uuid | yes | FK |
| `source_type` | text | no | `SYSTEM / TEACHER / PARENT / ASSESSMENT / ASSIGNMENT` |
| `actor_account_id` | uuid | yes | FK accounts |
| `evidence_kind` | text | no | `PERFORMANCE / OBSERVATION / ASSESSMENT / TRANSFER` |
| `signal` | jsonb | no | correctness/independence/hint/etc |
| `provenance` | jsonb | no | source trace |
| `occurred_at` | timestamptz | no | event time authoritative only after server acceptance |
| `recorded_at` | timestamptz | no | server time |
| `client_installation_id` | uuid | yes | FK client_installations |
| `client_event_id` | text | yes | offline dedupe reference |

### Evidence rules

- insert-only in normal app flow.
- اصلاح اعتبار با `evidence_validity_records`.
- Evidence ممکن است از یک Answer به چند Skill تولید شود.
- Evidence بدون provenance معتبر نیست.

## 15.2 `evidence_validity_records`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `evidence_id` | uuid | no | FK |
| `status` | text | no | `VALID / INVALID / SUPERSEDED` |
| `reason_code` | text | no | |
| `reason_detail` | text | yes | |
| `actor_account_id` | uuid | yes | FK |
| `created_at` | timestamptz | no | |

این جدول fact اصلی را تغییر نمی‌دهد.

## 15.3 `interpretations`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `context_id` | uuid | no | FK |
| `status` | text | no | `ACTIVE / SUPERSEDED` |
| `interpretation_type` | text | no | `STATE_SIGNAL / ERROR_PATTERN / OTHER` |
| `summary` | text | yes | human-readable summary |
| `confidence` | numeric(6,5) | yes | 0..1 |
| `uncertainty` | numeric(6,5) | yes | 0..1 |
| `basis` | jsonb | no | evidence IDs / policy refs |
| `created_at` | timestamptz | no | |
| `superseded_at` | timestamptz | yes | |

## 15.4 `error_hypotheses`

Specialized interpretation.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `interpretation_id` | uuid | no | FK |
| `hypothesis_code` | text | no | |
| `status` | text | no | `PROPOSED / ACTIVE / REJECTED / SUPERSEDED / EXPIRED` |
| `strength` | numeric(6,5) | yes | 0..1 |
| `reasoning` | jsonb | yes | structured support |
| `created_at` | timestamptz | no | |
| `resolved_at` | timestamptz | yes | |

---

# 16. Learning State

## 16.1 `learning_states`

State جاری، نه historical truth.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `skill_id` | uuid | no | FK |
| `relationship_context_id` | uuid | no | FK |
| `state` | text | no | `NEW / EMERGING / DEVELOPING / STABLE / TRANSFER_READY / MASTERED` |
| `retention_state` | text | no | `FRESH / REVIEW_DUE / AT_RISK` |
| `confidence` | numeric(6,5) | yes | derived |
| `uncertainty` | numeric(6,5) | yes | derived |
| `evidence_count` | integer | no | derived/cache |
| `last_evidence_at` | timestamptz | yes | |
| `last_evaluation_at` | timestamptz | yes | |
| `state_version` | bigint | no | optimistic concurrency |
| `updated_at` | timestamptz | no | |

Unique semantic key:

```text
(learning_identity_id, skill_id, relationship_context_id)
```

State updates must be traceable to Evidence/Interpretation/Policy through Decision or audit metadata.

---

# 17. Decision & Plan Runtime

## 17.1 `learning_decisions`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `grade_id` | uuid | no | FK |
| `context_id` | uuid | no | FK |
| `status` | text | no | `PROPOSED / COMMITTED / SUPERSEDED` |
| `decision_type` | text | no | candidate role |
| `target_skill_id` | uuid | yes | FK |
| `target_station_id` | uuid | yes | FK |
| `reason` | jsonb | no | evidence/state references |
| `policy_refs` | jsonb | no | policy version references |
| `selected_candidate` | jsonb | no | selected plan input |
| `created_at` | timestamptz | no | |
| `committed_at` | timestamptz | yes | |

## 17.2 `learning_plans`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `decision_id` | uuid | no | FK |
| `learning_identity_id` | uuid | no | FK |
| `status` | text | no | `DRAFT / ACTIVE / COMPLETED / CANCELLED / SUPERSEDED` |
| `plan_config` | jsonb | no | dosage/sequence/experience constraints |
| `revision` | integer | no | >=1 |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |

Unique `(decision_id, revision)`.

ArbitrationResult table در V1 لازم نیست؛ trace موردنیاز در `reason + policy_refs + selected_candidate` نگهداری می‌شود مگر audit بعدی نیاز جدی به جداکردن آن پیدا کند.

---

# 18. Progression Tables

## 18.1 `progression_configs`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `grade_id` | uuid | no | FK |
| `version` | text | no | |
| `config` | jsonb | no | milestone / unlock policy |
| `status` | text | no | `DRAFT / ACTIVE / RETIRED` |
| `created_at` | timestamptz | no | |

## 18.2 `progression_milestones`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `progression_config_id` | uuid | no | FK |
| `code` | text | no | |
| `title` | text | no | |
| `condition` | jsonb | no | evidence/mastery condition |
| `status` | text | no | `ACTIVE / RETIRED` |

## 18.3 `unlocks`

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `learning_identity_id` | uuid | no | FK |
| `milestone_id` | uuid | no | FK |
| `target_type` | text | no | `STATION / MISSION / EXPERIENCE` |
| `target_ref` | uuid | no | opaque target ID |
| `state` | text | no | `LOCKED / UNLOCKED` |
| `granted_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

Unique active unlock per `(learning_identity_id, target_type, target_ref)`.

---

# 19. Events & Audit

## 19.1 `events`

Telemetry / domain event envelope مشترک.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK = event_id |
| `event_type` | text | no | stable machine name |
| `schema_version` | integer | no | >=1 |
| `actor_account_id` | uuid | yes | FK accounts |
| `learning_identity_id` | uuid | yes | FK |
| `grade_id` | uuid | yes | FK |
| `session_id` | uuid | yes | FK |
| `station_id` | uuid | yes | FK |
| `content_version_id` | uuid | yes | FK |
| `client_installation_id` | uuid | yes | FK client_installations |
| `client_sequence` | bigint | yes | monotonic sequence per installation when available |
| `occurred_at` | timestamptz | no | client/device time claim |
| `recorded_at` | timestamptz | no | server authority |
| `correlation_id` | uuid | yes | request/workflow trace |
| `causation_id` | uuid | yes | causal predecessor |
| `idempotency_key` | text | yes | dedupe |
| `payload` | jsonb | no | minimized, no unnecessary PII |

Recommended index:

```text
(learning_identity_id, recorded_at desc)
(event_type, recorded_at desc)
(correlation_id)
```

## 19.2 `audit_records`

برای access و actionهای حساس.

| Column | Type | Null | Rule |
|---|---|---:|---|
| `id` | uuid | no | PK |
| `actor_account_id` | uuid | yes | FK |
| `action` | text | no | |
| `resource_type` | text | no | |
| `resource_id` | uuid | yes | |
| `result` | text | no | `ALLOWED / DENIED / ERROR` |
| `reason` | text | yes | |
| `metadata` | jsonb | no | بدون secret/PII غیرضروری |
| `occurred_at` | timestamptz | no | |

---

# 20. Idempotency & Offline Sync

در V1 exactly-once transport لازم نیست. Domain باید at-least-once delivery + idempotent handling را تحمل کند.

### 20.1 عملیات idempotent اجباری

- answer submission
- attempt evaluation acceptance
- evidence creation from accepted answer
- unlock grant
- session resume/update
- diagnostic probe submission
- event ingestion

### 20.2 Canonical Client Action

هر action مهمی که ممکن است offline queue شود باید یک شناسه client-generated داشته باشد:

```text
client_installation_id
+
client_event_id / idempotency_key
+
operation type
```

Server باید duplicate را به‌صورت deterministic تشخیص دهد.

### 20.3 Baseline flow

```text
Mobile / Web Client
      ↓
Local Pending Action
      ↓
HTTPS submission
      ↓
Idempotency check
      ↓
Domain transaction
      ↓
Accepted result
      ↓
Client marks action synced
```

Duplicate:

```text
Same operation + same idempotency key
        ↓
No second transition
        ↓
Return original accepted outcome or deterministic duplicate response
```

### 20.4 Ordering

`client_sequence` در صورت وجود برای ordering aid استفاده می‌شود؛ source of truth نیست. Server order و domain transaction precedence canonical است.

Device timestamp authority نیست؛ `recorded_at` server time است و `occurred_at` claim/provenance زمانی را نگه می‌دارد.

### 20.5 What offline cannot decide

offline mode نباید به‌تنهایی این موارد را authoritative commit کند:

- final Learning State
- Mastery verdict
- Station Pass
- permission grants
- sensitive relationship changes


---

# 21. Referential Integrity Rules

## 21.1 `ON DELETE`

برای historical data، cascade حذف ممنوع است.

Default:

```text
ON DELETE RESTRICT
```

در مواردی که رابطه واقعاً optional است:

```text
ON DELETE SET NULL
```

`CASCADE` فقط برای child records کاملاً local و non-historical قابل‌قبول است، مثل برخی draft junctionها.

## 21.2 Version integrity

یک runtime record نباید به version دیگری از همان artifact switch شود.

مثلاً:

```text
Session -> curriculum_version_id
Encounter -> content_version_id
Evidence -> content_version_id
```

این references immutable هستند.

---

# 22. Uniqueness & Index Baseline

## High-value unique indexes

```text
accounts.id
account_roles(account_id, role)
learning_identities.account_id [active subset]
classes(owner_account_id, name) [implementation-dependent]
class_memberships(class_id, learning_identity_id, role)
grades.grade_number
grades.code
curriculum_versions(grade_id, version)
skill_graph_versions(grade_id, version)
skill_graph_nodes(skill_graph_version_id, skill_id)
stations(curriculum_version_id, sequence)
stations(curriculum_version_id, code)
content_artifacts(grade_id, artifact_code)
content_versions(content_artifact_id, version_number)
encounters(session_id, sequence)
attempts(encounter_id, attempt_number)
learning_states(learning_identity_id, skill_id, relationship_context_id)
progression_milestones(progression_config_id, status)
unlocks(learning_identity_id, state, granted_at desc)
```

## High-value lookup indexes

```text
evidence(learning_identity_id, occurred_at desc)
evidence(skill_id, occurred_at desc)
evidence(context_id, occurred_at desc)
sessions(learning_identity_id, created_at desc)
encounters(session_id, sequence)
answers(attempt_id, submitted_at)
events(learning_identity_id, recorded_at desc)
events(client_installation_id, recorded_at desc) -- Mobile-only reference; Web events may keep NULL
client_installations(account_id, status)
client_installations(learning_identity_id, status)
push_subscriptions(client_installation_id, status)
audit_records(resource_type, resource_id, occurred_at desc)
```

---

# 23. Soft Delete / Retention Policy Baseline

## Normal application behavior

### Historical learning data

Hard delete ممنوع در عملیات عادی:

- Evidence
- Answer
- Attempt
- Session
- Interpretation
- Decision
- Audit
- Event

### Versioned product data

Hard delete بعد از reference شدن ممنوع:

- Content Version
- Skill Graph Version
- Curriculum Version
- Mastery Contract Version
- Policy versions

به‌جای آن `RETIRED` / `SUPERSEDED` / `QUARANTINED` استفاده می‌شود.

### Account / Relationship

- Relationship: lifecycle state
- Account: lifecycle state
- Learning Identity: deletion workflow جداگانه

Retention واقعی Guest و deletion واقعی داده کودک تا قبل از production نیازمند Privacy/Legal decision است و این سند threshold حقوقی جعل نمی‌کند.

---

# 24. RLS Boundary — طراحی قبل از v0.25

RLS باید بر اساس `learning_identity_id` و Relationship scope طراحی شود، نه صرفاً role.

## baseline

| Actor | Resource | Read | Write |
|---|---|---:|---:|
| Child | own session/attempt/answer | yes | own execution |
| Child | own evidence | projection only | no direct mutation |
| Parent | related child progress | yes | no learning history overwrite |
| Teacher | class students summary | yes | teacher workflow only |
| Teacher | other class | no | no |
| Child / Account | own active client installations | yes | register/revoke own install within policy |
| Child / Account | own push subscriptions | yes | own subscription management |
| Admin | operational/config resources | policy-based | policy-based |

اصل:

```text
Default Deny
+ Least Privilege
+ Server-side Authorization
+ RLS
```

RLS implementation SQL در سند Auth/RLS بعدی می‌آید؛ v0.23 فقط ownership boundary را قفل می‌کند.

---

# 25. Grade Package Integrity Constraints

هر Grade Package که `ACTIVE` می‌شود باید این contractها را پاس کند:

```text
GradeDefinition valid
CurriculumVersion valid
SkillGraphVersion valid
All graph nodes reference active Skills
No invalid prerequisite relation
Every active Station has sequence
StationSkill mapping valid
Every active DiagnosticProbe targets valid Skill
Every ACTIVE ContentVersion belongs to correct Grade
Every required ContentVersion is traceable to Station/Skill/Objective
PassPolicy exists for operational Stations
RecoveryPolicy available by station or grade default
AgeProfile exists
ProgressionConfig exists
```

این‌ها بخشی از application-level contract test نیز خواهند بود؛ همه آن‌ها نباید با SQL CHECK بیان شوند.

---

# 26. Migration Strategy

ترتیب migrationها:

```text
001_extensions_and_helpers
002_accounts_and_roles
003_client_installations_and_push_subscriptions
004_learning_identities
005_relationship_contexts_and_relationships
006_classes_and_memberships
007_grades_and_curriculum
008_skill_graph
009_stations
010_learning_objectives
011_content
012_diagnostics
013_policies
014_runtime
015_evidence_and_interpretation
016_learning_states
017_decisions_and_plans
018_progression
019_events_and_audit
020_indexes_and_constraints
021_rls_baseline
```

هر migration:

- transaction-safe تا جای ممکن
- backward-compatible در rolloutهای runtime
- قابل‌اجرای مجدد فقط در pipeline migration tool، نه با اجرای دستی
- بدون seed وابسته به environment production secrets

---

# 27. Seed Data Baseline

Seed اولیه باید فقط داده‌های لازم برای development/staging را ایجاد کند:

```text
Grades: G1..G6 definitions
Grade 1: ACTIVE build package
Grade 2..6: registry rows only / not production-active
Grade 1 curriculum version placeholder
Grade 1 skill graph version placeholder
Station 01 placeholder
Platform relationship context
Development admin account mapping
```

**مهم:** artifact `math_learning_product_grade1_skill_graph_v0_27.md` اکنون 64 Skill و 25 Station + mapping/relation contract را تعریف می‌کند. این داده‌ها تا educational review `PROVISIONAL / DERIVED` هستند و فقط پس از approval باید در seed فعال وارد شوند.

---

# 28. Explicit Decisions for v0.23

این نسخه چند تصمیم اجرایی را برای جلوگیری از ambiguity می‌بندد:

### D1 — Stable Skill identity

Skill ID از Skill Graph Version جداست؛ graph membership versioned است.

### D2 — Session pins package versions

Session همیشه Grade + Curriculum + Skill Graph context خود را نگه می‌دارد.

### D3 — Evidence is append-only

اصلاح با validity overlay است، نه update/delete fact.

### D4 — Content Version immutable after ACTIVE

هر تغییر meaningful یک version جدید است.

### D5 — Runtime is version-aware

Encounter/Attempt/Evidence باید بتوانند Content Version و Grade context خود را ردیابی کنند.

### D6 — No separate DB per grade

تمام پایه‌ها در یک relational database.

### D7 — No generic metadata-only domain

جایی که referential integrity لازم است، JSON جای relation table را نمی‌گیرد.

### D8 — JSONB فقط برای configuration/payload

`policy`, `prompt`, `answer_schema`, `evaluator_config`, `feedback_config`, `provenance`, `event payload` از JSONB استفاده می‌کنند؛ identity و relationهای اصلی relational می‌مانند.

### D9 — Client Installation ≠ Learning Identity

تعداد Device/App installationها نباید باعث ایجاد Learning Identity جدید شود.

### D10 — Session is Client-agnostic

Session به Learning Identity و server state تعلق دارد؛ می‌تواند روی Web شروع و روی Mobile ادامه پیدا کند یا برعکس، مشروط به authorization و resume policy.

### D11 — Mobile is a Client, not a Domain Owner

Mobile-specific data فقط برای installation, push, compatibility, trace و sync metadata persistent می‌شود؛ Learning Truth و Learning State در Platform Core باقی می‌مانند.

### D12 — Child Path is Rebuildable

The child-facing Guided Path is a projection assembled from canonical package, state, progression, review/recovery and plan data. No independent mutable `path truth` exists in V1.

### D13 — Onboarding Preferences are Not Learning Evidence

Grade selection is context; experience preferences are product preferences; only educationally meaningful diagnostic responses become Evidence through the canonical runtime.

Mobile-specific data فقط برای installation, push, compatibility, trace و sync metadata persistent می‌شود؛ Learning Truth و Learning State در Platform Core باقی می‌مانند.

---

# 29. Deferred to Next Specifications

## v0.24 — Child App Experience & Journey

`CLOSED` — implemented as a UX contract; no new path domain entity introduced.

## v0.25 — Auth / Permission / RLS

- Web + Mobile Auth flow
- deep-link / app-to-web handoff
- client installation registration/revocation
- exact Supabase Auth flow
- child / parent access flow
- teacher approval
- class membership workflow
- RLS SQL policies
- server authorization helpers
- guest → registered conversion
- elevated access / audit rules

## v0.27 — Grade 1 Skill Graph & Station Contract

- 64 Skill verification
- Skill families
- prerequisite graph
- Station 01..25 mapping
- cross-grade extension rules

## v0.28 — Content Contract

- exact JSON shapes
- evaluator interface
- answer schemas
- hint/feedback/audio/media contract
- content QA contract

## v0.29 — Session Runtime & Learning Rules

- Web/Mobile session continuity
- offline queue acceptance/rejection semantics
- lifecycle transition table
- idempotency behavior
- recovery rules
- state transition rules
- Station Pass implementation
- Diagnostic scoring

> **بعد از بسته‌شدن v0.29، همراه با verification artifactهای Grade 1، ورودی‌های قراردادی لازم برای Station 01 End-to-End آماده‌اند.**

---

# 30. Implementation Readiness Gate after v0.23

با بسته‌شدن این سند، تیم می‌تواند بدون حدس‌زدن درباره مدل persistence، skeleton migration را ایجاد کند؛ اما هنوز نباید production-quality learning coding را کامل‌شده فرض کرد.

### چه چیزی بعد از v0.23 مجاز است؟

- **Repository / app-shell bootstrap:** بله، پس از بسته‌شدن v0.25 Technical Architecture.
- **Database migration / RLS baseline:** پس از بسته‌شدن v0.26 Auth / Permission / RLS.
- **Production-quality Station 01 learning code:** هنوز نه؛ باید v0.26، v0.27، v0.28 و v0.29 و artifactهای Grade 1 نیز بسته/verified شوند.

### Ready

- [x] shared vs grade-aware table boundary
- [x] canonical ID policy
- [x] immutable/versioned data policy
- [x] core runtime entities
- [x] Mobile Client Installation / Push baseline
- [x] evidence/state separation
- [x] event/audit separation
- [x] base integrity/index rules

### Still Required

- [ ] RLS SQL
- [ ] exact Auth workflow
- [ ] exact Mobile token / deep-link flow
- [ ] verified Grade 1 Skill Graph
- [ ] verified Station mapping
- [ ] exact Content Contract
- [ ] executable Learning Rules
- [ ] actual migration files
- [ ] test cases

---

# 31. خلاصه نهایی

```text
                 ONE POSTGRESQL DATABASE
                             │
            ┌────────────────┴────────────────┐
            │                                 │
      PLATFORM CORE                      GRADE PACKAGES
            │                                 │
   Identity / Relationship             Grade / Curriculum
   Class / Session                     Skill Graph
   Attempt / Answer                    Stations
   Evidence                            Diagnostics
   Learning State                      Content
   Decision / Plan                     Policies
   Event / Audit                       Progression
            │                                 │
            └────────────────┬────────────────┘
                             │
                      VERSION-AWARE RUNTIME
                             │
                    Grade + Graph + Content
```

> **v0.23 تصمیم می‌گیرد که PostgreSQL «source of truth» تاریخی و operational باشد، Skill/Content/Policy را version-aware نگه دارد، Learning Identity را بین پایه‌ها پایدار نگه دارد، و Clientها را بدون ساختن backend/database موازی به همان runtime متصل کند. Mobile-specific state فقط تا سطح installation/push/sync trace persistence پیدا می‌کند.**


---

<div dir="rtl" align="right">

# COMPLETION ADDENDUM — v0.30 Game / Quest / Reward Data Boundary

**Historical source:** Database Schema v0.23 is preserved. This addendum defines the minimal persistence needed for Game/Quest/Reward without over-modeling the platform.

## 1. Games

No mandatory `games` table is introduced in V1. A Mini Game is represented through existing `content_artifacts` / `content_versions` with:

- `artifact_type = EXPERIENCE`
- `interaction_type = MINI_GAME`
- `experience_form = MINI_GAME`
- explicit Skill/Station references
- versioned evaluator config

Stateful client interaction remains transient unless a later product requirement proves a durable game-state entity necessary.

## 2. Quest tables

### `quest_definitions`

- `id uuid PK`
- `grade_id uuid FK`
- `code text`
- `version text`
- `quest_type text` = `PATH_PROGRESS / SKILL_REVIEW / RECOVERY / GAME_PRACTICE / TRANSFER / MILESTONE`
- `target_config jsonb`
- `condition jsonb`
- `reward_config jsonb`
- `status text` = `DRAFT / ACTIVE / RETIRED`
- timestamps

Unique: `(grade_id, code, version)`.

### `quest_instances`

- `id uuid PK`
- `learning_identity_id uuid FK`
- `quest_definition_id uuid FK`
- `status text` = `ACTIVE / COMPLETED / EXPIRED / CANCELLED`
- `progress jsonb`
- `source_context jsonb`
- `starts_at timestamptz`
- `expires_at timestamptz`
- `completed_at timestamptz`
- timestamps

Unique active assignment per `(learning_identity_id, quest_definition_id, starts_at)`.

`progress` is a projection and must be rebuildable from canonical qualifying events.

## 3. Reward tables

### `reward_catalog`

- `id uuid PK`
- `code text UNIQUE`
- `reward_type text` = `STAR_PROGRESS / MILESTONE_BADGE / CHARACTER_REACTION / WORLD_ELEMENT / CHARACTER_COSMETIC / PATH_REVEAL / STICKER`
- `payload jsonb`
- `status text` = `DRAFT / ACTIVE / RETIRED`
- timestamps

### `reward_grants`

- `id uuid PK`
- `learning_identity_id uuid FK`
- `reward_id uuid FK`
- `source_type text` = `QUEST / MILESTONE / STATION_PROGRESS / LEARNING_ACHIEVEMENT / ADVENTURE_COMPLETION`
- `source_ref uuid/text`
- `status text` = `PENDING / GRANTED / REVOKED`
- `granted_at timestamptz`
- timestamps

Unique idempotency key:

`(learning_identity_id, source_type, source_ref, reward_id)`.

## 4. No V1 currency ledger

A spendable gems/coins economy is intentionally excluded from V1. Stars and collectibles are presentation/progression outcomes, not money-like balances.

## 5. Event additions

Canonical engagement events:

```text
game_started
game_completed
game_abandoned
quest_presented
quest_progressed
quest_completed
reward_presented
reward_granted
milestone_reached
learning_rhythm_updated
```

Event ≠ Evidence.

## 6. Index additions

```text
quest_definitions(grade_id, status)
quest_instances(learning_identity_id, status, expires_at)
reward_grants(learning_identity_id, granted_at desc)
reward_grants(learning_identity_id, source_type, source_ref)
```

## 7. Updated persistence rule

Historical learning facts remain immutable. Quest progress is a rebuildable projection. Reward grant is an auditable domain outcome and must be idempotent.

## 8. Readiness

This amendment closes the Game/Quest/Reward persistence boundary for V1. Actual SQL migrations, RLS policies and implementation tests remain build artifacts.

</div>
