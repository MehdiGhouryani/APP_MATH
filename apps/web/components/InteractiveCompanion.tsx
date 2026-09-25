'use client';

import React, { useState } from 'react';
import { CHARACTERS, CompanionCharacter } from '../lib/persian';
import { soundFx } from '../lib/sound';
import type { AnimationSemanticEvent } from '@math/contracts';

interface InteractiveCompanionProps {
  characterId: string;
  semanticEvent?: AnimationSemanticEvent;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showBubble?: boolean;
  onTap?: () => void;
}

export function InteractiveCompanion({
  characterId,
  semanticEvent = 'SESSION_START',
  customMessage,
  size = 'md',
  showBubble = true,
  onTap,
}: InteractiveCompanionProps) {
  const [isTapped, setIsTapped] = useState(false);
  const char: CompanionCharacter = CHARACTERS[characterId] ?? CHARACTERS['aria']!;

  // Determine speech text based on event
  let speech = customMessage;
  if (!speech) {
    switch (semanticEvent) {
      case 'ANSWER_CORRECT':
        speech = char.reactions.correct;
        break;
      case 'ANSWER_WRONG':
        speech = char.reactions.wrong;
        break;
      case 'HINT_OPENED':
        speech = char.reactions.hint;
        break;
      case 'RECOVERY':
        speech = char.reactions.recovery;
        break;
      case 'STATION_PASS':
      case 'MILESTONE':
      case 'REWARD_GRANTED':
        speech = char.reactions.pass;
        break;
      default:
        speech = char.reactions.idle;
    }
  }

  const dimension = size === 'sm' ? 80 : size === 'lg' ? 170 : 120;

  function handleCharacterTap() {
    soundFx.playCharacterChirp(char.id);
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 300);
    onTap?.();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {showBubble && speech && (
        <div
          className="character-speech-bubble"
          style={{
            maxWidth: 320,
            fontSize: size === 'sm' ? '13px' : '15px',
            color: '#1e293b',
            lineHeight: 1.6,
            textAlign: 'center',
            borderColor: char.themeColor + '40',
            backgroundColor: '#ffffff',
            boxShadow: `0 8px 24px ${char.themeColor}15`,
            animation: 'bounceIn 0.3s ease-out',
          }}
        >
          <span style={{ fontWeight: 700, color: char.themeColor, display: 'block', marginBottom: 2 }}>
            {char.name}:
          </span>
          {speech}
        </div>
      )}

      {/* Scalable SVG Render of Companion */}
      <button
        type="button"
        onClick={handleCharacterTap}
        aria-label={`شخصیت همراه ${char.name}`}
        style={{
          width: dimension,
          height: dimension,
          borderRadius: '50%',
          backgroundColor: char.avatarBg,
          border: `4px solid ${char.themeColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 25px ${char.themeColor}25`,
          position: 'relative',
          cursor: 'pointer',
          padding: 0,
          transform: isTapped ? 'scale(1.12) rotate(-4deg)' : 'scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {char.id === 'aria' && <AriaSvg event={semanticEvent} />}
        {char.id === 'qbo' && <QboSvg event={semanticEvent} />}
        {char.id === 'jiko' && <JikoSvg event={semanticEvent} />}
        {char.id === 'dana' && <DanaSvg event={semanticEvent} />}

        {/* Emotion status indicator badge */}
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: `2px solid ${char.themeColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {semanticEvent === 'ANSWER_CORRECT' && '⭐'}
          {semanticEvent === 'ANSWER_WRONG' && '💡'}
          {semanticEvent === 'HINT_OPENED' && '🔍'}
          {semanticEvent === 'RECOVERY' && '🌱'}
          {(semanticEvent === 'STATION_PASS' || semanticEvent === 'MILESTONE') && '🎉'}
          {semanticEvent === 'SESSION_START' && '✨'}
        </div>
      </button>
    </div>
  );
}

// 1. Aria - Friendly Baby Dragon in Persian Blue
function AriaSvg({ event }: { event: AnimationSemanticEvent }) {
  const isHappy = event === 'ANSWER_CORRECT' || event === 'STATION_PASS' || event === 'REWARD_GRANTED';
  const isThinking = event === 'HINT_OPENED' || event === 'EXPLAIN';

  return (
    <svg width="80%" height="80%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Little dragon horns / crest */}
      <path d="M35 25C30 15 22 20 28 32" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" fill="#60A5FA" />
      <path d="M65 25C70 15 78 20 72 32" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" fill="#60A5FA" />
      <path d="M50 18C47 8 53 8 50 18" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />

      {/* Head / Body */}
      <ellipse cx="50" cy="54" rx="34" ry="32" fill="#3B82F6" />
      {/* Belly */}
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="#93C5FD" opacity="0.9" />

      {/* Cheeks */}
      <circle cx="30" cy="58" r="6" fill="#F472B6" opacity="0.6" />
      <circle cx="70" cy="58" r="6" fill="#F472B6" opacity="0.6" />

      {/* Eyes */}
      {isHappy ? (
        <>
          <path d="M34 46C36 42 42 42 44 46" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <path d="M56 46C58 42 64 42 66 46" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : isThinking ? (
        <>
          <circle cx="39" cy="46" r="4.5" fill="#1E293B" />
          <circle cx="61" cy="42" r="5" fill="#1E293B" />
          <circle cx="63" cy="40" r="1.5" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <circle cx="39" cy="46" r="5" fill="#1E293B" />
          <circle cx="41" cy="44" r="2" fill="#FFFFFF" />
          <circle cx="61" cy="46" r="5" fill="#1E293B" />
          <circle cx="63" cy="44" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth */}
      {isHappy ? (
        <path d="M43 56C47 64 53 64 57 56" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="#EF4444" />
      ) : (
        <path d="M44 58C48 62 52 62 56 58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}

// 2. Qbo - Smart Cubical Math Robot
function QboSvg({ event }: { event: AnimationSemanticEvent }) {
  const isHappy = event === 'ANSWER_CORRECT' || event === 'STATION_PASS';

  return (
    <svg width="80%" height="80%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line x1="50" y1="12" x2="50" y2="24" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="12" r="5" fill="#10B981" />

      {/* Head Frame */}
      <rect x="22" y="24" width="56" height="52" rx="14" fill="#34D399" stroke="#059669" strokeWidth="3" />
      {/* Screen */}
      <rect x="30" y="32" width="40" height="34" rx="8" fill="#064E3B" />

      {/* Digital Eyes */}
      {isHappy ? (
        <>
          <path d="M38 46L44 42L44 52" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 46L62 42L62 52" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="42" cy="48" r="4" fill="#6EE7B7" />
          <circle cx="58" cy="48" r="4" fill="#6EE7B7" />
        </>
      )}

      {/* Wheels/Stand */}
      <rect x="36" y="78" width="28" height="8" rx="4" fill="#059669" />
    </svg>
  );
}

// 3. Jiko - Playful Cheerful Bird / Buddy
function JikoSvg({ event }: { event: AnimationSemanticEvent }) {
  const isHappy = event === 'ANSWER_CORRECT' || event === 'STATION_PASS';

  return (
    <svg width="80%" height="80%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Feather crest */}
      <path d="M48 18C44 8 56 12 50 24" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />

      {/* Body */}
      <circle cx="50" cy="54" r="32" fill="#FBBF24" />

      {/* Cheeks */}
      <circle cx="32" cy="56" r="5" fill="#F87171" opacity="0.6" />
      <circle cx="68" cy="56" r="5" fill="#F87171" opacity="0.6" />

      {/* Eyes */}
      {isHappy ? (
        <>
          <path d="M36 46C38 42 42 42 44 46" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M56 46C58 42 62 42 64 46" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="40" cy="46" r="4.5" fill="#78350F" />
          <circle cx="42" cy="44" r="1.5" fill="#FFFFFF" />
          <circle cx="60" cy="46" r="4.5" fill="#78350F" />
          <circle cx="62" cy="44" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Beak */}
      <polygon points="50,50 44,58 56,58" fill="#EA580C" />
    </svg>
  );
}

// 4. Dana - Wise Squirrel / Nature Explorer
function DanaSvg({ event }: { event: AnimationSemanticEvent }) {
  const isHappy = event === 'ANSWER_CORRECT' || event === 'STATION_PASS';

  return (
    <svg width="80%" height="80%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <ellipse cx="32" cy="28" rx="8" ry="12" fill="#DB2777" />
      <ellipse cx="32" cy="28" rx="4" ry="8" fill="#FCE7F3" />
      <ellipse cx="68" cy="28" rx="8" ry="12" fill="#DB2777" />
      <ellipse cx="68" cy="28" rx="4" ry="8" fill="#FCE7F3" />

      {/* Head */}
      <circle cx="50" cy="56" r="30" fill="#F472B6" />
      <ellipse cx="50" cy="64" rx="18" ry="12" fill="#FDF2F8" />

      {/* Eyes */}
      {isHappy ? (
        <>
          <path d="M38 50C40 46 44 46 46 50" stroke="#831843" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M54 50C56 46 60 46 62 50" stroke="#831843" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="42" cy="50" r="4.5" fill="#831843" />
          <circle cx="43" cy="48" r="1.5" fill="#FFFFFF" />
          <circle cx="58" cy="50" r="4.5" fill="#831843" />
          <circle cx="59" cy="48" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Cute nose */}
      <circle cx="50" cy="58" r="3" fill="#831843" />
    </svg>
  );
}
