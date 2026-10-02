# Phase 14 — Deep Remediation

## Closed in code

- Grade 1 executable staging seed now includes 25 Stations, 64 provisional Skills, station-skill mappings, ST01 E01–E12 content, package and manifest.
- ST01 Recovery/Re-check now has skill-aware variants for SK001, SK003, SK009 and SK011 while preserving the 12 logical encounter inventory.
- Mobile idempotency key is installation + session + encounter + content-version + attempt scoped.
- E12 is a mastery-evidence encounter and never grants Station Pass.
- Production readiness now detects executable seed state separately from educational approval.
- Production Adult/Assignment gates fail closed unless a real Supabase-backed repository is explicitly selected; current runtime remains in-memory.

## Still blocked

- Grade 1 Skill Graph is PROVISIONAL and requires educational review.
- ST01 content has `EDUCATIONAL_REVIEW_REQUIRED`.
- Live Supabase migration/Auth/RLS/transaction E2E has not been executed in this environment.
- Adult Projection and Assignment repositories are not yet Supabase-backed; their production gates are intentionally fail-closed.

## Important semantic rule

The four skill-aware Recovery/Re-check variants are implementation variants of E09/E10, not additional logical Station encounters.

## Source basis

ST01 encounter inventory and recovery intent follow `math_learning_product_station01_vertical_slice_v0_30.md`; the skill mappings remain provisional per `math_learning_product_grade1_skill_graph_v0_27.md`.
