'use client';

import React, { useState } from 'react';
import { toPersianDigits } from '../lib/persian';
import { soundFx } from '../lib/sound';
import { DESIGN_TOKENS } from '../lib/theme/tokens';

export function LeaderboardView() {
  const [cheeredIndex, setCheeredIndex] = useState<number | null>(null);

  const ranks = [
    { rank: 1, name: 'سارا رضایی', xp: 480, avatar: '👧', streak: 7, isMe: false },
    { rank: 2, name: 'شما (قهرمان ریاضی)', xp: 420, avatar: '🐲', streak: 3, isMe: true },
    { rank: 3, name: 'کیان محمدی', xp: 395, avatar: '👦', streak: 5, isMe: false },
    { rank: 4, name: 'هلیا احمدی', xp: 350, avatar: '👧', streak: 2, isMe: false },
    { rank: 5, name: 'رادین کریمی', xp: 310, avatar: '👦', streak: 4, isMe: false },
    { rank: 6, name: 'آوا موسوی', xp: 280, avatar: '👧', streak: 1, isMe: false },
  ];

  function handleCheer(idx: number) {
    soundFx.playBubblePop();
    setCheeredIndex(idx);
    setTimeout(() => setCheeredIndex(null), 1200);
  }

  return (
    <div style={{ padding: '16px 20px 40px', fontFamily: DESIGN_TOKENS.typography.fonts.body }}>
      {/* League Header */}
      <div
        style={{
          backgroundColor: DESIGN_TOKENS.colors.brand.secondary,
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: '20px 20px',
          color: DESIGN_TOKENS.colors.neutral.white,
          textAlign: 'center',
          boxShadow: `0 6px 0 ${DESIGN_TOKENS.colors.brand.secondaryDark}`,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 4 }}>🏆</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, fontFamily: DESIGN_TOKENS.typography.fonts.display }}>لیگ الماس (لیگ دانایی ریاضی)</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
          با حل تمرین‌های روزانه، امتیاز تجربه (XP) کسب کن و در لیگ بالا برو!
        </p>
        <div
          style={{
            marginTop: 12,
            backgroundColor: 'rgba(0,0,0,0.15)',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 750,
          }}
        >
          ⏱️ ۲ روز تا پایان این دوره مسابقه
        </div>
      </div>

      {/* Leaderboard List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ranks.map((item, idx) => (
          <div
            key={item.rank}
            onClick={() => !item.isMe && handleCheer(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: DESIGN_TOKENS.radius.md,
              backgroundColor: item.isMe ? DESIGN_TOKENS.colors.brand.primaryLight : DESIGN_TOKENS.colors.neutral.white,
              border: item.isMe ? `2px solid ${DESIGN_TOKENS.colors.brand.primary}` : `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
              boxShadow: item.isMe ? `0 4px 0 ${DESIGN_TOKENS.colors.brand.primary}` : `0 2px 0 ${DESIGN_TOKENS.colors.neutral.border}`,
              cursor: item.isMe ? 'default' : 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Rank number badge */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor:
                    item.rank === 1
                      ? '#ffd700'
                      : item.rank === 2
                      ? DESIGN_TOKENS.colors.brand.primaryLight
                      : item.rank === 3
                      ? '#fed7aa'
                      : '#f1f5f9',
                  color: item.rank === 1 ? '#854d0e' : DESIGN_TOKENS.colors.neutral.charcoal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                {toPersianDigits(item.rank)}
              </div>

              {/* Avatar & Name */}
              <span style={{ fontSize: 24 }}>{item.avatar}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: DESIGN_TOKENS.colors.neutral.charcoal }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: DESIGN_TOKENS.colors.neutral.slate, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>🔥 {toPersianDigits(item.streak)} روز متوالی</span>
                  {cheeredIndex === idx && (
                    <span style={{ color: '#e11d48', fontWeight: 800, animation: 'bounceIn 0.3s ease' }}>
                      👏 تشویق شد!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* XP Points */}
            <div style={{ fontWeight: 900, fontSize: 15, color: DESIGN_TOKENS.colors.brand.primary, fontFamily: DESIGN_TOKENS.typography.fonts.math }}>
              {toPersianDigits(item.xp)} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
