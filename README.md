# Math Learning Product V1

Current architecture:

- TypeScript
- Next.js + React for Web
- React Native + Expo for Child Mobile
- Node.js 24 target
- PostgreSQL + Supabase Auth/Storage
- Rive + Reanimated for animation
- Modular Monolith
- Server-authoritative Learning Runtime
- No Unity / Unreal / Godot in V1

## Current implementation phase

**Phase 16 — Deep Audit & Remediation**

Completed implementation areas include repository/bootstrap, DB/Auth/RLS baseline, content delivery, Rive runtime boundary, Learning Runtime, Station 01 child flow, Teacher Assignment slice, Parent/Teacher projections, Offline/Sync, E2E/performance gates, Production Auth boundary, transactional PostgreSQL runtime contract, and successive deep-audit remediation passes.

## Current status

Engineering verification is progressing, but **Production Pilot is still BLOCKED**.

Passing checks currently include:

- Learning Runtime tests: 6/6
- Learning Runtime package TypeScript verification
- Phase 15 adversarial verification
- Migration static guard: 44 contiguous migrations through `0044_runtime_check_group_ordering.sql`
- Repository script syntax verification

Intentional blockers:

- 64 Grade 1 skills and ST01 content remain educationally provisional / review-required.
- Live Supabase migration + Auth + RLS + RPC + Station 01 E2E has not been executed in this environment.
- Adult Projection and Assignment production repositories are still in-memory and remain fail-closed.
- Complete Web/Mobile workspace build is not verified because the current environment lacks a complete dependency/workspace installation.

## Delivery rule

Every phase package is a complete repository snapshot, including:

- all source code
- all database migrations
- all tests / verification scripts
- all contracts
- all historical and current `.md` specifications
- phase manifests and revision notes

## Important product boundary

Parent and Teacher experiences are projections of Shared Platform Core. They do not own Learning Truth and cannot manually overwrite Learning State, Mastery, Path, or historical Evidence.

## Migration integrity rule

Applied migrations are treated as immutable history. Forward corrections are delivered through new migration numbers rather than editing an already-applied migration. Phase 16 uses `0044_runtime_check_group_ordering.sql` for the check-group ordering correction.

## Current audit documents

- `docs/AUDIT_DEEP_2026-09-25.md`
- `docs/PHASE_16_DEEP_AUDIT_REMEDIATION.md`
- `docs/REVISION_NOTES_PHASE_16.md`
- `scripts/verify-migrations-static.mjs`
- `scripts/verify-production-readiness-static.mjs`
