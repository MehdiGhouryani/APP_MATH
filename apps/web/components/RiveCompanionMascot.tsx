'use client';

import React, { useState, useEffect } from 'react';
import { CHARACTERS, CompanionCharacter } from '../lib/persian';

export type MascotState = 'idle' | 'working' | 'excited' | 'thinking';

interface RiveCompanionMascotProps {
  characterId?: string;
  state?: MascotState;
  size?: number;
  interactive?: boolean;
  showSpeechBubble?: boolean;
  speechText?: string;
  onClick?: () => void;
  className?: string;
}

export function RiveCompanionMascot({
  characterId = 'aria',
  state = 'idle',
  size = 180,
  interactive = true,
  showSpeechBubble = false,
  speechText,
  onClick,
  className = '',
}: RiveCompanionMascotProps) {
  const [internalState, setInternalState] = useState<MascotState>(state);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync state prop with internal state
  useEffect(() => {
    setInternalState(state);
  }, [state]);

  // Natural Blinking Cycle (Rive Idle State Machine)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3500 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const character: CompanionCharacter =
    CHARACTERS[characterId] || CHARACTERS['aria']!;

  const handlePointerClick = () => {
    if (!interactive) return;
    setInternalState('excited');
    setTimeout(() => setInternalState(state), 1500);
    if (onClick) onClick();
  };

  // Determine current active mood colors and speech
  const themeColor = character.themeColor || '#3B82F6';
  const rxMap: Record<string, string> = character.reactions;
  const displayText = speechText || rxMap[internalState] || character.reactions.idle;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePointerClick}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && displayText && (
        <div
          className="absolute -top-12 z-20 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700 whitespace-nowrap animate-bounce pointer-events-none"
          style={{ borderColor: themeColor }}
        >
          {displayText}
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 rotate-45 border-r-2 border-b-2 border-slate-200 dark:border-slate-700"
            style={{ borderColor: themeColor }}
          />
        </div>
      )}

      {/* Rive Vector Canvas Container */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
      >
        {/* Glow Aura Background */}
        <div
          className="absolute inset-2 rounded-full opacity-30 blur-xl transition-all duration-500"
          style={{
            backgroundColor: themeColor,
            transform:
              internalState === 'excited' || isHovered
                ? 'scale(1.15)'
                : 'scale(0.95)',
          }}
        />

        {/* Dynamic SVG Mascot Renderer */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full z-10 overflow-visible"
          style={{
            filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))',
          }}
        >
          {/* Character 1: ARIA (Blue Dragon) */}
          {characterId === 'aria' && (
            <g className={`transition-all duration-300 ${internalState === 'working' ? 'animate-pulse' : ''}`}>
              {/* Dragon Wings */}
              <g className="animate-float-slow">
                <path
                  d="M 35 90 C 10 60, 20 120, 50 110 Z"
                  fill="#2563EB"
                  className="transition-transform origin-right"
                  style={{
                    transform: internalState === 'excited' ? 'rotate(-15deg)' : 'rotate(0deg)',
                  }}
                />
                <path
                  d="M 165 90 C 190 60, 180 120, 150 110 Z"
                  fill="#2563EB"
                  className="transition-transform origin-left"
                  style={{
                    transform: internalState === 'excited' ? 'rotate(15deg)' : 'rotate(0deg)',
                  }}
                />
              </g>

              {/* Main Head & Body */}
              <circle cx="100" cy="105" r="52" fill="#3B82F6" />
              <ellipse cx="100" cy="120" rx="35" ry="30" fill="#60A5FA" />

              {/* Cute Horns */}
              <path d="M 75 58 C 70 38, 82 35, 85 54 Z" fill="#F59E0B" />
              <path d="M 125 58 C 130 38, 118 35, 115 54 Z" fill="#F59E0B" />

              {/* Cheeks */}
              <ellipse cx="68" cy="112" rx="8" ry="5" fill="#F43F5E" opacity="0.4" />
              <ellipse cx="132" cy="112" rx="8" ry="5" fill="#F43F5E" opacity="0.4" />

              {/* Eyes & Blinking Rive State */}
              {!isBlinking ? (
                <g>
                  {/* Left Eye */}
                  <circle cx="80" cy="98" r="13" fill="#FFFFFF" />
                  <circle
                    cx={internalState === 'thinking' ? 83 : 80}
                    cy={internalState === 'thinking' ? 95 : 98}
                    r="7"
                    fill="#1E3A8A"
                  />
                  <circle cx="82" cy="95" r="2.5" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <circle cx="120" cy="98" r="13" fill="#FFFFFF" />
                  <circle
                    cx={internalState === 'thinking' ? 123 : 120}
                    cy={internalState === 'thinking' ? 95 : 98}
                    r="7"
                    fill="#1E3A8A"
                  />
                  <circle cx="122" cy="95" r="2.5" fill="#FFFFFF" />
                </g>
              ) : (
                <g stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round">
                  <path d="M 72 98 Q 80 104 88 98" />
                  <path d="M 112 98 Q 120 104 128 98" />
                </g>
              )}

              {/* Cute Snout & Mouth */}
              <ellipse cx="100" cy="110" rx="9" ry="6" fill="#2563EB" opacity="0.3" />
              {internalState === 'excited' ? (
                <path d="M 92 112 Q 100 126 108 112 Z" fill="#EF4444" />
              ) : internalState === 'working' ? (
                <path d="M 94 114 Q 100 110 106 114" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M 93 113 Q 100 120 107 113" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}

              {/* Sweat drop for Working State */}
              {internalState === 'working' && (
                <path
                  d="M 138 85 Q 142 92 138 96 Q 134 92 138 85 Z"
                  fill="#38BDF8"
                  className="animate-bounce"
                />
              )}
            </g>
          )}

          {/* Character 2: QBO (Emerald Robot) */}
          {characterId === 'qbo' && (
            <g className={`transition-all duration-300 ${internalState === 'working' ? 'animate-pulse' : ''}`}>
              {/* Antenna */}
              <line x1="100" y1="52" x2="100" y2="35" stroke="#059669" strokeWidth="4" />
              <circle cx="100" cy="32" r="7" fill={internalState === 'working' ? '#EF4444' : '#34D399'} className="animate-ping" />

              {/* Robot Body Frame */}
              <rect x="52" y="52" width="96" height="96" rx="24" fill="#10B981" />
              <rect x="62" y="62" width="76" height="76" rx="16" fill="#064E3B" />

              {/* Screen Face */}
              {!isBlinking ? (
                <g>
                  {/* Digital Eyes */}
                  {internalState === 'excited' ? (
                    <g stroke="#34D399" strokeWidth="4" strokeLinecap="round">
                      <path d="M 74 88 L 86 100 L 74 112" />
                      <path d="M 126 88 L 114 100 L 126 112" />
                    </g>
                  ) : (
                    <g>
                      <rect x="74" y="88" width="14" height="20" rx="7" fill="#34D399" />
                      <rect x="112" y="88" width="14" height="20" rx="7" fill="#34D399" />
                    </g>
                  )}
                  {/* Digital Mouth */}
                  <rect x="85" y="118" width="30" height="6" rx="3" fill="#34D399" />
                </g>
              ) : (
                <g stroke="#34D399" strokeWidth="3" strokeLinecap="round">
                  <line x1="72" y1="98" x2="88" y2="98" />
                  <line x1="112" y1="98" x2="128" y2="98" />
                </g>
              )}
            </g>
          )}

          {/* Character 3: JIKO (Golden Bird) */}
          {characterId === 'jiko' && (
            <g className={`transition-all duration-300 ${internalState === 'working' ? 'animate-bounce' : ''}`}>
              {/* Wings */}
              <path d="M 40 100 Q 20 80 45 110 Z" fill="#D97706" />
              <path d="M 160 100 Q 180 80 155 110 Z" fill="#D97706" />

              {/* Round Body */}
              <circle cx="100" cy="105" r="50" fill="#F59E0B" />
              <circle cx="100" cy="115" r="32" fill="#FCD34D" />

              {/* Beak */}
              <polygon points="100,105 88,118 112,118" fill="#EA580C" />

              {/* Eyes */}
              {!isBlinking ? (
                <g>
                  <circle cx="80" cy="92" r="10" fill="#FFFFFF" />
                  <circle cx="80" cy="92" r="5" fill="#78350F" />
                  <circle cx="120" cy="92" r="10" fill="#FFFFFF" />
                  <circle cx="120" cy="92" r="5" fill="#78350F" />
                </g>
              ) : (
                <g stroke="#78350F" strokeWidth="3" strokeLinecap="round">
                  <path d="M 72 92 Q 80 98 88 92" />
                  <path d="M 112 92 Q 120 98 128 92" />
                </g>
              )}
            </g>
          )}

          {/* Character 4: DANA (Purple Squirrel) */}
          {characterId === 'dana' && (
            <g className={`transition-all duration-300 ${internalState === 'working' ? 'animate-pulse' : ''}`}>
              {/* Fluffy Tail */}
              <path d="M 140 120 C 190 130 180 60 130 80 Z" fill="#7C3AED" />

              {/* Head & Ears */}
              <circle cx="100" cy="105" r="48" fill="#8B5CF6" />
              <polygon points="68,65 82,45 88,70" fill="#6D28D9" />
              <polygon points="132,65 118,45 112,70" fill="#6D28D9" />

              {/* Snout */}
              <ellipse cx="100" cy="115" rx="20" ry="14" fill="#DDD6FE" />
              <ellipse cx="100" cy="108" rx="6" ry="4" fill="#4C1D95" />

              {/* Cute Glasses */}
              <circle cx="80" cy="98" r="14" fill="none" stroke="#F59E0B" strokeWidth="3" />
              <circle cx="120" cy="98" r="14" fill="none" stroke="#F59E0B" strokeWidth="3" />
              <line x1="94" y1="98" x2="106" y2="98" stroke="#F59E0B" strokeWidth="3" />

              {/* Eyes */}
              {!isBlinking ? (
                <g>
                  <circle cx="80" cy="98" r="6" fill="#2E1065" />
                  <circle cx="120" cy="98" r="6" fill="#2E1065" />
                  <circle cx="82" cy="96" r="2" fill="#FFFFFF" />
                  <circle cx="122" cy="96" r="2" fill="#FFFFFF" />
                </g>
              ) : (
                <g stroke="#2E1065" strokeWidth="3" strokeLinecap="round">
                  <line x1="74" y1="98" x2="86" y2="98" />
                  <line x1="114" y1="98" x2="126" y2="98" />
                </g>
              )}
            </g>
          )}

          {/* Sparkles / Stars on Excited State */}
          {internalState === 'excited' && (
            <g className="animate-ping">
              <path d="M 30 40 L 35 50 L 45 55 L 35 60 L 30 70 L 25 60 L 15 55 L 25 50 Z" fill="#FBBF24" />
              <path d="M 160 30 L 163 38 L 171 41 L 163 44 L 160 52 L 157 44 L 149 41 L 157 38 Z" fill="#FBBF24" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
