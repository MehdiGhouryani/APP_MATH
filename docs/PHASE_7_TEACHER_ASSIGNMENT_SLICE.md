# Phase 7 — Teacher Assignment Slice

تاریخ: 24 سپتامبر 2026

## هدف

پیاده‌سازی اولین مسیر Assignment بدون ساختن Learning Engine دوم و بدون کپی کردن Content Package.

## Canonical Flow

```text
Teacher
  ↓
Class-scoped Assignment
  ↓
Shared Objective + Outcome + Boundary
  ↓
Assignment Instances (one per learner)
  ↓
Same Journey / Station 01
  ↓
Learning Engine chooses HOW
  ↓
Evidence / Decision
  ↓
Assignment Completion Projection
  ↓
Recheck when requested
```

## Locked Rules

- Teacher chooses WHAT; Engine chooses HOW within declared boundary.
- Assignment is shared intent; Assignment Instance is per-learner execution.
- Assignment never creates a duplicate content package.
- Child sees the assignment inside the existing learning journey.
- Teacher can request Recheck; Teacher cannot edit Learning Truth, Mastery, or Path directly.
- `adaptation_mode` supports `OPEN_ADAPTIVE`, `BOUNDED_ADAPTIVE`, `PINNED`.
- V1 completion rules: `STATION_PASS`, `OBJECTIVE_MET`, `RECHECK_PASSED`.

## Persistence Additions

### `assignment_targets`

Relational target boundary for Skills or Stations. The existing `boundary` JSON remains as a transport/configuration envelope; target identity is relational for integrity.

### `assignment_rechecks`

Append-only-ish request record for teacher recheck intent with requestor provenance and lifecycle.

### `assignment_instances`

Adds start/activity/recheck timestamps while retaining per-learner execution state.

## API Surface

```text
POST /api/v1/assignments
POST /api/v1/assignments/:assignmentId  { action: PUBLISH, learnerIds: [] }
GET  /api/v1/assignments/:assignmentId
GET  /api/v1/learning-identities/:learningIdentityId/assignments
POST /api/v1/assignment-instances/:instanceId/outcome
POST /api/v1/assignment-instances/:instanceId/recheck
```

## Development Adapter Boundary

The web demo currently uses an in-memory Assignment adapter to validate workflow semantics before the Supabase-backed service adapter is connected. Production authorization remains server-side/RLS-driven; the dev adapter is not a substitute for RLS.

## Exit Gate

- one teacher can create/publish ST01 assignment;
- two learners can receive separate instances from the same assignment;
- assignment target is shared, execution record is per learner;
- recheck request changes the learner instance to `NEEDS_RECHECK`;
- no class-specific content copy is created;
- child assignment surface points into the same Station journey.
