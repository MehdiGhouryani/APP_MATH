/**
 * First Run state machine (DEC-010). Pure so it can be unit-tested.
 * Nothing is persisted until the LAST step completes (consent comes first).
 */
export type OnboardingStep = 'WELCOME' | 'Q1' | 'Q2' | 'RESULT' | 'GATE' | 'NAME';
export const STEPS: OnboardingStep[] = ['WELCOME', 'Q1', 'Q2', 'RESULT', 'GATE', 'NAME'];

export interface PlacementItem {
  id: 'count' | 'pattern';
  prompt: string;
  display: string;
  options: string[];
  correct: string;
}
export const PLACEMENT_ITEMS: PlacementItem[] = [
  { id: 'count', prompt: 'چند تا ستاره می‌بینی؟', display: '⭐ ⭐ ⭐ ⭐', options: ['۳', '۴', '۵'], correct: '۴' },
  { id: 'pattern', prompt: 'این الگو را نگاه کن؛ بعدی چی می‌آید؟', display: '🔵 🟡 🔵 🟡 ❓', options: ['🔵', '🟡', '🟢'], correct: '🔵' },
];

export function nextStep(step: OnboardingStep): OnboardingStep {
  const i = STEPS.indexOf(step);
  return STEPS[Math.min(i + 1, STEPS.length - 1)]!;
}

/** null = first step (Android back should leave the app there). */
export function prevStep(step: OnboardingStep): OnboardingStep | null {
  const i = STEPS.indexOf(step);
  return i <= 0 ? null : STEPS[i - 1]!;
}

/** 0..1 for the progress bar; WELCOME = 0, NAME = 1. */
export function progressFraction(step: OnboardingStep): number {
  return STEPS.indexOf(step) / (STEPS.length - 1);
}

/** answers[i] = chosen option for item i (undefined = unanswered). */
export function scorePlacement(answers: Array<string | undefined>): { correct: number; fastTrack: boolean } {
  const correct = PLACEMENT_ITEMS.reduce((n, item, i) => n + (answers[i] === item.correct ? 1 : 0), 0);
  return { correct, fastTrack: correct === PLACEMENT_ITEMS.length };
}

export function isValidName(raw: string): boolean {
  const n = raw.trim();
  return n.length >= 1 && n.length <= 20;
}
