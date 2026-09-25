'use client';

import React, { useState } from 'react';
import { CHARACTERS, toPersianDigits, GradeMeta } from '../lib/persian';
import { soundFx } from '../lib/sound';

export interface PathNodeItem {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  type: 'COUNT' | 'PATTERN' | 'WONDER_GRID' | 'TALLY' | 'SYMMETRY' | 'SCALE' | 'CHECK' | 'CHEST';
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  stars: number;
  offset: number; // -38 (left), 0 (center), +38 (right)
  icon: string;
  textbookMascot?: string; // 🐊 🦁 🐒 🐸
}

interface DuolingoPathProps {
  selectedGrade: GradeMeta;
  activeCharId: string;
  completedNodeIds: string[];
  onSelectNode: (node: PathNodeItem) => void;
}

const RAW_NODES: Omit<PathNodeItem, 'status' | 'stars'>[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'بشمار و بگو',
    subtitle: 'شمارش ترتیبی میوه‌ها و اشیاء تا ۵',
    type: 'COUNT',
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
    offset: 0,
    icon: '✏️',
    textbookMascot: '🦁', // شیر بشمار و بنویس
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'آینه تقارن و خط‌کش',
    subtitle: 'کشف نیمه قرینه شکل‌ها (صفحه ۴۲)',
    type: 'SYMMETRY',
    offset: 38,
    icon: '🪞',
    textbookMascot: '🐸',
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'ترازوی مقایسه دسته‌ها',
    subtitle: 'کمتر، بیشتر و مساوی (صفحه ۷۶)',
    type: 'SCALE',
    offset: -38,
    icon: '⚖️',
    textbookMascot: '🦁',
  },
  {
    id: 'step-7',
    stepNumber: 7,
    title: 'سنجش مستقل اول (Check 1)',
    subtitle: 'اثبات تسلط بدون سرنخ',
    type: 'CHECK',
    offset: 38,
    icon: '🛡️',
  },
  {
    id: 'step-8',
    stepNumber: 8,
    title: 'صندوق گنجینه دانایی',
    subtitle: 'پاداش فتح نگاره اول',
    type: 'CHEST',
    offset: 0,
    icon: '🎁',
  },
];

export function DuolingoPath({
  selectedGrade,
  activeCharId,
  completedNodeIds,
  onSelectNode,
}: DuolingoPathProps) {
  const activeChar = CHARACTERS[activeCharId] ?? CHARACTERS['aria']!;
  const [lockedNoticeId, setLockedNoticeId] = useState<string | null>(null);

  // Compute status for each node dynamically based on completedNodeIds
  let firstUncompletedFound = false;
  const nodes: PathNodeItem[] = RAW_NODES.map((raw) => {
    const isCompleted = completedNodeIds.includes(raw.id);
    let status: 'COMPLETED' | 'ACTIVE' | 'LOCKED' = 'LOCKED';
    let stars = 0;

    if (isCompleted) {
      status = 'COMPLETED';
      stars = 3;
    } else if (!firstUncompletedFound) {
      status = 'ACTIVE';
      stars = 0;
      firstUncompletedFound = true;
    } else {
      status = 'LOCKED';
      stars = 0;
    }

    return {
      ...raw,
      status,
      stars,
    };
  });

  const completedCount = nodes.filter((n) => n.status === 'COMPLETED').length;

  function handleNodeClick(node: PathNodeItem) {
    if (node.status === 'LOCKED') {
      soundFx.playTryAgain();
      setLockedNoticeId(node.id);
      setTimeout(() => setLockedNoticeId(null), 2000);
      return;
    }
    soundFx.playTap();
    onSelectNode(node);
  }

  return (
    <div style={{ paddingBottom: 40, position: 'relative', width: '100%' }}>
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
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, lineHeight: 1.4 }}>
              {selectedGrade.id === 'G1'
                ? 'خانه و صبحانه خانوادگی (شمارش و الگو)'
                : `${selectedGrade.title} — سرفصل‌های اختصاصی`}
            </h2>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85, color: '#e0e7ff' }}>
              آشنایی با شمارش تا ۵، دسته‌های مساوی و جدول شگفت‌انگیز
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '16px',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📘</span>
            <span>راهنما</span>
          </div>
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
          <span style={{ color: '#fde047', fontWeight: 800 }}>
            {toPersianDigits(completedCount)} از {toPersianDigits(nodes.length)} مرحله تکمیل‌شده
          </span>
        </div>
      </div>

      {/* Serpentine Wavy Path */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 46,
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
          const isLockedNotice = lockedNoticeId === node.id;

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
                    animation: 'bounceIn 0.3s ease-out',
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

              {/* Locked Notice Tooltip */}
              {isLockedNotice && (
                <div
                  style={{
                    position: 'absolute',
                    top: -50,
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: 11,
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
                    whiteSpace: 'nowrap',
                    zIndex: 25,
                  }}
                >
                  🔒 ابتدا مرحله قبل را کامل کن!
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
                type="button"
                onClick={() => handleNodeClick(node)}
                className={`path-stone-node ${
                  isCompleted
                    ? 'path-stone-completed'
                    : isActive
                    ? 'path-stone-active'
                    : isChest
                    ? 'path-stone-chest'
                    : 'path-stone-locked'
                }`}
                style={{
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
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

              {/* Companion standing beside ONLY the single ACTIVE node! */}
              {isActive && (
                <div
                  className="mascot-gentle-float"
                  style={{
                    position: 'absolute',
                    right: -105,
                    top: -12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    zIndex: 12,
                  }}
                >
                  {/* Little speech bubble */}
                  <div
                    className="math-speech-bubble"
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: activeChar.themeColor,
                      padding: '5px 9px',
                      marginBottom: 6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    بزن بریم {activeChar.name}!
                  </div>

                  {/* Character Avatar */}
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      backgroundColor: activeChar.avatarBg,
                      border: `3px solid ${activeChar.themeColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
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
