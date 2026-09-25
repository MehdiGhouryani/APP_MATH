'use client';

import React from 'react';
import { CHARACTERS, toPersianDigits, GradeMeta } from '../lib/persian';

export interface PathNodeItem {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  type: 'COUNT' | 'PATTERN' | 'WONDER_GRID' | 'TALLY' | 'CHECK' | 'CHEST' | 'NEXT_STATION';
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  stars: number;
  offset: number; // -38 (left), 0 (center), +38 (right)
  icon: string;
  textbookMascot?: string; // 🐊 🦁 🐒 🐸
}

interface DuolingoPathProps {
  selectedGrade: GradeMeta;
  activeCharId: string;
  onSelectNode: (node: PathNodeItem) => void;
}

export function DuolingoPath({
  selectedGrade,
  activeCharId,
  onSelectNode,
}: DuolingoPathProps) {
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;

  // Authentic Grade 1 learning nodes directly mapped from the official textbook (صفحات ۷ تا ۳۰)
  const nodes: PathNodeItem[] = [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'بشمار و بگو',
      subtitle: 'شمارش ترتیبی میوه‌ها و اشیاء تا ۵',
      type: 'COUNT',
      status: 'COMPLETED',
      stars: 3,
      offset: 0,
      icon: '🍊',
      textbookMascot: '🐊', // تمساح بشمار و بگو
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'الگویابی شکل‌ها',
      subtitle: 'تناوب رنگ‌ها و قطار دایره‌ها',
      type: 'PATTERN',
      status: 'COMPLETED',
      stars: 3,
      offset: 38,
      icon: '🎨',
      textbookMascot: '🐒', // میمون الگویابی
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'جدول شگفت‌انگیز ۲×۲',
      subtitle: 'سودوکوی هندسی و تفکر منطقی',
      type: 'WONDER_GRID',
      status: 'ACTIVE',
      stars: 0,
      offset: -38,
      icon: '🧩',
      textbookMascot: '🐸', // قورباغه با ابزار کار کن
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'چوب‌خط‌های جادویی',
      subtitle: 'بسته‌های ۵تایی چوب‌خط (صفحه ۳۰)',
      type: 'TALLY',
      status: 'LOCKED',
      stars: 0,
      offset: 0,
      icon: '✏️',
      textbookMascot: '🦁', // شیر بشمار و بنویس
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'سنجش مستقل اول (Check 1)',
      subtitle: 'اثبات تسلط بدون سرنخ',
      type: 'CHECK',
      status: 'LOCKED',
      stars: 0,
      offset: 38,
      icon: '🛡️',
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'صندوق گنجینه دانایی',
      subtitle: 'پاداش فتح نگاره اول',
      type: 'CHEST',
      status: 'LOCKED',
      stars: 0,
      offset: 0,
      icon: '🎁',
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: 'نگاره ۲: خیابان و مدرسه',
      subtitle: 'ایستگاه ۰۲: تناظر یک‌به‌یک و اعداد تا ۱۰',
      type: 'NEXT_STATION',
      status: 'LOCKED',
      stars: 0,
      offset: -38,
      icon: '🏫',
    },
  ];

  return (
    <div style={{ paddingBottom: 36, position: 'relative' }}>
      {/* Unit Header (Persian Warm Indigo & Saffron) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #3b52d4 100%)',
          borderRadius: '0 0 28px 28px',
          padding: '20px 22px 24px',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)',
          position: 'relative',
          marginBottom: 34,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: '#fde047',
                marginBottom: 4,
              }}
            >
              نگاره ۱ از کتاب درسی · ایستگاه ۰۱ از {toPersianDigits(selectedGrade.stationCount)}
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 21, fontWeight: 900, lineHeight: 1.4 }}>
              {selectedGrade.id === 'G1'
                ? 'خانه و صبحانه خانوادگی (شمارش و الگو)'
                : `${selectedGrade.title} — سرفصل‌های اختصاصی`}
            </h2>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85, color: '#e0e7ff' }}>
              آشنایی با شمارش تا ۵، دسته‌های مساوی و جدول شگفت‌انگیز
            </p>
          </div>

          <button
            title="کتابچه راهنمای آموزشی"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '16px',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📘</span>
            <span>راهنما</span>
          </button>
        </div>

        {/* Learning Journey Rhythm Badge */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: 12,
            fontWeight: 700,
            width: 'fit-content',
            color: '#f8fafc',
          }}
        >
          <span>🌱 پیشرفت ایستگاه:</span>
          <span style={{ color: '#fde047', fontWeight: 800 }}>۲ از ۵ مهارت تثبیت‌شده</span>
        </div>
      </div>

      {/* Serpentine Wavy Path */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
          padding: '10px 20px',
        }}
      >
        {/* SVG curved background connecting line */}
        <svg
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            width: '100%',
            height: 'calc(100% - 40px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <path
            d="
              M 200 40
              Q 260 90 238 160
              Q 180 230 162 285
              Q 160 360 200 410
              Q 260 470 238 535
              Q 180 600 200 660
              Q 220 720 162 785
            "
            fill="none"
            stroke="#e2dcce"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="4 8"
          />
        </svg>

        {nodes.map((node) => {
          const isCompleted = node.status === 'COMPLETED';
          const isActive = node.status === 'ACTIVE';
          const isLocked = node.status === 'LOCKED';
          const isChest = node.type === 'CHEST';

          return (
            <div
              key={node.id}
              style={{
                position: 'relative',
                transform: `translateX(${node.offset}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              {/* Active Floating Tooltip */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: -46,
                    backgroundColor: '#3b52d4',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '14px',
                    fontSize: 13,
                    fontWeight: 800,
                    boxShadow: '0 4px 0 #2738a8, 0 8px 18px rgba(59, 82, 212, 0.35)',
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                  }}
                >
                  <span>شروع یادگیری!</span>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #3b52d4',
                    }}
                  />
                </div>
              )}

              {/* Stars above completed node */}
              {isCompleted && (
                <div
                  style={{
                    position: 'absolute',
                    top: -18,
                    display: 'flex',
                    gap: 2,
                    fontSize: 14,
                    zIndex: 15,
                  }}
                >
                  <span>⭐</span>
                  <span style={{ transform: 'translateY(-2px)' }}>⭐</span>
                  <span>⭐</span>
                </div>
              )}

              {/* Stepping Stone Node */}
              <button
                onClick={() => onSelectNode(node)}
                className={`path-stone-node ${
                  isCompleted
                    ? 'path-stone-completed'
                    : isActive
                    ? 'path-stone-active'
                    : isChest
                    ? 'path-stone-chest'
                    : 'path-stone-locked'
                }`}
              >
                {isActive && <div className="active-pulse-ring" />}

                {/* Inside Icon */}
                {isCompleted && <span style={{ fontSize: 32 }}>👑</span>}
                {isActive && <span style={{ fontSize: 32 }}>{node.icon}</span>}
                {isChest && <span style={{ fontSize: 32 }}>🎁</span>}
                {isLocked && !isChest && <span style={{ fontSize: 26 }}>🔒</span>}

                {/* Small textbook mascot badge on bottom-left */}
                {node.textbookMascot && (
                  <div
                    title="نماد فعالیت کتاب درسی"
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: -4,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e2dcce',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    {node.textbookMascot}
                  </div>
                )}
              </button>

              {/* Node Title & Subtitle underneath */}
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 800,
                  color: isLocked ? '#9c978b' : '#1e293b',
                  textAlign: 'center',
                  maxWidth: 130,
                  lineHeight: 1.3,
                }}
              >
                {node.title}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: isLocked ? '#b0aa9e' : '#64748b',
                  textAlign: 'center',
                  maxWidth: 120,
                  marginTop: 2,
                }}
              >
                {node.subtitle}
              </div>

              {/* Aria Companion standing beside active node! */}
              {isActive && (
                <div
                  className="mascot-gentle-float"
                  style={{
                    position: 'absolute',
                    right: -110,
                    top: -12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Little speech bubble */}
                  <div
                    className="math-speech-bubble"
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: activeChar.themeColor,
                      padding: '6px 10px',
                      marginBottom: 6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    بزن بریم آریا!
                  </div>

                  {/* Character Avatar */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: activeChar.avatarBg,
                      border: `3px solid ${activeChar.themeColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
