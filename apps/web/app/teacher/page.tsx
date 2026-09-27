'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { soundFx } from '../../lib/sound';
import type { TeacherSessionInfo } from '@math/contracts';

interface SubmittedApplicationInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  schoolName: string;
  city: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export default function TeacherLandingPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'HOME' | 'REQUEST_ACCOUNT' | 'LOGIN'>('HOME');
  const [existingSession, setExistingSession] = useState<TeacherSessionInfo | null>(null);

  // Application Form State
  const [appFormData, setAppFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    schoolName: '',
    city: '',
    notes: '',
  });

  // Teacher Login Form State (Username & Password with NO role picker)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<SubmittedApplicationInfo | null>(null);

  // Check if teacher is already authenticated
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch('/api/v1/teacher/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.session) {
            setExistingSession(data.session);
          }
        }
      } catch {
        // Ignore background session check error
      }
    }
    checkExistingSession();
  }, []);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/teacher/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: appFormData.firstName,
          lastName: appFormData.lastName,
          phoneNumber: appFormData.phone,
          schoolName: appFormData.schoolName,
          city: appFormData.city,
          notes: appFormData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در ثبت درخواست');
      }

      soundFx.playSuccess();
      setSubmittedApplication(data.application);
    } catch (err) {
      soundFx.playTryAgain();
      setErrorMessage(err instanceof Error ? err.message : 'خطای ارتباط با سرور. لطفاً مجدداً تلاش نمایید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/teacher/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }

      soundFx.playSuccess();
      // Directly transition to Teacher Area
      router.push('/teacher/area');
    } catch (err) {
      soundFx.playTryAgain();
      setErrorMessage(err instanceof Error ? err.message : 'خطا در ورود به حساب معلم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetApplicationForm = () => {
    setAppFormData({
      firstName: '',
      lastName: '',
      phone: '',
      schoolName: '',
      city: '',
      notes: '',
    });
    setSubmittedApplication(null);
    setErrorMessage(null);
  };

  return (
    <main dir="rtl" className="adult-shell" style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px', minHeight: '100vh' }}>
      {/* Top Bar Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            👩‍🏫
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
              معلمان
            </h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              پرتال معلم (Teacher Lite) — سامانه اختصاصی معلمان، همکاران آموزشی و مدارس
            </p>
          </div>
        </div>

        <Link
          href="/"
          onClick={() => soundFx.playTap()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 10,
            color: '#334155',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <span>←</span>
          <span>بازگشت به برنامه کودک</span>
        </Link>
      </div>

      {/* If already authenticated, show quick jump card */}
      {existingSession && activeView === 'HOME' && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1.5px solid #86efac',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#166534', display: 'block' }}>
              شما با حساب معلم ({existingSession.displayName || existingSession.username}) وارد شده‌اید.
            </span>
            <span style={{ fontSize: 12, color: '#15803d' }}>
              نقش فعال در پایگاه داده: TEACHER
            </span>
          </div>

          <Link
            href="/teacher/area"
            onClick={() => soundFx.playTap()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            ورود به Teacher Area →
          </Link>
        </div>
      )}

      {/* Main Landing View (Two explicit teacher paths) */}
      {activeView === 'HOME' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, margin: '0 0 8px', fontWeight: 600 }}>
              به بخش معلمان خوش آمدید. این فضا به صورت مستقل جهت ارزیابی میزان تسلط، مدیریت تکالیف و پایش پیشرفت تحصیلی دانش‌آموزان در نظر گرفته شده است.
            </p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              لطفاً یکی از مسیرهای زیر را برای ادامه انتخاب فرمایید:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Path 1: درخواست همکاری / درخواست حساب */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  درخواست همکاری / درخواست حساب
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  ثبت مشخصات مدرسه یا مرکز آموزشی جهت بررسی مدارک، دریافت تاییدیه معلم و تخصیص کد کلاس.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  resetApplicationForm();
                  setActiveView('REQUEST_ACCOUNT');
                }}
                style={{
                  marginTop: 18,
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ثبت درخواست حساب معلم
              </button>
            </div>

            {/* Path 2: ورود معلم */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  ورود معلم
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  ورود اختصاصی معلمان با نام کاربری و رمز عبور به Teacher Area (تشخیص خودکار نقش توسط سیستم).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setErrorMessage(null);
                  setActiveView('LOGIN');
                }}
                style={{
                  marginTop: 18,
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ورود به حساب معلمان
              </button>
            </div>
          </div>

          {/* Quick Dev Preview Links for Existing Contract Specs */}
          <div
            style={{
              marginTop: 16,
              padding: '14px 18px',
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
              دسترسی‌های سریع ابزارهای کلاس (محیط آزمایشی):
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                href="/teacher/assignments"
                style={{
                  fontSize: 12,
                  color: '#0284c7',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                📋 تکلیف جدید
              </Link>
              <Link
                href="/teacher/needs-attention"
                style={{
                  fontSize: 12,
                  color: '#ea580c',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                ⚠️ نیازمند توجه
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Path 1 Screen: درخواست همکاری / درخواست حساب */}
      {activeView === 'REQUEST_ACCOUNT' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              📝 فرم درخواست همکاری / درخواست حساب
            </h2>
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setActiveView('HOME');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              بازگشت به منوی معلمان ✕
            </button>
          </div>

          {submittedApplication ? (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: 14,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#166534', margin: '0 0 8px' }}>
                درخواست شما با موفقیت ثبت شد
              </h3>
              
              {/* Status Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: 20,
                  color: '#92400e',
                  fontSize: 12,
                  fontWeight: 800,
                  margin: '8px 0 16px',
                }}
              >
                <span>⏳ وضعیت:</span>
                <span>در انتظار بررسی (PENDING)</span>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  padding: '14px 16px',
                  textAlign: 'right',
                  fontSize: 13,
                  color: '#1e293b',
                  lineHeight: 1.8,
                  marginBottom: 18,
                }}
              >
                <div><strong>کد پیگیری درخواست:</strong> <span style={{ fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>{submittedApplication.id.slice(0, 8).toUpperCase()}</span></div>
                <div><strong>نام متقاضی:</strong> {submittedApplication.firstName} {submittedApplication.lastName}</div>
                <div><strong>مدرسه / مرکز:</strong> {submittedApplication.schoolName} ({submittedApplication.city})</div>
                <div><strong>شماره تماس:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{submittedApplication.phoneNumber}</span></div>
              </div>

              <p style={{ fontSize: 13, color: '#15803d', lineHeight: 1.7, margin: '0 0 20px', fontWeight: 600 }}>
                اطلاعات ثبت‌شده در نوبت بررسی تیم آموزشی قرار گرفت. پس از ارزیابی مدارک و تأیید هویت معلمی، فعال‌سازی حساب از طریق پیامک به شماره همراه شما اطلاع‌رسانی خواهد شد.
              </p>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    resetApplicationForm();
                  }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#ffffff',
                    color: '#166534',
                    border: '1.5px solid #86efac',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ثبت درخواست جدید
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setActiveView('HOME');
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  بازگشت به صفحه معلمان
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: '#1e40af',
                  lineHeight: 1.6,
                }}
              >
                ℹ️ <strong>نکته:</strong> ارسال درخواست به منزله دسترسی فوری نیست. پس از بررسی و احراز صلاحیت توسط تیم آموزشی، حساب اختصاصی شما تایید و فعال خواهد شد.
              </div>

              {errorMessage && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#991b1b',
                    fontWeight: 600,
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    نام: <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مریم"
                    value={appFormData.firstName}
                    onChange={(e) => setAppFormData({ ...appFormData, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    نام خانوادگی: <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: کریمی"
                    value={appFormData.lastName}
                    onChange={(e) => setAppFormData({ ...appFormData, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  شماره تلفن همراه (جهت دریافت پیامک تایید): <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={appFormData.phone}
                  onChange={(e) => setAppFormData({ ...appFormData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 14,
                    direction: 'ltr',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    نام مدرسه / مرکز آموزشی: <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="دبستان شهید بهشتی"
                    value={appFormData.schoolName}
                    onChange={(e) => setAppFormData({ ...appFormData, schoolName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    شهر / منطقه آموزشی: <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="تهران - منطقه ۵"
                    value={appFormData.city}
                    onChange={(e) => setAppFormData({ ...appFormData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  توضیح کوتاه / پایه‌های تدریس (اختیاری):
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: آموزگار پایه اول و دوم با ۱۰ سال سابقه تدریس..."
                  value={appFormData.notes}
                  onChange={(e) => setAppFormData({ ...appFormData, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 13,
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: 6,
                  padding: '13px',
                  backgroundColor: isSubmitting ? '#94a3b8' : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {isSubmitting ? 'در حال ارسال درخواست...' : 'ارسال درخواست همکاری و بررسی حساب'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Path 2 Screen: ورود معلم (Username & Password - NO role picker) */}
      {activeView === 'LOGIN' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🔑 ورود به حساب معلمان
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
                ورود با نام کاربری و رمز عبور اختصاصی معلم (بدون نیاز به انتخاب نقش)
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setActiveView('HOME');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              بازگشت به منوی معلمان ✕
            </button>
          </div>

          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: '#991b1b',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleTeacherLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                نام کاربری: <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="مثال: teacher_zahra یا teacher-dev-01"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 14,
                  direction: 'ltr',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                رمز عبور: <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 14,
                  direction: 'ltr',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: 10,
                padding: '13px',
                backgroundColor: isSubmitting ? '#94a3b8' : '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'در حال احراز هویت...' : 'ورود'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
