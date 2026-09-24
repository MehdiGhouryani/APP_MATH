# Revision Notes — Phase 11

## Scope

Production Auth boundary hardening after the deep Phase 0–10 audit.

## Implemented

- Replaced API route use of `requireDevPrincipal` / `requireDevAccountPrincipal` with async request principals.
- Added Supabase Auth Bearer verification through `/auth/v1/user`.
- Added RLS-scoped account role lookup and server-side Learning Identity resolution.
- Added role gates for Parent and Teacher surfaces.
- Added production-safe mobile auth header injection.
- Removed unconditional dev auth headers from Mobile Content Manager.
- Production Offline actions now use the server-returned Learning Identity after Session start.
- Added runtime backend fail-closed gates so production cannot silently execute the in-memory Learning/Adult runtimes.
- Added API error status mapping for authentication, authorization, not-found and backend-unavailable conditions on hardened routes.
- Updated remediation verification to understand the production principal boundary.

## Deliberately not claimed

- PostgreSQL-backed Learning Runtime transaction implementation.
- Production mobile Auth session UI/persistence.
- Production Rive asset readiness.
- Pilot readiness.

## Verification

Passed:

- `node scripts/verify-remediation.mjs`
- `node scripts/verify-phase11-auth.mjs`
- `node scripts/runtime-tests.mjs` — 5/5 tests
- TypeScript syntax/parser scan — 86 TS/TSX files

Not green / environment limitation:

- Full `npm run typecheck:web` cannot be claimed because the local `node_modules` tree is incomplete after an npm registry timeout; `next`, `react`, and `@types/node` are unavailable in the current runtime.
- Direct PostgreSQL driver installation also timed out, so no fake transaction adapter was introduced.
