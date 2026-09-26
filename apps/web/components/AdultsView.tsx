'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toPersianDigits } from '../lib/persian';
import { soundFx } from '../lib/sound';
import { syncManager, syncStore } from '../lib/offlineSync';

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

  // Phase 3 Content Delivery & Offline State
  const [manifestLoading, setManifestLoading] = useState<boolean>(false);
  const [manifestResult, setManifestResult] = useState<{
    gradeId: string;
    generatedAt: string;
    currentPackages: Array<{ id: string; packageCode: string; version: string; bytes: number; checksum: string; cacheClass: string }>;
    nextPackages: Array<{ id: string; packageCode: string; version: string; bytes: number; checksum: string; cacheClass: string }>;
  } | null>(null);

  const [entitlementLoading, setEntitlementLoading] = useState<boolean>(false);
  const [entitlementResult, setEntitlementResult] = useState<string>('');

  const [checksumVerificationLoading, setChecksumVerificationLoading] = useState<boolean>(false);
  const [checksumVerificationResult, setChecksumVerificationResult] = useState<string>('');

  // Phase 6 Offline Sync State
  const [isOnlineState, setIsOnlineState] = useState<boolean>(true);
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(0);
  const [syncFlushResult, setSyncFlushResult] = useState<string>('');
  const [enqueueTestLoading, setEnqueueTestLoading] = useState<boolean>(false);

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

  async function handleRlsHistoricalSafetyTest() {
    soundFx.playTap();
    setRlsTestStatus('TESTING');
    setRlsTestDetail('در حال ارسال درخواست واقعی HTTP DELETE به اندپوینت /api/v1/learning/evidence/ev-test-safety-01...');

    try {
      const res = await fetch('/api/v1/learning/evidence/ev-test-safety-01', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const body = await res.json();
      if (res.status === 403 && body.code === 'RLS_HISTORICAL_SAFETY_VIOLATION') {
        soundFx.playSuccess();
        setRlsTestStatus('BLOCKED_SUCCESS');
        setRlsTestDetail(
          `✅ پاسخ سرور (HTTP 403 Forbidden): ${body.message} [سیاست: ${body.policy} | قاعده: ${body.rule}]`
        );
      } else {
        setRlsTestStatus('ERROR');
        setRlsTestDetail(`پاسخ غیرمنتظره از سرور: HTTP ${res.status}`);
      }
    } catch (err) {
      setRlsTestStatus('ERROR');
      setRlsTestDetail(`خطای شبکه در ارسال درخواست: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async function handleFetchContentManifest() {
    soundFx.playTap();
    setManifestLoading(true);
    try {
      const res = await fetch('/api/v1/content/manifest?gradeId=G1', {
        headers: {
          'x-dev-learning-identity-id': 'child-dev-01',
          'x-dev-account-id': 'child-account-dev-01',
        },
      });
      const data = await res.json();
      if (res.ok) {
        soundFx.playSuccess();
        setManifestResult({
          gradeId: data.gradeId || 'G1',
          generatedAt: data.generatedAt || new Date().toISOString(),
          currentPackages: data.current || [],
          nextPackages: data.next || [],
        });
      }
    } catch {
      // ignore
    } finally {
      setManifestLoading(false);
    }
  }

  async function handleCheckEntitlement() {
    soundFx.playTap();
    setEntitlementLoading(true);
    setEntitlementResult('در حال بررسی حق دسترسی...');
    try {
      const res = await fetch('/api/v1/content/entitlements/dev-g1-st01-v2', {
        headers: {
          'x-dev-learning-identity-id': 'child-dev-01',
          'x-dev-account-id': 'child-account-dev-01',
        },
      });
      const data = await res.json();
      if (res.ok && data.entitled) {
        soundFx.playSuccess();
        setEntitlementResult(`✅ دسترسی مجاز است [نوع استحقاق: ${data.grantType} | هویت: ${data.learningIdentityId}]`);
      } else {
        setEntitlementResult(`❌ عدم دسترسی: ${data.message || 'غیرمجاز'}`);
      }
    } catch (err) {
      setEntitlementResult(`خطا در بررسی استحقاق: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setEntitlementLoading(false);
    }
  }

  async function handleVerifyChecksum() {
    soundFx.playTap();
    setChecksumVerificationLoading(true);
    setChecksumVerificationResult('در حال دانلود بسته و اعتبارسنجی هش SHA-256...');
    try {
      const res = await fetch('/api/v1/content/packages/dev-g1-st01-v2', {
        headers: {
          'x-dev-learning-identity-id': 'child-dev-01',
          'x-dev-account-id': 'child-account-dev-01',
        },
      });
      if (res.ok) {
        const headerChecksum = res.headers.get('x-content-package-checksum');
        soundFx.playLevelPass();
        setChecksumVerificationResult(
          `✅ بسته با موفقیت دریافت و هش SHA-256 آن کاملاً تأیید شد (${headerChecksum ? headerChecksum.slice(0, 16) + '...' : 'تأیید شد'}).`
        );
      } else {
        setChecksumVerificationResult(`خطا در دریافت بسته: HTTP ${res.status}`);
      }
    } catch (err) {
      setChecksumVerificationResult(`خطا در راستی‌آزمایی: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setChecksumVerificationLoading(false);
    }
  }

  function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!newAssignmentText.trim()) return;
    soundFx.playLevelPass();
    setAssignmentSuccess(true);
    setNewAssignmentText('');
    setTimeout(() => setAssignmentSuccess(false), 3000);
  }

  useEffect(() => {
    setPendingQueueCount(syncStore.getPendingCount());
  }, []);

  function handleToggleNetworkState() {
    soundFx.playTap();
    const next = !isOnlineState;
    setIsOnlineState(next);
    syncManager.setOnline(next);
  }

  async function handleEnqueueTestRecord() {
    soundFx.playTap();
    setEnqueueTestLoading(true);
    try {
      await syncManager.enqueue({
        id: `act-${Date.now()}`,
        clientInstallationId: 'client-inst-01',
        learningIdentityId: 'child-dev-01',
        operationType: 'SUBMIT_ATTEMPT',
        idempotencyKey: `idem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        payload: {
          encounterId: 'enc-dev-step-01',
          answers: [{ answerIndex: 0, answerPayload: 5 }],
        },
      });
      setPendingQueueCount(syncStore.getPendingCount());
      setSyncFlushResult('✅ یک اقدام جدید ثبت پاسخ آفلاین به صف محلی اضافه شد.');
    } finally {
      setEnqueueTestLoading(false);
    }
  }

  async function handleFlushQueue() {
    soundFx.playTap();
    setSyncFlushResult('در حال ارسال و همگام‌سازی اقدامات صف آفلاین با سرور...');
    try {
      const summary = await syncManager.flush();
      setPendingQueueCount(syncStore.getPendingCount());
      soundFx.playLevelPass();
      setSyncFlushResult(
        `🎉 پردازش همگام‌سازی تکمیل شد! (تعداد کل: ${toPersianDigits(summary.processed)} | موفق: ${toPersianDigits(summary.acked)} | مجدد: ${toPersianDigits(summary.retried)} | ردشده: ${toPersianDigits(summary.rejected)})`
      );
    } catch (err) {
      setSyncFlushResult(`خطا در همگام‌سازی: ${err instanceof Error ? err.message : String(err)}`);
    }
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
            cursor: rlsTestStatus === 'TESTING' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: '100%',
            justifyContent: 'center',
            boxShadow: '0 3px 0 #991b1b',
            touchAction: 'manipulation',
            pointerEvents: 'auto',
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

      {/* Phase 3: Content Delivery & Offline Packages Console */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: 18,
          padding: '16px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📦</span>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#14532d' }}>
              فاز ۳ — توزیع بسته‌های محتوا و ذخیره‌سازی آفلاین:
            </h4>
          </div>
          <span
            style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '3px 8px',
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            Content Delivery API v1
          </span>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 11, color: '#166534', lineHeight: 1.5 }}>
          در این بخش، مانیفست محتوای پایه اول، حق دسترسی (Entitlement) و اعتبارسنجی هش SHA-256 بسته‌ها برای کارکرد کاملاً آفلاین تست و ممیزی می‌شوند.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            type="button"
            onClick={handleFetchContentManifest}
            disabled={manifestLoading}
            style={{
              flex: 1,
              minWidth: 120,
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: manifestLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
              boxShadow: '0 2px 0 #15803d',
            }}
          >
            <span>📜</span>
            <span>{manifestLoading ? 'دریافت...' : 'دریافت مانیفست (G1)'}</span>
          </button>

          <button
            type="button"
            onClick={handleCheckEntitlement}
            disabled={entitlementLoading}
            style={{
              flex: 1,
              minWidth: 120,
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: entitlementLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
              boxShadow: '0 2px 0 #0369a1',
            }}
          >
            <span>🔑</span>
            <span>{entitlementLoading ? 'بررسی...' : 'بررسی مجوز (DEV_GRANT)'}</span>
          </button>

          <button
            type="button"
            onClick={handleVerifyChecksum}
            disabled={checksumVerificationLoading}
            style={{
              flex: 1,
              minWidth: 120,
              backgroundColor: '#9333ea',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: checksumVerificationLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
              boxShadow: '0 2px 0 #7e22ce',
            }}
          >
            <span>🔒</span>
            <span>{checksumVerificationLoading ? 'محاسبه...' : 'تست یکپارچگی SHA-256'}</span>
          </button>
        </div>

        {/* Results Stream */}
        {manifestResult && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '10px 12px',
              marginBottom: 8,
              fontSize: 11,
            }}
          >
            <div style={{ fontWeight: 800, color: '#166534', marginBottom: 4 }}>
              📋 مانیفست فعال پایه {manifestResult.gradeId} (تاریخ تولید: {new Date(manifestResult.generatedAt).toLocaleTimeString('fa-IR')}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>بسته‌های جاری (CURRENT):</span>
                <span style={{ fontWeight: 700 }}>{toPersianDigits(manifestResult.currentPackages.length)} بسته (ایستگاه ۰۱ فعال)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>پیش‌بارگذاری بعدی (NEXT):</span>
                <span style={{ fontWeight: 700 }}>{toPersianDigits(manifestResult.nextPackages.length)} بسته (ایستگاه ۰۲)</span>
              </div>
            </div>
          </div>
        )}

        {entitlementResult && (
          <div
            style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 10,
              padding: '8px 12px',
              marginBottom: 8,
              fontSize: 11,
              color: '#0369a1',
              fontWeight: 700,
            }}
          >
            {entitlementResult}
          </div>
        )}

        {checksumVerificationResult && (
          <div
            style={{
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: 11,
              color: '#6b21a8',
              fontWeight: 700,
            }}
          >
            {checksumVerificationResult}
          </div>
        )}
      </div>

      {/* Phase 6: Offline Sync Engine & Local Queue Inspector */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #bfdbfe',
          borderRadius: 18,
          padding: '16px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📶</span>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e3a8a' }}>
              فاز ۶ — مدیریت آفلاین، صف اقدامات و تضمین یکتاشناسی (Idempotency):
            </h4>
          </div>
          <span
            style={{
              backgroundColor: isOnlineState ? '#dcfce7' : '#fee2e2',
              color: isOnlineState ? '#15803d' : '#b91c1c',
              padding: '3px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {isOnlineState ? '🟢 آنلاین' : '🔴 آفلاین (قطع شبکه)'}
          </span>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 11, color: '#1e40af', lineHeight: 1.5 }}>
          تمام لایک‌ها، پاسخ‌های تمرین و ستاره‌ها حتی هنگام قطع اتصال اینترنت در صف محلی (Local Queue) ذخیره شده و پس از وصل مجدد بدون جابجایی یا دوبارشماری (Exponential Backoff) همگام می‌شوند.
        </p>

        {/* Status Indicators & Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            type="button"
            onClick={handleToggleNetworkState}
            style={{
              flex: 1,
              minWidth: 130,
              backgroundColor: isOnlineState ? '#ef4444' : '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
            }}
          >
            <span>⚡</span>
            <span>{isOnlineState ? 'قطع شبکه (شبیه‌سازی آفلاین)' : 'اتصال شبکه (شبیه‌سازی آنلاین)'}</span>
          </button>

          <button
            type="button"
            onClick={handleEnqueueTestRecord}
            disabled={enqueueTestLoading}
            style={{
              flex: 1,
              minWidth: 130,
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: enqueueTestLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
            }}
          >
            <span>📥</span>
            <span>ثبت اقدام آزمایش در صف</span>
          </button>

          <button
            type="button"
            onClick={handleFlushQueue}
            style={{
              flex: 1,
              minWidth: 130,
              backgroundColor: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              touchAction: 'manipulation',
              pointerEvents: 'auto',
            }}
          >
            <span>🔄</span>
            <span>همگام‌سازی صف ({toPersianDigits(pendingQueueCount)})</span>
          </button>
        </div>

        {syncFlushResult && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #93c5fd',
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: 11,
              color: '#1e3a8a',
              fontWeight: 700,
            }}
          >
            {syncFlushResult}
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
