'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { soundFx } from '../../../lib/sound';
import type { TeacherSessionInfo } from '@math/contracts';

export default function TeacherAreaPage() {
  const router = useRouter();
  const [session, setSession] = useState<TeacherSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/v1/teacher/auth/session');
        if (!res.ok) {
          router.replace('/teacher');
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.session) {
          setSession(data.session);
        } else {
          router.replace('/teacher');
        }
      } catch {
        router.replace('/teacher');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    soundFx.playTap();
    try {
      await fetch('/api/v1/teacher/auth/logout', { method: 'POST' });
      soundFx.playSuccess();
      router.replace('/teacher');
    } catch {
      router.replace('/teacher');
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <main dir="rtl" className="adult-shell" style={{ maxWidth: 680, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#64748b', fontWeight: 600 }}>در حال بررسی احراز هویت معلم...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main dir="rtl" className="adult-shell" style={{ maxWidth: 680, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 18, color: '#991b1b', fontWeight: 800, margin: '0 0 8px' }}>دسترسی غیرمجاز</h2>
          <p style={{ fontSize: 14, color: '#7f1d1d', margin: '0 0 16px' }}>
            برای دسترسی به Teacher Area باید ابتدا با حساب معلم تاییدشده وارد شوید.
          </p>
          <Link
            href="/teacher"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            ورود به بخش معلمان
          </Link>
        </div>
      </main>
    );
  }

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
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Teacher Area
              </h1>
              <span
                style={{
                  fontSize: 11,
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontWeight: 800,
                }}
              >
                تأییدشده ✓
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              فضای اختصاصی معلمان — احراز هویت متصل به بک‌اند و نقش TEACHER
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 10,
            color: '#be123c',
            fontSize: 13,
            fontWeight: 700,
            cursor: logoutLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <span>🚪</span>
          <span>{logoutLoading ? 'در حال خروج...' : 'خروج از حساب'}</span>
        </button>
      </div>

      {/* Verified Teacher Profile Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 16,
          padding: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
          مشخصات حساب معلم تاییدشده
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
          <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>نام و عنوان:</span>
            <strong style={{ color: '#0f172a' }}>{session.displayName || session.username}</strong>
          </div>
          <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>نام کاربری:</span>
            <strong style={{ color: '#0f172a', direction: 'ltr', display: 'inline-block' }}>{session.username}</strong>
          </div>
          <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>شناسه حساب (Account ID):</span>
            <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: 11, direction: 'ltr', display: 'inline-block' }}>
              {session.accountId}
            </strong>
          </div>
          <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>نقش سیستمی در پایگاه داده:</span>
            <strong style={{ color: '#059669' }}>
              {session.roles.join(', ')}
            </strong>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: '10px 12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 8,
            fontSize: 12,
            color: '#065f46',
            lineHeight: 1.6,
          }}
        >
          ✓ <strong>احراز هویت موفق:</strong> سیستم بدون پرسش از کاربر، نقش <code>TEACHER</code> را مستقیماً از روی پایگاه داده تشخیص داده و اجازه دسترسی به این بخش را صادر کرد.
        </div>
      </div>

      {/* Teacher Actions & Quick Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <Link
          href="/teacher/assignments"
          onClick={() => soundFx.playTap()}
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 14,
            padding: 16,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: 28 }}>📋</div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0284c7', margin: '0 0 4px' }}>
              مدیریت تکالیف (Assignments)
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              تخصیص تمرین‌های هدفمند به دانش‌آموزان و کلاس‌ها
            </p>
          </div>
        </Link>

        <Link
          href="/teacher/needs-attention"
          onClick={() => soundFx.playTap()}
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 14,
            padding: 16,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: 28 }}>⚠️</div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#ea580c', margin: '0 0 4px' }}>
              نیازمند توجه (Needs Attention)
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              پایش دانش‌آموزانی که در ایستگاه‌های یادگیری به کمک نیاز دارند
            </p>
          </div>
        </Link>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link
          href="/"
          onClick={() => soundFx.playTap()}
          style={{
            fontSize: 13,
            color: '#64748b',
            textDecoration: 'none',
          }}
        >
          بازگشت به صفحه اصلی برنامه
        </Link>
      </div>
    </main>
  );
}
