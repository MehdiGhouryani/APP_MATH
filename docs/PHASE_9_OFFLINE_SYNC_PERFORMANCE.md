# Phase 9 — Offline + Sync + Performance

Date: 24 September 2026

## Purpose

Implement the V1 offline boundary without moving Learning Truth to the device.

## Locked behavior

### Offline queue

- Transport is at-least-once.
- Every queued action has a client installation id + operation type + idempotency key.
- Queue states: PENDING → SYNCING → ACKED / RETRY / REJECTED.
- SYNCING is recoverable after app restart.
- Retry uses bounded exponential backoff.
- Duplicate/ACK responses remove the queue item.

### Authoritative boundary

Offline cannot authoritatively commit:

- final Learning State;
- final Mastery;
- final Station Pass;
- permission grants.

Offline can capture a pending attempt/session/event operation and submit it after reconnect.

### Content cache

- CURRENT is protected.
- NEXT may prefetch.
- RECENT is evictable.
- FUTURE remains on-demand.
- Entitlement revocation removes the affected cached package.
- SHA-256 is validated before a package becomes usable.
- Cache budget is enforced; protected CURRENT packages are never silently evicted.

### Performance

- UI frame budget target: 16.67 ms for 60 FPS.
- Sync batch target: max 20 actions.
- Default development cache budget: 80 MB.
- Low-end Android must be profiled before pilot.
- Reduced-motion behavior remains mandatory from Phase 4.

## Exit gate

- offline action survives restart;
- reconnect flushes idempotently;
- duplicate sync does not create duplicate learning records;
- failed downloads retry;
- revoked entitlement cannot keep a usable protected copy;
- cache budget is enforced;
- critical E2E path can run online and offline;
- no client-side action can directly mutate Learning Truth.
