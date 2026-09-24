# Revision Notes — Phase 12

## Added

- `supabase/migrations/0031_learning_runtime_contract_alignment.sql`
- `supabase/migrations/0032_runtime_transactional_rpc.sql`
- `apps/web/lib/learning-runtime-production.ts`
- `scripts/verify-phase12-postgres-runtime.mjs`
- `docs/PHASE_12_POSTGRES_RUNTIME.md`

## Changed

- Added Supabase REST RPC transport.
- Session creation now uses the production DB runtime when a Supabase access token is present.
- Encounter creation now uses the production DB runtime when a Supabase access token is present.
- Attempt submission now uses the atomic PostgreSQL runtime when a Supabase access token is present.
- `.env.example` now documents the migration prerequisite for `MATH_RUNTIME_BACKEND=postgres`.

## Deep audit findings fixed

- Persistent `Learning State` schema was missing the runtime confidence/uncertainty/review/recovery fields.
- Persistent `Learning Decision` schema was missing its causal attempt reference.
- PostgreSQL runtime now owns the full authoritative write transaction instead of pretending that sequential REST writes are atomic.
- Idempotent replay now preserves answer payloads and semantic correctness.
- Production attempt responses now expose the same evaluation semantics expected by the TypeScript contract.

## Verification limitation

The SQL migrations were statically reviewed and referenced by the repository, but were **not executed against a live Supabase/PostgreSQL instance in this environment**. No production-ready claim is made until that external integration test passes.
