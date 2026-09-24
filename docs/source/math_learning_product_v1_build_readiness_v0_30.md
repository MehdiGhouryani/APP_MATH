# V1 Build Readiness — Consolidated Closure v0.30

تاریخ: ۲۴ سپتامبر ۲۰۲۶

## وضعیت تصمیم

این سند وضعیت نهایی مجموعه specifications موجود را برای ورود به Build Phase جمع‌بندی می‌کند.

### Baseline Documents

1. Product Core v0.21-MA4
2. Database Schema v0.23-MA4
3. Grade 1 Skill Graph + Station Contract v0.27
4. Game + Engagement + Quest + Reward v0.28-GEQR
5. Content Contract v0.28
6. Session Runtime + Learning Rules v0.29

## Readiness Matrix

| Area | Status | Build Gate |
|---|---|---|
| Product semantics | READY | Closed |
| Child Path / Station model | READY | Closed |
| Skill Graph structure | READY WITH EDUCATIONAL PROVISION | Review before seed freeze |
| Database model | READY BASELINE | Implement migrations |
| Auth/RLS | REQUIRED IMPLEMENTATION SPEC | Must exist before production data |
| Content Contract | READY | Seed can start |
| Session Runtime | READY | Unit/integration tests required |
| Game system | READY | Implement Station 01 first |
| Quest system | READY | Implement with projections |
| Reward system | READY | Implement idempotent grants |
| Full Grade 1 content | NOT READY | Must be authored/QA'd progressively |
| Grades 2–6 content | NOT READY | Later |
| Legal / privacy | PROVISIONAL | Required before public launch |

## What the team may build now

- repository bootstrap؛
- PostgreSQL migration skeleton;
- domain/application modules؛
- Child Mobile shell؛
- Public/Parent/Teacher/Admin shells؛
- Skill/Station seed harness؛
- Content engine skeleton؛
- evaluator interface؛
- Session runtime؛
- Game renderer contract؛
- Quest/Reward projection;
- Station 01 vertical slice.

## What is not production-complete yet

- all Grade 1 content;
- complete RLS SQL and authorization helper suite unless separately closed;
- final educational approval of 64-skill taxonomy;
- final calibration of Mastery / Pass;
- full legal/privacy sign-off;
- App Store / Play Store release hardening.

## Definition of Done for Station 01

Station 01 is considered implementation-ready only when all are true:

- Skill mappings seed successfully؛
- content versions seed successfully؛
- instruction/practice/check/recovery content exists؛
- 2 Mini Games exist؛
- evaluator tests pass؛
- Attempt/Answer/Evidence transaction works؛
- Learning State updates; 
- Decision selects next step;
- Pass/Recovery/Re-check work;
- Quest progress works;
- Reward grant is idempotent;
- session resume works;
- RTL/audio/touch baseline works;
- Playwright E2E passes;
- historical version pinning is verified.

## Recommended implementation order

```text
1. Repository + module boundaries
2. Database migrations
3. Auth / RLS / roles
4. Grade 1 seed
5. Content engine + evaluator interface
6. Session / Attempt / Answer
7. Evidence / Learning State
8. Rule-Based Decision Engine
9. Station 01 UI
10. Mini Games
11. Quest / Reward projections
12. Recovery / Re-check
13. Parent / Teacher minimal views
14. E2E + pilot telemetry
15. Station 02–25 rollout
```

## Final Gate

**The project is ready to enter the Build Phase for a Station 01 vertical slice. It is not yet a complete production-ready six-grade app.**

The right next unit of implementation is not the whole app; it is the end-to-end learning slice that proves:

`Placement → Path → Station → Game → Evidence → Decision → Recovery/Pass → Quest → Reward → Resume`.
