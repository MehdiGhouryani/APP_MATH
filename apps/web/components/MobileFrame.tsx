'use client';

import React, { useState } from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        backgroundImage: `
          radial-gradient(at 10% 20%, rgba(37, 99, 235, 0.15) 0px, transparent 50%),
          radial-gradient(at 90% 80%, rgba(88, 204, 2, 0.12) 0px, transparent 50%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullscreen ? '0' : '16px 8px',
      }}
    >
      {/* Frame Control Switcher on Desktop */}
      {!isFullscreen && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
            color: '#94a3b8',
            fontSize: 13,
          }}
        >
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>
            📱 شبیه‌ساز اپلیکیشن یادگیری ریاضی (پایه‌های ۱ تا ۶)
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ⛶ تمام‌صفحه موبایل
          </button>
        </div>
      )}

      {/* The Phone Bezel Container */}
      <div
        style={{
          width: isFullscreen ? '100vw' : '100%',
          maxWidth: isFullscreen ? '100vw' : '430px',
          height: isFullscreen ? '100vh' : '860px',
          maxHeight: isFullscreen ? '100vh' : '94vh',
          backgroundColor: '#ffffff',
          borderRadius: isFullscreen ? '0' : '44px',
          boxShadow: isFullscreen
            ? 'none'
            : '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 10px #1e293b, 0 0 0 12px #334155',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Phone Status Bar (Dynamic Island & Status Icons) */}
        <div
          style={{
            height: 44,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            fontSize: 14,
            fontWeight: 700,
            color: '#1e293b',
            zIndex: 60,
            flexShrink: 0,
            borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
          }}
        >
          <span>۹:۴۱</span>

          {/* Dynamic Island pill */}
          <div
            style={{
              width: 108,
              height: 26,
              backgroundColor: '#000000',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1e293b' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#0f172a' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span>5G</span>
            <span>📶</span>
            <span>🔋</span>
            {isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                title="خروج از تمام‌صفحه"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  marginRight: 4,
                  color: '#1e293b',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Inner Phone Viewport - Flex column container */}
        <div
          style={{
            flex: 1,
            height: 'calc(100% - 44px)',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
