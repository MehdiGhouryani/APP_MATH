'use client';

import React, { useState, useEffect } from 'react';
import { RiveCompanionMascot, MascotState } from './RiveCompanionMascot';
import { GRADES, GradeMeta, CHARACTERS } from '../lib/persian';

export type AuthFlowStep = 'SPLASH' | 'GATEWAY' | 'MOBILE_OTP' | 'LEARNER_SETUP' | 'SYNC_LOADING';

interface AuthFlowScreenProps {
  onCompleteAuth: (userData: {
    phoneNumber?: string;
    authMethod: 'MOBILE' | 'GOOGLE' | 'GUEST';
    gradeId: string;
    characterId: string;
    childName: string;
  }) => void;
  onClose?: () => void;
  initialStep?: AuthFlowStep;
}

export function AuthFlowScreen({
  onCompleteAuth,
  onClose,
  initialStep = 'SPLASH',
}: AuthFlowScreenProps) {
  const [step, setStep] = useState<AuthFlowStep>(initialStep);

  // Form States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [selectedGrade, setSelectedGrade] = useState<GradeMeta>(GRADES[0]!);
  const [selectedCharId, setSelectedCharId] = useState<string>('aria');
  const [childName, setChildName] = useState('آرش');
  const [authMethod, setAuthMethod] = useState<'MOBILE' | 'GOOGLE' | 'GUEST'>('GUEST');

  // Sync Progress State
  const [syncProgress, setSyncProgress] = useState(15);
  const [syncMessageIndex, setSyncMessageIndex] = useState(0);

  const syncMessages = [
    `در حال برقراری اتصال امن با سرور...`,
    `در حال چیدن سنگ‌فرش‌های ${selectedGrade.title}...`,
    `در حال آماده‌سازی پازل‌های تعاملی ایستگاه ۱...`,
    `در حال تنظیم ستاره‌های دانش و همراهی ${CHARACTERS[selectedCharId]?.name || 'آریا'}...`,
    `آماده‌سازی با موفقیت انجام شد!`,
  ];

  // Splash Screen Timer & Check
  useEffect(() => {
    if (step === 'SPLASH') {
      const splashTimer = setTimeout(() => {
        setStep('GATEWAY');
      }, 2200);
      return () => clearTimeout(splashTimer);
    }
  }, [step]);

  // OTP Countdown Timer
  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, otpTimer]);

  // Sync Loading Progress Animation
  useEffect(() => {
    if (step === 'SYNC_LOADING') {
      const progressInterval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              onCompleteAuth({
                phoneNumber,
                authMethod,
                gradeId: selectedGrade.id,
                characterId: selectedCharId,
                childName,
              });
            }, 600);
            return 100;
          }
          const next = prev + 18;
          setSyncMessageIndex(Math.min(Math.floor((next / 100) * syncMessages.length), syncMessages.length - 1));
          return next;
        });
      }, 400);

      return () => clearInterval(progressInterval);
    }
  }, [step, selectedGrade, selectedCharId, childName, phoneNumber, authMethod, onCompleteAuth, syncMessages.length]);

  // Handlers
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) return;
    setOtpSent(true);
    setOtpTimer(60);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) return;
    setAuthMethod('MOBILE');
    setStep('LEARNER_SETUP');
  };

  const handleGoogleLogin = () => {
    setAuthMethod('GOOGLE');
    setStep('LEARNER_SETUP');
  };

  const handleGuestLogin = () => {
    setAuthMethod('GUEST');
    setStep('LEARNER_SETUP');
  };

  const handleFinishSetup = () => {
    setStep('SYNC_LOADING');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white font-sans p-6 overflow-hidden select-none dir-rtl">
      {/* Top Bar with Optional Close Button */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">ریاضی دانا</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* STEP 1: SPLASH SCREEN */}
      {step === 'SPLASH' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 z-10 animate-fade-in">
          <div className="relative">
            <RiveCompanionMascot
              characterId="aria"
              state="idle"
              size={220}
              interactive={false}
              showSpeechBubble={true}
              speechText="سلام دوست من! خوش اومدی!"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-md">
              ریاضی دانا
            </h1>
            <p className="text-sm font-medium text-slate-300">
              پلتفرم هوشمند یادگیری گام‌به‌گام دبستان
            </p>
          </div>

          <div className="pt-8 flex items-center space-x-2 space-x-reverse">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-slate-400">در حال آماده‌سازی محیط یادگیری...</span>
          </div>
        </div>
      )}

      {/* STEP 2: MAIN AUTH GATEWAY */}
      {step === 'GATEWAY' && (
        <div className="flex-1 w-full max-w-md flex flex-col items-center justify-between py-6 z-10 animate-fade-in">
          {/* Header & Live Mascot */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <RiveCompanionMascot
              characterId="aria"
              state="excited"
              size={180}
              interactive={true}
              showSpeechBubble={true}
              speechText="آماده‌ای با هم ریاضی رو فتح کنیم؟"
            />
            <div>
              <h2 className="text-2xl font-black text-white">ورود به ریاضی دانا</h2>
              <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                مناسب برای پایه‌های اول تا ششم دبستان
              </div>
            </div>
          </div>

          {/* Login Actions */}
          <div className="w-full space-y-3 pt-6">
            {/* Primary Mobile OTP Button */}
            <button
              onClick={() => setStep('MOBILE_OTP')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-base shadow-lg shadow-emerald-900/30 flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-xl">📱</span>
                <span>ورود با شماره موبایل</span>
              </div>
              <span className="text-lg">➔</span>
            </button>

            {/* Google One-Tap Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-sm flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>ورود با حساب گوگل</span>
              </div>
              <span className="text-slate-400">➔</span>
            </button>

            {/* Guest Mode Quick Start */}
            <button
              onClick={handleGuestLogin}
              className="w-full py-3 px-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/30 font-bold text-sm flex items-center justify-center space-x-2 space-x-reverse transition-all"
            >
              <span>🚀</span>
              <span>ورود سریع (آزمايش حساب مهمان)</span>
            </button>
          </div>

          {/* Privacy Terms Footnote */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            با ورود به نرم‌افزار،{' '}
            <a href="#privacy" className="text-emerald-400 underline hover:text-emerald-300">
              «خط‌مشی رازدار»
            </a>{' '}
            و قوانین یادگیری را می‌پذیرم.
          </p>
        </div>
      )}

      {/* STEP 3: MOBILE OTP INPUT */}
      {step === 'MOBILE_OTP' && (
        <div className="flex-1 w-full max-w-md flex flex-col items-center justify-between py-6 z-10 animate-fade-in">
          <div className="w-full space-y-6">
            {/* Back Arrow */}
            <button
              onClick={() => setStep('GATEWAY')}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 space-x-reverse"
            >
              <span>➔</span>
              <span>بازگشت</span>
            </button>

            <div className="flex flex-col items-center text-center space-y-2">
              <RiveCompanionMascot
                characterId="qbo"
                state={otpSent ? 'excited' : 'thinking'}
                size={140}
                interactive={true}
              />
              <h2 className="text-2xl font-black text-white">
                {otpSent ? 'کد تایید پیامکی' : 'شماره همراه'}
              </h2>
              <p className="text-xs text-slate-300">
                {otpSent
                  ? `کد ۴ رقمی ارسال‌شده به ${phoneNumber} را وارد کنید:`
                  : 'جهت ذخیره پیشرفت فرزندتان، شماره همراه را وارد کنید:'}
              </p>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="09123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    dir="ltr"
                    className="w-full py-4 px-5 rounded-2xl bg-slate-800/90 border-2 border-slate-700 text-center text-xl font-mono text-emerald-400 placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={!phoneNumber || phoneNumber.length < 10}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-base shadow-lg transition-all"
                >
                  ارسال کد تایید پیامکی
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  dir="ltr"
                  className="w-full py-4 px-5 rounded-2xl bg-slate-800/90 border-2 border-emerald-400 text-center text-3xl font-mono tracking-widest text-emerald-300 focus:outline-none"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length < 4}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-base shadow-lg transition-all"
                >
                  تایید و ورود
                </button>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>ارسال مجدد کد: {otpTimer} ثانیه</span>
                  <button
                    onClick={() => setOtpSent(false)}
                    className="text-emerald-400 underline"
                  >
                    اصلاح شماره
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: LEARNER PROFILE & GRADE SETUP */}
      {step === 'LEARNER_SETUP' && (
        <div className="flex-1 w-full max-w-md flex flex-col justify-between py-4 z-10 animate-fade-in overflow-y-auto hide-scrollbar">
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-white">تنظیم پروفایل ریاضی‌دان کوچک</h2>
              <p className="text-xs text-slate-300">پایه تحصیلی و همراه دوست‌داشتنی را انتخاب کنید:</p>
            </div>

            {/* 1. Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">نام دانش‌آموز:</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* 2. Companion Character Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">انتخاب همراه داستانی:</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(CHARACTERS).map((char) => {
                  const isSelected = selectedCharId === char.id;
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedCharId(char.id)}
                      className={`p-2 rounded-2xl flex flex-col items-center border-2 transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-400 scale-105 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <RiveCompanionMascot
                        characterId={char.id}
                        state={isSelected ? 'excited' : 'idle'}
                        size={60}
                        interactive={false}
                      />
                      <span className="text-[11px] font-bold text-slate-200 mt-1">{char.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Grade Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">انتخاب پایه تحصیلی:</label>
              <div className="grid grid-cols-2 gap-2">
                {GRADES.map((g) => {
                  const isSelected = selectedGrade.id === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGrade(g)}
                      className={`p-3 rounded-xl text-right border transition-all ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-emerald-300">{g.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{g.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleFinishSetup}
            className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base shadow-lg active:scale-98 transition-all"
          >
            ورود به مسیر یادگیری ➔
          </button>
        </div>
      )}

      {/* STEP 5: DYNAMIC SYNC & LOADING */}
      {step === 'SYNC_LOADING' && (
        <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center text-center space-y-6 z-10 animate-fade-in">
          {/* Live Working Character Animation */}
          <RiveCompanionMascot
            characterId={selectedCharId}
            state="working"
            size={200}
            interactive={true}
            showSpeechBubble={true}
            speechText={`خیلی خوشحالم ${childName} جان! دارم مسیر رو می‌چینم!`}
          />

          <div className="w-full space-y-4 px-4">
            <h2 className="text-xl font-black text-white">در حال ساخت مسیر یادگیری اختصاصی</h2>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>

            {/* Dynamic Status Message */}
            <div className="text-xs font-bold text-emerald-400 animate-pulse min-h-[24px]">
              {syncMessages[syncMessageIndex]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
