# Phase 8 — Parent Lite + Teacher Lite

تاریخ: 24 سپتامبر 2026

## 0. هدف

Parent Lite و Teacher Lite به‌عنوان Projectionهای Shared Platform Core پیاده‌سازی می‌شوند؛ هیچ Learning Engine یا Learning Truth مستقل برای بزرگسالان ساخته نمی‌شود.

## 1. Parent Lite

### Screens
- Home / Today
- Progress
- Skills Snapshot
- Next Step
- Recent Learning
- Simple Home Activity
- Assignment Status

### Boundaries
- Parent فقط related child را می‌بیند.
- Parent Learning State / Mastery / Path / historical Evidence را مستقیم mutate نمی‌کند.
- Parent view از Evidence / Learning State / Decision / Plan / Session / Progression / Quest / Assignment ساخته می‌شود.

## 2. Teacher Lite

### Screens
- Teacher Home
- Class List / Student List
- Student Learning Snapshot
- Needs Review / Needs Attention
- Assignment (Phase 7)
- Recheck Queue
- Observation

### Student Snapshot
- Current Station / Path position
- Skills: Strength / Building / Needs Review
- Recent evidence summary
- Current learning decision
- Recommended next action
- Recent intervention / recheck / observation

### Teacher Actions
`VIEW → SET OBJECTIVE → REQUEST RECHECK → ADD OBSERVATION`

Teacher cannot:
- manually set Mastery
- edit Learning State
- edit Path
- delete/overwrite historical Evidence
- author a custom question/path in V1

## 3. Teacher Observation

Observation is an append-only source record with provenance.

```text
Teacher Observation
→ Evidence + Provenance
→ Interpretation / Confidence
→ Learning Decision
```

Phase 8 persists the source observation in `teacher_observations`. Conversion to canonical Evidence/Interpretation remains owned by the Learning Runtime and is not performed by the Teacher UI.

## 4. Authorization

- Parent scope = active Parent relationship → child.
- Teacher scope = active class membership / teacher relationship → learner.
- Server authorization and RLS remain the authority; UI hiding is not authorization.

## 5. Projection Rules

Parent / Teacher projections must be rebuildable from canonical records. They are presentation/read models, not new learning truth.

## 6. Development Adapter

The current Web shell uses a deterministic in-memory projection adapter for local workflow verification. Production wiring remains Supabase-backed and must reuse the existing authorization helpers/RLS.

## 7. Exit Gate

- Parent sees only related child.
- Parent Today/Progress/Skills/Next Step/Recent Learning are coherent.
- Teacher sees only own classes/students.
- Student Snapshot is built from canonical-state-shaped records.
- Teacher Observation has provenance.
- Recheck is visible without mutating historical Evidence.
- No manual Learning State or Mastery editing exists.
