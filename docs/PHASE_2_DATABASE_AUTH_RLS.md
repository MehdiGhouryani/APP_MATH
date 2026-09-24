# Phase 2 — Database + Auth + RLS

**Revision:** Phase 2 / 2026-09-24  
**Status:** `IMPLEMENTED BASELINE — STATIC VERIFIED`  
**Scope:** V1 / Grade 1 first vertical slice

## Goal

Move the repository from schema placeholders to a reproducible PostgreSQL/Supabase baseline that respects the canonical v0.34 identity, relationship, learning-truth, assignment and offline principles.

## Canonical migration order

```text
0001 extensions/helpers
0002 accounts/roles
0003 learning identities/installations/push
0004 relationships/classes/memberships
0005 grades/curriculum
0006 skill graph/stations
0007 learning objectives
0008 content contract
0009 diagnostics/policies
0010 runtime core
0011 evidence/state
0012 decisions/plans
0013 progression/unlocks/quests/rewards
0014 events/audit
0015 entitlements/assignments
0016 indexes/RLS hardening
0017 development seed registry
0018 Supabase auth trigger
0019 RLS contract test marker
0020 historical safety
0021 phase completion marker
```

## Authorization model

```text
Default Deny
+ Least Privilege
+ Server-side Authorization
+ PostgreSQL RLS
```

### Child

Own learning identity, own runtime actions, no cross-child access.

### Parent

Active relationship to child is required. Parent-facing actions cannot overwrite historical learning truth.

### Teacher

Access is restricted to authorized classes/relationships. Teacher may inspect students, create bounded assignments, request recheck and add observations; teacher cannot directly edit mastery or path truth.

### Admin

Administrative write authority is explicit and auditable. Admin is not a normal learning actor.

## Historical safety

The client receives no normal DELETE path for:

- Evidence
- Interpretation
- Session
- Encounter
- Attempt
- Answer
- Learning State history

Meaningful corrections use append-only / overlay semantics or new versions.

## Assignment boundary

`Assignment` stores shared teacher intent.

`Assignment Instance` stores child-specific execution state.

Assignment does not duplicate a content package.

## Entitlement boundary

`Entitlement` answers whether a learner/account may access a package scope. It is separate from cache/download state and separate from Learning State.

## Development seed

The seed registry creates G1..G6 grade rows and a provisional G1 curriculum/skill-graph registry. The Grade 1 64-skill taxonomy remains provisional until educational approval.

## Verification

`node scripts/verify-phase2.mjs`

The script performs static checks for migration order, required tables, role vocabulary, no-Unity architecture, assignment separation and historical safety. A live PostgreSQL/Supabase execution is intentionally not claimed from this environment because local `psql` / Supabase CLI are not installed.
