'use client';

import React from 'react';
import { toPersianDigits } from '../lib/persian';

export function LeaderboardView() {
  const ranks = [
    { rank: 1, name: 'سارا رضایی', xp: 480, avatar: '👧', streak: 7, isMe: false },
    { rank: 2, name: 'شما (قهرمان ریاضی)', xp: 420, avatar: '🐲', streak: 3, isMe: true },
    { rank: 3, name: 'کیان محمدی', xp: 395, avatar: '👦', streak: 5, isMe: false },
    { rank: 4, name: 'هلیا احمدی', xp: 350, avatar: '👧', streak: 2, isMe: false },
    { rank: 5, name: 'رادین کریمی', xp: 310, avatar: '👦', streak: 4, isMe: false },
    { rank: 6, name: 'آوا موسوی', xp: 280, avatar: '👧', streak: 1, isMe: false },
  ];

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      {/* League Header */}
      <div
        style={{
          backgroundColor: '#ff9600',
          borderRadius: 24,
          padding: '20px 20px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 6px 0 #cc7800',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 4 }}>🏆</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900 }}>لیگ الماس پایه اول</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
          با حل تمرین‌های روزانه، امتیاز تجربه (XP) کسب کن و در لیگ بالا برو!
        </p>
        <div
          style={{
            marginTop: 12,
            backgroundColor: 'rgba(0,0,0,0.15)',
            padding: '4px 12px',
            borderRadius: 999,
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 750,
          }}
        >
          ⏱️ ۲ روز تا پایان این دوره مسابقه
        </div>
      </div>

      {/* Leaderboard List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ranks.map((item) => (
          <div
            key={item.rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 18,
              backgroundColor: item.isMe ? '#ddf4ff' : '#ffffff',
              border: item.isMe ? '2px solid #84d8ff' : '2px solid #e5e5e5',
              boxShadow: item.isMe ? '0 4px 0 #84d8ff' : '0 2px 0 #e5e5e5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Rank number badge */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor:
                    item.rank === 1
                      ? '#ffd700'
                      : item.rank === 2
                      ? '#e0e7ff'
                      : item.rank === 3
                      ? '#fed7aa'
                      : '#f1f5f9',
                  color: item.rank === 1 ? '#854d0e' : '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                {toPersianDigits(item.rank)}
              </div>

              {/* Avatar & Name */}
              <span style={{ fontSize: 24 }}>{item.avatar}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#3c3c3c' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: '#777', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>🔥 {toPersianDigits(item.streak)} روز متوالی</span>
                </div>
              </div>
            </div>

            {/* XP Points */}
            <div style={{ fontWeight: 900, fontSize: 15, color: '#1cb0f6' }}>
              {toPersianDigits(item.xp)} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
