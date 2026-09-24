import { CryptoDigestAlgorithm, digestStringAsync } from 'expo-crypto';
import type { OfflineSyncAction, SyncReceipt, SyncTransport } from '@math/offline-sync';
import { FileSyncQueueStore } from './FileSyncQueueStore';
import { OfflineSyncManager } from '@math/offline-sync';
import { getAuthHeaders } from '../auth/AuthSession';

export class MobileSyncTransport implements SyncTransport {
  constructor(private readonly baseUrl: string, private readonly installationId: string, private readonly devLearningIdentityId: string | undefined) {}

  async send(action: OfflineSyncAction): Promise<SyncReceipt> {
    const response = await fetch(`${this.baseUrl}/api/v1/sync/batch`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Client-Installation-Id': this.installationId, ...getAuthHeaders(), ...(__DEV__ && !getAuthHeaders().Authorization && this.devLearningIdentityId ? { 'x-dev-learning-identity-id': this.devLearningIdentityId } : {}) },
      body: JSON.stringify({ actions: [action] }),
    });
    if (!response.ok) {
      if (response.status >= 500 || response.status === 429) return { status: 'RETRY', idempotencyKey: action.idempotencyKey, errorCode: `HTTP_${response.status}` };
      return { status: 'REJECTED', idempotencyKey: action.idempotencyKey, errorCode: `HTTP_${response.status}` };
    }
    const body = await response.json() as { results?: SyncReceipt[] };
    return body.results?.[0] ?? { status: 'RETRY', idempotencyKey: action.idempotencyKey, errorCode: 'SYNC_RESPONSE_INVALID' };
  }
}

export function createMobileSyncManager(baseUrl: string, installationId: string, devLearningIdentityId?: string): OfflineSyncManager {
  return new OfflineSyncManager(new FileSyncQueueStore(), new MobileSyncTransport(baseUrl, installationId, devLearningIdentityId));
}

export async function stableActionKey(operationType: string, scope: string, payload: unknown): Promise<string> {
  return digestStringAsync(CryptoDigestAlgorithm.SHA256, `${operationType}:${scope}:${JSON.stringify(payload)}`);
}
