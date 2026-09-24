# Math Learning Product — v0.34 Implementation Baseline

**Date:** 24 September 2026  
**Status:** `IMPLEMENTATION BASELINE — READY FOR REPOSITORY BOOTSTRAP`  
**Scope:** V1 / Grade 1 first vertical slice  
**Baseline architecture:** Modular Monolith

---

## 0. Purpose

This document is the executable reconciliation layer between the Product Core, Database Schema, Grade 1 Skill Graph, Content/Runtime specifications, Parent/Teacher experience, Game/Quest/Reward decisions, and Content Delivery decisions.

It does not redefine the product model. It converts already-accepted decisions into one implementation boundary and explicitly marks superseded/deferred references.

---

## 1. Canonical Source Order

When two artifacts disagree, use this order:

1. Product Core semantics
2. v0.34 Implementation Baseline
3. Database Schema for persistence constraints
4. Grade 1 Skill Graph for Grade 1 taxonomy/mapping
5. Content Contract for content/evaluator representation
6. Session Runtime + Learning Rules for runtime transitions
7. Parent/Teacher Experience for adult-facing workflows
8. Game/Quest/Reward for experience projections
9. Delivery/Entitlement decisions for package and cache behavior

A later implementation document may refine implementation details but may not silently change a locked domain invariant.

---

## 2. Architecture — Locked

### 2.1 Application architecture

`Modular Monolith` for V1.

The platform is one deployable backend with explicit domain/application modules. Microservices are deferred.

### 2.2 Languages

- TypeScript — primary application language
- SQL — PostgreSQL migrations, functions and RLS policies
- JSON/JSONB — configuration and payload contracts only

### 2.3 Web

- Next.js
- React
- TypeScript
- App Router

### 2.4 Child Mobile

- React Native
- Expo
- Expo Router
- TypeScript
- React Native New Architecture
- Hermes
- EAS for builds/releases

### 2.5 Data/Auth/Storage

- PostgreSQL — operational and historical source of truth
- Supabase Auth — authentication provider
- Supabase Storage — object/media storage

### 2.6 Animation

- Rive — main character / interactive 2D animation
- Reanimated — UI, transition and gesture motion
- Skia — optional, only when a concrete game requires canvas rendering

Unity/Unreal/Godot are not V1 runtime dependencies.

---

## 3. Module Boundary

Recommended backend modules:

```text
platform
identity
relationships
classroom
grades
skill_graph
stations
content
content_delivery
entitlements
assignments
diagnostics
learning_runtime
evidence
learning_state
decision_engine
progression
quests
rewards
events
audit
```

Rules:

- Domain truth stays server-side.
- Client modules consume contracts; they do not own Learning Truth.
- Parent/Teacher are projections/actions over canonical records.
- Delivery state is not learning state.
- Entitlement is not content download state.

---

## 4. Canonical Runtime

```text
Learning Identity
    ↓
Session
    ↓
Encounter
    ↓
Attempt
    ↓
Answer
    ↓
Evaluator
    ↓
Evidence
    ↓
Learning State
    ↓
Learning Decision
    ↓
Learning Plan
    ↓
Next Encounter / Recovery / Recheck
```

Teacher Assignment enters as a shared objective/boundary and constraint input. It is not a second learning engine.

---

## 5. Identity & Authorization Contract

### 5.1 Identity separation

```text
Account / Principal ≠ Learning Identity
Client Installation ≠ Learning Identity
```

A device/app installation can never create a new child learning identity merely because the app was reinstalled or moved to another device.

### 5.2 Relationship lifecycle

```text
PENDING → ACTIVE → SUSPENDED → EXPIRED / REMOVED
```

Relationship removal does not delete learning history.

### 5.3 Role baseline

```text
CHILD
PARENT
TEACHER
ADMIN
```

Roles do not themselves grant blanket access to children.

### 5.4 Server authorization rule

```text
Default Deny
+
Least Privilege
+
Server-side Authorization
+
PostgreSQL RLS
```

The UI is never the final authorization boundary.

### 5.5 Child

Can access only the child-owned learning resources and runtime operations allowed by the authenticated child context.

### 5.6 Parent

Can read and act only within an active relationship to the child.

V1 Parent Lite is read/projection oriented and cannot overwrite Evidence, Learning State, history, or the child's path.

### 5.7 Teacher

Can access students only through authorized Class / Relationship Context membership.

Teacher V1 capabilities:

```text
VIEW CLASS
VIEW STUDENT SNAPSHOT
SET BOUNDED OBJECTIVE
REQUEST RECHECK
ADD OBSERVATION
```

Teacher cannot manually edit mastery, learning history, or canonical path state.

### 5.8 Admin

Administrative access is policy-scoped and audited. Admin does not gain unrestricted mutation of learning history by default.

---

## 6. Canonical Assignment Contract

### 6.1 Assignment meaning

An Assignment is a teacher-authored shared intent:

```text
Assignment
├── author relationship
├── class scope
├── shared objective
├── shared outcome
├── skill/station boundary
├── adaptation mode
├── validity window
└── revision
```

An Assignment Instance binds that intent to one learner:

```text
Assignment Instance
├── assignment
├── learning identity
├── execution state
├── personalized plan reference
├── completion projection
├── recheck references
└── revision
```

### 6.2 Core invariant

```text
Teacher chooses WHAT
Engine chooses HOW
```

The same Assignment may produce different learner execution paths while keeping the same shared outcome/boundary.

### 6.3 V1 lifecycle

```text
DRAFT
  ↓
PUBLISHED
  ↓
ACTIVE
  ├── → COMPLETED
  ├── → EXPIRED
  └── → CANCELLED
```

Assignment Instance:

```text
PENDING
  ↓
ACTIVE
  ├── → COMPLETED
  ├── → NEEDS_RECHECK
  ├── → EXPIRED
  └── → CANCELLED
```

Implementation note: exact persistence status vocabulary can be normalized during migration generation, but the lifecycle semantics above are canonical.

### 6.4 Assignment does not duplicate content

An Assignment references existing Skill/Station/Content Package records. It never creates a class-specific copy of a content pack.

### 6.5 Assignment and delivery

If the target content is not cached, Assignment preparation may request the required package through Content Delivery.

### 6.6 Superseded statement

The earlier Parent/Teacher document's sentence that an independent Assignment entity remains deferred is **SUPERSEDED for V1** by the later canonical Teacher Assignment decision and this baseline.

---

## 7. Content Package & Manifest Contract

### 7.1 Delivery model

```text
App Core
  ↓
Bootstrap Manifest
  ↓
Grade Manifest
  ↓
Current Station Package
  ↓
Session
  ↓
Next Station Prefetch
  ↓
Future On-Demand
```

Whole-grade download is not the V1 strategy.

### 7.2 Package identity

A package is versioned and immutable once active.

Package references must remain traceable to:

- Grade
- Curriculum Version
- Skill Graph Version where applicable
- Station
- Content Artifact / Content Version
- Required media/assets
- checksum/version

### 7.3 Manifest responsibilities

Manifest must be independently fetchable from full content and must provide enough metadata to decide:

- which package is current;
- which package can be prefetched;
- which package is available under current entitlement;
- which package is already cached;
- which version/checksum is required.

### 7.4 Content state on device

Canonical cache classes:

```text
CURRENT
NEXT
RECENT
FUTURE
```

`FUTURE` is on-demand by default, not bulk downloaded.

### 7.5 Package integrity

Before activation in local cache:

```text
manifest metadata
→ version validation
→ checksum validation
→ atomic cache commit
```

Partial/corrupt packages must not become ACTIVE local content.

---

## 8. Entitlement Contract

Entitlement answers:

> Is this learner/context allowed to use this content/package?

It does not answer:

> Has this package already been downloaded?

Therefore:

```text
Entitlement ≠ Download State
Entitlement ≠ Cache State
Subscription ≠ Bulk Download
```

### 8.1 V1 development

Station 01 may use a development/internal entitlement grant. Payment provider integration is not a prerequisite for the first vertical slice.

### 8.2 School/class access

Class membership is an access/context layer. It must not produce duplicate content storage.

### 8.3 Revocation

Entitlement revocation is authoritative on the server. Cached content may remain physically present until eviction, but the client must not treat revoked access as valid when a server-authoritative check is required.

---

## 9. Mobile Content Manager Contract

The mobile client maintains a local content catalog and cache metadata, not learning truth.

### 9.1 Responsibilities

```text
manifest fetch
package eligibility check
prefetch scheduling
parallel/serial download policy
checksum validation
atomic install
cache lookup
LRU/priority eviction
retry with backoff
low-storage handling
entitlement refresh
```

### 9.2 Required behavior

- Current package is highest priority.
- Next package is prefetched when budget/network rules permit.
- Recent package may remain cached for fast resume/review.
- Future packages stay on-demand.
- Restart must preserve successful cache state.
- Failed package download must be retryable without duplicate corruption.

### 9.3 Storage budget

The implementation must have an explicit configurable local storage budget. Exact numeric limits are implementation/configuration values, not yet a product invariant.

---

## 10. Offline / Sync Contract

Transport baseline:

```text
At-least-once delivery
+
Idempotent domain handling
```

### 10.1 Client operation identity

Minimum operation identity:

```text
client_installation_id
+
client_event_id / idempotency_key
+
operation_type
```

### 10.2 Offline-safe operations

Client may queue eligible operations locally and submit them when connectivity returns.

### 10.3 Never authoritative offline

Offline client must never authoritatively commit:

- final Learning State;
- final Mastery;
- final Station Pass;
- permission grants.

### 10.4 Duplicate delivery

```text
same operation + same idempotency key
→ one canonical server transition
```

### 10.5 Retry semantics

Retryable transport failures must be retried. Validation, authorization, version mismatch and revoked-entitlement errors must not loop blindly.

Canonical client-visible error classes:

```text
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
VERSION_CONFLICT
CONTENT_INVALID
ENTITLEMENT_REVOKED
VALIDATION_FAILED
RATE_LIMITED
NETWORK_UNAVAILABLE
SERVER_RETRYABLE
CLIENT_STORAGE_FULL
```

---

## 11. API Contract Index

REST/HTTP is the recommended V1 transport contract. Exact route implementation may be grouped by module but must preserve domain ownership.

### Identity/Auth

```text
GET    /v1/me
POST   /v1/installations
POST   /v1/installations/:id/revoke
```

### Grade/Content

```text
GET    /v1/bootstrap
GET    /v1/grades/:gradeCode/manifest
GET    /v1/content/packages/:packageId
```

### Entitlement

```text
GET    /v1/entitlements
GET    /v1/entitlements/check?packageId=...
```

### Sessions

```text
POST   /v1/sessions
GET    /v1/sessions/:id
POST   /v1/sessions/:id/resume
POST   /v1/encounters/:id/attempts
POST   /v1/attempts/:id/answers
```

### Assignment

```text
POST   /v1/classes/:classId/assignments
GET    /v1/classes/:classId/assignments
GET    /v1/assignments/:id
POST   /v1/assignments/:id/recheck
GET    /v1/assignment-instances/:id
```

### Adult projections

```text
GET    /v1/parent/today
GET    /v1/parent/progress
GET    /v1/parent/skills
GET    /v1/teacher/classes
GET    /v1/teacher/classes/:classId/students
GET    /v1/teacher/students/:learningIdentityId/snapshot
POST   /v1/teacher/observations
```

API payloads must use stable IDs and explicit version fields where the domain is versioned. Error responses must include a machine-readable code and correlation/request ID.

> The route index above is an implementation contract proposed by v0.34; it is not claimed to have existed verbatim in earlier artifacts.

---

## 12. Child Navigation / Screen State Contract

The child app is a client of the Journey model, not a second path engine.

### 12.1 Main state machine

```text
APP_BOOT
  ↓
AUTH / IDENTITY_READY
  ↓
GRADE_CONTEXT_READY
  ↓
PLACEMENT / STARTING_POINT
  ↓
PATH_READY
  ↓
STATION_ENTRY
  ↓
LEARN
  ↓
GUIDED_PRACTICE
  ↓
MINI_GAME / PRACTICE
  ↓
CHECK
  ↓
RESULT
  ├── PASS → REWARD / QUEST → RESUME / NEXT
  └── RECOVERY → RECHECK → RESULT
```

### 12.2 Client navigation rules

- Navigation state may be local and transient.
- Learning state is server-authoritative.
- Refresh/restart must reconstruct the screen from server state + cached content.
- A screen transition must not by itself create Evidence.
- A reward animation must not by itself create mastery/progression.

---

## 13. Animation Event Contract

Learning Engine emits semantic events; animation layer maps them to visual states.

```text
SESSION_START
EXPLAIN
ANSWER_CORRECT
ANSWER_WRONG
HINT_OPENED
RECOVERY
STATION_PASS
MILESTONE
REWARD_GRANTED
```

Animation code must not contain learning decision logic.

Required baseline character states:

```text
IDLE
THINK
CORRECT
ENCOURAGE
CELEBRATE
```

Reduced-motion/static fallback is mandatory for critical feedback.

---

## 14. Database Migration Dependency Graph

The original v0.23 order is retained as the structural baseline, with the new delivery/assignment domains inserted after core content and before runtime-dependent delivery usage.

```text
001 extensions/helpers
002 accounts/roles
003 client installations/push
004 learning identities
005 relationship contexts/relationships
006 classes/memberships
007 grades/curriculum
008 skill graph
009 stations
010 learning objectives
011 content artifacts/content versions/assets
012 diagnostics
013 policies
014 content packages/manifest/package items
015 entitlements
016 assignments/assignment instances
017 runtime: missions/sessions/encounters/attempts/answers
018 evidence/interpretation
019 learning states
020 decisions/plans
021 progression/unlocks
022 quests/rewards
023 events/audit
024 indexes/constraints
025 RLS policies
```

Migration rules:

- historical learning records are not cascade-deleted;
- active content/policy versions are immutable;
- runtime records pin relevant versions;
- migrations are applied through migration tooling, not manually edited production databases;
- seed does not depend on production secrets.

The exact split of SQL files is an implementation detail; the dependency order above is canonical for build planning.

---

## 15. Seed Strategy

### Development seed

Allowed:

- G1..G6 grade definitions
- G1 build package
- G1 curriculum/graph records
- ST01 development content
- internal/dev entitlement
- development accounts and class

### Production/active educational seed

Requires educational approval for the Grade 1 taxonomy/mapping before the Graph Version becomes the active canonical learning package.

The 64-skill model remains `PROVISIONAL / DERIVED` pending educational review; 25 station sequence remains source-derived.

---

## 16. Contract Test Baseline

### Security

- unauthorized child read fails;
- parent cannot read unrelated child;
- teacher cannot read unrelated class;
- UI hiding is not relied on for authorization;
- sensitive operations are audited.

### Content delivery

- manifest is fetchable independently;
- current package loads without full-grade download;
- next package can prefetch;
- checksum mismatch blocks activation;
- failed download can retry;
- cache survives restart;
- revoked entitlement blocks authoritative access.

### Runtime

- session pins grade/curriculum/graph;
- duplicate submit is idempotent;
- evidence is immutable;
- evaluator version is recorded;
- Pass is not Mastery;
- Recovery returns to the original objective;
- Recheck produces new evidence.

### Assignment

- teacher assignment is class-scoped;
- two learners may share the same assignment;
- assignment does not copy content;
- learner execution can adapt independently;
- completion is derived from canonical outcomes;
- teacher cannot manually overwrite learning truth.

### Animation

- semantic event drives Rive state;
- animation has no learning decision authority;
- reduced-motion fallback exists;
- station-specific assets are lazy-loadable.

---

## 17. Explicitly Superseded / Reclassified References

| Earlier reference | v0.34 status |
|---|---|
| v0.23 statement that exact Auth/RLS implementation remains deferred | Superseded: implemented as v0.34 engineering contract, SQL remains build work |
| v0.23 statement that Assignment may remain deferred | Superseded: Assignment is V1 canonical, because Teacher Assignment was later locked |
| v0.31 statement that Assignment entity may remain deferred | Superseded by V0.33/v0.34 Assignment decision |
| v0.23 original migration order | Superseded by v0.34 dependency order with delivery/assignment domains |
| "Subscription = content download" interpretations | Rejected; entitlement and download/cache are separate |
| whole-grade mobile download | Rejected; manifest/current/next/on-demand model is canonical |

Older documents remain historical records and are not rewritten solely to erase their previous state.

---

## 18. Build Gates

### Gate A — Repository Ready

- monorepo created;
- TypeScript strict mode;
- web + mobile shells launch;
- environment variables documented;
- CI green;
- module boundaries enforced.

### Gate B — Data/Auth Ready

- migrations apply from empty database;
- Supabase Auth connected;
- RLS tests pass;
- role/relationship authorization helpers pass;
- audit baseline works.

### Gate C — Delivery Ready

- ST01 package is manifest-discoverable;
- package downloads and verifies;
- cache survives restart;
- next prefetch works;
- entitlement check works.

### Gate D — Runtime Ready

- Session → Encounter → Attempt → Answer → Evaluator → Evidence → State → Decision works;
- idempotency works;
- recovery/recheck works;
- pass rule works without implying mastery.

### Gate E — Vertical Slice Ready

```text
Placement
→ Station 01
→ Learn
→ Guided Practice
→ Game
→ Check
→ Evidence
→ Decision
→ Pass/Recovery
→ Recheck
→ Quest/Reward
→ Resume
```

Parent/Teacher smoke projections must remain coherent.

---

## 19. What Starts Immediately After This Baseline

### Step 1 — Repository Bootstrap

Create the repository structure and engineering foundation only. Do not build feature-complete screens yet.

### Step 2 — Canonical Migrations

Generate migration files from Section 14 and implement RLS from Section 5.

### Step 3 — Delivery Skeleton

Implement Manifest → Package → Entitlement → Cache Manager for ST01.

### Step 4 — Animation Spike

Validate Rive + Expo + New Architecture + Hermes + EAS together before committing the full animation pipeline.

### Step 5 — Station 01 Runtime Skeleton

Implement the server/client contracts needed for a single end-to-end learning encounter.

---

## 20. Out of Scope at This Stage

- payment provider integration;
- AI tutor;
- ML recommendation engine;
- predictive download model;
- leaderboard/social/co-op;
- complex teacher gradebook;
- full analytics warehouse;
- all Grade 1 content;
- Grades 2–6 content production;
- final public legal/privacy sign-off.

---

## 21. Baseline Acceptance

This v0.34 baseline is accepted as the working implementation contract when:

```text
Core semantics
      +
DB persistence
      +
Auth/RLS
      +
Assignment
      +
Content Delivery
      +
Offline semantics
      +
Child navigation
      +
Animation boundary

        ↓

One consistent implementation plan
```

Any later change that affects these boundaries must be introduced as a new revision/change record rather than silently changing implementation behavior.
