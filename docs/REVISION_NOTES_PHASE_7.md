# Revision Notes — Phase 7

## Added

- `@math/assignment-runtime`
- assignment creation / publish / per-learner instances
- recheck lifecycle
- assignment outcome projection
- teacher demo page
- child assignment surface
- relational assignment targets migration
- API contract and phase documentation

## Preserved

- No Unity
- Server-authoritative Learning Truth
- One shared Learning Engine
- Content Package reuse; no class content duplication
- Parent/Teacher as projections/context, not a second learning truth

## Known boundary

The production Supabase service adapter is not yet wired to these Next.js demo routes. The current in-memory adapter is intentionally a development workflow harness. RLS SQL is the authoritative production permission boundary.
