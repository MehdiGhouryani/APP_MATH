'use client';

import React, { useState, useEffect } from 'react';
import { MobileFrame } from '../components/MobileFrame';
import { ChildTopBar } from '../components/ChildTopBar';
import { ChildBottomNav, type MainTabType } from '../components/ChildBottomNav';
import { DuolingoPath, type PathNodeItem } from '../components/DuolingoPath';
import { DuolingoLessonModal } from '../components/DuolingoLessonModal';
import { BackpackView } from '../components/BackpackView';
import { ProfileView } from '../components/ProfileView';
import { AuthFlowScreen } from '../components/AuthFlowScreen';
import { CharacterArt } from '../components/CharacterArt';
import { GRADES, CHARACTERS, type GradeMeta } from '../lib/persian';
import { soundFx } from '../lib/sound';
import type { AnimationSemanticEvent } from '@math/contracts';

interface ChildProfile {
  childName: string;
  gradeId: string;
}

const DEFAULT_PROFILE: ChildProfile = {
  childName: 'آرش',
  gradeId: 'G1',
};

const DEFAULT_COMPLETED_NODES = ['step-1', 'step-2'];

export default function ChildHomePage() {
  const [activeTab, setActiveTab] = useState<MainTabType>('PATH');
  const [profile, setProfile] = useState<ChildProfile>(DEFAULT_PROFILE);
  const [selectedGrade, setSelectedGrade] = useState<GradeMeta>(GRADES[0]!);
  const [activeCharId, setActiveCharId] = useState<string>('aria');
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(DEFAULT_COMPLETED_NODES);
  const [learningStars, setLearningStars] = useState<number>(12);
  const [activeLessonNode, setActiveLessonNode] = useState<PathNodeItem | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCompanionModal, setShowCompanionModal] = useState<boolean>(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('math_app_child_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<ChildProfile>;
        const merged: ChildProfile = {
          childName: parsed.childName || DEFAULT_PROFILE.childName,
          gradeId: parsed.gradeId || DEFAULT_PROFILE.gradeId,
        };
        setProfile(merged);
        const matchedGrade = GRADES.find((g) => g.id === merged.gradeId) || GRADES[0]!;
        setSelectedGrade(matchedGrade);
      }

      const savedNodes = localStorage.getItem('math_app_completed_node_ids');
      if (savedNodes) {
        const parsedNodes = JSON.parse(savedNodes);
        if (Array.isArray(parsedNodes)) {
          setCompletedNodeIds(parsedNodes);
        }
      }

      const savedStars = localStorage.getItem('math_app_learning_stars');
      if (savedStars) {
        const num = parseInt(savedStars, 10);
        if (!isNaN(num)) setLearningStars(num);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const handleSelectGrade = (grade: GradeMeta) => {
    setSelectedGrade(grade);
    const updated = { ...profile, gradeId: grade.id };
    setProfile(updated);
    try {
      localStorage.setItem('math_app_child_profile', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCompleteNode = (nodeId: string, result?: any) => {
    setCompletedNodeIds((prev) => {
      const next = prev.includes(nodeId) ? prev : [...prev, nodeId];
      try {
        localStorage.setItem('math_app_completed_node_ids', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    const scoreEarned = result?.attempt?.evaluation?.score ?? 3;
    setLearningStars((prev) => {
      const next = prev + scoreEarned;
      try {
        localStorage.setItem('math_app_learning_stars', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleCompleteAuth = (userData: {
    phoneNumber?: string;
    authMethod: 'MOBILE' | 'GOOGLE' | 'GUEST';
    gradeId: string;
    characterId: string;
    childName: string;
  }) => {
    const updated: ChildProfile = {
      childName: userData.childName || profile.childName,
      gradeId: userData.gradeId || profile.gradeId,
    };
    setProfile(updated);
    const matchedGrade = GRADES.find((g) => g.id === updated.gradeId) || GRADES[0]!;
    setSelectedGrade(matchedGrade);
    if (userData.characterId) {
      setActiveCharId(userData.characterId);
    }
    setShowAuthModal(false);
    try {
      localStorage.setItem('math_app_child_profile', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleEmitSemanticEvent = (event: AnimationSemanticEvent, detail: string) => {
    // Event logging for diagnostic / debugging
  };

  return (
    <MobileFrame>
      {/* Accessible App Title Heading */}
      <h1
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.01,
          fontSize: '10px',
          pointerEvents: 'none',
          zIndex: 1,
          margin: 0,
        }}
      >
        Math Learning Product
      </h1>

      {/* Child Top Bar */}
      <ChildTopBar
        selectedGrade={selectedGrade}
        onSelectGrade={handleSelectGrade}
        activeCharId={activeCharId}
        onOpenCompanionModal={() => setShowCompanionModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        weeklyActiveDays={3}
        learningStars={learningStars}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {activeTab === 'PATH' && (
          <DuolingoPath
            selectedGrade={selectedGrade}
            activeCharId={activeCharId}
            completedNodeIds={completedNodeIds}
            onSelectNode={(node) => setActiveLessonNode(node)}
          />
        )}

        {activeTab === 'PRACTICE' && (
          <BackpackView completedNodeIds={completedNodeIds} initialTab="SKILLS" />
        )}

        {activeTab === 'BACKPACK' && (
          <BackpackView completedNodeIds={completedNodeIds} initialTab="BADGES" />
        )}

        {activeTab === 'PROFILE' && (
          <ProfileView
            activeCharId={activeCharId}
            childName={profile.childName}
            gradeTitle={selectedGrade.title}
            streakDays={3}
            gemsCount={learningStars * 4}
          />
        )}
      </main>

      {/* Child Bottom Navigation */}
      <ChildBottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Duolingo Lesson Modal */}
      {activeLessonNode && (
        <DuolingoLessonModal
          activeNode={activeLessonNode}
          activeCharId={activeCharId}
          onClose={() => setActiveLessonNode(null)}
          onCompleteNode={handleCompleteNode}
          onEmitSemanticEvent={handleEmitSemanticEvent}
        />
      )}

      {/* Auth / Login Modal */}
      {showAuthModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            backgroundColor: '#ffffff',
          }}
        >
          <AuthFlowScreen
            onClose={() => setShowAuthModal(false)}
            onCompleteAuth={handleCompleteAuth}
          />
        </div>
      )}

      {/* Companion Mascot Switcher Modal */}
      {showCompanionModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: 16,
          }}
          onClick={() => setShowCompanionModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 24,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
              همراهان دانایی ریاضی
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
              هر کدام از دوستانت در بخشی از ماجراجویی ریاضی همراهت هستند
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Object.values(CHARACTERS).map((char) => {
                const isSelected = char.id === activeCharId;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      soundFx.playTap();
                      setActiveCharId(char.id);
                      setShowCompanionModal(false);
                    }}
                    style={{
                      border: isSelected ? `2.5px solid ${char.themeColor}` : '2px solid #e2e8f0',
                      borderRadius: 16,
                      padding: 14,
                      backgroundColor: isSelected ? `${char.themeColor}12` : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        backgroundColor: char.avatarBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CharacterArt id={char.id} bust size={46} reducedMotion />
                    </div>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{char.name}</strong>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{char.role}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowCompanionModal(false)}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '10px',
                backgroundColor: '#f1f5f9',
                border: 'none',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}
