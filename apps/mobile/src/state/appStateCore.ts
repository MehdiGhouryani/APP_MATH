/**
 * Pure (no Expo imports) app-state core — unit-testable with vitest.
 *
 * One versioned document holds everything that decides "first run vs returning":
 * the child profile, the one-shot placement fast-track, and per-station progress.
 * It is a device-local PROJECTION; learning truth stays server-authoritative
 * (SoT §22.1).
 */
export const SCHEMA_VERSION = 1;
export const KNOWN_GRADES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'] as const;

export interface ChildProfile {
  childName: string;
  gradeId: string;
  /** ISO time the parent gate + consent was passed (set right before first save). */
  consentAt: string;
}

/** Stages a child can be re-entered into after closing the app (RESULT/ENTRY/COMPLETE are transient). */
export const RESUMABLE_STAGES = [
  'LEARN', 'GUIDED', 'GAME_PATTERN', 'GAME_COUNT', 'INDEPENDENT', 'REVIEW',
  'TRANSFER', 'CHECK_A', 'CHECK_B', 'MASTERY_CHECK', 'RECOVERY', 'RECHECK',
] as const;
export type ResumableStage = (typeof RESUMABLE_STAGES)[number];

export interface ResumePoint {
  stage: ResumableStage;
  /** Needed to rebuild RECOVERY/RECHECK content. */
  skillId?: string;
  /** Checks already passed in this attempt (so a pass earned earlier is not lost). */
  checks: number;
  passAchieved: boolean;
}

export interface StationProgress {
  /** Set once the child actually left the entry screen; consumes the fast-track. */
  startedAt?: string;
  /** Last reached encounter sequence (Phase 2 resume). */
  lastSeq: number;
  sessionId?: string;
  passed: boolean;
  /** Where to continue ("ادامه از همین‌جا"); cleared when the journey finishes. */
  resume?: ResumePoint;
}

export interface AppState {
  schemaVersion: number;
  profile: ChildProfile;
  /** Placement outcome. Only honoured until the station is first started. */
  placementFastTrack: boolean;
  progress: Record<string, StationProgress>;
  /** Local calendar day (YYYY-MM-DD) of the last learning activity — gentle daily goal, NO streak/penalty (SoT §37). */
  lastActiveDay?: string;
}

export type EntryDecision =
  | { kind: 'NEW' }
  | { kind: 'RETURNING'; state: AppState }
  /** File exists but cannot be trusted: back it up, tell the child kindly, start over. */
  | { kind: 'RECOVER'; reason: 'CORRUPT' | 'NEWER_VERSION' };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function validateProfile(v: unknown): ChildProfile | null {
  if (!isObj(v)) return null;
  const name = typeof v.childName === 'string' ? v.childName.trim() : '';
  if (name.length < 1 || name.length > 20) return null;
  if (typeof v.gradeId !== 'string' || !(KNOWN_GRADES as readonly string[]).includes(v.gradeId)) return null;
  if (typeof v.consentAt !== 'string' || Number.isNaN(Date.parse(v.consentAt))) return null;
  return { childName: name, gradeId: v.gradeId, consentAt: v.consentAt };
}

function validateProgress(v: unknown): Record<string, StationProgress> | null {
  if (!isObj(v)) return null;
  const out: Record<string, StationProgress> = {};
  for (const [id, raw] of Object.entries(v)) {
    if (!/^ST\d{2}$/.test(id) || !isObj(raw)) return null;
    if (typeof raw.passed !== 'boolean') return null;
    const lastSeq = raw.lastSeq;
    if (typeof lastSeq !== 'number' || !Number.isInteger(lastSeq) || lastSeq < 0 || lastSeq > 1000) return null;
    if (raw.startedAt !== undefined && (typeof raw.startedAt !== 'string' || Number.isNaN(Date.parse(raw.startedAt)))) return null;
    if (raw.sessionId !== undefined && typeof raw.sessionId !== 'string') return null;
    let resume: ResumePoint | undefined;
    if (raw.resume !== undefined) {
      const r = raw.resume;
      if (!isObj(r) || !(RESUMABLE_STAGES as readonly string[]).includes(r.stage as string)) return null;
      if (typeof r.checks !== 'number' || !Number.isInteger(r.checks) || r.checks < 0 || r.checks > 2) return null;
      if (typeof r.passAchieved !== 'boolean') return null;
      if (r.skillId !== undefined && typeof r.skillId !== 'string') return null;
      resume = { stage: r.stage as ResumableStage, checks: r.checks, passAchieved: r.passAchieved, ...(r.skillId !== undefined ? { skillId: r.skillId as string } : {}) };
    }
    out[id] = {
      ...(resume ? { resume } : {}),
      passed: raw.passed,
      lastSeq,
      ...(raw.startedAt !== undefined ? { startedAt: raw.startedAt as string } : {}),
      ...(raw.sessionId !== undefined ? { sessionId: raw.sessionId as string } : {}),
    };
  }
  return out;
}

export function parseState(raw: string): { ok: true; state: AppState } | { ok: false; reason: 'CORRUPT' | 'NEWER_VERSION' } {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'CORRUPT' };
  }
  if (!isObj(json) || typeof json.schemaVersion !== 'number') return { ok: false, reason: 'CORRUPT' };
  if (json.schemaVersion > SCHEMA_VERSION) return { ok: false, reason: 'NEWER_VERSION' };
  // schemaVersion < 1 / future migrations land here (none shipped yet).
  if (json.schemaVersion !== SCHEMA_VERSION) return { ok: false, reason: 'CORRUPT' };
  const profile = validateProfile(json.profile);
  const progress = validateProgress(json.progress);
  if (!profile || !progress || typeof json.placementFastTrack !== 'boolean') return { ok: false, reason: 'CORRUPT' };
  const day = json.lastActiveDay;
  if (day !== undefined && (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day))) return { ok: false, reason: 'CORRUPT' };
  return {
    ok: true,
    state: { schemaVersion: SCHEMA_VERSION, profile, placementFastTrack: json.placementFastTrack, progress, ...(day !== undefined ? { lastActiveDay: day } : {}) },
  };
}

/** raw === null means "no file". */
export function decideEntry(raw: string | null): EntryDecision {
  if (raw === null) return { kind: 'NEW' };
  if (raw.trim() === '') return { kind: 'RECOVER', reason: 'CORRUPT' };
  const parsed = parseState(raw);
  return parsed.ok ? { kind: 'RETURNING', state: parsed.state } : { kind: 'RECOVER', reason: parsed.reason };
}

export function createInitialState(profile: ChildProfile, placementFastTrack: boolean): AppState {
  return { schemaVersion: SCHEMA_VERSION, profile, placementFastTrack, progress: {} };
}

/** Fast-track applies only until the station is first started (one-shot). */
export function shouldFastTrack(state: AppState, stationId: string): boolean {
  return state.placementFastTrack && !state.progress[stationId]?.startedAt;
}

const base = (p?: StationProgress): StationProgress => p ?? { lastSeq: 0, passed: false };

export function markStationStarted(state: AppState, stationId: string, nowIso: string): AppState {
  const cur = base(state.progress[stationId]);
  if (cur.startedAt) return state;
  return { ...state, progress: { ...state.progress, [stationId]: { ...cur, startedAt: nowIso } } };
}

export function markStationPassed(state: AppState, stationId: string, nowIso: string): AppState {
  const cur = base(state.progress[stationId]);
  if (cur.passed && cur.startedAt && !cur.resume) return state;
  const { resume: _drop, ...rest } = cur;
  return { ...state, progress: { ...state.progress, [stationId]: { ...rest, startedAt: cur.startedAt ?? nowIso, passed: true } } };
}

export function isStationPassed(state: AppState | null, stationId: string): boolean {
  return state?.progress[stationId]?.passed === true;
}

export function setResume(state: AppState, stationId: string, resume: ResumePoint | null, nowIso: string): AppState {
  const cur = base(state.progress[stationId]);
  const sameResume = JSON.stringify(cur.resume ?? null) === JSON.stringify(resume);
  if (sameResume && cur.startedAt) return state;
  const { resume: _old, ...rest } = cur;
  return {
    ...state,
    progress: { ...state.progress, [stationId]: { ...rest, startedAt: cur.startedAt ?? nowIso, ...(resume ? { resume } : {}) } },
  };
}

/** Local calendar day, YYYY-MM-DD (the device's own timezone). */
export function localDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function recordActivity(state: AppState, day: string): AppState {
  return state.lastActiveDay === day ? state : { ...state, lastActiveDay: day };
}

export function dailyGoalDone(state: AppState | null, today: string): boolean {
  return state?.lastActiveDay === today;
}

/** The first star is the Placement reward; one more per finished station. Never decreases. */
export function starsEarned(state: AppState | null): number {
  if (!state) return 0;
  return 1 + Object.values(state.progress).filter((p) => p.passed).length;
}

export function getResume(state: AppState | null, stationId: string): ResumePoint | null {
  return state?.progress[stationId]?.resume ?? null;
}
