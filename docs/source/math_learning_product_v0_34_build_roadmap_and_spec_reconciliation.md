# Math Learning Product — v0.34 Build Roadmap & Specification Reconciliation

تاریخ: 24 سپتامبر 2026

## 0. هدف

این سند مسیر اجرایی canonical پروژه را از specification تا Pilot تعریف می‌کند و قبل از شروع implementation هر ambiguity قراردادی را در یک نقطه جمع می‌کند.

## 1. تصمیم اصلی

V1 برای ساخت **Station 01 End-to-End Vertical Slice** آماده است، اما قبل از شروع implementation production-quality باید یک reconciliation pass انجام شود.

این pass باید:

1. قراردادهای ارجاع‌شده به v0.24 / v0.25 / v0.26 را در یک `Implementation Baseline` قابل‌مصرف برای تیم جمع کند.
2. تناقض Assignment در Database را رفع کند؛ v0.33 canonical است و متن‌های قبلی `deferred` باید superseded علامت‌گذاری شوند.
3. مرز migration / seed / RLS / API / Mobile را مشخص کند.
4. Grade 1 educational review را از engineering unblock جدا کند: engineering با draft/provisional seed می‌تواند ادامه دهد، اما `ACTIVE/FROZEN` canonical seed فقط بعد از educational approval است.
5. entitlement/payment را از delivery engine جدا کند؛ در vertical slice از dev entitlement استفاده شود و payment provider بعداً اضافه شود.

## 2. وضعیت فعلی

### Locked

- Child Mobile: React Native + Expo + TypeScript + New Architecture + Hermes
- Reanimated + Rive baseline
- Shared Platform Core
- PostgreSQL + Supabase Auth/Storage
- Grade / Station / Encounter content boundaries
- Current / Next / Recent / Future cache policy
- Entitlement ≠ Download State
- Teacher Lite + bounded Assignment / Recheck
- Parent Lite projection
- Rule-based Learning Engine V1
- Station 01 as first vertical slice

### Provisional / Parallel Review

- exact 64-skill Grade 1 taxonomy
- family assignment / prerequisite semantics / primary-supporting mapping
- exact mastery calibration
- exact dosage / quest mix / reward frequency
- visual art direction and final asset set
- legal/privacy finalization

### Not required before first slice

- payment provider integration
- Grades 2–6 content production
- advanced teacher gradebook
- social/co-op
- predictive download ML
- full analytics warehouse

## 3. Canonical Delivery Architecture

```text
App Runtime
  ↓
Bootstrap Manifest
  ↓
Grade Manifest
  ↓
Current Station Pack
  ↓
Current Station Session
  ↓
Next Station Prefetch
  ↓
Future = On Demand
```

Assignment does not create content copies. It can make an eligible package required for a learner.

## 4. Canonical Learning Runtime

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
Decision
  ↓
Plan
  ↓
Next Encounter / Recovery / Recheck
```

Teacher Assignment enters as objective/constraint input; it is never a second learning engine.

## 5. Canonical Adult Runtime

```text
Shared Learning Truth
       │
 ┌─────┴─────┐
 ▼           ▼
Parent      Teacher
Lite        Lite
Projection  Projection
```

Teacher actions:
- View class
- View student snapshot
- Set bounded objective
- Request Recheck
- Add Observation

Parent actions:
- View Today
- View Progress
- View Skill Snapshot
- View Next Step
- Set lightweight preferences/constraints

Neither may manually overwrite Learning Truth.

## 6. Implementation Phases

### Phase 0 — Spec Reconciliation

Deliverables:
- v0.34 Implementation Baseline
- final Assignment schema status
- Auth/RLS contract
- API contract index
- migration dependency graph
- content package/manifest contract cross-reference
- error and retry semantics

Exit Gate:
- no unresolved contradiction between Core / DB / Content / Runtime / Parent-Teacher / Delivery
- every implementation dependency has one canonical source

### Phase 1 — Repository + Engineering Foundation

Build:
- monorepo/module boundaries
- TypeScript strict mode
- lint / format / unit test runner
- CI
- environment model
- Supabase project configuration
- React Native Expo shell
- Next.js web shell

Exit Gate:
- local + CI builds green
- mobile app launches
- web app launches
- database connection works

### Phase 2 — Database + Identity + RLS

Build in order:
1. migrations
2. seed tables / version records
3. accounts / learning identities
4. relationships / classes
5. learning runtime tables
6. content/package tables
7. entitlements
8. assignments / assignment instances
9. RLS
10. authorization helpers

Exit Gate:
- authenticated child/parent/teacher flows respect relationship scope
- unauthorized reads/writes fail closed
- migrations reproducible

### Phase 3 — Content Package + Delivery Engine

Build:
- content package registry
- package manifest
- checksum/version validation
- package endpoint
- entitlement resolver
- download manager
- cache manager
- retry / eviction

Development entitlement:
- use internal/dev grant
- do not block the slice on payment integration

Exit Gate:
- G1-ST01 can be loaded without full Grade download
- cache survives restart
- next pack can prefetch
- failed pack retries safely

### Phase 4 — Animation Runtime

Build first:
- one main character
- Rive state machine
- semantic event bridge
- reduced-motion fallback
- one station animation pack
- asset loading / cache hooks

Semantic inputs only:
- SESSION_START
- EXPLAIN
- ANSWER_CORRECT
- ANSWER_WRONG
- HINT_OPENED
- RECOVERY
- STATION_PASS
- MILESTONE
- REWARD_GRANTED

Exit Gate:
- character state changes from learning events without learning-engine code knowing animation IDs
- low-end Android smoke test passes

### Phase 5 — Learning Runtime

Implement:
- Session lifecycle
- Encounter lifecycle
- Attempt / Answer
- evaluator
- evidence creation
- learning state update
- candidate generation
- decision rules
- recovery
- station pass
- recheck

Exit Gate:
- deterministic Station 01 runtime tests pass
- duplicate submission is idempotent
- historical evidence is immutable

### Phase 6 — Station 01 Child Experience

Implement the exact sequence:

```text
Onboarding / Entry
→ Station 01
→ Learn
→ Guided Practice
→ Mini Game
→ Check
→ Evidence
→ Decision
→ Pass OR Recovery
→ Reward / Quest
→ Resume
```

Game set for first slice:
- Pattern Path
- Count Catch
- Magic Row
- Strategy Choice

Exit Gate:
- one complete child session works end-to-end
- accessibility / reduced motion works
- no full-grade download occurs

### Phase 7 — Teacher Assignment Slice

Implement:
- create assignment for Class
- skill/station scope
- start/due
- adaptation mode
- assignment instance per learner
- completion projection
- Recheck

Child sees assignment inside the same Journey, not a separate school app.

Exit Gate:
- one teacher can assign ST01
- two learners can receive the same shared assignment
- no duplicated content package
- each learner can get adaptive execution

### Phase 8 — Parent Lite + Teacher Lite

Parent:
- Today
- Progress
- Skills Snapshot
- Next Step
- assignment status

Teacher:
- Class
- Student List
- Student Snapshot
- Needs Review / Attention
- Assignment
- Recheck
- Observation

Exit Gate:
- projections match canonical state
- RLS/relationship boundaries verified

### Phase 9 — Offline + Sync + Performance

Test:
- cold download
- cache hit
- next prefetch
- download failure/retry
- offline session
- reconnect
- duplicate sync
- revoked entitlement
- low-storage eviction
- low-end Android animation performance

Exit Gate:
- all critical E2E tests green
- no Learning Truth corruption under retry/offline scenarios

### Phase 10 — Pilot Gate

Pilot only after Phase 9.

Measure:
- learning outcome
- evidence quality
- completion quality
- recovery success
- child return
- task friction
- parent comprehension
- teacher usefulness / burden
- package download size
- offline reliability
- animation performance

No large feature expansion during initial pilot unless evidence requires it.

### Phase 11 — Scale Grade 1

Once Station 01 pattern is stable:

```text
ST02–ST05
→ validation
→ ST06–ST10
→ validation
→ ST11–ST15
→ validation
→ ST16–ST20
→ validation
→ ST21–ST25
```

Do not build all 24 remaining Stations blindly; build in verified batches.

### Phase 12 — Grades 2–6

Only after Grade 1 architecture/content workflow is validated:

- Grade Package per grade
- Skill Graph per grade
- curriculum version
- content packages
- station/game mappings
- grade-specific diagnostics

Shared platform/runtime remains unchanged unless evidence forces an architectural revision.

## 7. Parallel Workstreams

### Educational Track

Runs in parallel with engineering:
- Grade 1 taxonomy review
- prerequisite review
- diagnostic probe authoring
- content authoring
- evaluator validation
- mastery calibration
- audio / visual QA

### Engineering Track

Runs in order through the phases above.

The two tracks meet at:

```text
Approved Skill Graph
+
Approved Content Package
+
Executable Runtime
```

## 8. What We Must Not Build Yet

- full payment stack
- social system
- leaderboard
- co-op
- complex teacher gradebook
- advanced analytics warehouse
- AI tutor
- ML recommendation engine
- predictive download ML
- all Grade 1 content before validating Station 01
- all Grade 2–6 content

## 9. Immediate Next 5 Engineering Deliverables

1. v0.34 Implementation Baseline / Spec Reconciliation
2. Repository + environment bootstrap
3. Database migration + Auth/RLS baseline
4. Content Package / Manifest / Entitlement APIs
5. Rive character proof-of-concept + Station 01 runtime skeleton

## 10. Definition of Vertical Slice Done

The project may move from "Build Slice" to "Pilot Candidate" only when:

- child completes Station 01;
- at least one game produces valid evidence;
- evaluator and learning state work;
- recovery/recheck work;
- assignment works for a class;
- parent projection works;
- teacher projection works;
- current/next content delivery works;
- offline sync passes;
- Rive animation state is event-driven;
- low-end performance is acceptable;
- all critical tests pass;
- educational review approves the Station 01 content.

## 11. Canonical Sequence

```text
SPEC RECONCILIATION
        ↓
REPOSITORY / INFRA
        ↓
DB + AUTH + RLS
        ↓
CONTENT PACKAGE / MANIFEST
        ↓
ENTITLEMENT + ASSIGNMENT
        ↓
MOBILE CONTENT MANAGER
        ↓
RIVE / ANIMATION RUNTIME
        ↓
LEARNING RUNTIME
        ↓
STATION 01 CHILD EXPERIENCE
        ↓
TEACHER ASSIGNMENT
        ↓
PARENT / TEACHER PROJECTIONS
        ↓
OFFLINE + E2E + PERFORMANCE
        ↓
PILOT
        ↓
ST02–ST25 IN BATCHES
        ↓
GRADES 2–6
```
