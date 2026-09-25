'use client';

import React, { useState } from 'react';
import { CHARACTERS, toPersianDigits } from '../lib/persian';
import { InteractiveTallyMarks } from './InteractiveTallyMarks';
import { WonderGrid } from './WonderGrid';
import { SymmetryMirror } from './SymmetryMirror';
import { ComparisonScale } from './ComparisonScale';
import type { PathNodeItem } from './DuolingoPath';
import type { AnimationSemanticEvent } from '@math/contracts';

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

  const [evaluation, setEvaluation] = useState<EvaluationState>('UNCHECKED');

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

  function toggleFruitTap(index: number) {
    if (tappedCountItems.includes(index)) {
      setTappedCountItems(tappedCountItems.filter((i) => i !== index));
    } else {
      setTappedCountItems([...tappedCountItems, index]);
    }
  }

  function handleCheck() {
    let correct = false;

    if (activeNode.type === 'COUNT') {
      correct = selectedCountNum === 5;
      if (correct) {
        onEmitSemanticEvent('ANSWER_CORRECT', 'RuntimeEvaluator.eval(CountTask, answer=5)');
      } else {
        onEmitSemanticEvent('ANSWER_WRONG', `RuntimeEvaluator.eval(CountTask, answer=${selectedCountNum})`);
      }
    } else if (activeNode.type === 'PATTERN') {
      correct = selectedPatternColor === 'blue';
      if (correct) {
        onEmitSemanticEvent('ANSWER_CORRECT', 'RuntimeEvaluator.eval(PatternTask, answer=BLUE)');
      } else {
        onEmitSemanticEvent('ANSWER_WRONG', 'RuntimeEvaluator.eval(PatternTask, answer=YELLOW)');
      }
    } else if (activeNode.type === 'WONDER_GRID') {
      correct = isGridSolved;
      if (correct) {
        onEmitSemanticEvent('ANSWER_CORRECT', 'RuntimeEvaluator.eval(WonderGrid, solved=true)');
      } else {
        onEmitSemanticEvent('ANSWER_WRONG', 'RuntimeEvaluator.eval(WonderGrid, solved=false)');
      }
    } else if (activeNode.type === 'TALLY') {
      correct = tallyCount === 5;
      if (correct) {
        onEmitSemanticEvent('ANSWER_CORRECT', 'RuntimeEvaluator.eval(TallyMarks, count=5)');
      } else {
        onEmitSemanticEvent('ANSWER_WRONG', `RuntimeEvaluator.eval(TallyMarks, count=${tallyCount})`);
      }
    } else if (activeNode.type === 'CHECK') {
      correct = selectedSeqNum === 8;
      if (correct) {
        onEmitSemanticEvent('ANSWER_CORRECT', 'RuntimeEvaluator.evalIndependentCheck(Check1, answer=8)');
      } else {
        onEmitSemanticEvent('RECOVERY', 'LearningEngine.triggerSmartRecovery(Skill=G1-SK02)');
      }
    } else {
      correct = true;
    }

    setEvaluation(correct ? 'CORRECT' : 'WRONG');
  }

  function handleContinue() {
    if (evaluation === 'CORRECT') {
      setEvaluation('FINISHED');
      onEmitSemanticEvent('STATION_PASS', `Runtime.passNode(${activeNode.id})`);
    } else {
      setEvaluation('UNCHECKED');
    }
  }

  const isCheckDisabled =
    (activeNode.type === 'COUNT' && selectedCountNum === null) ||
    (activeNode.type === 'PATTERN' && selectedPatternColor === null) ||
    (activeNode.type === 'WONDER_GRID' && !isGridSolved) ||
    (activeNode.type === 'TALLY' && tallyCount === 0) ||
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
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
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
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
            fontWeight: 800,
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
            padding: '20px 22px 140px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Mascot Prompt */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: '50%',
                backgroundColor: activeChar.avatarBg,
                border: `3px solid ${activeChar.themeColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                flexShrink: 0,
                boxShadow: `0 6px 16px ${activeChar.themeColor}25`,
              }}
            >
              {activeChar.id === 'aria'
                ? '🐲'
                : activeChar.id === 'qbo'
                ? '🤖'
                : activeChar.id === 'jiko'
                ? '🐦'
                : '🐿️'}
            </div>

            <div className="math-speech-bubble" style={{ flex: 1 }}>
              {activeNode.type === 'COUNT' &&
                '🐊 تمساح مهربان می‌گوید: پرتقال‌ها را لمس کن و بشمار؛ چند تا در سبد هست؟'}
              {activeNode.type === 'PATTERN' &&
                '🐒 میمون الگویاب می‌پرسد: قطار رنگ‌ها را ببین! جای علامت سؤال کدام رنگ می‌آید؟'}
              {activeNode.type === 'WONDER_GRID' &&
                '🐸 قورباغه با ابزار کار می‌کند: جدول شگفت‌انگیز را بدون رنگ تکراری در هر سطر و ستون کامل کن!'}
              {activeNode.type === 'TALLY' &&
                '🦁 شیر باهوش می‌گوید: به تعداد پرتقال‌ها چوب‌خط بکش! خط پنجم کج کشیده می‌شود.'}
              {activeNode.type === 'CHECK' &&
                '🛡️ سنجش مستقل: عدد بعدی دنباله ۲، ۴، ۶ چیست؟'}
            </div>
          </div>

          {/* 1. COUNT EXERCISE */}
          {activeNode.type === 'COUNT' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                }}
              >
                {[1, 2, 3, 4, 5].map((idx) => {
                  const isTapped = tappedCountItems.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleFruitTap(idx)}
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
                }}
              >
                {[3, 4, 5, 6].map((num) => {
                  const isSelected = selectedCountNum === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setSelectedCountNum(num)}
                      className={`math-choice-card ${isSelected ? 'selected' : ''}`}
                      style={{ fontSize: 24, padding: '16px 0' }}
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

              <div style={{ display: 'flex', gap: 14, width: '100%' }}>
                <button
                  onClick={() => setSelectedPatternColor('blue')}
                  className={`math-choice-card ${selectedPatternColor === 'blue' ? 'selected' : ''}`}
                  style={{ flex: 1, gap: 8, fontSize: 16 }}
                >
                  <span style={{ fontSize: 24 }}>🔵</span>
                  <span>دایره آبی</span>
                </button>
                <button
                  onClick={() => setSelectedPatternColor('yellow')}
                  className={`math-choice-card ${selectedPatternColor === 'yellow' ? 'selected' : ''}`}
                  style={{ flex: 1, gap: 8, fontSize: 16 }}
                >
                  <span style={{ fontSize: 24 }}>🟡</span>
                  <span>دایره زرد</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. WONDER GRID EXERCISE */}
          {activeNode.type === 'WONDER_GRID' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <WonderGrid onSuccess={() => setIsGridSolved(true)} />
            </div>
          )}

          {/* 4. TALLY EXERCISE */}
          {activeNode.type === 'TALLY' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              <InteractiveTallyMarks count={tallyCount} maxCount={8} onChangeCount={setTallyCount} />
            </div>
          )}

          {/* 5. CHECK EXERCISE */}
          {activeNode.type === 'CHECK' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                }}
              >
                {[7, 8, 9, 10].map((num) => {
                  const isSelected = selectedSeqNum === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setSelectedSeqNum(num)}
                      className={`math-choice-card ${isSelected ? 'selected' : ''}`}
                      style={{ fontSize: 24, padding: '16px 0' }}
                    >
                      {toPersianDigits(num)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VICTORY SCREEN */
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
            onClick={() => {
              onCompleteNode(activeNode.id);
              onClose();
            }}
            className="math-btn-success"
            style={{ width: '100%', padding: '16px 0', fontSize: 17 }}
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
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {evaluation === 'UNCHECKED' ? (
            <button
              onClick={handleCheck}
              disabled={isCheckDisabled}
              className={isCheckDisabled ? 'math-btn-disabled' : 'math-btn-primary'}
              style={{ width: '100%', padding: '15px 0', fontSize: 17 }}
            >
              بررسی کن
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={evaluation === 'CORRECT' ? 'math-btn-success' : 'math-btn-saffron'}
              style={{ width: '100%', padding: '15px 0', fontSize: 17 }}
            >
              {evaluation === 'CORRECT' ? 'ادامه' : 'تلاش دوباره'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
