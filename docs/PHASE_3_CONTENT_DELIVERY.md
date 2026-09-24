# Phase 3 — Content Package + Manifest + Entitlement + Mobile Content Manager

## Status
`ENGINEERING BASELINE COMPLETE — DEV FIXTURE ONLY`

## Scope
- Manifest fetched independently from full content.
- Current package download.
- Next package prefetch.
- Future packages stay on-demand.
- Package checksum validation with SHA-256.
- Local persistent package storage.
- Retry with bounded exponential backoff.
- Entitlement check before download.
- Assignment-required package relation.

## Canonical flow
```text
Auth / Learning Identity
        ↓
Manifest
        ↓
Current Package
        ↓
Entitlement
        ↓
Download
        ↓
Checksum
        ↓
Persistent Cache
        ↓
Station Runtime
```

## Cache classes
- CURRENT: required for active experience.
- NEXT: eligible for prefetch while online.
- RECENT: retained for quick resume/review.
- FUTURE: metadata only until explicitly needed.

## Development fixture boundary
The package files in `content/dev-packs/` are runtime fixtures only. They are not final Grade 1 educational content and must not be promoted to ACTIVE educational seed without review/approval.

## Entitlement boundary
Payment is intentionally absent in this phase. The only development entitlement is `DEV_GRANT` outside production. Production access must be resolved server-side from canonical entitlement/assignment records.

## API baseline
- `GET /api/v1/content/manifest?gradeId=G1`
- `GET /api/v1/content/packages/:packageId`
- `GET /api/v1/content/entitlements/:packageId`
- `GET /api/v1/assignments/:assignmentId/content`

## Exit gate
- Manifest independent from package bytes.
- Current package can be downloaded and verified.
- Next package can be downloaded/prefetched.
- No full-grade download path exists.
- Entitlement is checked before download.
- Corrupt package is deleted and retried.
- Package survives app restart through document storage.
