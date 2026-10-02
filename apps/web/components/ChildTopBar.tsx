'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GRADES, CHARACTERS, toPersianDigits, GradeMeta } from '../lib/persian';
import { soundFx } from '../lib/sound';
import { DESIGN_TOKENS } from '../lib/theme/tokens';
import { ParentGate } from './ParentGate';
import { CharacterArt } from './CharacterArt';

interface ChildTopBarProps {
  selectedGrade: GradeMeta;
  onSelectGrade: (grade: GradeMeta) => void;
  activeCharId: string;
  onOpenCompanionModal?: () => void;
  onOpenAuthModal?: () => void;
  weeklyActiveDays?: number;
  learningStars?: number;
}

export function ChildTopBar({
  selectedGrade,
  onSelectGrade,
  activeCharId,
  onOpenCompanionModal,
  onOpenAuthModal,
  weeklyActiveDays = 0,
  learningStars = 0,
}: ChildTopBarProps) {
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [teacherGateOpen, setTeacherGateOpen] = useState(false);
  const router = useRouter();
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGradeMenu(false);
        setShowSecondaryMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: DESIGN_TOKENS.colors.neutral.white,
        zIndex: 35,
        borderBottom: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        fontFamily: DESIGN_TOKENS.typography.fonts.body,
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
            background: DESIGN_TOKENS.colors.neutral.cream,
            border: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
            borderRadius: DESIGN_TOKENS.radius.sm,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 13,
            color: DESIGN_TOKENS.colors.neutral.charcoal,
            touchAction: 'manipulation',
            pointerEvents: 'auto',
            fontFamily: DESIGN_TOKENS.typography.fonts.display,
          }}
        >
          <span>🎓</span>
          <span>{selectedGrade.title.replace(' ابتدایی', '')}</span>
          <span style={{ fontSize: 10, color: DESIGN_TOKENS.colors.neutral.slate }}>▼</span>
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
                backgroundColor: DESIGN_TOKENS.colors.neutral.white,
                borderRadius: DESIGN_TOKENS.radius.sm,
                border: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
                boxShadow: DESIGN_TOKENS.shadows.card,
                padding: 8,
                zIndex: 100,
                animation: 'duoSlideUp 0.15s ease-out',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, color: DESIGN_TOKENS.colors.neutral.slate }}>
                انتخاب پایه تحصیلی (۱ تا ۶)
              </div>
              {GRADES.map((g) => {
                const isSelected = g.id === selectedGrade.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    disabled={!g.active}
                    aria-disabled={!g.active}
                    onClick={() => {
                      if (!g.active) return;
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
                      background: isSelected ? DESIGN_TOKENS.colors.brand.primaryLight : 'transparent',
                      color: isSelected ? DESIGN_TOKENS.colors.brand.primary : DESIGN_TOKENS.colors.neutral.charcoal,
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 13,
                      cursor: g.active ? 'pointer' : 'not-allowed',
                      opacity: g.active ? 1 : 0.5,
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
                        <div style={{ fontSize: 10, color: DESIGN_TOKENS.colors.neutral.slate, fontWeight: 500 }}>
                          {g.active ? `${toPersianDigits(g.stationCount)} ایستگاه` : 'به‌زودی'}
                        </div>
                      </div>
                    </div>
                    {g.active && (
                      <span
                        style={{
                          backgroundColor: DESIGN_TOKENS.colors.status.success,
                          color: DESIGN_TOKENS.colors.neutral.white,
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

      {/* Educational Engagement Metrics: Stars, Safe Sync, Auth Gateway, Mascot, Secondary Menu */}
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
            color: DESIGN_TOKENS.colors.status.retry,
            backgroundColor: DESIGN_TOKENS.colors.status.retryLight,
            border: `1px solid ${DESIGN_TOKENS.colors.status.retryBorder}`,
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
            backgroundColor: DESIGN_TOKENS.colors.status.success,
            boxShadow: `0 0 0 2.5px ${DESIGN_TOKENS.colors.status.success}33`,
            flexShrink: 0,
          }}
        />

        {/* Login / Auth Gateway Trigger Button */}
        {onOpenAuthModal && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            title="ورود یا ذخیره حساب کاربری کودک"
            style={{
              background: DESIGN_TOKENS.colors.status.successLight,
              border: `1.5px solid ${DESIGN_TOKENS.colors.status.successBorder}`,
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 800,
              color: DESIGN_TOKENS.colors.status.success,
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
          <CharacterArt id={activeChar.id} bust size={30} reducedMotion />
        </button>

        {/* Quiet Secondary Menu Button for Teachers (منوی کوچک فرعی) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <button
            type="button"
            onClick={() => {
              soundFx.playTap();
              setShowSecondaryMenu(!showSecondaryMenu);
            }}
            title="منوی فرعی تنظیمات و دسترسی‌ها"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: DESIGN_TOKENS.colors.neutral.cream,
              border: `1px solid ${DESIGN_TOKENS.colors.neutral.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: DESIGN_TOKENS.colors.neutral.slate,
              fontSize: 14,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 101,
            }}
          >
            <span>⚙️</span>
          </button>

          {showSecondaryMenu && (
            <>
              <div
                onClick={() => setShowSecondaryMenu(false)}
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
                  left: 0,
                  marginTop: 6,
                  width: 170,
                  backgroundColor: DESIGN_TOKENS.colors.neutral.white,
                  borderRadius: DESIGN_TOKENS.radius.sm,
                  border: `1.5px solid ${DESIGN_TOKENS.colors.neutral.border}`,
                  boxShadow: DESIGN_TOKENS.shadows.card,
                  padding: '6px',
                  zIndex: 102,
                  animation: 'duoSlideUp 0.15s ease-out',
                  pointerEvents: 'auto',
                }}
              >
                <Link
                  href="/teacher"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSecondaryMenu(false);
                    setTeacherGateOpen(true);
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: DESIGN_TOKENS.colors.neutral.charcoal,
                    fontSize: 12,
                    fontWeight: 800,
                    backgroundColor: DESIGN_TOKENS.colors.neutral.cream,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>👩‍🏫</span>
                    <span>معلمان</span>
                  </span>
                  <span style={{ fontSize: 10, color: DESIGN_TOKENS.colors.neutral.slate }}>←</span>
                </Link>
              </div>
            </>
          )}
        </div>
        {teacherGateOpen && (
          <ParentGate
            purpose="پرتال معلمان مخصوص بزرگسالان است. برای ورود، پاسخ سؤال را بنویسید."
            onPass={() => {
              setTeacherGateOpen(false);
              router.push('/teacher');
            }}
            onCancel={() => setTeacherGateOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
