# V1 Build Readiness — v0.33

**Date:** 24 September 2026

## Current Status

`READY FOR BUILD — Station 01 Vertical Slice`

## Locked V1 Architecture

### Child
- React Native + Expo + TypeScript
- React Native New Architecture + Hermes
- Reanimated
- Rive
- optional Skia only when a game requires custom canvas rendering

### Experience
- Animated Character
- Learn / Guided Practice / Check / Result
- Mini Games
- Quest / Reward
- Recovery / Recheck

### Delivery
- Manifest-driven content
- Grade / Station package boundaries
- Current pack required
- Next pack prefetch
- Future packs on-demand
- Smart local cache
- Entitlement-aware access
- Offline pending actions + server-authoritative learning sync

### Adult experiences
- Parent Lite
- Teacher Lite
- Admin baseline

## Teacher Assignment

V1 supports:
- class-scoped assignment;
- Skill/Station objective;
- start/due date;
- bounded adaptation;
- completion tracking;
- Recheck.

## Build Order

```text
1. Repository / module boundaries
2. Supabase / PostgreSQL migrations
3. Auth + RLS
4. Content Package + Manifest schema
5. Entitlement service
6. Assignment service
7. Mobile Content Manager
8. Rive runtime spike
9. Animation controller
10. Grade 1 seed
11. Content evaluator
12. Session runtime
13. Evidence / Learning State
14. Rule-Based Decision Engine
15. Station 01 UI
16. Station 01 content pack
17. Mini Games
18. Assignment → Child Session
19. Quest / Reward
20. Recovery / Recheck
21. Parent Lite
22. Teacher Lite
23. Offline / sync tests
24. E2E + low-end Android performance
25. Pilot
26. Station 02–25
```

## Definition of Done — Delivery

- [ ] Manifest can be fetched independently from full content.
- [ ] Current station package loads without full-grade download.
- [ ] Next station can prefetch.
- [ ] Future station remains on-demand.
- [ ] Entitlement is server-authoritative.
- [ ] Assignment can require a package.
- [ ] Package cache survives restart.
- [ ] Failed download retries safely.
- [ ] Offline actions sync idempotently.
- [ ] Package checksum is validated.
- [ ] Storage budget is enforced.
- [ ] No class-specific content duplication.

## Definition of Done — Animation

- [ ] Core Rive character loads.
- [ ] Semantic events drive visual states.
- [ ] Station animation packs are lazy loaded.
- [ ] Reduced-motion fallback exists.
- [ ] Low-end Android performance profiled.
- [ ] Asset budgets measured.

## Remaining Product Gates

- educational review of Grade 1 taxonomy;
- final content authoring for Grade 1;
- final legal/privacy review;
- release/pilot QA.

The project is not yet a public release; it is ready for engineering build of the first end-to-end vertical slice.
