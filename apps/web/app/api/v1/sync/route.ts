import { NextResponse } from 'next/server';
import { requireRequestPrincipal } from '@/lib/request-principal';
import { apiErrorStatus } from '@/lib/api-errors';

// Global server-side in-memory store for syncing across devices
interface SyncState {
  completedNodeIds: string[];
  learningStars: number;
  updatedAt: string;
}

const globalStore = globalThis as typeof globalThis & {
  __mathDeviceSyncStore?: Map<string, SyncState>;
};

if (!globalStore.__mathDeviceSyncStore) {
  globalStore.__mathDeviceSyncStore = new Map<string, SyncState>();
}

const syncStore = globalStore.__mathDeviceSyncStore;

export async function GET(request: Request) {
  try {
    const principal = await requireRequestPrincipal(request);
    const id = principal.learningIdentityId;

    const saved = syncStore.get(id);
    if (!saved) {
      // Default initial states matching the UI defaults
      return NextResponse.json({
        completedNodeIds: ['step-1', 'step-2'],
        learningStars: 120,
      });
    }

    return NextResponse.json({
      completedNodeIds: saved.completedNodeIds,
      learningStars: saved.learningStars,
    });
  } catch (error) {
    return NextResponse.json(
      { code: 'SYNC_GET_FAILED', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: apiErrorStatus(error) }
    );
  }
}

export async function POST(request: Request) {
  try {
    const principal = await requireRequestPrincipal(request);
    const id = principal.learningIdentityId;

    const body = (await request.json()) as {
      completedNodeIds?: string[];
      learningStars?: number;
    };

    const clientNodes = body.completedNodeIds || [];
    const clientStars = typeof body.learningStars === 'number' ? body.learningStars : 0;

    const existing = syncStore.get(id);

    let mergedNodes = clientNodes;
    let mergedStars = clientStars;

    if (existing) {
      // Merge: Union of all completed node IDs to ensure progress is never lost
      mergedNodes = Array.from(new Set([...existing.completedNodeIds, ...clientNodes]));
      // Merge: Take the maximum star count across devices to ensure stars are not downgraded
      mergedStars = Math.max(existing.learningStars, clientStars);
    } else {
      // If no existing record, ensure defaults are at least included
      mergedNodes = Array.from(new Set(['step-1', 'step-2', ...clientNodes]));
      mergedStars = Math.max(120, clientStars);
    }

    syncStore.set(id, {
      completedNodeIds: mergedNodes,
      learningStars: mergedStars,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      completedNodeIds: mergedNodes,
      learningStars: mergedStars,
      status: 'SYNCHRONIZED',
    });
  } catch (error) {
    return NextResponse.json(
      { code: 'SYNC_POST_FAILED', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: apiErrorStatus(error) }
    );
  }
}
