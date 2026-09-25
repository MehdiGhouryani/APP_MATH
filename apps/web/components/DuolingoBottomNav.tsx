'use client';

import React from 'react';
import { soundFx } from '../lib/sound';

export type MainTabType = 'PATH' | 'LEAGUES' | 'BACKPACK' | 'ADULTS' | 'PROFILE';

interface DuolingoBottomNavProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export function DuolingoBottomNav({ activeTab, onChangeTab }: DuolingoBottomNavProps) {
  const tabs: Array<{ id: MainTabType; label: string; icon: string; badge?: string }> = [
    { id: 'PATH', label: 'مسیر', icon: '🗺️' },
    { id: 'LEAGUES', label: 'لیگ‌ها', icon: '🏆', badge: 'جدید' },
    { id: 'BACKPACK', label: 'مهارت‌ها', icon: '🎒' },
    { id: 'ADULTS', label: 'والدین/معلم', icon: '👨‍👩‍👧' },
    { id: 'PROFILE', label: 'پروفایل', icon: '👤' },
  ];

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        borderTop: '2px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 8px 10px',
        zIndex: 50,
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              onChangeTab(tab.id);
              soundFx.playTap();
            }}
            style={{
              background: isSelected ? '#ddf4ff' : 'transparent',
              border: isSelected ? '2px solid #84d8ff' : '2px solid transparent',
              borderRadius: '16px',
              padding: '6px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s ease',
              minWidth: 62,
              touchAction: 'manipulation',
              userSelect: 'none',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isSelected ? 800 : 600,
                color: isSelected ? '#1cb0f6' : '#777777',
              }}
            >
              {tab.label}
            </span>

            {tab.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  left: 4,
                  backgroundColor: '#ff4b4b',
                  color: '#ffffff',
                  fontSize: 8,
                  fontWeight: 800,
                  padding: '1px 4px',
                  borderRadius: 6,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
