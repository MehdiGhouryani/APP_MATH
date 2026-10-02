import { describe, expect, it } from 'vitest';
import { OfflineSyncManager } from '../manager';
import { InMemorySyncQueueStore } from '../store';

const action = {
  id: 'a1',
  clientInstallationId: 'install-1',
  learningIdentityId: 'child-1',
  operationType: 'SUBMIT_ATTEMPT' as const,
  idempotencyKey: 'k1',
  payload: { answer: 1 },
};

describe('OfflineSyncManager', () => {
  it('persists a queued action and flushes it exactly once', async () => {
    const store = new InMemorySyncQueueStore();
    let sends = 0;
    const manager = new OfflineSyncManager(store, {
      async send(input) {
        sends += 1;
        return { status: 'ACKED' as const, idempotencyKey: input.idempotencyKey };
      },
    });

    await manager.enqueue(action);
    expect((await store.snapshot()).length).toBe(1);
    expect((await manager.flush()).acked).toBe(1);
    expect(sends).toBe(1);
    expect((await store.snapshot()).length).toBe(0);
    expect((await manager.flush()).processed).toBe(0);
  });

  it('flushes a retry when the app returns online', async () => {
    const store = new InMemorySyncQueueStore();
    let sends = 0;
    const manager = new OfflineSyncManager(store, {
      async send(input) {
        sends += 1;
        return sends === 1
          ? { status: 'RETRY' as const, idempotencyKey: input.idempotencyKey, retryAfterMs: 0 }
          : { status: 'ACKED' as const, idempotencyKey: input.idempotencyKey };
      },
    });

    await manager.enqueue(action);
    expect((await manager.flush()).retried).toBe(1);
    expect((await manager.flush()).acked).toBe(1);
    expect(sends).toBe(2);
  });
});
