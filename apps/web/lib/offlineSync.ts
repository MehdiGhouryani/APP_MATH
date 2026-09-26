/**
 * Browser Offline Queue Store and Transport Implementation for Primary Math App
 * Powered by @math/offline-sync
 */

import {
  OfflineSyncManager,
  type OfflineSyncAction,
  type SyncQueueStore,
  type SyncTransport,
  type SyncReceipt,
} from '@math/offline-sync';

export class LocalStorageSyncStore implements SyncQueueStore {
  private readonly storageKey = 'math_app_offline_sync_queue_v1';

  private getAll(): OfflineSyncAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveAll(actions: OfflineSyncAction[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(actions));
    } catch (e) {
      console.warn('[OfflineSyncStore] Failed to persist queue to localStorage', e);
    }
  }

  async listReady(nowIso: string): Promise<OfflineSyncAction[]> {
    const all = this.getAll();
    const nowTime = new Date(nowIso).getTime();
    return all.filter((action) => {
      if (action.status === 'REJECTED' || action.status === 'ACKED') return false;
      if (!action.nextRetryAt) return true;
      return new Date(action.nextRetryAt).getTime() <= nowTime;
    });
  }

  async put(action: OfflineSyncAction): Promise<void> {
    const all = this.getAll();
    const index = all.findIndex((a) => a.id === action.id);
    if (index >= 0) {
      all[index] = action;
    } else {
      all.push(action);
    }
    this.saveAll(all);
  }

  async update(action: OfflineSyncAction): Promise<void> {
    await this.put(action);
  }

  async remove(id: string): Promise<void> {
    const all = this.getAll();
    const filtered = all.filter((a) => a.id !== id);
    this.saveAll(filtered);
  }

  getPendingCount(): number {
    return this.getAll().filter((a) => a.status === 'PENDING' || a.status === 'RETRY').length;
  }
}

export class AppletSyncTransport implements SyncTransport {
  async send(action: OfflineSyncAction): Promise<SyncReceipt> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (action.clientInstallationId) {
        headers['X-Client-Installation-Id'] = action.clientInstallationId;
      }

      const res = await fetch('/api/v1/sync/batch', {
        method: 'POST',
        headers,
        body: JSON.stringify({ actions: [action] }),
      });

      if (!res.ok) {
        const isTemporary = res.status === 429 || res.status >= 500;
        return {
          status: isTemporary ? 'RETRY' : 'REJECTED',
          idempotencyKey: action.idempotencyKey,
          errorCode: `HTTP_${res.status}`,
        };
      }

      const data = (await res.json()) as { results?: SyncReceipt[] };
      const receipt = data.results?.[0];
      if (receipt) {
        return receipt;
      }

      return {
        status: 'RETRY',
        idempotencyKey: action.idempotencyKey,
        errorCode: 'EMPTY_SYNC_RECEIPT',
      };
    } catch (err) {
      return {
        status: 'RETRY',
        idempotencyKey: action.idempotencyKey,
        errorCode: err instanceof Error ? err.message : 'NETWORK_ERROR',
      };
    }
  }
}

export const syncStore = new LocalStorageSyncStore();
export const syncTransport = new AppletSyncTransport();
export const syncManager = new OfflineSyncManager(syncStore, syncTransport);
