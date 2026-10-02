# Phase 6 — Station 01 Child Experience

Date: 24 September 2026
Status: IMPLEMENTED — DEVELOPMENT SLICE

## Goal

Turn Station 01 into the first playable child-facing vertical experience while preserving the canonical learning runtime.

## UX sequence

```text
Entry
→ Learn
→ Guided Practice
→ Pattern Game
→ Count Game
→ Check A
→ Result
→ Recovery / Recheck when required
→ Complete
```

## Game principle

The interaction is game-like, but the underlying operation remains a learning Encounter. The child selects, taps, counts, continues a pattern, receives visual feedback, and produces an answer that is sent to the Learning Runtime.

## No Unity

Unity is not used by this slice. The visual runtime remains React Native + Reanimated + Rive. Game interactions are implemented as native React Native UI primitives for this first slice.

## Runtime ownership

- Client: transient interaction state, rendering, animation, input.
- Server runtime: session, encounter, evaluation, evidence, learning state, decision.
- Local fallback: allowed only for development preview when the API base URL is not configured; it is not a production source of truth.

## Accessibility

- Large touch targets.
- RTL-friendly text layout.
- Reduced-motion behavior comes from the existing animation runtime.
- Meaningful feedback is not animation-only.

## Acceptance checks

1. Station route opens.
2. Entry starts a session.
3. Learn encounter displays.
4. Guided practice accepts a choice.
5. Pattern and counting games accept choices.
6. Check A and Check B run as separate check encounters; in remote mode they use separate sessions so the two-check Station Pass policy remains valid.
7. Wrong Check can route to Recovery.
8. Recovery can route to Recheck.
9. Character receives semantic animation events.
10. Complete state shows reward presentation without changing Learning Truth.
