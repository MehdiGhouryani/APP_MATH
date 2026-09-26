'use client';

import React, { useState } from 'react';
import { toPersianDigits } from '../lib/persian';
import { soundFx } from '../lib/sound';
import { evaluateLearningEncounter, INITIAL_SKILLS } from '../lib/learningEngine';

interface SkillItem {
  code: string;
  title: string;
  status: 'MASTERED' | 'REVIEW' | 'BUILDING' | 'LOCKED';
  stars: number;
}

export function BackpackView() {
  const [filter, setFilter] = useState<'ALL' | 'MASTERED' | 'REVIEW'>('ALL');
  const [activeTab, setActiveTab] = useState<'SKILLS' | 'BADGES' | 'TOOLS'>('SKILLS');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAnswer, setReviewAnswer] = useState<number | null>(null);
  const [reviewEvaluated, setReviewEvaluated] = useState<'UNCHECKED' | 'CORRECT' | 'WRONG'>('UNCHECKED');

  const [skills, setSkills] = useState<SkillItem[]>([
    { code: 'G1-SK01', title: 'شمارش ترتیبی اشیاء تا ۵', status: 'MASTERED', stars: 3 },
    { code: 'G1-SK02', title: 'تناوب و کشف الگوهای دوتایی (AB)', status: 'MASTERED', stars: 3 },
    { code: 'G1-SK03', title: 'شمارش دو‌تادوتا و دنباله افزایشی', status: 'REVIEW', stars: 1 },
    { code: 'G1-SK04', title: 'مقایسه دسته‌ها (بیشتر و کمتر)', status: 'BUILDING', stars: 2 },
    { code: 'G1-SK05', title: 'تناظر یک‌به‌یک اشیاء', status: 'BUILDING', stars: 1 },
    { code: 'G1-SK06', title: 'شناخت و نام‌گذاری اشکال هندسی پایه', status: 'LOCKED', stars: 0 },
    { code: 'G1-SK07', title: 'حل جدول شگفت‌انگیز ۲×۲ بدون تکرار', status: 'MASTERED', stars: 3 },
    { code: 'G1-SK08', title: 'قرینه‌یابی و خط تقارن در شکل‌های شطرنجی', status: 'MASTERED', stars: 3 },
  ]);

  const badges = [
    { id: 'b1', name: 'شکارچی الگوها', icon: '🎨', desc: 'تکمیل بدون اشتباه زنجیره رنگی', unlocked: true },
    { id: 'b2', name: 'استاد چوب‌خط', icon: '✏️', desc: 'ترسیم بسته‌های ۵تایی منظم', unlocked: true },
    { id: 'b3', name: 'نگهبان تقارن', icon: '🪞', desc: 'رنگ‌آمیزی دقیق بازتاب آینه‌ای', unlocked: true },
    { id: 'b4', name: 'ترازودار عادل', icon: '⚖️', desc: 'تشخیص سریع دسته‌های بزرگتر', unlocked: true },
    { id: 'b5', name: 'کلیددار گنجینه', icon: '🔑', desc: 'فتح ایستگاه ۰۱ و دریافت صندوق', unlocked: true },
    { id: 'b6', name: 'قهرمان شگفت‌انگیز', icon: '🧩', desc: 'حل بدون کمک جدول سودوکو', unlocked: false },
  ];

  const tools = [
    { id: 't1', name: 'چوب‌خط‌های جادویی', icon: '🥢', desc: 'شمارش سریع پنج‌تایی اشیاء' },
    { id: 't2', name: 'آینه تقارن شفاف', icon: '🪞', desc: 'دیدن قرینه شکل‌ها و تصاویر' },
    { id: 't3', name: 'ترازوی دوکفه‌ای', icon: '⚖️', desc: 'سنجش سنگینی و تعداد دسته‌ها' },
    { id: 't4', name: 'مکعب‌های چینه رنگی', icon: '🧱', desc: 'ساخت برج و الگوهای تکرارشونده' },
  ];

  const filtered = skills.filter((s) => {
    if (filter === 'MASTERED') return s.status === 'MASTERED';
    if (filter === 'REVIEW') return s.status === 'REVIEW';
    return true;
  });

  const reviewCount = skills.filter((s) => s.status === 'REVIEW').length;
  const masteredCount = skills.filter((s) => s.status === 'MASTERED').length;

  function handleCompleteReview() {
    const currentSkill = INITIAL_SKILLS.find((s) => s.code === 'G1-SK03')!;
    const result = evaluateLearningEncounter(
      {
        nodeId: 'review-g1-sk03',
        skillCode: 'G1-SK03',
        type: 'CHECK',
        userAnswer: reviewAnswer,
        expectedAnswer: 8,
      },
      currentSkill
    );

    if (result.evaluation.correct) {
      soundFx.playSuccess();
      setReviewEvaluated('CORRECT');
      setSkills((prev) =>
        prev.map((sk) => (sk.code === 'G1-SK03' ? { ...sk, status: 'MASTERED', stars: 3 } : sk))
      );
    } else {
      soundFx.playTryAgain();
      setReviewEvaluated('WRONG');
    }
  }

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
              {toPersianDigits(64)} مهارت شناختی پایه اول — مدال‌ها و ابزارهای دست‌ورزی
            </p>
          </div>
        </div>
      </div>

      {/* View Switcher: SKILLS | BADGES | TOOLS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => {
            soundFx.playTap();
            setActiveTab('SKILLS');
          }}
          style={{
            flex: 1,
            padding: '10px 4px',
            borderRadius: 14,
            border: activeTab === 'SKILLS' ? '2px solid #1cb0f6' : '2px solid #e5e5e5',
            backgroundColor: activeTab === 'SKILLS' ? '#ddf4ff' : '#ffffff',
            color: activeTab === 'SKILLS' ? '#1899d6' : '#64748b',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            touchAction: 'manipulation',
            pointerEvents: 'auto',
          }}
        >
          📜 مهارت‌ها ({toPersianDigits(skills.length)})
        </button>
        <button
          type="button"
          onClick={() => {
            soundFx.playTap();
            setActiveTab('BADGES');
          }}
          style={{
            flex: 1,
            padding: '10px 4px',
            borderRadius: 14,
            border: activeTab === 'BADGES' ? '2px solid #f59e0b' : '2px solid #e5e5e5',
            backgroundColor: activeTab === 'BADGES' ? '#fef3c7' : '#ffffff',
            color: activeTab === 'BADGES' ? '#d97706' : '#64748b',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            touchAction: 'manipulation',
            pointerEvents: 'auto',
          }}
        >
          🏅 مدال‌ها ({toPersianDigits(badges.filter((b) => b.unlocked).length)})
        </button>
        <button
          type="button"
          onClick={() => {
            soundFx.playTap();
            setActiveTab('TOOLS');
          }}
          style={{
            flex: 1,
            padding: '10px 4px',
            borderRadius: 14,
            border: activeTab === 'TOOLS' ? '2px solid #10b981' : '2px solid #e5e5e5',
            backgroundColor: activeTab === 'TOOLS' ? '#d1fae5' : '#ffffff',
            color: activeTab === 'TOOLS' ? '#059669' : '#64748b',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            touchAction: 'manipulation',
            pointerEvents: 'auto',
          }}
        >
          🛠️ ابزارها ({toPersianDigits(tools.length)})
        </button>
      </div>

      {activeTab === 'SKILLS' && (
        <>
          {/* Mistakes Review Callout (Practice Hub) */}
          {reviewCount > 0 && (
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
                  <div style={{ fontSize: 12, color: '#b45309' }}>
                    {toPersianDigits(reviewCount)} تمرین برای تثبیت نیاز به مرور دارد
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setReviewModalOpen(true);
                  setReviewEvaluated('UNCHECKED');
                  setReviewAnswer(null);
                }}
                className="math-btn-saffron"
                style={{ padding: '8px 14px', fontSize: 13, touchAction: 'manipulation', pointerEvents: 'auto' }}
              >
                شروع مرور
              </button>
            </div>
          )}

          {/* Filter Sub-Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setFilter('ALL');
              }}
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
                touchAction: 'manipulation',
                pointerEvents: 'auto',
              }}
            >
              همه ({toPersianDigits(skills.length)})
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setFilter('MASTERED');
              }}
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
                touchAction: 'manipulation',
                pointerEvents: 'auto',
              }}
            >
              تثبیت‌شده ({toPersianDigits(masteredCount)})
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setFilter('REVIEW');
              }}
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
                touchAction: 'manipulation',
                pointerEvents: 'auto',
              }}
            >
              مرور ({toPersianDigits(reviewCount)})
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
        </>
      )}

      {activeTab === 'BADGES' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: b.unlocked ? '#ffffff' : '#f8fafc',
                border: b.unlocked ? '2px solid #fef08a' : '2px dashed #e2e8f0',
                borderRadius: 20,
                padding: '16px',
                textAlign: 'center',
                boxShadow: b.unlocked ? '0 4px 0 #fde047' : 'none',
                opacity: b.unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8, filter: b.unlocked ? 'none' : 'grayscale(1)' }}>
                {b.icon}
              </div>
              <div style={{ fontWeight: 900, fontSize: 14, color: b.unlocked ? '#854d0e' : '#64748b' }}>
                {b.name}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, lineHeight: 1.4 }}>
                {b.desc}
              </div>
              {b.unlocked ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#16a34a',
                    backgroundColor: '#dcfce7',
                    padding: '2px 8px',
                    borderRadius: 999,
                    display: 'inline-block',
                  }}
                >
                  ✓ باز شده
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#94a3b8',
                    backgroundColor: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: 999,
                    display: 'inline-block',
                  }}
                >
                  🔒 قفل
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'TOOLS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tools.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: 20,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 3px 0 #e2e8f0',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                {t.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 15, color: '#1e293b' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{t.desc}</div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                آماده استفاده
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Smart Review Modal */}
      {reviewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 380,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '2px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>💡</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', margin: '0 0 6px' }}>
              مرور هوشمند: شمارش دو‌تادوتا
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
              الگوی روبرو را کامل کن: <br />
              <strong style={{ fontSize: 20, color: '#2563eb', display: 'inline-block', marginTop: 6 }}>
                ۲ ، ۴ ، ۶ ، ...
              </strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    soundFx.playBubblePop();
                    setReviewAnswer(num);
                    setReviewEvaluated('UNCHECKED');
                  }}
                  className={`math-choice-card ${reviewAnswer === num ? 'selected' : ''}`}
                  style={{ fontSize: 22, padding: '12px 0', cursor: 'pointer', touchAction: 'manipulation', pointerEvents: 'auto' }}
                >
                  {toPersianDigits(num)}
                </button>
              ))}
            </div>

            {reviewEvaluated === 'CORRECT' ? (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', marginBottom: 12 }}>
                  🎉 آفرین! مهارت به وضعیت تثبیت‌شده ارتقا یافت!
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setReviewModalOpen(false);
                  }}
                  className="math-btn-success"
                  style={{ width: '100%', padding: '12px 0', fontSize: 15, cursor: 'pointer', touchAction: 'manipulation', pointerEvents: 'auto' }}
                >
                  بستن و ثبت
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setReviewModalOpen(false);
                  }}
                  className="math-btn-neutral"
                  style={{ flex: 1, padding: '12px 0', fontSize: 14, cursor: 'pointer', touchAction: 'manipulation', pointerEvents: 'auto' }}
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleCompleteReview}
                  disabled={reviewAnswer === null}
                  className="math-btn-primary"
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    fontSize: 14,
                    opacity: reviewAnswer === null ? 0.5 : 1,
                    cursor: reviewAnswer === null ? 'not-allowed' : 'pointer',
                    touchAction: 'manipulation',
                    pointerEvents: 'auto',
                  }}
                >
                  بررسی کن
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
