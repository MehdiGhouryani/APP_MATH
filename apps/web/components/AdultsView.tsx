'use client';

import React from 'react';
import Link from 'next/link';

interface AdultsViewProps {
  semanticEventLog: Array<{ event: string; time: string; source: string }>;
}

export function AdultsView({ semanticEventLog }: AdultsViewProps) {
  return (
    <div style={{ padding: '16px 20px 40px' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#3b82f6',
          borderRadius: 24,
          padding: '20px',
          color: '#ffffff',
          boxShadow: '0 6px 0 #1d4ed8',
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 4 }}>👨‍👩‍👧</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900 }}>
          بخش همراهان بزرگسال (والدین و معلمان)
        </h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
          مشاهده مستقل پیشرفت تحصیلی کودک، ثبت تکالیف و تحلیل داده‌های شناختی
        </p>
      </div>

      {/* Direct Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <Link
          href="/parent"
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #bfdbfe',
            boxShadow: '0 4px 0 #bfdbfe',
            borderRadius: 20,
            padding: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>👨‍👩‍👧</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#1e40af' }}>
                ورود به پرتال والدین (Parent Lite)
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                خلاصه فعالیت امروز، مهارت‌های فعال و پیشنهادهای خانگی
              </div>
            </div>
          </div>
          <span style={{ fontSize: 18, color: '#2563eb' }}>←</span>
        </Link>

        <Link
          href="/teacher"
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #bbf7d0',
            boxShadow: '0 4px 0 #bbf7d0',
            borderRadius: 20,
            padding: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>👩‍🏫</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#166534' }}>
                ورود به پنل معلم (Teacher Lite)
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                وضعیت دانش‌آموزان کلاس، تعیین تکلیف و درخواست بازبینی
              </div>
            </div>
          </div>
          <span style={{ fontSize: 18, color: '#16a34a' }}>←</span>
        </Link>
      </div>

      {/* Live Semantic Monitor (From ADR 0002 & ADR 0003) */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: 20,
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>🧠</span>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#334155' }}>
            ناظر زنده رویدادهای موتور یادگیری (Learning Runtime):
          </h4>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
          مطابق اصل تفکیک معماری (Server-Authoritative Runtime)، منطق ارزیابی و حقیقت یادگیری منحصراً در موتور سرور پردازش شده و شخصیت فقط انیمیشن متناظر را اجرا می‌کند.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
          {semanticEventLog.map((log, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '6px 10px',
                fontSize: 11,
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
                    padding: '2px 6px',
                    borderRadius: 6,
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
