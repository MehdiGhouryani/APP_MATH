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
  xp?: number;
  completedStepsCount?: number;
}

export function ProfileView({
  activeCharId,
  childName,
  gradeTitle,
  streakDays = 3,
  gemsCount = 0,
  xp = 120,
  completedStepsCount = 2,
}: ProfileViewProps) {
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);

  const weekDays = [
    { name: 'ش', active: true },
    { name: 'ی', active: true },
    { name: 'د', active: true },
    { name: 'س', active: false },
    { name: 'چ', active: false },
    { name: 'پ', active: false },
    { name: 'ج', active: false },
  ];

  const dailyQuests = [
    {
      id: 'q1',
      icon: '🗺️',
      title: 'شروع آسان: حل ۱ گام از مسیر یادگیری',
      progress: Math.min(completedStepsCount, 1),
      target: 1,
      reward: '۲۰ XP',
      completed: completedStepsCount >= 1,
    },
    {
      id: 'q2',
      icon: '⭐',
      title: 'سازنده مهارت: کسب ۲ ستاره دانایی',
      progress: Math.min(completedStepsCount, 2),
      target: 2,
      reward: '۲۵ XP',
      completed: completedStepsCount >= 2,
    },
    {
      id: 'q3',
      icon: '🎯',
      title: 'تمرین معنادار: مرور ۱ مهارت در هاب تمرین',
      progress: 0,
      target: 1,
      reward: '۳۰ XP',
      completed: false,
    },
  ];

  const dailyGoalTarget = 3;
  const dailyGoalCurrent = Math.min(completedStepsCount, dailyGoalTarget);
  const dailyGoalPercent = Math.round((dailyGoalCurrent / dailyGoalTarget) * 100);

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
          marginBottom: 20,
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
          دانش‌آموز {gradeTitle} · همراه: {activeChar.name}
        </p>

        {/* 3 Metrics: Streak, XP, Gems */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div
            style={{
              backgroundColor: '#fff7ed',
              border: '2px solid #ffedd5',
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '10px 6px',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: '#c2410c' }}>🔥 {toPersianDigits(streakDays)} روز</div>
            <div style={{ fontSize: 10, color: '#ea580c', fontWeight: 800 }}>استریک فعال</div>
          </div>
          <div
            style={{
              backgroundColor: '#f5f3ff',
              border: '2px solid #ede9fe',
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '10px 6px',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: '#6d28d9' }}>⚡ {toPersianDigits(xp)}</div>
            <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 800 }}>امتیاز XP</div>
          </div>
          <div
            style={{
              backgroundColor: DESIGN_TOKENS.colors.brand.primaryLight,
              border: `2px solid ${DESIGN_TOKENS.colors.brand.primary}`,
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '10px 6px',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: DESIGN_TOKENS.colors.brand.primary }}>💎 {toPersianDigits(gemsCount)}</div>
            <div style={{ fontSize: 10, color: DESIGN_TOKENS.colors.brand.primary, fontWeight: 800 }}>الماس کل</div>
          </div>
        </div>
      </div>

      {/* Gentle Streak & Learning Rhythm Section */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: '18px 16px',
          marginBottom: 20,
          boxShadow: '0 3px 0 #bbf7d0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#166534' }}>ریتم یادگیری و استریک مهربان</div>
              <div style={{ fontSize: 11, color: '#15803d' }}>{toPersianDigits(streakDays)} روز یادگیری پیوسته در این هفته</div>
            </div>
          </div>
          <span
            style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>❄️</span>
            <span>محافظ رایگان فعال</span>
          </span>
        </div>

        {/* Weekly Day Circles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0 10px' }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: d.active ? '#22c55e' : '#ffffff',
                  border: d.active ? '2px solid #16a34a' : '2px solid #dcfce7',
                  color: d.active ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  boxShadow: d.active ? '0 2px 6px rgba(34, 197, 94, 0.3)' : 'none',
                }}
              >
                {d.active ? '✓' : d.name}
              </div>
              <span style={{ fontSize: 10, color: '#4b5563', fontWeight: 700 }}>{d.name}</span>
            </div>
          ))}
        </div>

        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#15803d', lineHeight: 1.5 }}>
          🌱 در روزهایی که استراحت می‌کنی یا مشغله داری، محافظت رایگان استریکت را بدون هیچ جریمه‌ای حفظ می‌کند.
        </p>
      </div>

      {/* Daily Learning Goal */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: '18px 16px',
          marginBottom: 20,
          boxShadow: `0 3px 0 ${DESIGN_TOKENS.colors.neutral.border}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div style={{ fontSize: 14, fontWeight: 900, color: DESIGN_TOKENS.colors.neutral.charcoal }}>هدف یادگیری امروز</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#3b52d4' }}>
            {toPersianDigits(dailyGoalCurrent)} از {toPersianDigits(dailyGoalTarget)} گام ({toPersianDigits(dailyGoalPercent)}٪)
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: 12, backgroundColor: '#f1f5f9', borderRadius: 999, overflow: 'hidden', padding: 2, border: '1px solid #e2e8f0' }}>
          <div
            style={{
              width: `${dailyGoalPercent}%`,
              height: '100%',
              backgroundColor: '#3b52d4',
              borderRadius: 999,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Daily Quests (کوئست‌های روزانه) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: '18px 16px',
          marginBottom: 20,
          boxShadow: `0 3px 0 ${DESIGN_TOKENS.colors.neutral.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>📜</span>
          <div style={{ fontSize: 14, fontWeight: 900, color: DESIGN_TOKENS.colors.neutral.charcoal }}>کوئست‌های روزانه دانایی</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 14,
                backgroundColor: q.completed ? '#f0fdf4' : '#f8fafc',
                border: q.completed ? '1.5px solid #bbf7d0' : '1.5px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{q.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b' }}>{q.title}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>پاداش: {q.reward}</div>
                </div>
              </div>

              {q.completed ? (
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}>
                  ✓ انجام شد
                </span>
              ) : (
                <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
                  {toPersianDigits(q.progress)}/{toPersianDigits(q.target)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safe Child Experience Notice (Guardrails) */}
      <div
        style={{
          backgroundColor: '#fafaf9',
          border: '1.5px dashed #d6d3d1',
          borderRadius: DESIGN_TOKENS.radius.md,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>🛡️</span>
        <div style={{ fontSize: 11, color: '#78716c', lineHeight: 1.5 }}>
          <strong>محیط آموزشی امن:</strong> بدون رقابت و لیدربورد، بدون کسر قلب/جان و بدون خرید درون‌برنامه‌ای.
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

