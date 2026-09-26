'use client';

import React, { useState, useEffect, useId } from 'react';
import { CHARACTERS, toPersianDigits } from '../lib/persian';
import { soundFx } from '../lib/sound';
import { InteractiveTallyMarks } from './InteractiveTallyMarks';
import { WonderGrid } from './WonderGrid';
import { SymmetryMirror } from './SymmetryMirror';
import { ComparisonScale } from './ComparisonScale';
import { InteractiveCompanion } from './InteractiveCompanion';
import type { PathNodeItem } from './DuolingoPath';
import type { AnimationSemanticEvent } from '@math/contracts';
import {
  NODE_CANONICAL_MAPPINGS,
  type SessionResponse,
  type EncounterResponse,
  type SubmitAttemptResponse,
} from '../lib/learning-api-client';
import { learningService } from '../lib/learningService';

interface DuolingoLessonModalProps {
  onClose: () => void;
  activeCharId: string;
  activeNode: PathNodeItem;
  onEmitSemanticEvent: (event: AnimationSemanticEvent, detail: string) => void;
  onCompleteNode: (nodeId: string) => void;
}

type EvaluationState = 'UNCHECKED' | 'CORRECT' | 'WRONG' | 'FINISHED';

export function DuolingoLessonModal({
  onClose,
  activeCharId,
  activeNode,
  onEmitSemanticEvent,
  onCompleteNode,
}: DuolingoLessonModalProps) {
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;

  const [evaluation, setEvaluation] = useState<EvaluationState>(
    activeNode.type === 'CHEST' ? 'FINISHED' : 'UNCHECKED'
  );

  // Server Integration State
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [encounter, setEncounter] = useState<EncounterResponse | null>(null);
  const [attemptKey, setAttemptKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastServerResult, setLastServerResult] = useState<SubmitAttemptResponse | null>(null);
  const [currentEvent, setCurrentEvent] = useState<AnimationSemanticEvent>('SESSION_START');

  // Exercise states
  // 1. COUNT
  const [tappedCountItems, setTappedCountItems] = useState<number[]>([]);
  const [selectedCountNum, setSelectedCountNum] = useState<number | null>(null);

  // 2. PATTERN
  const [selectedPatternColor, setSelectedPatternColor] = useState<string | null>(null);

  // 3. WONDER_GRID
  const [isGridSolved, setIsGridSolved] = useState<boolean>(false);

  // 4. TALLY
  const [tallyCount, setTallyCount] = useState<number>(0);

  // 5. CHECK
  const [selectedSeqNum, setSelectedSeqNum] = useState<number | null>(null);

  // 6. SYMMETRY
  const [isSymmetrySolved, setIsSymmetrySolved] = useState<boolean>(false);

  // 7. SCALE
  const [isScaleSolved, setIsScaleSolved] = useState<boolean>(false);

  // Chest opened state
  const [isChestOpened, setIsChestOpened] = useState<boolean>(false);

  // Initialize Session & Encounter on mount
  useEffect(() => {
    let isMounted = true;
    async function initLearningEncounter() {
      if (activeNode.type === 'CHEST') return;
      try {
        const { session: newSession, encounter: newEncounter } =
          await learningService.initiateEncounterForNode(activeNode.id);

        if (!isMounted) return;
        setSession(newSession);
        setEncounter(newEncounter);
        setAttemptKey(`attempt-${newSession.id}-${newEncounter.id}-1`);
        onEmitSemanticEvent('SESSION_START', `Session=${newSession.id}, Encounter=${newEncounter.id}`);
      } catch (err) {
        console.warn('[DuolingoLessonModal] Backend encounter init fallback via learningService', err);
      }
    }

    initLearningEncounter();
    return () => {
      isMounted = false;
    };
  }, [activeNode.id, activeNode.stepNumber, activeNode.type]);

  function toggleFruitTap(index: number) {
    soundFx.playBubblePop();
    if (tappedCountItems.includes(index)) {
      setTappedCountItems(tappedCountItems.filter((i) => i !== index));
    } else {
      setTappedCountItems([...tappedCountItems, index]);
    }
  }

  async function handleCheck() {
    setIsSubmitting(true);
    let userAnswerPayload: unknown = 1;

    if (activeNode.type === 'COUNT') {
      userAnswerPayload = selectedCountNum === 5 ? 1 : 0;
    } else if (activeNode.type === 'PATTERN') {
      userAnswerPayload = selectedPatternColor === 'blue' ? 1 : 0;
    } else if (activeNode.type === 'WONDER_GRID') {
      userAnswerPayload = isGridSolved ? 1 : 0;
    } else if (activeNode.type === 'TALLY') {
      userAnswerPayload = tallyCount === 5 ? 1 : 0;
    } else if (activeNode.type === 'SYMMETRY') {
      userAnswerPayload = isSymmetrySolved ? 2 : 0;
    } else if (activeNode.type === 'SCALE') {
      userAnswerPayload = isScaleSolved ? 0 : 1;
    } else if (activeNode.type === 'CHECK') {
      userAnswerPayload = selectedSeqNum === 8 ? 1 : 0;
    }

    const mapping = NODE_CANONICAL_MAPPINGS[activeNode.id];
    const isCorrectLocally = userAnswerPayload === (mapping?.expectedIndex ?? 1);

    try {
      if (session && encounter) {
        const idempotencyKey = attemptKey || `attempt-${session.id}-${encounter.id}-1`;
        const result = await learningService.submitAttempt({
          sessionId: session.id,
          encounterId: encounter.id,
          userAnswer: userAnswerPayload,
          customIdempotencyKey: idempotencyKey,
        });

        setLastServerResult(result);
        const isServerCorrect = Boolean(result.attempt?.evaluation?.correct || result.semanticEvent === 'ANSWER_CORRECT');

        if (isServerCorrect) {
          soundFx.playSuccess();
          setCurrentEvent('ANSWER_CORRECT');
          onEmitSemanticEvent('ANSWER_CORRECT', `ServerScore=${result.attempt?.evaluation?.score ?? 1.0}`);
          setEvaluation('CORRECT');
          if (result.stationPass) {
            setCurrentEvent('STATION_PASS');
            onEmitSemanticEvent('STATION_PASS', `StationPassGranted(Station=G1-ST01)`);
            onCompleteNode(activeNode.id);
          }
        } else {
          soundFx.playTryAgain();
          if (result.decision?.selectedStep === 'RECOVERY') {
            setCurrentEvent('RECOVERY');
            onEmitSemanticEvent('RECOVERY', `LearningRuntime.triggerRecovery(Step=${result.decision.selectedStep})`);
          } else {
            setCurrentEvent('ANSWER_WRONG');
            onEmitSemanticEvent('ANSWER_WRONG', `LearningRuntime.evalTryAgain`);
          }
          setEvaluation('WRONG');
        }
      } else {
        // Fallback for isolated offline preview
        if (isCorrectLocally) {
          soundFx.playSuccess();
          setCurrentEvent('ANSWER_CORRECT');
          onEmitSemanticEvent('ANSWER_CORRECT', 'EvaluationSuccess');
          setEvaluation('CORRECT');
        } else {
          soundFx.playTryAgain();
          setCurrentEvent('ANSWER_WRONG');
          onEmitSemanticEvent('ANSWER_WRONG', 'EvaluationTryAgain');
          setEvaluation('WRONG');
        }
      }
    } catch (err) {
      console.warn('[DuolingoLessonModal] Submit attempt error, using resilient evaluation', err);
      if (isCorrectLocally) {
        soundFx.playSuccess();
        setCurrentEvent('ANSWER_CORRECT');
        onEmitSemanticEvent('ANSWER_CORRECT', 'EvaluationSuccess(Resilient)');
        setEvaluation('CORRECT');
      } else {
        soundFx.playTryAgain();
        setCurrentEvent('ANSWER_WRONG');
        onEmitSemanticEvent('ANSWER_WRONG', 'EvaluationTryAgain(Resilient)');
        setEvaluation('WRONG');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinue() {
    soundFx.playTap();
    if (evaluation === 'CORRECT') {
      setEvaluation('FINISHED');
      soundFx.playLevelPass();
      setCurrentEvent('STATION_PASS');
      onCompleteNode(activeNode.id);
      onEmitSemanticEvent('STATION_PASS', `Runtime.passNode(${activeNode.id})`);
    } else {
      setEvaluation('UNCHECKED');
      setCurrentEvent('SESSION_START');
    }
  }

  function handleOpenChest() {
    soundFx.playLevelPass();
    setIsChestOpened(true);
    setCurrentEvent('REWARD_GRANTED');
    onEmitSemanticEvent('REWARD_GRANTED', 'TreasureChest.open(Station=ST01)');
  }

  function handleOptionSelect(exerciseType: string, choiceValue: unknown, onSelect: () => void) {
    console.log(`[DuolingoLessonModal] Choice selected -> Exercise: ${exerciseType}, Value:`, choiceValue);
    soundFx.playBubblePop();
    onSelect();
  }

  const isCheckDisabled =
    (activeNode.type === 'COUNT' && selectedCountNum === null) ||
    (activeNode.type === 'PATTERN' && selectedPatternColor === null) ||
    (activeNode.type === 'WONDER_GRID' && !isGridSolved) ||
    (activeNode.type === 'TALLY' && tallyCount === 0) ||
    (activeNode.type === 'SYMMETRY' && !isSymmetrySolved) ||
    (activeNode.type === 'SCALE' && !isScaleSolved) ||
    (activeNode.type === 'CHECK' && selectedSeqNum === null);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
        touchAction: 'pan-y',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderBottom: '2px solid var(--border-subtle)',
          backgroundColor: '#ffffff',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => {
            soundFx.playTap();
            onClose();
          }}
          aria-label="بستن درس"
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 8,
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            touchAction: 'manipulation',
            pointerEvents: 'auto',
          }}
        >
          ✕
        </button>

        {/* Progress Bar */}
        <div className="math-progress-track">
          <div
            className="math-progress-fill"
            style={{ width: evaluation === 'FINISHED' ? '100%' : '75%' }}
          />
        </div>

        {/* Psychological Safety Badge */}
        <div
          title="محیط امن یادگیری: بدون جریمه یا استرس خطا"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 800,
            fontSize: 12,
            color: '#065f46',
            backgroundColor: '#d1fae5',
            padding: '4px 10px',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🌱</span>
          <span>یادگیری امن</span>
        </div>
      </div>

      {/* Main Body */}
      {evaluation !== 'FINISHED' ? (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 22px 150px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
            pointerEvents: 'auto',
            touchAction: 'pan-y',
          }}
        >
          {/* Companion Mascot with Semantic Animation */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <InteractiveCompanion
              characterId={activeChar.id}
              semanticEvent={currentEvent}
              size="sm"
              showBubble={true}
              customMessage={
                evaluation === 'CORRECT'
                  ? activeChar.reactions.correct
                  : evaluation === 'WRONG'
                  ? currentEvent === 'RECOVERY'
                    ? activeChar.reactions.recovery
                    : activeChar.reactions.wrong
                  : activeNode.type === 'COUNT'
                  ? '🐊 تمساح مهربان می‌گوید: پرتقال‌ها را لمس کن و بشمار؛ چند تا در سبد هست؟'
                  : activeNode.type === 'PATTERN'
                  ? '🐒 میمون الگویاب می‌پرسد: قطار رنگ‌ها را ببین! جای علامت سؤال کدام رنگ می‌آید؟'
                  : activeNode.type === 'WONDER_GRID'
                  ? '🐸 قورباغه با ابزار کار می‌کند: جدول شگفت‌انگیز را بدون رنگ تکراری در هر سطر و ستون کامل کن!'
                  : activeNode.type === 'TALLY'
                  ? '🦁 شیر باهوش می‌گوید: به تعداد پرتقال‌ها چوب‌خط بکش! خط پنجم کج کشیده می‌شود.'
                  : activeNode.type === 'SYMMETRY'
                  ? '🐸 قورباغه راهنما: نیمه سمت راست فرش را قرینه سمت چپ رنگ‌آمیزی کن!'
                  : activeNode.type === 'SCALE'
                  ? '🦁 شیر تحلیل‌گر: دو دسته میوه را مقایسه کن و علامت درست را بگذار!'
                  : '🛡️ سنجش مستقل: عدد بعدی دنباله ۲، ۴، ۶ چیست؟'
              }
            />
          </div>

          {/* 1. COUNT EXERCISE */}
          {activeNode.type === 'COUNT' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '2px solid #fde68a',
                  borderRadius: 22,
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 14,
                  flexWrap: 'wrap',
                  width: '100%',
                  marginBottom: 24,
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                {[1, 2, 3, 4, 5].map((idx) => {
                  const isTapped = tappedCountItems.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        console.log(`[DuolingoLessonModal] Orange tapped: item #${idx}`);
                        toggleFruitTap(idx);
                      }}
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        backgroundColor: isTapped ? '#ffedd5' : '#ffffff',
                        border: isTapped ? '3px solid #f97316' : '2px dashed #fed7aa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 30,
                        cursor: 'pointer',
                        transform: isTapped ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                        pointerEvents: 'auto',
                        touchAction: 'manipulation',
                        position: 'relative',
                        zIndex: 5,
                      }}
                    >
                      🍊
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  width: '100%',
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                {[3, 4, 5, 6].map((num) => {
                  const isSelected = selectedCountNum === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleOptionSelect('COUNT', num, () => setSelectedCountNum(num))}
                      className={`math-choice-card ${isSelected ? 'selected' : ''}`}
                      style={{
                        fontSize: 24,
                        padding: '16px 0',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        touchAction: 'manipulation',
                        position: 'relative',
                        zIndex: 5,
                      }}
                    >
                      {toPersianDigits(num)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. PATTERN EXERCISE */}
          {activeNode.type === 'PATTERN' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '2px solid var(--border-subtle)',
                  borderRadius: 24,
                  padding: '24px 16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  marginBottom: 24,
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 4px 0 #1d4ed8' }} />
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#facc15', boxShadow: '0 4px 0 #ca8a04' }} />
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 4px 0 #1d4ed8' }} />
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#facc15', boxShadow: '0 4px 0 #ca8a04' }} />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '3px dashed #94a3b8',
                    backgroundColor:
                      selectedPatternColor === 'blue'
                        ? '#3b82f6'
                        : selectedPatternColor === 'yellow'
                        ? '#facc15'
                        : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {!selectedPatternColor && '❓'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, width: '100%', position: 'relative', zIndex: 5 }}>
                <button
                  type="button"
                  onClick={() => handleOptionSelect('PATTERN', 'blue', () => setSelectedPatternColor('blue'))}
                  className={`math-choice-card ${selectedPatternColor === 'blue' ? 'selected' : ''}`}
                  style={{
                    flex: 1,
                    gap: 8,
                    fontSize: 16,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 5,
                  }}
                >
                  <span style={{ fontSize: 24 }}>🔵</span>
                  <span>دایره آبی</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOptionSelect('PATTERN', 'yellow', () => setSelectedPatternColor('yellow'))}
                  className={`math-choice-card ${selectedPatternColor === 'yellow' ? 'selected' : ''}`}
                  style={{
                    flex: 1,
                    gap: 8,
                    fontSize: 16,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 5,
                  }}
                >
                  <span style={{ fontSize: 24 }}>🟡</span>
                  <span>دایره زرد</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. WONDER GRID EXERCISE */}
          {activeNode.type === 'WONDER_GRID' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <WonderGrid onSuccess={() => {
                console.log('[DuolingoLessonModal] WonderGrid solved successfully');
                soundFx.playSuccess();
                setIsGridSolved(true);
              }} />
            </div>
          )}

          {/* 4. TALLY EXERCISE */}
          {activeNode.type === 'TALLY' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '2px solid #fde68a',
                  borderRadius: 22,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 16,
                  width: '100%',
                  marginBottom: 20,
                }}
              >
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} style={{ fontSize: 36 }}>🍊</div>
                ))}
              </div>
              <InteractiveTallyMarks count={tallyCount} maxCount={8} onChangeCount={(newCount) => {
                console.log(`[DuolingoLessonModal] Tally count changed: ${newCount}`);
                setTallyCount(newCount);
              }} />
            </div>
          )}

          {/* 5. SYMMETRY EXERCISE */}
          {activeNode.type === 'SYMMETRY' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <SymmetryMirror onSuccess={() => {
                console.log('[DuolingoLessonModal] SymmetryMirror solved successfully');
                soundFx.playSuccess();
                setIsSymmetrySolved(true);
              }} />
            </div>
          )}

          {/* 6. SCALE EXERCISE */}
          {activeNode.type === 'SCALE' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <ComparisonScale
                leftCount={4}
                rightCount={2}
                leftItem="🍎"
                rightItem="🍐"
                onCorrect={() => {
                  console.log('[DuolingoLessonModal] ComparisonScale solved correctly');
                  soundFx.playSuccess();
                  setIsScaleSolved(true);
                }}
              />
            </div>
          )}

          {/* 7. CHECK EXERCISE */}
          {activeNode.type === 'CHECK' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              <div
                style={{
                  backgroundColor: '#eef2ff',
                  border: '2px solid #c7d2fe',
                  borderRadius: 24,
                  padding: '24px 20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 16,
                  fontSize: 28,
                  fontWeight: 900,
                  width: '100%',
                  marginBottom: 28,
                  direction: 'rtl',
                }}
              >
                <span>{toPersianDigits(2)}</span>
                <span>،</span>
                <span>{toPersianDigits(4)}</span>
                <span>،</span>
                <span>{toPersianDigits(6)}</span>
                <span>،</span>
                <span style={{ borderBottom: '4px solid #3b52d4', minWidth: 40, textAlign: 'center', color: '#3b52d4' }}>
                  {selectedSeqNum ? toPersianDigits(selectedSeqNum) : '؟'}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  width: '100%',
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                {[7, 8, 9, 10].map((num) => {
                  const isSelected = selectedSeqNum === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleOptionSelect('CHECK_SEQUENCE', num, () => setSelectedSeqNum(num))}
                      className={`math-choice-card ${isSelected ? 'selected' : ''}`}
                      style={{
                        fontSize: 24,
                        padding: '16px 0',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        touchAction: 'manipulation',
                        position: 'relative',
                        zIndex: 5,
                      }}
                    >
                      {toPersianDigits(num)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : activeNode.type === 'CHEST' ? (
        /* CHEST REWARD SCREEN */
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: 20 }}>
            {!isChestOpened ? (
              <button
                type="button"
                onClick={handleOpenChest}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 84,
                  cursor: 'pointer',
                  animation: 'bounceIn 0.6s infinite alternate',
                }}
              >
                🎁
              </button>
            ) : (
              <div style={{ fontSize: 84 }} className="victory-pop">
                💎✨🏆
              </div>
            )}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#d97706', margin: '0 0 8px' }}>
            {!isChestOpened ? 'صندوق گنجینه دانایی نگاره اول!' : 'تبریک! پاداش بزرگ باز شد!'}
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
            {!isChestOpened
              ? 'صندوق را لمس کن تا پاداش تلاش و یادگیری‌ات را دریافت کنی!'
              : '۱۰ ستاره دانایی و مدال افتخار ریاضی پایه اول به کوله‌پشتی‌ات افزوده شد.'}
          </p>

          {isChestOpened ? (
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                onCompleteNode(activeNode.id);
                onClose();
              }}
              className="math-btn-success"
              style={{ width: '100%', padding: '16px 0', fontSize: 17, cursor: 'pointer', pointerEvents: 'auto', touchAction: 'manipulation' }}
            >
              دریافت و بازگشت به نقشه
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenChest}
              className="math-btn-saffron"
              style={{ width: '100%', padding: '16px 0', fontSize: 17, cursor: 'pointer', pointerEvents: 'auto', touchAction: 'manipulation' }}
            >
              باز کردن صندوق 🎁
            </button>
          )}
        </div>
      ) : (
        /* STANDARD VICTORY SCREEN */
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }} className="victory-pop">
            🎉⭐🏆
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#10b981', margin: '0 0 8px' }}>
            {activeNode.title} کامل شد!
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
            پاسخ شما با موفقیت در موتور یادگیری ثبت و گام بعدی نقشه باز شد.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 14,
              width: '100%',
              marginBottom: 30,
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: '#fffbeb',
                border: '2px solid #fde68a',
                borderRadius: 20,
                padding: '14px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: '#b45309', fontWeight: 800 }}>ستاره‌های دانایی</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#d97706' }}>+۳ ⭐</div>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: '#eef2ff',
                border: '2px solid #c7d2fe',
                borderRadius: 20,
                padding: '14px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: '#3730a3', fontWeight: 800 }}>تثبیت مهارت</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#3b52d4' }}>۱۰۰٪</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playTap();
              onCompleteNode(activeNode.id);
              onClose();
            }}
            className="math-btn-success"
            style={{ width: '100%', padding: '16px 0', fontSize: 17, cursor: 'pointer', pointerEvents: 'auto', touchAction: 'manipulation' }}
          >
            ادامه مسیر یادگیری
          </button>
        </div>
      )}

      {/* Bottom Evaluation Drawer */}
      {evaluation !== 'FINISHED' && (
        <div
          className="drawer-slide-up"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor:
              evaluation === 'CORRECT'
                ? '#ecfdf5'
                : evaluation === 'WRONG'
                ? '#fff7ed'
                : '#ffffff',
            borderTop:
              evaluation === 'CORRECT'
                ? '2px solid #a7f3d0'
                : evaluation === 'WRONG'
                ? '2px solid #fed7aa'
                : '2px solid var(--border-subtle)',
            padding: '16px 22px 20px',
            zIndex: 60,
            pointerEvents: 'auto',
          }}
        >
          {evaluation === 'CORRECT' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: '#10b981',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.25)',
                }}
              >
                ✓
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 18, color: '#047857', fontWeight: 900 }}>
                  آفرین! کاملاً درست و دقیق بود!
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: '#059669' }}>
                  یک ستاره دانایی دیگر به کوله‌پشتی‌ات اضافه شد ⭐
                </p>
              </div>
            </div>
          )}

          {evaluation === 'WRONG' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: '#ea580c',
                  boxShadow: '0 2px 8px rgba(234,88,12,0.2)',
                }}
              >
                💡
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 17, color: '#9a3412', fontWeight: 900 }}>
                  اصلاً اشکالی نداره، با هم دقت می‌کنیم:
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: '#b45309' }}>
                  {activeNode.type === 'COUNT' && 'تعداد ۵ پرتقال بود؛ دوباره بشمار.'}
                  {activeNode.type === 'PATTERN' && 'الگوی دوتایی است: آبی، زرد، آبی، زرد... نوبت دایره آبی است.'}
                  {activeNode.type === 'CHECK' && 'الگوی اضافه شدن دو‌تایی: ۲، ۴، ۶، ۸.'}
                  {activeNode.type === 'TALLY' && 'برای ۵ تا باید یک بسته چوب‌خط کامل داشته باشی.'}
                  {activeNode.type === 'WONDER_GRID' && 'در هر ردیف و هر ستون هر رنگ فقط یک‌بار می‌آید.'}
                  {activeNode.type === 'SYMMETRY' && 'نیمه راست باید بازتاب دقیق نیمه چپ در آینه باشد.'}
                  {activeNode.type === 'SCALE' && 'دهانه علامت همیشه به سمت دسته بزرگتر باز است.'}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {evaluation === 'UNCHECKED' ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={isCheckDisabled}
              className={isCheckDisabled ? 'math-btn-disabled' : 'math-btn-primary'}
              style={{ width: '100%', padding: '15px 0', fontSize: 17, cursor: isCheckDisabled ? 'not-allowed' : 'pointer', pointerEvents: 'auto', touchAction: 'manipulation' }}
            >
              بررسی کن
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className={evaluation === 'CORRECT' ? 'math-btn-success' : 'math-btn-saffron'}
              style={{ width: '100%', padding: '15px 0', fontSize: 17, cursor: 'pointer', pointerEvents: 'auto', touchAction: 'manipulation' }}
            >
              {evaluation === 'CORRECT' ? 'ادامه' : 'تلاش دوباره'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
