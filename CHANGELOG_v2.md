# Changelog · 2.0.0 (2026-10-02) · cast rebuild

Added
- project-design-v2/ (source, assets, specs, docs, concepts, preview, qa)
- apps/web/components/CharacterArt.tsx, apps/web/lib/characterArt.generated.ts
- apps/mobile/src/characters/art.ts, apps/mobile/assets/characters/** (PNG 1x/2x/3x)

Changed
- apps/web/components/RiveCompanionMascot.tsx: inline v1 SVG branches → CharacterArt (props unchanged)
- apps/web/components/InteractiveCompanion.tsx: 4 inline SVG components + emoji badge removed → CharacterArt
- apps/web/app/globals.css: cast v2 motion appended
- apps/web/lib/persian.ts, apps/mobile/src/characters/characters.ts: descriptions, colors, species, softened lines
- apps/mobile/src/components/CharacterAvatar.tsx, AnimatedCharacter.tsx, SemanticAnimationDemo.tsx
- apps/mobile/assets/icon.png, adaptive-icon.png, splash-icon.png
- project-design-v1.3/specs/characters.json marked superseded; v1.2/v1.3 READMEs note supersession

Moved (archived, not deleted)
- project-design-v1.3/assets/characters → project-design-archive/v1.3-characters
- project-design-v1.2/assets/characters, assets/concepts → project-design-archive/
- project-design/assets/{aria-expression-sheet,character-family}.png → project-design-archive/v0-character-png
- note: project-design-v1.3/qa/original-preservation.json still lists the old paths (historical record)

Not included
- .riv files, side/3-quarter vector turnarounds, audio, device build, child testing

# 2.0.1 (2026-10-02) · design audit + roadmap
Fixed
- web: leftover emoji companions replaced by CharacterArt bust (DuolingoPath, ProfileView, ChildTopBar, PlacementFlow); getCompanionEmoji deprecated
- web: no companion on CHECK (assessment) nodes in DuolingoLessonModal
- motion: Qbo loading ring static in lesson mode; encourage float-cube no longer loops; Dana celebrate tail flow 1x (under 2s) with seamless offset
- cast: correct-state fx added for Aria and Qbo; full rebuild (SVG/PNG/generated.ts/preview), validate-cast 28/28
- CharacterArt: stable remount key (no double play on mount)
Added
- ROADMAP_PHASES.md (phase plan with PASS/PENDING protocol)
- docs/audits/AUDIT_DESIGN_V2_2026-10-02.md

# 2.0.2 (2026-10-02) · P00 offline checks + P01 cast hardening
Fixed
- mobile StationFlow: dead LOCAL/REMOTE comparisons (real tsc errors), double semicolon
- web: guides now follow allowedScenes (Jiko only rewards; Qbo counting; Dana pattern/shape); OTP screen Qbo → Aria
- cast: motion targets classes, inline SVG has unique per-instance ids (valid DOM with many guides)
Added
- packages/contracts/src/characters.ts (resolveGuide), apps/web/lib/{characterScenes,characterArtMarkup}.ts + tests, e2e/web/no-guide-on-check.spec.ts
- build-all syncs globals.css motion block; validate-cast checks classes, inline ids, multi-instance uniqueness, generated module sync
Removed
- mobile Character.emoji, web getCompanionEmoji
Spec
- characters-v2.json: toothPolicy (Dana rounded incisors allowed), requiredIdExceptions (Qbo think), selectorPolicy

# 2.0.4 (2026-10-02) · offline sync lifecycle
Fixed
- pending mobile sync actions now flush on app launch and every foreground transition
- local fallback no longer claims an answer was queued when no server encounter exists
Added
- offline-sync manager tests for ACK, retry, and re-flush behavior
- bust SVG clips to its frame (overflow:hidden); before, the full body spilled outside small avatars (top bar, path, preview)

# 2.0.5 (2026-10-02) · C0 repo cleanup + optimization
Removed
- project-design-archive/, project-design-v1.2/, project-design/ (v1.1 text decisions kept in docs/design-history/v1.1/)
- v1.3 duplicates/build outputs: prototype/, DESIGN-HANDBOOK.pdf, root FinalHandoff/TechResearch, prototype-src json copies, assets/brand, original-preservation.json, manifest.csv
- START_HERE_v1.2/v1.3 (v2 renamed to START_HERE.md); superseded docs/source revisions; old snapshot/package manifests; one-off debug scripts + obsolete verify-remediation.mjs
Changed
- docs/ split into adr/ api/ phases/ audits/ source/ reference/ history/ (+ docs/README.md map); script paths updated
- concepts PNG → WebP; all PNGs losslessly optimized (optipng -o2)
- ROADMAP_PHASES.md: C0 phase, milestones M0–M5, critical path, concrete next step, repo hygiene rule
- README status refreshed; .gitignore extended
Verified
- all static verify scripts unchanged result; validate-cast 28/28

# 2.0.6 (2026-10-02) · audit handoff
Changed
- ROADMAP_PHASES.md: P01 corrected from IN_PROGRESS to PASS; P00 remains explicitly BLOCKED pending network/device gates
- scripts/verify-phase16-deep-audit.mjs: static verification no longer claims full Pilot readiness
Verified
- cast validation: 28/28 assets, 96 unique inline ids
- migration/static/auth/content/learning/offline/readiness checks: PASS
