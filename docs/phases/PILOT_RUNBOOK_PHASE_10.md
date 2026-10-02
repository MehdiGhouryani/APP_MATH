# Pilot Runbook — Phase 10

## Gate 0 — Environment

- Staging Supabase available
- Node 24 active
- dependencies installed
- Auth/RLS policies applied
- Grade 1 Station 01 fixture/content approved for the pilot cohort

## Gate 1 — Technical smoke

1. Open child app.
2. Fetch G1 manifest.
3. Load CURRENT package.
4. Start Station 01.
5. Run Learn → Guided Practice → Game-like encounter.
6. Complete two Checks in separate sessions.
7. Verify Station Pass.
8. Create a Teacher Assignment.
9. Verify learner instance.
10. Verify Parent projection.
11. Verify Teacher projection.

## Gate 2 — Offline

1. Download CURRENT.
2. Kill app.
3. Relaunch.
4. Enter offline mode.
5. Submit pending action.
6. Restart app.
7. Reconnect.
8. Verify single canonical sync.
9. Verify duplicate sync is harmless.

## Gate 3 — Performance

Capture real metrics for:

- P50/P95/P99 frame time
- cold start
- station transition
- Rive response latency
- package download latency
- sync latency
- memory footprint
- cache size

## Gate 4 — Learning / product

Measure:

- valid evidence rate
- recovery success
- Station completion quality
- child return
- task friction
- parent comprehension
- teacher usefulness / burden

`time_spent` alone is not a success metric.

## Rollback triggers

Stop the pilot build if any of these occur:

- Learning Truth corruption
- duplicate historical Evidence
- unauthorized cross-child visibility
- revoked entitlement still produces usable content
- repeated sync creates duplicate attempts
- critical animation blocks learning flow
- low-end Android cannot sustain the required interaction quality
