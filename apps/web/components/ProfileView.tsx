'use client';

import React from 'react';
import Link from 'next/link';
import { CHARACTERS, toPersianDigits } from '../lib/persian';
import { soundFx } from '../lib/sound';

interface ProfileViewProps {
  activeCharId: string;
  onSelectChar: (charId: string) => void;
  streakDays?: number;
  gemsCount?: number;
}

export function ProfileView({
  activeCharId,
  onSelectChar,
  streakDays = 3,
  gemsCount = 120,
}: ProfileViewProps) {
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      {/* Profile Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid #e5e5e5',
          borderRadius: 24,
          padding: '24px 20px',
          boxShadow: '0 4px 0 #e5e5e5',
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
          {activeChar.id === 'aria'
            ? '🐲'
            : activeChar.id === 'qbo'
            ? '🤖'
            : activeChar.id === 'jiko'
            ? '🐦'
            : '🐿️'}
        </div>

        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, color: '#3c3c3c' }}>
          سارا رضایی
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#777' }}>
          دانش‌آموز پایه اول دبستان · کلاس ۱A
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              flex: 1,
              backgroundColor: '#fff3d6',
              border: '2px solid #ff9600',
              borderRadius: 16,
              padding: '10px',
            }}
          >
            <div style={{ fontSize: 18 }}>🔥 {toPersianDigits(streakDays)} روز</div>
            <div style={{ fontSize: 11, color: '#cc7800', fontWeight: 800 }}>استریک فعال</div>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: '#ddf4ff',
              border: '2px solid #1cb0f6',
              borderRadius: 16,
              padding: '10px',
            }}
          >
            <div style={{ fontSize: 18 }}>💎 {toPersianDigits(gemsCount)}</div>
            <div style={{ fontSize: 11, color: '#1899d6', fontWeight: 800 }}>الماس کل</div>
          </div>
        </div>
      </div>

      {/* Choose Companion Mascot (4 Mascots from V1 specification) */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#3c3c3c', margin: '0 0 12px' }}>
          انتخاب همراه یادگیری (۴ شخصیت V1):
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Object.values(CHARACTERS).map((char) => {
            const isSelected = char.id === activeCharId;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => {
                  soundFx.playCharacterChirp(char.id);
                  onSelectChar(char.id);
                }}
                style={{
                  backgroundColor: isSelected ? char.avatarBg : '#ffffff',
                  border: isSelected ? `2px solid ${char.themeColor}` : '2px solid #e5e5e5',
                  boxShadow: isSelected ? `0 4px 0 ${char.themeColor}` : '0 2px 0 #e5e5e5',
                  borderRadius: 18,
                  padding: '14px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                  touchAction: 'manipulation',
                  pointerEvents: 'auto',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 4 }}>
                  {char.id === 'aria'
                    ? '🐲'
                    : char.id === 'qbo'
                    ? '🤖'
                    : char.id === 'jiko'
                    ? '🐦'
                    : '🐿️'}
                </div>
                <div style={{ fontWeight: 900, fontSize: 14, color: char.themeColor }}>
                  {char.name}
                </div>
                <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>{char.role}</div>
                {isSelected && (
                  <span
                    style={{
                      marginTop: 6,
                      backgroundColor: char.themeColor,
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    فعال
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adult Portals Links */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: 20,
          padding: '16px',
        }}
      >
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: '#475569' }}>
          🔒 پرتال‌های ناظران و بزرگسالان:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link
            href="/parent"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 12,
              color: '#1e293b',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>👨‍👩‍👧 پرتال والدین (Parent Lite)</span>
            <span>←</span>
          </Link>
          <Link
            href="/teacher"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 12,
              color: '#1e293b',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>👩‍🏫 پرتال معلم (Teacher Lite)</span>
            <span>←</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
