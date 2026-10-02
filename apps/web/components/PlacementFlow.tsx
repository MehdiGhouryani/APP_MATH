'use client';

import React, { useState } from 'react';
import { DESIGN_TOKENS } from '../lib/theme/tokens';
import { CharacterArt } from './CharacterArt';

/**
 * Placement / Diagnostic (SoT v1.2 §0.1, Screen Inventory S06–S08).
 *
 * A short, ungraded check used only to pick a starting point — never framed as
 * pass/fail (§0.1: "بدون برچسب منفی"). With only Station 1 seeded with real
 * content (see PHASE-00_RECONCILIATION_REPORT.md §12), there is nowhere else
 * to *place* a learner across stations; what this CAN honestly determine is
 * whether the child already shows the counting/pattern competency that ST01's
 * first four steps teach, and if so, start them at step-5 (TRY ALONE) instead
 * of repeating Discover/Guided/Play. This is a real, if narrow, placement.
 */

type ItemId = 'count' | 'pattern';

const ITEMS: Array<{
  id: ItemId;
  prompt: string;
  display: string;
  options: string[];
  correct: string;
}> = [
  { id: 'count', prompt: 'چند تا ستاره می‌بینی؟', display: '⭐ ⭐ ⭐ ⭐', options: ['۳', '۴', '۵'], correct: '۴' },
  {
    id: 'pattern',
    prompt: 'این الگو را نگاه کن؛ بعدی چی می‌آید؟',
    display: '🔵 🟡 🔵 🟡 ❓',
    options: ['🔵', '🟡', '🟢'],
    correct: '🔵',
  },
];

interface PlacementFlowProps {
  childName: string;
  /** allCorrect: whether the child answered both diagnostic items correctly. */
  onDone: (allCorrect: boolean) => void;
}

export function PlacementFlow({ childName, onDone }: PlacementFlowProps) {
  const [stage, setStage] = useState<'INTRO' | number | 'RESULT'>('INTRO');
  const [correctCount, setCorrectCount] = useState(0);

  function answer(choice: string) {
    const index = stage as number;
    const item = ITEMS[index]!;
    const nextCorrect = correctCount + (choice === item.correct ? 1 : 0);
    setCorrectCount(nextCorrect);
    if (index + 1 < ITEMS.length) {
      setStage(index + 1);
    } else {
      setStage('RESULT');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="پیدا کردن نقطه‌ی شروع"
      dir="rtl"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: DESIGN_TOKENS.typography.fonts.body,
        color: '#ffffff',
        textAlign: 'center',
      }}
    >
      {stage === 'INTRO' && (
        <div style={{ maxWidth: 360 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><CharacterArt id="aria" state="idle" size={96} label="آریا" /></div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px' }}>
            {childName ? `${childName} جان، ` : ''}دو تا سؤال کوتاه!
          </h2>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.9, margin: '0 0 20px' }}>
            این‌ها امتحان نیست، فقط کمک می‌کند بهترین نقطه‌ی شروع را برایت پیدا کنیم. جواب اشتباه هم کاملاً
            اشکالی ندارد.
          </p>
          <button
            type="button"
            onClick={() => setStage(0)}
            style={{
              padding: '14px 28px',
              borderRadius: 16,
              border: 'none',
              backgroundColor: DESIGN_TOKENS.colors.brand.primary,
              color: '#fff',
              fontWeight: 900,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            شروع کن ➔
          </button>
        </div>
      )}

      {typeof stage === 'number' && (
        <div style={{ maxWidth: 360, width: '100%' }}>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
            سؤال {stage === 0 ? '۱' : '۲'} از ۲
          </p>
          <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 18px' }}>{ITEMS[stage]!.prompt}</h3>
          <div style={{ fontSize: 40, marginBottom: 22, letterSpacing: 4 }}>{ITEMS[stage]!.display}</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {ITEMS[stage]!.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => answer(opt)}
                style={{
                  minWidth: 64,
                  padding: '14px 10px',
                  borderRadius: 14,
                  border: '2px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'RESULT' && (
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>نقطه‌ی شروعت پیدا شد!</h2>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.9, margin: '0 0 20px' }}>
            {correctCount === ITEMS.length
              ? 'عالی بود! می‌توانی از تمرین‌های مستقل ایستگاه یک شروع کنی.'
              : 'با هم قدم‌به‌قدم از اول ایستگاه یک شروع می‌کنیم.'}
          </p>
          <button
            type="button"
            onClick={() => onDone(correctCount === ITEMS.length)}
            style={{
              padding: '14px 28px',
              borderRadius: 16,
              border: 'none',
              backgroundColor: DESIGN_TOKENS.colors.brand.primary,
              color: '#fff',
              fontWeight: 900,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            برو به یادگیری ➔
          </button>
        </div>
      )}
    </div>
  );
}
