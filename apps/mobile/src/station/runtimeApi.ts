import type { AnswerPayload, StationContent, SubmitOutcome } from './types';
import { createMobileSyncManager, stableActionKey } from '../sync/MobileSyncManager';
import { getAuthHeaders } from '../auth/AuthSession';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const LEARNING_ID = process.env.EXPO_PUBLIC_DEV_LEARNING_ID ?? 'dev-child-001';
const DEV_LEARNING_ID = __DEV__ ? LEARNING_ID : undefined;
let activeLearningIdentityId: string | null = DEV_LEARNING_ID ?? null;
const CONTEXT_ID = process.env.EXPO_PUBLIC_RELATIONSHIP_CONTEXT_ID ?? 'platform';
const CURRICULUM_VERSION = process.env.EXPO_PUBLIC_CURRICULUM_VERSION ?? 'g1-build-001';
const SKILL_GRAPH_VERSION = process.env.EXPO_PUBLIC_SKILL_GRAPH_VERSION ?? 'g1-provisional-001';
const INSTALLATION_ID = process.env.EXPO_PUBLIC_CLIENT_INSTALLATION_ID ?? 'dev-installation-01';
const syncManager = createMobileSyncManager(BASE_URL, INSTALLATION_ID, DEV_LEARNING_ID);
const CONTENT_01 = '26000000-0000-4000-8000-000000000001';
const CONTENT_02 = '26000000-0000-4000-8000-000000000002';
const CONTENT_03 = '26000000-0000-4000-8000-000000000003';
const CONTENT_04 = '26000000-0000-4000-8000-000000000004';
const CONTENT_05 = '26000000-0000-4000-8000-000000000005';
const CONTENT_06 = '26000000-0000-4000-8000-000000000006';
const CONTENT_07 = '26000000-0000-4000-8000-000000000007';
const CONTENT_08 = '26000000-0000-4000-8000-000000000008';
const CONTENT_09 = '26000000-0000-4000-8000-000000000009';
const CONTENT_10 = '26000000-0000-4000-8000-000000000010';
const CONTENT_11 = '26000000-0000-4000-8000-000000000011';
const CONTENT_12 = '26000000-0000-4000-8000-000000000012';
const RECOVERY_001 = '26000000-0000-4000-8000-000000000013';
const RECOVERY_003 = '26000000-0000-4000-8000-000000000014';
const RECOVERY_009 = '26000000-0000-4000-8000-000000000015';
const RECOVERY_011 = '26000000-0000-4000-8000-000000000016';
const RECHECK_001 = '26000000-0000-4000-8000-000000000017';
const RECHECK_003 = '26000000-0000-4000-8000-000000000018';
const RECHECK_009 = '26000000-0000-4000-8000-000000000019';
const RECHECK_011 = '26000000-0000-4000-8000-000000000020';

class NetworkRequestError extends Error {
  constructor() { super('NETWORK_UNAVAILABLE'); this.name = 'NetworkRequestError'; }
}

const localContent: Record<string, StationContent> = {
  learn: {
    id: 'G1-ST01-E01', contentVersionId: CONTENT_01, title: 'اول بشماریم', prompt: 'هر ستاره را یکی‌یکی ببین. آخرین عددی که می‌گویی، تعداد همه‌ی ستاره‌هاست.', stationId: 'G1-ST01', skillId: 'G1-SK001', learningRole: 'INSTRUCTION', experienceForm: 'CONVERSATION_EXPLANATION',
  },
  guided: {
    id: 'G1-ST01-E02', contentVersionId: CONTENT_02, title: 'یه انتخاب کوچولو', prompt: 'گروهی را انتخاب کن که ۳ ستاره دارد.', stationId: 'G1-ST01', skillId: 'G1-SK001', learningRole: 'GUIDED_PRACTICE', experienceForm: 'PUZZLE', options: ['★ ★', '★ ★ ★', '★ ★ ★ ★'], expected: 1,
  },
  pattern: {
    id: 'G1-ST01-E03', contentVersionId: CONTENT_03, title: 'مسیر الگو', prompt: 'کدام مهره باید جای علامت سؤال بیاید؟', stationId: 'G1-ST01', skillId: 'G1-SK009', learningRole: 'GUIDED_PRACTICE', experienceForm: 'MINI_GAME', options: ['🟡', '🔵', '🟢'], expected: 1,
  },
  count: {
    id: 'G1-ST01-E04', contentVersionId: CONTENT_04, title: 'شکار شمارش', prompt: 'چند ستاره می‌بینی؟', stationId: 'G1-ST01', skillId: 'G1-SK003', learningRole: 'GUIDED_PRACTICE', experienceForm: 'MINI_GAME', options: ['۲', '۳', '۴'], expected: 1, visualCount: 3,
  },
  independent: {
    id: 'G1-ST01-E05', contentVersionId: '26000000-0000-4000-8000-000000000005', title: 'تمرین مستقل', prompt: 'بدون کمک، تعداد شکل‌ها را پیدا کن.', stationId: 'G1-ST01', skillId: 'G1-SK003', learningRole: 'INDEPENDENT_PRACTICE', experienceForm: 'PUZZLE', options: ['۲','۳','۴'], expected: 1, visualCount: 3,
  },
  review: {
    id: 'G1-ST01-E06', contentVersionId: '26000000-0000-4000-8000-000000000006', title: 'مرور الگو', prompt: 'الگو را سریع کامل کن.', stationId: 'G1-ST01', skillId: 'G1-SK009', learningRole: 'REVIEW', experienceForm: 'MINI_GAME', options: ['🟡','🔵','🟢'], expected: 1,
  },
  checkA: {
    id: 'G1-ST01-E07', contentVersionId: CONTENT_07, title: 'چالش اول', prompt: 'در ۵ مأموریت کوتاه، شمارش و تعداد را بررسی کن.', stationId: 'G1-ST01', skillId: 'G1-SK001', learningRole: 'MASTERY_CHECK', experienceForm: 'CHALLENGE',
    questions: [
      { prompt: 'چند ستاره؟', options: ['۲','۳','۴','۵'], expected: 1, visualCount: 3 },
      { prompt: 'چند ستاره؟', options: ['۱','۲','۳','۴'], expected: 2, visualCount: 3 },
      { prompt: 'چند ستاره؟', options: ['۳','۴','۵','۶'], expected: 2, visualCount: 4 },
      { prompt: 'چند ستاره؟', options: ['۱','۲','۳','۴'], expected: 1, visualCount: 2 },
      { prompt: 'چند ستاره؟', options: ['۳','۴','۵','۶'], expected: 2, visualCount: 5 },
    ],
  },
  checkB: {
    id: 'G1-ST01-E08', contentVersionId: CONTENT_08, title: 'چالش دوم', prompt: 'حالا یک بررسی تازه و مستقل انجام بده.', stationId: 'G1-ST01', skillId: 'G1-SK009', learningRole: 'MASTERY_CHECK', experienceForm: 'CHALLENGE',
    questions: [
      { prompt: 'چه رنگی جای علامت سؤال می‌آید؟', options: ['🟡','🔵','🟢'], expected: 1 },
      { prompt: 'الگو را کامل کن.', options: ['🟡','🔵','🟢'], expected: 2 },
      { prompt: 'کدام مهره ادامه الگوست؟', options: ['🔴','🟢','🔵'], expected: 1 },
      { prompt: 'کدام رنگ باید بیاید؟', options: ['🟡','🔵','🟢'], expected: 0 },
      { prompt: 'پایان الگو چیست؟', options: ['🟡','🔵','🟢'], expected: 2 },
    ],
  },
  recovery: {
    id: 'G1-ST01-E09', contentVersionId: RECOVERY_001, title: 'با هم دوباره', prompt: 'این بار آهسته‌تر: هر ستاره را یکی‌یکی لمس کن و تا ۳ بشمار.', stationId: 'G1-ST01', skillId: 'G1-SK001', learningRole: 'RECOVERY', experienceForm: 'BUILD_EXPLORE', options: ['۱', '۲', '۳'], expected: 2, visualCount: 3,
  },
  recheck: {
    id: 'G1-ST01-E10', contentVersionId: RECHECK_001, title: 'بررسی دوباره', prompt: 'بعد از تمرین بازیابی، یک بررسی تازه انجام بده.', stationId: 'G1-ST01', skillId: 'G1-SK001', learningRole: 'MASTERY_CHECK', experienceForm: 'MINI_GAME', questions: [
      { prompt: 'چند ستاره داریم؟', options: ['۲','۳','۴'], expected: 1, visualCount: 3 },
      { prompt: 'چند ستاره داریم؟', options: ['۱','۲','۳'], expected: 0, visualCount: 1 },
      { prompt: 'چند ستاره داریم؟', options: ['۱','۲','۳'], expected: 1, visualCount: 2 },
      { prompt: 'چند ستاره داریم؟', options: ['۱','۲','۳'], expected: 2, visualCount: 3 },
      { prompt: 'چند ستاره داریم؟', options: ['۱','۲','۳'], expected: 1, visualCount: 2 },
    ],
  },
  recoveryPattern: {
    id: 'G1-ST01-E09', contentVersionId: RECOVERY_009, title: 'با هم الگو می‌سازیم', prompt: 'رنگی را انتخاب کن که الگو را کامل می‌کند.', stationId: 'G1-ST01', skillId: 'G1-SK009', learningRole: 'RECOVERY', experienceForm: 'BUILD_EXPLORE', options: ['🟡','🔵','🟢'], expected: 1,
  },
  recheckPattern: {
    id: 'G1-ST01-E10', contentVersionId: RECHECK_009, title: 'بررسی دوباره الگو', prompt: 'الگو را در پنج موقعیت تازه بررسی کن.', stationId: 'G1-ST01', skillId: 'G1-SK009', learningRole: 'MASTERY_CHECK', experienceForm: 'MINI_GAME', questions: [
      { prompt: 'چه رنگی می‌آید؟', options: ['🟡','🔵','🟢'], expected: 1 },
      { prompt: 'ادامه چیست؟', options: ['🟡','🔵','🟢'], expected: 2 },
      { prompt: 'کدام مورد درست است؟', options: ['🔴','🟢','🔵'], expected: 1 },
      { prompt: 'رنگ بعدی چیست؟', options: ['🟡','🔵','🟢'], expected: 0 },
      { prompt: 'پایان الگو چیست؟', options: ['🟡','🔵','🟢'], expected: 2 },
    ],
  },
  recoveryRule: {
    id: 'G1-ST01-E09', contentVersionId: RECOVERY_011, title: 'قانون الگو را دوباره پیدا کن', prompt: 'کدام گزینه قانون الگو را کامل می‌کند؟', stationId: 'G1-ST01', skillId: 'G1-SK011', learningRole: 'RECOVERY', experienceForm: 'BUILD_EXPLORE', options: ['الگو A','الگو B','الگو C'], expected: 2,
  },
  recheckRule: {
    id: 'G1-ST01-E10', contentVersionId: RECHECK_011, title: 'بررسی دوباره قانون الگو', prompt: 'قانون الگو را در پنج موقعیت تازه بررسی کن.', stationId: 'G1-ST01', skillId: 'G1-SK011', learningRole: 'MASTERY_CHECK', experienceForm: 'MINI_GAME', questions: [
      { prompt: 'قانون درست چیست؟', options: ['A','B','C'], expected: 1 },
      { prompt: 'کدام ادامه درست است؟', options: ['A','B','C'], expected: 2 },
      { prompt: 'چه چیزی باید بیاید؟', options: ['A','B','C'], expected: 0 },
      { prompt: 'کدام قانون درست است؟', options: ['A','B','C'], expected: 1 },
      { prompt: 'پایان الگو چیست؟', options: ['A','B','C'], expected: 2 },
    ],
  },
  recoveryCardinality: {
    id: 'G1-ST01-E09', contentVersionId: RECOVERY_003, title: 'دوباره و آهسته‌تر', prompt: 'گروه را بشمار و عدد آخر را انتخاب کن.', stationId: 'G1-ST01', skillId: 'G1-SK003', learningRole: 'RECOVERY', experienceForm: 'BUILD_EXPLORE', options: ['۲','۳','۴'], expected: 1, visualCount: 3,
  },
  recheckCardinality: {
    id: 'G1-ST01-E10', contentVersionId: RECHECK_003, title: 'بررسی دوباره تعداد', prompt: 'در پنج سؤال تازه، تعداد را بررسی کن.', stationId: 'G1-ST01', skillId: 'G1-SK003', learningRole: 'MASTERY_CHECK', experienceForm: 'MINI_GAME', questions: [
      { prompt: 'چند شیء است؟', options: ['۲','۳','۴'], expected: 1, visualCount: 3 },
      { prompt: 'چند شیء است؟', options: ['۱','۲','۳'], expected: 0, visualCount: 1 },
      { prompt: 'چند شیء است؟', options: ['۱','۲','۳'], expected: 1, visualCount: 2 },
      { prompt: 'چند شیء است؟', options: ['۱','۲','۳'], expected: 2, visualCount: 3 },
      { prompt: 'چند شیء است؟', options: ['۱','۲','۳'], expected: 1, visualCount: 2 },
    ],
  },
  transfer: {
    id: 'G1-ST01-E11', contentVersionId: '26000000-0000-4000-8000-000000000011', title: 'در دنیای واقعی', prompt: 'قانون الگو را در یک موقعیت تازه پیدا کن.', stationId: 'G1-ST01', skillId: 'G1-SK011', learningRole: 'TRANSFER', experienceForm: 'MINI_GAME', options: ['الگو A','الگو B','الگو C'], expected: 2,
  },
  mastery: {
    id: 'G1-ST01-E12', contentVersionId: '26000000-0000-4000-8000-000000000012', title: 'چالش نهایی مهارت', prompt: 'قانون الگو را در ۵ موقعیت تازه بررسی کن.', stationId: 'G1-ST01', skillId: 'G1-SK011', learningRole: 'MASTERY_CHECK', experienceForm: 'MINI_GAME', questions: [
      { prompt: 'گزینه درست چیست؟', options: ['🟡','🔵','🟢'], expected: 1 },
      { prompt: 'الگو را کامل کن.', options: ['🔴','🟢','🔵'], expected: 2 },
      { prompt: 'کدام مورد ادامه الگوست؟', options: ['🟢','🟡','🔵'], expected: 0 },
      { prompt: 'چه رنگی می‌آید؟', options: ['🟡','🔵','🟢'], expected: 1 },
      { prompt: 'پایان الگو چیست؟', options: ['🔵','🟢','🟡'], expected: 2 },
    ],
  },
};

export function getRecoveryContent(skillId?: string): StationContent {
  if (skillId === 'G1-SK009') return localContent.recoveryPattern;
  if (skillId === 'G1-SK011') return localContent.recoveryRule;
  if (skillId === 'G1-SK003') return localContent.recoveryCardinality;
  return localContent.recovery;
}

export function getRecheckContent(skillId?: string): StationContent {
  if (skillId === 'G1-SK009') return localContent.recheckPattern;
  if (skillId === 'G1-SK011') return localContent.recheckRule;
  if (skillId === 'G1-SK003') return localContent.recheckCardinality;
  return localContent.recheck;
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Client-Installation-Id': INSTALLATION_ID, ...getAuthHeaders(), ...(__DEV__ && !getAuthHeaders().Authorization ? { 'x-dev-learning-identity-id': LEARNING_ID } : {}), ...(init.headers ?? {}) },
    });
  } catch {
    throw new NetworkRequestError();
  }
  if (!response.ok) throw new Error(`API_${response.status}`);
  return (await response.json()) as T;
}

export async function startStationSession() {
  const session = await request<{ id: string; learningIdentityId: string }>('/api/v1/learning/sessions', {
    method: 'POST',
    body: JSON.stringify({ ...(DEV_LEARNING_ID ? { learningIdentityId: DEV_LEARNING_ID } : {}), relationshipContextId: CONTEXT_ID, gradeId: 'G1', curriculumVersionId: CURRICULUM_VERSION, skillGraphVersionId: SKILL_GRAPH_VERSION, sessionType: 'LEARNING' }),
  });
  activeLearningIdentityId = session.learningIdentityId;
  return session;
}

export async function createEncounter(sessionId: string, content: StationContent, sequence: number) {
  return request<{ encounter: { id: string } }>('/api/v1/learning/sessions/' + sessionId + '/encounters', {
    method: 'POST',
    body: JSON.stringify({ sessionId, contentVersionId: content.contentVersionId ?? content.id, stationId: content.stationId, skillId: content.skillId, learningRole: content.learningRole, experienceForm: content.experienceForm, sequence }),
  });
}

export async function submitAttempt(input: { sessionId: string; encounterId: string; content: StationContent; answer?: AnswerPayload; answers?: AnswerPayload[]; attemptNumber: number }): Promise<SubmitOutcome> {
  const clientIdempotencyKey = `station01:v2:${INSTALLATION_ID}:${input.sessionId}:${input.encounterId}:${input.content.contentVersionId ?? input.content.id}:${input.attemptNumber}`;
  const payload = {
    learningIdentityId: activeLearningIdentityId ?? DEV_LEARNING_ID ?? (() => { throw new Error('LEARNING_IDENTITY_CONTEXT_REQUIRED'); })(),
    relationshipContextId: CONTEXT_ID,
    sessionId: input.sessionId,
    encounterId: input.encounterId,
    attemptNumber: input.attemptNumber,
    clientIdempotencyKey,
    answers: input.answers ?? (input.answer ? [input.answer] : []),
  };
  try {
    const result = await request<{
      decision: { selectedStep: SubmitOutcome['selectedStep']; target_skill_id?: string; targetSkillId?: string };
      learningState: { state: string };
      stationPass: boolean;
      semanticEvent: string;
      evidence?: { id?: string } | null;
      attempt: { evaluation?: { correct?: boolean; score?: number; maxScore?: number } };
    }>('/api/v1/learning/attempts/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    void syncManager.flush();
    return {
      correct: Boolean(result.attempt.evaluation?.correct),
      score: result.attempt.evaluation?.score ?? 0,
      maxScore: result.attempt.evaluation?.maxScore ?? 1,
      selectedStep: result.decision.selectedStep,
      stationPass: result.stationPass,
      semanticEvent: result.semanticEvent,
      learningState: result.learningState.state,
      ...(result.decision.target_skill_id || result.decision.targetSkillId ? { decisionTargetSkillId: result.decision.target_skill_id ?? result.decision.targetSkillId } : {}),
      ...(result.evidence?.id ? { evidenceId: result.evidence.id } : {}),
    };
  } catch (error) {
    if (!(error instanceof NetworkRequestError)) throw error;
    const idempotencyKey = await stableActionKey('SUBMIT_ATTEMPT', `${input.sessionId}:${input.encounterId}:${input.attemptNumber}`, payload);
    await syncManager.enqueue({
      id: idempotencyKey,
      clientInstallationId: INSTALLATION_ID,
      learningIdentityId: activeLearningIdentityId ?? DEV_LEARNING_ID ?? (() => { throw new Error('LEARNING_IDENTITY_CONTEXT_REQUIRED'); })(),
      operationType: 'SUBMIT_ATTEMPT',
      idempotencyKey,
      payload,
    });
    return {
      correct: false,
      score: 0,
      maxScore: input.content.questions?.length ?? 1,
      selectedStep: 'CONTINUE',
      stationPass: false,
      semanticEvent: 'SYNC_QUEUED',
      learningState: 'PENDING_SYNC',
      syncPending: true,
    };
  }
}

export function getLocalContent(key: keyof typeof localContent): StationContent {
  return localContent[key]!;
}

export function shouldUseRemoteRuntime(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_API_BASE_URL);
}
