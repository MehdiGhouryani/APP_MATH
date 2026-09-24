import { Directory, File, Paths } from 'expo-file-system';
import type { OfflineSyncAction, SyncQueueStore } from '@math/offline-sync';

export class FileSyncQueueStore implements SyncQueueStore {
  private readonly dir = new Directory(Paths.document, 'sync');
  private readonly file = new File(this.dir, 'pending-actions.json');

  async listReady(now: string): Promise<OfflineSyncAction[]> {
    const actions = await this.read();
    const t = Date.parse(now);
    return actions
      .filter((x) => (x.status === 'PENDING' || x.status === 'RETRY' || x.status === 'SYNCING') && (!x.nextRetryAt || Date.parse(x.nextRetryAt) <= t))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async put(action: OfflineSyncAction): Promise<void> {
    const actions = await this.read();
    const index = actions.findIndex((x) => x.id === action.id);
    if (index === -1) actions.push(action); else actions[index] = action;
    await this.write(actions);
  }

  async update(action: OfflineSyncAction): Promise<void> {
    const actions = await this.read();
    const index = actions.findIndex((x) => x.id === action.id);
    if (index === -1) actions.push(action); else actions[index] = action;
    await this.write(actions);
  }

  async remove(id: string): Promise<void> {
    const actions = await this.read();
    await this.write(actions.filter((x) => x.id !== id));
  }

  private async read(): Promise<OfflineSyncAction[]> {
    if (!this.file.exists) return [];
    const bytes = await this.file.bytes();
    if (bytes.byteLength === 0) return [];
    return JSON.parse(new TextDecoder().decode(bytes)) as OfflineSyncAction[];
  }

  private async write(actions: OfflineSyncAction[]): Promise<void> {
    if (!this.dir.exists) this.dir.create({ intermediates: true, idempotent: true });
    if (!this.file.exists) this.file.create({ intermediates: true, overwrite: true });
    this.file.write(JSON.stringify(actions));
  }
}
