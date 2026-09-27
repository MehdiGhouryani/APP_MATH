'use client';

import React from 'react';
import { soundFx } from '../lib/sound';
import { DESIGN_TOKENS } from '../lib/theme/tokens';

export type MainTabType = 'PATH' | 'LEAGUES' | 'BACKPACK' | 'PROFILE';

interface DuolingoBottomNavProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export function DuolingoBottomNav({ activeTab, onChangeTab }: DuolingoBottomNavProps) {
  const tabs: Array<{ id: MainTabType; label: string; icon: string; badge?: string }> = [
    { id: 'PATH', label: 'مسیر', icon: '🗺️' },
    { id: 'LEAGUES', label: 'لیگ‌ها', icon: '🏆', badge: 'جدید' },
    { id: 'BACKPACK', label: 'مهارت‌ها', icon: '🎒' },
    { id: 'PROFILE', label: 'پروفایل', icon: '👤' },
  ];

  return (
    <nav
      style={{
        position: 'relative',
        backgroundColor: DESIGN_TOKENS.colors.neutral.white,
        borderTop: `2px solid ${DESIGN_TOKENS.colors.neutral.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 8px 10px',
        zIndex: 40,
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
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
              background: isSelected ? DESIGN_TOKENS.colors.brand.primaryLight : 'transparent',
              border: isSelected ? `2px solid ${DESIGN_TOKENS.colors.brand.primary}` : '2px solid transparent',
              borderRadius: DESIGN_TOKENS.radius.sm,
              padding: '6px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s ease',
              minWidth: 68,
              touchAction: 'manipulation',
              userSelect: 'none',
              outline: 'none',
              pointerEvents: 'auto',
              fontFamily: DESIGN_TOKENS.typography.fonts.body,
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isSelected ? DESIGN_TOKENS.typography.weights.black : DESIGN_TOKENS.typography.weights.semibold,
                color: isSelected ? DESIGN_TOKENS.colors.brand.primary : DESIGN_TOKENS.colors.neutral.slate,
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
                  backgroundColor: DESIGN_TOKENS.colors.brand.secondary,
                  color: DESIGN_TOKENS.colors.neutral.white,
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
