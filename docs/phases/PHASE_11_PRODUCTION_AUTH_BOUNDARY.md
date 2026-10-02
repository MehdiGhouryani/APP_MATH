# Phase 11 — Production Auth Boundary

## Scope

This phase closes the authentication/authorization boundary without pretending that the Learning Runtime is already PostgreSQL-backed.

## Locked rules

1. Production API requests require a Supabase Auth Bearer token.
2. Production API routes never accept `x-dev-learning-identity-id` or `x-dev-account-id` as authority.
3. Learning Identity is resolved server-side from `auth.uid()` through Supabase REST with the caller's access token and RLS.
4. Parent endpoints require an active `PARENT` role.
5. Teacher/assignment/recheck/observation endpoints require an active `TEACHER` role; `ADMIN` may pass the role gate.
6. Client request bodies may carry a learning identity for compatibility, but the server-derived principal is authoritative and mismatches are rejected.
7. Mobile production requests send `Authorization: Bearer <access token>`; dev headers are allowed only under `__DEV__`.
8. Direct runtime table writes remain blocked by migration `0030_runtime_client_write_lockdown.sql`.
9. Production runtime persistence is **not declared ready** until a transaction-capable PostgreSQL adapter is present and verified.

## Runtime persistence status

The current web runtime still uses the deterministic in-memory repository for development/test vertical slices. The repository interface remains the seam for a PostgreSQL implementation.

A PostgreSQL driver could not be installed in this environment because external npm access timed out. No fake transaction layer was introduced.

## Verification target

The next gate is:

`Supabase Auth → server principal → RLS-scoped identity/account lookup → transaction-capable runtime repository → Learning Runtime`

Only after that gate passes may the product claim Production Pilot readiness.
