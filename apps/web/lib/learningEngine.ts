/**
 * Core Learning Runtime Engine & Formative Evaluator Integration for Primary Math App
 * Powered by @math/learning-runtime
 */

import {
  ConfiguredEvaluator,
  type AnswerSubmission,
  type EvaluationResult,
  type RuntimeContentVersion,
  type LearningStateName,
  type LearningRole,
  type ExperienceForm,
} from '@math/learning-runtime';

export interface SkillMasteryState {
  code: string;
  title: string;
  gradeId: string;
  stationId: string;
  status: 'MASTERED' | 'BUILDING' | 'REVIEW' | 'LOCKED';
  stateName: LearningStateName;
  stars: number;
  lastEvaluatedAt?: string;
  attemptCount: number;
  correctCount: number;
  formativeFeedback?: string;
}

export const INITIAL_SKILLS: SkillMasteryState[] = [
  {
    code: 'G1-SK01',
    title: 'شمارش ترتیبی اشیاء تا ۵ (صفحه ۴)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'MASTERED',
    stateName: 'STRONG',
    stars: 3,
    attemptCount: 3,
    correctCount: 3,
    formativeFeedback: 'تسلط کامل بر شمارش ترتیبی و تناظر یک‌به‌یک اشیاء',
  },
  {
    code: 'G1-SK02',
    title: 'تناوب و کشف الگوهای دوتایی (صفحه ۱۲)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'MASTERED',
    stateName: 'STRONG',
    stars: 3,
    attemptCount: 2,
    correctCount: 2,
    formativeFeedback: 'تشخیص دقیق توالی رنگ‌ها و الگوهای تکرارشونده',
  },
  {
    code: 'G1-SK03',
    title: 'حل جدول شگفت‌انگیز ۲×۲ بدون تکرار (صفحه ۱۸)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'BUILDING',
    stateName: 'BUILDING',
    stars: 1,
    attemptCount: 1,
    correctCount: 1,
    formativeFeedback: 'در حال تقویت منطق سطر و ستون در جدول‌های سودوکویی',
  },
  {
    code: 'G1-SK04',
    title: 'بسته‌های ۵تایی چوب‌خط جادویی (صفحه ۳۰)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'BUILDING',
    stateName: 'BUILDING',
    stars: 0,
    attemptCount: 0,
    correctCount: 0,
  },
  {
    code: 'G1-SK05',
    title: 'آینه تقارن و قرینه‌یابی شطرنجی (صفحه ۴۲)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'BUILDING',
    stateName: 'BUILDING',
    stars: 0,
    attemptCount: 0,
    correctCount: 0,
  },
  {
    code: 'G1-SK06',
    title: 'ترازوی مقایسه دسته‌ها (کمتر، بیشتر، مساوی - صفحه ۷۶)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'BUILDING',
    stateName: 'BUILDING',
    stars: 0,
    attemptCount: 0,
    correctCount: 0,
  },
  {
    code: 'G1-SK07',
    title: 'سنجش مستقل بدون سرنخ (Check 1)',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'LOCKED',
    stateName: 'UNKNOWN',
    stars: 0,
    attemptCount: 0,
    correctCount: 0,
  },
  {
    code: 'G1-SK08',
    title: 'فتح صندوق گنجینه و پاداش نگاره اول',
    gradeId: 'G1',
    stationId: 'ST01',
    status: 'LOCKED',
    stateName: 'UNKNOWN',
    stars: 0,
    attemptCount: 0,
    correctCount: 0,
  },
];

const evaluator = new ConfiguredEvaluator();

export interface EvaluatorPayloadInput {
  nodeId: string;
  skillCode: string;
  type: string;
  userAnswer: unknown;
  expectedAnswer: unknown;
  learningRole?: LearningRole;
  experienceForm?: ExperienceForm;
}

export interface EvaluatorExecutionOutput {
  evaluation: EvaluationResult;
  updatedSkill: SkillMasteryState;
  nextStep: 'CONTINUE' | 'RECOVERY' | 'STATION_PASS';
  feedbackText: string;
  starsAwarded: number;
}

/**
 * Executes formative evaluation using @math/learning-runtime engine rules
 */
export function evaluateLearningEncounter(
  input: EvaluatorPayloadInput,
  currentSkill: SkillMasteryState
): EvaluatorExecutionOutput {
  const contentVersion: RuntimeContentVersion = {
    id: `cv-${input.nodeId}-${Date.now()}`,
    gradeId: currentSkill.gradeId,
    stationId: currentSkill.stationId,
    skillId: input.skillCode,
    learningRole: input.learningRole ?? 'INDEPENDENT_PRACTICE',
    experienceForm: input.experienceForm ?? 'PUZZLE',
    interactionType: input.type,
    answerSchema: { type: 'object' },
    evaluatorConfig: {
      version: 'v1',
      expectedAnswer: input.expectedAnswer,
      maxScore: 1,
    },
  };

  const answers: AnswerSubmission[] = [
    {
      answerIndex: 0,
      answerPayload: input.userAnswer,
    },
  ];

  const evaluation = evaluator.evaluate(contentVersion, answers);

  const isCorrect = evaluation.correct;
  const newAttemptCount = currentSkill.attemptCount + 1;
  const newCorrectCount = currentSkill.correctCount + (isCorrect ? 1 : 0);

  let newStatus = currentSkill.status;
  let newStateName = currentSkill.stateName;
  let starsAwarded = 0;
  let feedbackText = '';

  if (isCorrect) {
    starsAwarded = 3;
    newStatus = 'MASTERED';
    newStateName = 'STRONG';
    feedbackText = `آفرین! پاسخ کاملاً درست است. ۳ ستاره دانایی دریافت کردی! 🌟`;
  } else {
    starsAwarded = 0;
    if (newAttemptCount >= 2 && newCorrectCount === 0) {
      newStatus = 'REVIEW';
      newStateName = 'NEEDS_REVIEW';
      feedbackText = `همراهت با دادن یک سرنخ آموزشی آماده‌ست تا دوباره این مفهوم رو با هم مرور کنید! 🌱`;
    } else {
      newStatus = 'BUILDING';
      newStateName = 'BUILDING';
      feedbackText = `دقت کن! با تمرین دوباره حتماً پاسخ درست رو کشف می‌کنی! 💡`;
    }
  }

  const updatedSkill: SkillMasteryState = {
    ...currentSkill,
    status: newStatus,
    stateName: newStateName,
    stars: Math.max(currentSkill.stars, isCorrect ? 3 : currentSkill.stars),
    attemptCount: newAttemptCount,
    correctCount: newCorrectCount,
    lastEvaluatedAt: new Date().toISOString(),
    formativeFeedback: feedbackText,
  };

  const nextStep = isCorrect
    ? 'STATION_PASS'
    : newStatus === 'REVIEW'
    ? 'RECOVERY'
    : 'CONTINUE';

  return {
    evaluation,
    updatedSkill,
    nextStep,
    feedbackText,
    starsAwarded,
  };
}
