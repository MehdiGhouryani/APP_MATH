'use client';

import React, { useState } from 'react';
import { toPersianDigits } from '../lib/persian';

export function BackpackView() {
  const [filter, setFilter] = useState<'ALL' | 'MASTERED' | 'REVIEW'>('ALL');

  const skills = [
    { code: 'G1-SK01', title: 'شمارش ترتیبی اشیاء تا ۵', status: 'MASTERED', stars: 3 },
    { code: 'G1-SK02', title: 'تناوب و کشف الگوهای دوتایی (AB)', status: 'MASTERED', stars: 3 },
    { code: 'G1-SK03', title: 'شمارش دو‌تادوتا و دنباله افزایشی', status: 'REVIEW', stars: 1 },
    { code: 'G1-SK04', title: 'مقایسه دسته‌ها (بیشتر و کمتر)', status: 'BUILDING', stars: 2 },
    { code: 'G1-SK05', title: 'تناظر یک‌به‌یک اشیاء', status: 'LOCKED', stars: 0 },
    { code: 'G1-SK06', title: 'شناخت و نام‌گذاری اشکال هندسی پایه', status: 'LOCKED', stars: 0 },
  ];

  const filtered = skills.filter((s) => {
    if (filter === 'MASTERED') return s.status === 'MASTERED';
    if (filter === 'REVIEW') return s.status === 'REVIEW';
    return true;
  });

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      {/* Backpack Banner */}
      <div
        style={{
          backgroundColor: '#1cb0f6',
          borderRadius: 24,
          padding: '20px',
          color: '#ffffff',
          boxShadow: '0 6px 0 #1899d6',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 44 }}>🎒</div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900 }}>کوله‌پشتی مهارت‌های من</h2>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
              ۶۴ مهارت شناختی پایه اول — تثبیت‌شده و نیازمند مرور
            </p>
          </div>
        </div>
      </div>

      {/* Mistakes Review Callout (Duolingo Practice Hub) */}
      <div
        style={{
          backgroundColor: '#fff3d6',
          border: '2px solid #fed7aa',
          borderRadius: 20,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          boxShadow: '0 3px 0 #fed7aa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>💡</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#9a3412' }}>مرور هوشمند اشتباهات</div>
            <div style={{ fontSize: 12, color: '#b45309' }}>۱ تمرین برای تثبیت نیاز به مرور دارد</div>
          </div>
        </div>
        <button
          onClick={() => alert('تمرین جبرانی هوشمند شروع شد')}
          className="duo-btn-amber"
          style={{ padding: '8px 14px', fontSize: 13 }}
        >
          شروع مرور
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setFilter('ALL')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 12,
            border: filter === 'ALL' ? '2px solid #1cb0f6' : '2px solid #e5e5e5',
            backgroundColor: filter === 'ALL' ? '#ddf4ff' : '#ffffff',
            color: filter === 'ALL' ? '#1899d6' : '#777',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          همه مهارت‌ها ({toPersianDigits(64)})
        </button>
        <button
          onClick={() => setFilter('MASTERED')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 12,
            border: filter === 'MASTERED' ? '2px solid #58cc02' : '2px solid #e5e5e5',
            backgroundColor: filter === 'MASTERED' ? '#d7ffb8' : '#ffffff',
            color: filter === 'MASTERED' ? '#46a302' : '#777',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          تثبیت‌شده (۲)
        </button>
        <button
          onClick={() => setFilter('REVIEW')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 12,
            border: filter === 'REVIEW' ? '2px solid #ff9600' : '2px solid #e5e5e5',
            backgroundColor: filter === 'REVIEW' ? '#fff3d6' : '#ffffff',
            color: filter === 'REVIEW' ? '#cc7800' : '#777',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          مرور (۱)
        </button>
      </div>

      {/* Skills list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((skill) => (
          <div
            key={skill.code}
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #e5e5e5',
              borderRadius: 18,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 0 #e5e5e5',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1cb0f6', marginBottom: 2 }}>
                {skill.code}
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#3c3c3c' }}>
                {skill.title}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {skill.status === 'MASTERED' && (
                <span
                  style={{
                    backgroundColor: '#d7ffb8',
                    color: '#46a302',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  ✓ تثبیت
                </span>
              )}
              {skill.status === 'REVIEW' && (
                <span
                  style={{
                    backgroundColor: '#fff3d6',
                    color: '#cc7800',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  مرور
                </span>
              )}
              {skill.status === 'BUILDING' && (
                <span
                  style={{
                    backgroundColor: '#ddf4ff',
                    color: '#1899d6',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  در حال یادگیری
                </span>
              )}
              {skill.status === 'LOCKED' && <span style={{ fontSize: 18 }}>🔒</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
