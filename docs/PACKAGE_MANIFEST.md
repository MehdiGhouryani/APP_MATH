# V1 Package Manifest

## Architecture

- Modular Monolith
- TypeScript
- Next.js + React Web
- React Native + Expo Mobile
- Node.js 24 LTS target
- PostgreSQL + Supabase Auth/Storage
- Rive + Reanimated
- **Unity: NOT USED**

## Included specification set

- Product Core v0.21
- Database Schema v0.23
- Grade 1 Skill Graph v0.27
- Game / Engagement / Quest / Reward v0.28
- Session Runtime / Learning Rules v0.29
- Parent / Teacher Experience v0.31
- Build Readiness v0.31
- Build Readiness v0.32
- Build Readiness v0.33
- v0.34 Build Roadmap / Reconciliation
- v0.34 Implementation Baseline

## Implementation set

- repository bootstrap
- Web shell scaffold
- Mobile Expo shell scaffold
- contracts package scaffold
- API client scaffold
- Supabase migration scaffold
- environment template
- TypeScript base configuration

## Current implementation status

Implemented through Phase 10 remediation and Phase 11 Auth boundary:

- production API Auth boundary with Supabase Bearer verification
- server-side Learning Identity resolution under RLS
- Parent/Teacher role gates
- Content Package/Manifest + Entitlement contract/runtime slices
- Assignment runtime slice
- Mobile Content Manager + Offline Sync runtime slices
- Learning Engine runtime slice + Station 01 vertical slice
- E2E/performance verification harness

Still pending for Production Pilot:

- transaction-capable PostgreSQL Learning Runtime adapter
- production mobile Auth session UI/persistence
- production Rive asset package
- final educational approval of the 64 provisional Grade 1 skills
- device-level EAS/Expo build verification
- full production end-to-end run against Supabase

## Build status

Repository bootstrap is scaffolded. Node 24 is the target runtime; the current execution environment must be upgraded/validated against Node 24 before claiming a green production build.

- `docs/PHASE_2_DATABASE_AUTH_RLS.md`
- `scripts/verify-phase2.mjs`
- `supabase/migrations/0001..0021` Phase 2 migration chain
