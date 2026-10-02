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

Engineering phases 0–16 are done. Product completion now follows **`ROADMAP_PHASES.md`** (D0/C0 PASS, P00 BLOCKED, P01 IN_PROGRESS). Start with `START_HERE.md`; folder map in `docs/README.md`.

Completed implementation areas include repository/bootstrap, DB/Auth/RLS baseline, content delivery, Rive runtime boundary, Learning Runtime, Station 01 child flow, Teacher Assignment slice, Parent/Teacher projections, Offline/Sync, E2E/performance gates, Production Auth boundary, transactional PostgreSQL runtime contract, and successive deep-audit remediation passes.

## Current status

Engineering verification is progressing, but **Production Pilot is still BLOCKED**.

Passing checks currently include:

- Learning Runtime tests: 6/6
- Learning Runtime package TypeScript verification
- Phase 15 adversarial verification
- Migration static guard: 48 contiguous migrations through `0048_teacher_auth_mapping.sql`
- Repository script syntax verification

Intentional blockers:

- 64 Grade 1 skills and ST01 content remain educationally provisional / review-required.
- Live Supabase migration + Auth + RLS + RPC + Station 01 E2E has not been executed in this environment.
- Adult Projection and Assignment production repositories are still in-memory and remain fail-closed.
- Complete Web/Mobile workspace build is not verified because the current environment lacks a complete dependency/workspace installation.

## Delivery rule

Every package is a complete repository snapshot: all source code, migrations, tests/verify scripts and contracts, plus the **current** specs. Superseded design versions, old spec revisions and one-off debug scripts are removed (they remain in git history); see `docs/CLEANUP_2026-10-02.md`.

## Important product boundary

Parent and Teacher experiences are projections of Shared Platform Core. They do not own Learning Truth and cannot manually overwrite Learning State, Mastery, Path, or historical Evidence.

## Migration integrity rule

Applied migrations are treated as immutable history. Forward corrections are delivered through new migration numbers rather than editing an already-applied migration. Phase 16 uses `0044_runtime_check_group_ordering.sql` for the check-group ordering correction.

## Current audit documents

- `docs/audits/AUDIT_DESIGN_V2_2026-10-02.md`
- `docs/audits/AUDIT_DEEP_2026-09-25.md`
- `docs/phases/PHASE_16_DEEP_AUDIT_REMEDIATION.md`
- `scripts/verify-migrations-static.mjs`
- `scripts/verify-production-readiness-static.mjs`
