# Phase 1 Dependency Matrix

| Area | Decision | Source / rule |
|---|---|---|
| Backend | Modular Monolith | v0.21 Product Core + v0.34 |
| Web | Next.js + React + TS | v0.34 |
| Mobile | React Native + Expo + Expo Router + TS | v0.34 |
| Animation | Rive + Reanimated | v0.32/v0.34 |
| Database | PostgreSQL / Supabase | v0.23 |
| Auth | Supabase Auth | v0.21/v0.34 |
| Content delivery | Manifest + current/next/recent/future cache | v0.33/v0.34 |
| Assignment | Class-scoped shared intent + per-child instance | v0.21/v0.33/v0.34 |
| Learning truth | Server-side canonical runtime | v0.21/v0.29 |

| Offline sync | At-least-once + idempotent server handling | v0.29/v0.34 + Phase 9 |
| Cache policy | CURRENT protected; NEXT prefetch; RECENT evictable; FUTURE on-demand | v0.33/v0.34 + Phase 9 |
| Sync authority | Client queues actions; server owns Learning Truth | v0.23/v0.29 + Phase 9 |
| Performance | 16.67ms frame budget target; low-end Android profiling before pilot | v0.32/v0.34 + Phase 9 |
