# V1 Build Readiness — v0.32

تاریخ: ۲۴ سپتامبر ۲۰۲۶

## Current decision

Child App is explicitly animation-first in experience design.

### Locked visual runtime

- React Native + Expo + TypeScript
- React Native New Architecture + Hermes
- Reanimated for UI / transition animation
- Rive for main character and interactive 2D animation
- Skia is optional and deferred to games that need custom canvas rendering
- Unity / Unreal / Godot are not part of V1

## Why this is important

The product is for primary-school children and animation is now a first-class part of acquisition, comprehension, feedback, progress reveal and delight. Animation does not own Learning Truth.

## Updated implementation order

```text
1. Repository + module boundaries
2. Database migrations
3. Auth / RLS / authorization helpers
4. Mobile shell + navigation
5. Rive runtime spike + asset pipeline
6. Animation event controller + Reanimated foundation
7. Grade 1 seed
8. Content engine + evaluator
9. Session / Attempt / Answer
10. Evidence / Learning State
11. Rule-Based Decision Engine
12. Station 01 child UI
13. Station 01 animation package
14. Mini Games
15. Quest / Reward
16. Recovery / Re-check
17. Parent Lite
18. Teacher Lite
19. E2E + performance profiling + pilot
20. Station 02–25 rollout

## Animation Definition of Done

- Main character Rive asset loads locally.
- Idle / Think / Correct / Encourage / Celebrate states work.
- Semantic events trigger visual responses.
- Animation does not contain learning decision logic.
- Critical feedback has non-motion alternatives.
- Low-end Android performance is profiled.
- Asset size is measured and budgeted.
- Station 01 assets are lazy-loaded.
- Reduced-motion behavior is implemented.

## Build gate

`READY FOR BUILD` with one required engineering spike: validate Rive + Expo + New Architecture + Hermes + EAS together before committing the full animation pipeline.

## Product gate

Animation direction is locked at architecture level, while exact art direction, character identity, color system and final asset designs remain creative production decisions.
