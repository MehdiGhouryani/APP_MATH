# V1 Build Readiness — v0.31

تاریخ: ۲۴ سپتامبر ۲۰۲۶

## Current decision

The project is ready to start the Station 01 Build Phase. Parent Lite and Teacher Lite are now contractually scoped so they do not expand the learning core.

| Area | Status |
|---|---|
| Child Core | READY FOR STATION 01 BUILD |
| Game / Quest / Reward | READY |
| Content Contract | READY BASELINE |
| Session Runtime / Learning Rules | READY BASELINE |
| Parent Lite | SCOPED + READY AFTER CHILD CORE |
| Teacher Lite | SCOPED + READY AFTER CHILD CORE |
| Grade 1 graph | READY WITH EDUCATIONAL PROVISION |
| Full Grade 1 content | IN PROGRESS / NOT COMPLETE |
| Auth/RLS implementation | BUILD TASK |
| Legal/privacy | REQUIRED BEFORE PUBLIC RELEASE |

## Updated implementation order

```text
1. Repository + module boundaries
2. Database migrations
3. Auth / RLS / authorization helpers
4. Grade 1 seed
5. Content engine + evaluator
6. Session / Attempt / Answer
7. Evidence / Learning State
8. Rule-Based Decision Engine
9. Station 01 child UI
10. Mini Games
11. Quest / Reward
12. Recovery / Re-check
13. Parent Lite
14. Teacher Lite
15. E2E + pilot
16. Station 02–25 rollout

## Station 01 Definition of Done

The slice is complete when Placement → Path → Station → Game → Evidence → Decision → Recovery/Pass → Quest → Reward → Resume works end-to-end and Parent/Teacher smoke projections are coherent.

## Release gate

This is build-ready, not public-production-complete. Educational approval, full content QA, Auth/RLS audit, privacy/legal review and store hardening remain release gates.
