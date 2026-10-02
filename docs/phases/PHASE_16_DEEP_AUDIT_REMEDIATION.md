# Phase 16 — Deep Audit & Remediation

Date: 2026-09-25

## Audit posture

This phase audits the repository as it exists after Phase 15. The objective is not to make the readiness gate green; it is to eliminate contradictions and unsafe fallback paths while preserving the locked domain contracts.

## Findings fixed

1. **Station 01 E08 could advance to Transfer after only one qualifying Check.**
   - Fixed in `apps/mobile/src/station/StationFlow.tsx`.
   - E08 now requires the server-confirmed Station Pass; otherwise it routes to Recovery or a fresh independent Check B.

2. **PostgreSQL runtime resolved `checkGroup` too late.**
   - This could cause Evidence/Interpretation/Decision records to carry incomplete check-group provenance.
   - `0044_runtime_check_group_ordering.sql` moves canonical `checkGroup` resolution before Evidence/Interpretation/Decision writes.
   - `0043_runtime_semantics_v2.sql` remains the historical migration; the forward fix is a new migration.

3. **Migration immutability risk was identified and prevented.**
   - The new behavior is delivered through `0044`, not by relying on a modified historical migration.

4. **Manifest route principal binding was rechecked and guarded.**
   - `apps/web/app/api/v1/content/manifest/route.ts` now explicitly binds the authenticated principal before using its access token.

5. **Static migration verification is now repository-owned.**
   - `scripts/verify-migrations-static.mjs` checks migration sequence continuity, policy syntax hazards, dollar-quote balance, and the Phase 16 forward runtime patch.
   - Root `package.json` exposes `verify:migrations`.

6. **Production fallback posture remains fail-closed.**
   - Mobile remote runtime fallback is development-only.
   - Adult Projection and Assignment remain blocked until real Supabase repositories are present.

## Verification results

- Phase 15 deep adversarial verifier: PASS
- Learning Runtime tests: 6/6 PASS
- Learning Runtime TypeScript build/typecheck: PASS
- Migration static guard: PASS — 44 migrations, latest `0044_runtime_check_group_ordering.sql`
- Production readiness static guard: BLOCKED by the intended gates below
- All `scripts/*.mjs` and performance scripts: syntax PASS
- Lightweight repository TS/TSX sanity scan: PASS

## Remaining production blockers

### Educational approval

Grade 1 currently contains 64 provisional/derived skills and ST01 content marked `EDUCATIONAL_REVIEW_REQUIRED`. The system must not silently promote that content to an educationally approved baseline.

### Live Supabase verification

Auth, RLS, RPC execution, migration application, and full Station 01 E2E have not been executed against a real Supabase project in this environment. Static SQL inspection is not equivalent to live verification.

### Adult / Teacher / Assignment persistence

The current web runtime still instantiates `InMemoryAssignmentRepository` and `InMemoryAdultProjectionRepository`. Production gates therefore remain fail-closed. These paths must be moved to explicit request-scoped Supabase repositories before enabling the production environment flags.

### Full Web/Mobile build

A complete workspace build remains unverified because the current environment does not contain a complete dependency installation/workspace link tree. Package-local verification is used where dependencies are available.

## Decision

Do not open Production Pilot yet.

Next implementation target: request-scoped Supabase repositories for Assignment and Adult Projection, followed by live Supabase migration/Auth/RLS/RPC E2E. Educational approval remains a separate parallel gate and must not be inferred from technical verification.
