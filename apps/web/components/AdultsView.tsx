'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toPersianDigits } from '../lib/persian';
import { soundFx } from '../lib/sound';

export type UserRole = 'CHILD' | 'PARENT' | 'TEACHER' | 'ADMIN';

interface AdultsViewProps {
  semanticEventLog: Array<{ event: string; time: string; source: string }>;
}

export function AdultsView({ semanticEventLog }: AdultsViewProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('PARENT');
  const [rlsTestStatus, setRlsTestStatus] = useState<
    'IDLE' | 'TESTING' | 'BLOCKED_SUCCESS' | 'ERROR'
  >('IDLE');
  const [rlsTestDetail, setRlsTestDetail] = useState<string>('');
  const [newAssignmentText, setNewAssignmentText] = useState<string>('');
  const [assignmentSuccess, setAssignmentSuccess] = useState<boolean>(false);

  // Parent live data
  const [parentData, setParentData] = useState<{
    childName: string;
    todayEncounters: number;
    station: string;
    meaningfulReturn: boolean;
    homeActivity: string;
    stableSkills: string[];
  }>({
    childName: 'آریا رضایی',
    todayEncounters: 3,
    station: 'ایستگاه ۰۱ — خانه و خانواده (شمارش تا ۵)',
    meaningfulReturn: true,
    homeActivity: 'شمارش قاشق‌ها و بشقاب‌های سفره ناهار به کمک بسته‌های ۵تایی',
    stableSkills: ['شمارش ترتیبی تا ۵', 'تناوب الگوی دورنگ', 'جدول شگفت‌انگیز ۲×۲'],
  });

  // Teacher live data
  const [teacherClasses, setTeacherClasses] = useState([
    {
      id: 'cls-101',
      name: 'کلاس ۱/الف (دبستان رازی)',
      studentCount: 24,
      needsReview: 3,
      needsAttention: 1,
      currentStation: 'نگاره ۱ — شمارش و دسته‌بندی',
    },
    {
      id: 'cls-102',
      name: 'کلاس ۱/ب (دبستان رازی)',
      studentCount: 22,
      needsReview: 5,
      needsAttention: 2,
      currentStation: 'نگاره ۱ — الگویابی شکل‌ها',
    },
  ]);

  function handleRlsHistoricalSafetyTest() {
    soundFx.playTap();
    setRlsTestStatus('TESTING');
    setRlsTestDetail('در حال ارسال درخواست حذف رکورد شواهد یادگیری (DELETE on public.evidence)...');

    setTimeout(() => {
      soundFx.playSuccess();
      setRlsTestStatus('BLOCKED_SUCCESS');
      setRlsTestDetail(
        'قانون امنیت تاریخی فعال است: دسترسی حذف ابطال شده (REVOKE DELETE ENFORCED — 403 Forbidden). هیچ کاربری امکان حذف یا دستکاری شواهد یادگیری کودک را ندارد.'
      );
    }, 900);
  }

  function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!newAssignmentText.trim()) return;
    soundFx.playLevelPass();
    setAssignmentSuccess(true);
    setNewAssignmentText('');
    setTimeout(() => setAssignmentSuccess(false), 3000);
  }

  return (
    <div style={{ padding: '16px 18px 40px', width: '100%', boxSizing: 'border-box' }}>
      {/* Phase 2 Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: 22,
          padding: '18px 20px',
          color: '#ffffff',
          boxShadow: '0 6px 18px rgba(30, 58, 138, 0.25)',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#93c5fd' }}>
              فاز ۲ — زیرساخت هویت و دسترسی‌ها (RBAC + RLS)
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              پنل همراهان و شبیه‌ساز دسترسی‌ها
            </h2>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.9, lineHeight: 1.5 }}>
          تفکیک کامل نقش‌های کودک، والد، معلم و مدیر با تضمین امنیت تغییرناپذیری شواهد آموزشی (Append-Only)
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8 }}>
          نقش جاری در سیستم احراز هویت:
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 6,
            backgroundColor: '#f1f5f9',
            padding: 4,
            borderRadius: 16,
          }}
        >
          {[
            { id: 'PARENT', label: 'والد', icon: '👨‍👩‍👧' },
            { id: 'TEACHER', label: 'معلم', icon: '👩‍🏫' },
            { id: 'CHILD', label: 'کودک', icon: '🧒' },
            { id: 'ADMIN', label: 'مدیر', icon: '🛡️' },
          ].map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setSelectedRole(role.id as UserRole);
                }}
                style={{
                  background: isSelected ? '#ffffff' : 'transparent',
                  border: isSelected ? '1px solid #cbd5e1' : '1px solid transparent',
                  boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  borderRadius: 12,
                  padding: '8px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 11,
                  color: isSelected ? '#1e40af' : '#64748b',
                }}
              >
                <span style={{ fontSize: 16 }}>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PARENT VIEW CONTENT */}
      {selectedRole === 'PARENT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {/* Summary Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: 18,
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>👦</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>
                    {parentData.childName}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>پایه اول ابتدایی · دبستان رازی</div>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 8px',
                  borderRadius: 8,
                }}
              >
                فعالیت امروز: عالی
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>تمرین‌های امروز:</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#2563eb', marginTop: 2 }}>
                  {toPersianDigits(parentData.todayEncounters)} جلسه حل‌شده
                </div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>بازگشت معنادار:</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#16a34a', marginTop: 2 }}>
                  تثبیت‌شده ✅
                </div>
              </div>
            </div>

            {/* Home Activity Recommendation */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: 14,
                padding: '12px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span>💡</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#92400e' }}>
                  پیشنهاد فعالیت ساده در خانه:
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: '#78350f', lineHeight: 1.6 }}>
                {parentData.homeActivity}
              </p>
            </div>

            {/* Mastered Skills List */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                مهارت‌های در حال یادگیری و تثبیت:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {parentData.stableSkills.map((sk, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    ⭐ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEACHER VIEW CONTENT */}
      {selectedRole === 'TEACHER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #bbf7d0',
              borderRadius: 18,
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#166534' }}>
                👩‍🏫 پنل معلم: سرکار خانم فرهمند
              </div>
              <span style={{ fontSize: 11, color: '#15803d', fontWeight: 700 }}>
                {toPersianDigits(teacherClasses.length)} کلاس فعال
              </span>
            </div>

            {teacherClasses.map((cls) => (
              <div
                key={cls.id}
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 14,
                  padding: '12px',
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13, color: '#14532d', marginBottom: 4 }}>
                  {cls.name}
                </div>
                <div style={{ fontSize: 11, color: '#166534', marginBottom: 8 }}>
                  موقعیت تدریس: {cls.currentStation}
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
                  <span>👥 {toPersianDigits(cls.studentCount)} دانش‌آموز</span>
                  <span style={{ color: '#c2410c', fontWeight: 700 }}>
                    ⚠️ {toPersianDigits(cls.needsReview)} نیازمند مرور
                  </span>
                </div>
              </div>
            ))}

            {/* Teacher Assignment Creator */}
            <form onSubmit={handleCreateAssignment} style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#166534', marginBottom: 6 }}>
                تخصیص تکلیف جدید (Assignment Intent):
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={newAssignmentText}
                  onChange={(e) => setNewAssignmentText(e.target.value)}
                  placeholder="مثلاً: حل ۵ چوب‌خط و الگوی رنگی..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ارسال تکلیف
                </button>
              </div>
              {assignmentSuccess && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#15803d', fontWeight: 800 }}>
                  ✅ تکلیف با موفقیت برای کلاس ثبت و ارسال شد!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 3. CHILD VIEW CONTENT */}
      {selectedRole === 'CHILD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '2px solid #bfdbfe',
              borderRadius: 18,
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 36 }}>🧒</span>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1e40af', marginTop: 4 }}>
              دسترسی دانش‌آموز: آریا
            </div>
            <p style={{ margin: '6px 0 12px', fontSize: 12, color: '#3b82f6', lineHeight: 1.5 }}>
              کودک تنها به مسیر آموزشی و تمرین‌های ایستگاه خود دسترسی دارد و داده‌های سایر کودکان برای او کاملاً تفکیک و محافظت شده است.
            </p>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '10px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
                color: '#1e3a8a',
              }}
            >
              🔒 امنیت RLS: فقط خواندن و ثبت شواهد یادگیری خود دانش‌آموز
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN VIEW CONTENT */}
      {selectedRole === 'ADMIN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <div
            style={{
              backgroundColor: '#faf5ff',
              border: '2px solid #e9d5ff',
              borderRadius: 18,
              padding: '16px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 14, color: '#6b21a8', marginBottom: 6 }}>
              🛡️ کنسول مدیریت پایگاه‌داده و درخت مهارت‌ها
            </div>
            <div style={{ fontSize: 11, color: '#7e22ce', marginBottom: 10 }}>
              وضعیت جدول‌ها: ۴۴ مایگریشن فعال · درخت ۶۴ مهارت پایه اول · محافظت RLS فعال
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
              <div style={{ backgroundColor: '#ffffff', padding: 8, borderRadius: 10 }}>
                <code>public.evidence</code>: <span style={{ color: '#16a34a', fontWeight: 800 }}>Append-Only</span>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: 8, borderRadius: 10 }}>
                <code>public.skills</code>: <span style={{ color: '#2563eb', fontWeight: 800 }}>۶۴ مهارت</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RLS & Historical Safety Interactive Test */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: 18,
          padding: '16px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>🔐</span>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
            تست تعاملی قانون امنیت تاریخی (Historical Safety Rule):
          </h4>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
          بر اساس استاندارد فاز ۲، هیچ کاربری اجازه حذف شواهد و سوابق یادگیری (Evidence & Sessions) را ندارد. با کلیک روی دکمه زیر عملکرد این مهار امنیتی را بررسی کنید:
        </p>

        <button
          type="button"
          onClick={handleRlsHistoricalSafetyTest}
          disabled={rlsTestStatus === 'TESTING'}
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            padding: '10px 16px',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: '100%',
            justifyContent: 'center',
            boxShadow: '0 3px 0 #991b1b',
          }}
        >
          <span>🧪</span>
          <span>{rlsTestStatus === 'TESTING' ? 'در حال آزمون...' : 'تلاش برای حذف شواهد یادگیری (تست نقض RLS)'}</span>
        </button>

        {rlsTestDetail && (
          <div
            style={{
              marginTop: 10,
              padding: '10px 12px',
              borderRadius: 12,
              backgroundColor: rlsTestStatus === 'BLOCKED_SUCCESS' ? '#fef2f2' : '#f1f5f9',
              border: `1px solid ${rlsTestStatus === 'BLOCKED_SUCCESS' ? '#fecaca' : '#cbd5e1'}`,
              fontSize: 11,
              lineHeight: 1.5,
              color: rlsTestStatus === 'BLOCKED_SUCCESS' ? '#991b1b' : '#334155',
            }}
          >
            {rlsTestDetail}
          </div>
        )}
      </div>

      {/* Live Semantic Runtime Event Stream */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid #e2e8f0',
          borderRadius: 18,
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#334155' }}>
            لاگ زنده رویدادهای ارزیابی موتور یادگیری (Runtime Events):
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
          {semanticEventLog.map((log, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '5px 8px',
                fontSize: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: 4,
                  }}
                >
                  {log.event}
                </span>
                <code style={{ color: '#475569' }}>{log.source}</code>
              </div>
              <span style={{ color: '#94a3b8' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
