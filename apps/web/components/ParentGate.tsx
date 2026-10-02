'use client';

import React, { useState } from 'react';
import { DESIGN_TOKENS } from '../lib/theme/tokens';

/**
 * Parent Gate (SoT v1.2 §0.1, §20): a lightweight adult-only checkpoint that
 * sits between Child surfaces and adult surfaces / data-collection steps.
 *
 * It is a UX boundary, NOT authentication or authorization — server-side
 * authorization remains mandatory (SoT §22.2). The consent copy below is a
 * product placeholder; exact legal wording (COPPA/GDPR-K etc.) must be
 * finalized with local counsel.
 */

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .trim();
}

function makeChallenge() {
  // Two-digit × one-digit: quick for an adult, hard for an early reader.
  const a = 12 + Math.floor(Math.random() * 8); // 12..19
  const b = 3 + Math.floor(Math.random() * 6); // 3..8
  return { a, b, answer: a * b };
}

const MAX_FAILS = 3;
const COOLDOWN_MS = 30_000;

interface ParentGateProps {
  onPass: () => void;
  onCancel: () => void;
  /** Short Persian description of what the adult is about to do. */
  purpose: string;
  /** When true, also requires an explicit parent/guardian consent checkbox. */
  requireConsent?: boolean;
}

export function ParentGate({ onPass, onCancel, purpose, requireConsent = false }: ParentGateProps) {
  const [challenge, setChallenge] = useState(makeChallenge);
  const [value, setValue] = useState('');
  const [consent, setConsent] = useState(false);
  const [fails, setFails] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [error, setError] = useState('');

  const locked = lockedUntil !== null && Date.now() < lockedUntil;

  function handleSubmit() {
    if (locked) return;
    if (requireConsent && !consent) {
      setError('برای ادامه، تأیید والد/سرپرست لازم است.');
      return;
    }
    if (normalizeDigits(value) === String(challenge.answer)) {
      onPass();
      return;
    }
    const nextFails = fails + 1;
    setValue('');
    setChallenge(makeChallenge());
    if (nextFails >= MAX_FAILS) {
      setFails(0);
      setLockedUntil(Date.now() + COOLDOWN_MS);
      setError('چند بار اشتباه شد. کمی بعد دوباره امتحان کنید.');
    } else {
      setFails(nextFails);
      setError('پاسخ درست نبود. یک سؤال تازه آماده شد.');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="بخش ویژه بزرگسالان"
      dir="rtl"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15,23,42,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: DESIGN_TOKENS.typography.fonts.body,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          backgroundColor: '#ffffff',
          color: '#1e293b',
          borderRadius: 24,
          padding: 24,
          textAlign: 'right',
        }}
      >
        <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900 }}>🔒 بخش ویژه بزرگسالان</h3>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#475569' }}>{purpose}</p>

        {requireConsent && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: 12,
              fontSize: 12,
              lineHeight: 1.9,
              marginBottom: 12,
            }}
          >
            <strong>حریم خصوصی کودک:</strong> فقط حداقل اطلاعات لازم (نام مستعار، پایه و پیشرفت یادگیری) برای
            ادامهٔ مسیر یادگیری ذخیره می‌شود. برای شروع، شمارهٔ تلفن الزامی نیست و اطلاعات کودک برای تبلیغات
            استفاده نمی‌شود.
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 5 }}
              />
              <span>من والد یا سرپرست قانونی هستم و با موارد بالا موافقم.</span>
            </label>
          </div>
        )}

        <label htmlFor="parent-gate-answer" style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
          برای ادامه پاسخ را بنویسید: {challenge.a} × {challenge.b} = ؟
        </label>
        <input
          id="parent-gate-answer"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          disabled={locked}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: 12,
            border: '2px solid #cbd5e1',
            fontSize: 16,
            fontWeight: 800,
            textAlign: 'center',
          }}
        />

        {error && (
          <p role="alert" style={{ margin: '8px 0 0', fontSize: 12, color: '#b45309', fontWeight: 700 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={locked || value.trim().length === 0}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: locked || value.trim().length === 0 ? '#cbd5e1' : DESIGN_TOKENS.colors.brand.primary,
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            تأیید
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 16px',
              borderRadius: 14,
              border: '2px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            بازگشت
          </button>
        </div>
      </div>
    </div>
  );
}
