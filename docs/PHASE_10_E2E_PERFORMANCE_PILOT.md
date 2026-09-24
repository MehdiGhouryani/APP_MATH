# Phase 10 — E2E + Performance Gate + Pilot Readiness

تاریخ: 24 سپتامبر 2026

## هدف

این فاز اولین release gate مهندسی برای عبور از Build Slice به Pilot Candidate است.

## E2E scope

مسیر بحرانی V1 باید این زنجیره را پوشش دهد:

```text
Content Manifest
→ Current Package
→ Session
→ Station 01
→ Game-like Encounter
→ Attempt / Answer
→ Evaluator
→ Evidence
→ Learning State
→ Decision
→ Recovery / Pass
→ Assignment
→ Parent Projection
→ Teacher Projection
→ Offline Queue
→ Sync
```

E2Eهای Web در Playwright تعریف شده‌اند. API tests نیز جدا هستند تا failure UI از failure domain/runtime قابل تفکیک باشد.

## Performance contract

- هدف استاندارد: 60 FPS
- frame budget: 16.67 ms
- sync batch: حداکثر 20 action
- development content cache budget: 80 MB
- Reduced Motion: الزامی
- Character assets: lazy-load/cacheable
- Learning Engine نباید منتظر animation playback بماند.

این اعداد از قراردادهای Phase 4 و Phase 9 آمده‌اند؛ این فاز فقط validation gate آن‌ها را اضافه می‌کند.

## Synthetic performance test

`node scripts/performance/phase10-performance.mjs`

این تست برای CI یک sample deterministic دارد و فقط budget contract را کنترل می‌کند. **این تست جای profile واقعی Android را نمی‌گیرد.**

## Real-device gate

پیش از Pilot واقعی باید روی یک Android ضعیف‌تر از deviceهای توسعه‌ای اندازه‌گیری شود:

- cold start
- Station 01 entry
- Rive idle/think/correct/celebrate
- Pattern Path
- Count Catch
- Check transition
- recovery transition
- cache hit
- offline → reconnect sync

اندازه‌گیری واقعی low-end Android در این محیط انجام نشده و بنابراین `PASS` محسوب نمی‌شود.

## Release criteria

### Required for Pilot Candidate

- Critical E2E specs present and runnable.
- Runtime contract tests green.
- Offline contract tests green.
- Content checksum validation green.
- Assignment → Child session traceable.
- Parent/Teacher projections read from canonical records.
- No direct client mutation of Learning Truth.
- No Unity runtime dependency.

### Required before Pilot

- real low-end Android profile
- educational approval of Station 01 content
- content QA
- privacy/legal review
- real Auth/RLS against staging Supabase

## Explicit non-goals

- payment integration
- social features
- leaderboard
- AI tutor
- predictive download ML
- building all Grade 1 stations before validating Station 01

## Current gate state

`BUILD SLICE → PILOT CANDIDATE`: **NOT YET GREEN** until real staging E2E and low-end Android profiling are executed.

Static/contract verification can be green independently.
