'use client';

import React, { useState } from 'react';
import { GRADES, CHARACTERS, toPersianDigits, GradeMeta } from '../lib/persian';
import { soundFx } from '../lib/sound';

interface DuolingoTopHeaderProps {
  selectedGrade: GradeMeta;
  onSelectGrade: (grade: GradeMeta) => void;
  activeCharId: string;
  onOpenCompanionModal?: () => void;
  onOpenAuthModal?: () => void;
  weeklyActiveDays?: number;
  learningStars?: number;
}

export function DuolingoTopHeader({
  selectedGrade,
  onSelectGrade,
  activeCharId,
  onOpenCompanionModal,
  onOpenAuthModal,
  weeklyActiveDays = 3,
  learningStars = 120,
}: DuolingoTopHeaderProps) {
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        zIndex: 35,
        borderBottom: '2px solid #e5e5e5',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Grade Selector Pill (پایه‌های ۱ تا ۶) */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => {
            soundFx.playTap();
            setShowGradeMenu(!showGradeMenu);
          }}
          style={{
            background: '#f7f7f7',
            border: '2px solid #e5e5e5',
            borderRadius: '14px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 13,
            color: '#3c3c3c',
            touchAction: 'manipulation',
            pointerEvents: 'auto',
          }}
        >
          <span>🎓</span>
          <span>{selectedGrade.title.replace(' ابتدایی', '')}</span>
          <span style={{ fontSize: 10, color: '#777777' }}>▼</span>
        </button>

        {/* Dropdown Menu for Grades 1 to 6 */}
        {showGradeMenu && (
          <>
            <div
              onClick={() => setShowGradeMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 90,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                width: 240,
                backgroundColor: '#ffffff',
                borderRadius: 16,
                border: '2px solid #e5e5e5',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: 8,
                zIndex: 100,
                animation: 'duoSlideUp 0.15s ease-out',
                pointerEvents: 'auto',
              }}
            >
            <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, color: '#777' }}>
              انتخاب پایه تحصیلی (۱ تا ۶)
            </div>
            {GRADES.map((g) => {
              const isSelected = g.id === selectedGrade.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    onSelectGrade(g);
                    setShowGradeMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: 'none',
                    background: isSelected ? '#ddf4ff' : 'transparent',
                    color: isSelected ? '#1899d6' : '#3c3c3c',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    touchAction: 'manipulation',
                    pointerEvents: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{g.id === 'G1' ? '🌟' : '📘'}</span>
                    <div>
                      <div>{g.title}</div>
                      <div style={{ fontSize: 10, color: '#777', fontWeight: 500 }}>
                        {toPersianDigits(g.stationCount)} ایستگاه
                      </div>
                    </div>
                  </div>
                  {g.active && (
                    <span
                      style={{
                        backgroundColor: '#58cc02',
                        color: '#fff',
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 6,
                      }}
                    >
                      فعال
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          </>
        )}
      </div>

      {/* Educational Engagement Metrics: Stars, Safe Sync, Auth Gateway, Mascot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Knowledge Stars (ستاره‌های دانایی حاصل از تسلط آموزشی) */}
        <div
          title="ستاره‌های دانایی حاصل از حل مسائل"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 800,
            fontSize: 13,
            color: '#b45309',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '4px 8px',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 15 }}>⭐</span>
          <span>{toPersianDigits(learningStars)}</span>
        </div>

        {/* Offline / Online Sync Status Pill */}
        <div
          title="وضعیت اتصال شبکه و همگام‌سازی محلی"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 0 2.5px rgba(34, 197, 94, 0.2)',
            flexShrink: 0,
          }}
        />

        {/* Login / Auth Gateway Trigger Button */}
        {onOpenAuthModal && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            title="ورود یا ثبت‌نام حساب کاربری"
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '12px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 800,
              color: '#166534',
              cursor: 'pointer',
              touchAction: 'manipulation',
              pointerEvents: 'auto',
            }}
          >
            <span>📱</span>
            <span>ورود</span>
          </button>
        )}

        {/* Active Mascot Avatar */}
        <button
          type="button"
          onClick={onOpenCompanionModal}
          title={`همراه یادگیری: ${activeChar.name} (${activeChar.role})`}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: activeChar.avatarBg,
            border: `2px solid ${activeChar.themeColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            boxShadow: `0 2px 8px ${activeChar.themeColor}30`,
            touchAction: 'manipulation',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: 18 }}>
            {activeChar.id === 'aria'
              ? '🐲'
              : activeChar.id === 'qbo'
              ? '🤖'
              : activeChar.id === 'jiko'
              ? '🐦'
              : '🐿️'}
          </span>
        </button>
      </div>
    </div>
  );
}
