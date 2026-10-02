'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CHARACTERS, toPersianDigits } from '../lib/persian';
import { DESIGN_TOKENS } from '../lib/theme/tokens';
import { CompanionBust } from './DuolingoPath';
import { ParentGate } from './ParentGate';

interface ProfileViewProps {
  activeCharId: string;
  childName: string;
  gradeTitle: string;
  streakDays?: number;
  gemsCount?: number;
}

export function ProfileView({
  activeCharId,
  childName,
  gradeTitle,
  streakDays = 0,
  gemsCount = 0,
}: ProfileViewProps) {
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <div style={{ padding: '16px 20px 40px', fontFamily: DESIGN_TOKENS.typography.fonts.body }}>
      {/* Profile Card */}
      <div
        style={{
          backgroundColor: DESIGN_TOKENS.colors.neutral.white,
          border: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: '24px 20px',
          boxShadow: `0 4px 0 ${DESIGN_TOKENS.colors.neutral.border}`,
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            backgroundColor: activeChar.avatarBg,
            border: `3px solid ${activeChar.themeColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            margin: '0 auto 12px',
            boxShadow: `0 8px 20px ${activeChar.themeColor}30`,
          }}
        >
          <CompanionBust characterId={activeChar.id} size={72} />
        </div>

        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, color: DESIGN_TOKENS.colors.neutral.charcoal, fontFamily: DESIGN_TOKENS.typography.fonts.display }}>
          {childName}
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: DESIGN_TOKENS.colors.neutral.slate }}>
          دانش‌آموز {gradeTitle}
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              flex: 1,
              backgroundColor: DESIGN_TOKENS.colors.status.retryLight,
              border: `2px solid ${DESIGN_TOKENS.colors.status.retry}`,
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '10px',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>🔥 {toPersianDigits(streakDays)} روز</div>
            <div style={{ fontSize: 11, color: DESIGN_TOKENS.colors.status.retry, fontWeight: 800 }}>استریک فعال</div>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: DESIGN_TOKENS.colors.brand.primaryLight,
              border: `2px solid ${DESIGN_TOKENS.colors.brand.primary}`,
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '10px',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>💎 {toPersianDigits(gemsCount)}</div>
            <div style={{ fontSize: 11, color: DESIGN_TOKENS.colors.brand.primary, fontWeight: 800 }}>الماس کل</div>
          </div>
        </div>
      </div>

      {/* Adult Portals Links */}
      <div
        style={{
          backgroundColor: DESIGN_TOKENS.colors.neutral.cream,
          border: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: '16px',
        }}
      >
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: DESIGN_TOKENS.colors.neutral.slate }}>
          🔒 پرتال همکاران و معلمان:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            style={{
              width: '100%',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: DESIGN_TOKENS.colors.neutral.white,
              border: `1px solid ${DESIGN_TOKENS.colors.neutral.border}`,
              borderRadius: DESIGN_TOKENS.radius.sm,
              color: DESIGN_TOKENS.colors.neutral.charcoal,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>👩‍🏫 پرتال معلمان (Teacher Lite)</span>
            <span>←</span>
          </button>
        </div>
      </div>

      {gateOpen && (
        <ParentGate
          purpose="پرتال معلمان مخصوص بزرگسالان است. برای ورود، پاسخ سؤال را بنویسید."
          onPass={() => {
            setGateOpen(false);
            router.push('/teacher');
          }}
          onCancel={() => setGateOpen(false)}
        />
      )}
    </div>
  );
}
