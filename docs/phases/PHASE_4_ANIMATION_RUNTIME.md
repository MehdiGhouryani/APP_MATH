# Phase 4 — Animation Runtime

Date: 2026-09-24

## Goal

Animation is a first-class child-experience layer but does not own Learning Truth, diagnosis, mastery, station pass, or learning decisions.

## Locked stack

- React Native + Expo + TypeScript
- React Native New Architecture + Hermes
- Rive for character/interactive 2D animation
- Reanimated remains the UI-motion layer
- no Unity / Unreal / Godot in V1

Rive's current React Native documentation recommends the new Nitro-based runtime and lists Expo SDK 53+ and React Native 0.78+ as requirements. The project is above those minimums at Expo 57 / React Native 0.86. citeturn155126view0

## Semantic event bridge

The animation layer accepts semantic events only:

```text
SESSION_START
EXPLAIN
ANSWER_CORRECT
ANSWER_WRONG
HINT_OPENED
RECOVERY
STATION_PASS
MILESTONE
REWARD_GRANTED
```

Learning code does not reference Rive state-machine names or animation IDs.

## State mapping

```text
SESSION_START  -> IDLE
EXPLAIN        -> THINK
ANSWER_CORRECT -> CORRECT
ANSWER_WRONG   -> ENCOURAGE
HINT_OPENED    -> THINK
RECOVERY       -> RECOVERY
STATION_PASS   -> CELEBRATE
MILESTONE      -> CELEBRATE
REWARD_GRANTED -> CELEBRATE
```

## Reduced motion

`AccessibilityInfo.isReduceMotionEnabled()` disables non-essential motion and renders a static fallback character panel.

## Rive asset boundary

The runtime is prepared to load a local or cached `.riv` file through `useRiveFile`. The final branded character asset is intentionally not invented in code. A supplied/produced `.riv` asset becomes the production asset in the next asset-production handoff.

## Current gate status

- [x] semantic event contract
- [x] event → visual-state controller
- [x] Rive runtime component integration
- [x] reduced-motion fallback
- [x] animation demo route
- [ ] final branded `.riv` character asset
- [ ] low-end Android profiling on a physical device
- [ ] measured final asset budget

Therefore Phase 4 is **ENGINEERING FOUNDATION READY / CREATIVE ASSET GATE OPEN**, not falsely marked as final animation production.
