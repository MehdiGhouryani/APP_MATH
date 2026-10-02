import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createInitialState, localDay, markStationPassed, markStationStarted, recordActivity, setResume, type AppState, type ChildProfile, type EntryDecision, type ResumePoint } from './appStateCore';
import { deleteAllData, loadEntry, saveState } from './appStateStore';

interface Ctx {
  /** false until the first read of the state file finished (splash stays up). */
  ready: boolean;
  entry: EntryDecision;
  /** Non-null only when RETURNING. */
  state: AppState | null;
  completeOnboarding: (profile: ChildProfile, fastTrack: boolean) => Promise<boolean>;
  startStation: (stationId: string) => void;
  passStation: (stationId: string) => void;
  /** Remember where the child is (null clears) and count today as an active day. */
  saveResume: (stationId: string, resume: ResumePoint | null) => void;
  /** Parent-confirmed deletion; the app returns to First Run. */
  resetAll: () => Promise<boolean>;
}

const AppStateCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entry, setEntry] = useState<EntryDecision>({ kind: 'NEW' });
  // Mirror of the latest state so back-to-back updates compose correctly.
  const latest = useRef<AppState | null>(null);

  useEffect(() => {
    let alive = true;
    void loadEntry().then((d) => {
      if (!alive) return;
      latest.current = d.kind === 'RETURNING' ? d.state : null;
      setEntry(d);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const apply = useCallback((next: AppState) => {
    latest.current = next;
    setEntry({ kind: 'RETURNING', state: next });
    void saveState(next);
  }, []);

  const completeOnboarding = useCallback(async (profile: ChildProfile, fastTrack: boolean) => {
    const next = createInitialState(profile, fastTrack);
    const ok = await saveState(next);
    if (ok) {
      latest.current = next;
      setEntry({ kind: 'RETURNING', state: next });
    }
    return ok;
  }, []);

  const startStation = useCallback(
    (stationId: string) => {
      if (!latest.current) return;
      const next = markStationStarted(latest.current, stationId, new Date().toISOString());
      if (next !== latest.current) apply(next);
    },
    [apply]
  );

  const passStation = useCallback(
    (stationId: string) => {
      if (!latest.current) return;
      const next = markStationPassed(latest.current, stationId, new Date().toISOString());
      if (next !== latest.current) apply(next);
    },
    [apply]
  );

  const saveResume = useCallback(
    (stationId: string, resume: ResumePoint | null) => {
      if (!latest.current) return;
      const now = new Date();
      const next = recordActivity(setResume(latest.current, stationId, resume, now.toISOString()), localDay(now));
      if (next !== latest.current) apply(next);
    },
    [apply]
  );

  const resetAll = useCallback(async () => {
    const ok = await deleteAllData();
    if (ok) {
      latest.current = null;
      setEntry({ kind: 'NEW' });
    }
    return ok;
  }, []);

  const value = useMemo<Ctx>(
    () => ({ ready, entry, state: entry.kind === 'RETURNING' ? entry.state : null, completeOnboarding, startStation, passStation, saveResume, resetAll }),
    [ready, entry, completeOnboarding, startStation, passStation, saveResume, resetAll]
  );
  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState(): Ctx {
  const v = useContext(AppStateCtx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}
