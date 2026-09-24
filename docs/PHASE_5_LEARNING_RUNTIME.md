# Phase 5 — Learning Runtime

Date: 24 September 2026

## Purpose

اجرایی‌کردن حلقه canonical یادگیری بدون انتقال Learning Truth به Mobile/UI.

## Canonical runtime

```text
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
Learning Plan
  ↓
Continue / Recovery / Recheck / Station Pass
```

این قرارداد بر Session Runtime و Learning Rules v0.29 متکی است؛ duplicate submission باید idempotent باشد، Evidence تاریخی immutable بماند، و offline/client نتواند final Mastery یا Station Pass را authoritative commit کند.

## Implemented

- `@math/learning-runtime` package
- deterministic evaluator interface + configured evaluator baseline
- server-side runtime orchestration
- version integrity check between Session / Encounter / Content Version
- Evidence creation only after accepted evaluation
- Learning State update without diagnosing from a single wrong answer
- Recovery decision after an incorrect accepted answer
- temporary Station Pass rule: 4/5 in two separate checks
- Recheck decision after a qualifying single mastery check
- idempotent attempt submission by `clientIdempotencyKey`
- development-only Next.js runtime endpoints
- persistence contract migration `0023_learning_runtime_execution.sql`
- runtime tests

## Important boundary

The in-memory repository is a **development runtime adapter** only. Production persistence must use the canonical PostgreSQL/Supabase repository behind the same interface.

No learning decision is stored in Rive, React Native state, or a game renderer.

## State policy note

Exact Mastery thresholds remain outside this implementation. A first accepted educational evidence moves `UNKNOWN` to `BUILDING`; a wrong answer does not automatically become `NEEDS_REVIEW` or a diagnosis.

## Exit gate

- deterministic runtime tests green
- idempotency tested
- wrong-answer recovery tested
- two-check Station Pass tested
- historical evidence model preserved
- no Unity dependency
