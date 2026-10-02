import { describe, expect, it } from 'vitest';
import { PLACEMENT_ITEMS, STEPS, isValidName, nextStep, prevStep, progressFraction, scorePlacement } from './flow';

describe('onboarding order (DEC-010)', () => {
  it('has the approved order: welcome, placement, result, gate, name', () => {
    expect(STEPS).toEqual(['WELCOME', 'Q1', 'Q2', 'RESULT', 'GATE', 'NAME']);
  });
  it('consent gate comes BEFORE the name (first personal data) and after placement', () => {
    expect(STEPS.indexOf('GATE')).toBeLessThan(STEPS.indexOf('NAME'));
    expect(STEPS.indexOf('RESULT')).toBeLessThan(STEPS.indexOf('GATE'));
  });
  it('next/prev walk the list and stop at the ends', () => {
    expect(nextStep('WELCOME')).toBe('Q1');
    expect(nextStep('NAME')).toBe('NAME');
    expect(prevStep('WELCOME')).toBeNull(); // Android back exits the app only here
    expect(prevStep('Q2')).toBe('Q1');
  });
  it('progress goes 0 -> 1', () => {
    expect(progressFraction('WELCOME')).toBe(0);
    expect(progressFraction('NAME')).toBe(1);
    expect(progressFraction('GATE')).toBeGreaterThan(progressFraction('RESULT'));
  });
});

describe('placement scoring', () => {
  const right = PLACEMENT_ITEMS.map((i) => i.correct);
  it('both correct => fast-track', () => expect(scorePlacement(right)).toEqual({ correct: 2, fastTrack: true }));
  it('one wrong => no fast-track', () => expect(scorePlacement([right[0], '🟢'])).toEqual({ correct: 1, fastTrack: false }));
  it('unanswered => 0', () => expect(scorePlacement([undefined, undefined])).toEqual({ correct: 0, fastTrack: false }));
});

describe('name validation', () => {
  it('accepts 1..20 trimmed chars only', () => {
    expect(isValidName('آرش')).toBe(true);
    expect(isValidName('   ')).toBe(false);
    expect(isValidName('x'.repeat(21))).toBe(false);
  });
});
