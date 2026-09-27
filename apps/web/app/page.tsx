'use client';

import React, { useState, useEffect } from 'react';
import { GRADES, GradeMeta } from '../lib/persian';
import { MobileFrame } from '../components/MobileFrame';
import { DuolingoTopHeader } from '../components/DuolingoTopHeader';
import { DuolingoBottomNav, MainTabType } from '../components/DuolingoBottomNav';
import { DuolingoPath, PathNodeItem } from '../components/DuolingoPath';
import { DuolingoLessonModal } from '../components/DuolingoLessonModal';
import { LeaderboardView } from '../components/LeaderboardView';
import { BackpackView } from '../components/BackpackView';
import { ProfileView } from '../components/ProfileView';
import { AuthFlowScreen } from '../components/AuthFlowScreen';
import type { AnimationSemanticEvent } from '@math/contracts';

export default function MobileAppPage() {
  const [selectedGrade, setSelectedGrade] = useState<GradeMeta>(GRADES[0]!);
  const [activeTab, setActiveTab] = useState<MainTabType>('PATH');
  const [activeCharId, setActiveCharId] = useState<string>('aria');
  const [childName, setChildName] = useState<string>('آرش');

  // Auth & Onboarding Flow State (Child-first companion selection & progress sync)
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Progressive unlocking of learning nodes in Station 1
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(['step-1', 'step-2']);

  // Pedagogical metrics (Rhythm & Stars - No punitive streak or heart penalties)
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<number>(3);
  const [learningStars, setLearningStars] = useState<number>(120);

  // Lesson Modal State
  const [isLessonOpen, setIsLessonOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<PathNodeItem | null>(null);

  // Rehydrate child context & learning state on mount from localStorage
  useEffect(() => {
    try {
      // 1. Restore child profile context
      const savedProfile = localStorage.getItem('math_app_child_profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile.childName) setChildName(parsedProfile.childName);
        if (parsedProfile.activeCharId) setActiveCharId(parsedProfile.activeCharId);
        if (parsedProfile.gradeId) {
          const matched = GRADES.find((g) => g.id === parsedProfile.gradeId);
          if (matched) setSelectedGrade(matched);
        }
      }

      // 2. Restore learning progress
      const savedNodes = localStorage.getItem('math_app_completed_node_ids');
      if (savedNodes) {
        const parsed = JSON.parse(savedNodes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompletedNodeIds(parsed);
        }
      }
      const savedStars = localStorage.getItem('math_app_learning_stars');
      if (savedStars) {
        const parsedStars = parseInt(savedStars, 10);
        if (!isNaN(parsedStars)) {
          setLearningStars(parsedStars);
        }
      }
    } catch {}
  }, []);

  // Helper to persist child profile changes
  function persistChildProfile(updates: { childName?: string; activeCharId?: string; gradeId?: string }) {
    try {
      const current = {
        childName: updates.childName ?? childName,
        activeCharId: updates.activeCharId ?? activeCharId,
        gradeId: updates.gradeId ?? selectedGrade.id,
      };
      localStorage.setItem('math_app_child_profile', JSON.stringify(current));
    } catch {}
  }

  // Semantic Animation Event Log (ADR 0002 & ADR 0004) - Client safe initialization
  const [semanticEventLog, setSemanticEventLog] = useState<
    Array<{ event: string; time: string; source: string }>
  >([]);

  useEffect(() => {
    setSemanticEventLog([
      {
        event: 'SESSION_START',
        time: new Date().toLocaleTimeString('fa-IR'),
        source: 'MobileShell.init()',
      },
    ]);
  }, []);

  function emitSemanticEvent(event: AnimationSemanticEvent, source: string) {
    setSemanticEventLog((prev) => [
      { event, time: new Date().toLocaleTimeString('fa-IR'), source },
      ...prev.slice(0, 9),
    ]);
  }

  function handleNodeSelect(node: PathNodeItem) {
    // Launch bite-sized learning encounter
    setSelectedNode(node);
    emitSemanticEvent('SESSION_START', `User.startLesson(${node.id})`);
    setIsLessonOpen(true);
  }

  function handleCompleteNode(nodeId: string) {
    setCompletedNodeIds((prev) => {
      const next = prev.includes(nodeId) ? prev : [...prev, nodeId];
      try {
        localStorage.setItem('math_app_completed_node_ids', JSON.stringify(next));
      } catch {}
      return next;
    });
    setLearningStars((prev) => {
      const nextStars = prev + 3;
      try {
        localStorage.setItem('math_app_learning_stars', nextStars.toString());
      } catch {}
      return nextStars;
    });
    emitSemanticEvent('STATION_PASS', `Runtime.awardMastery(Node=${nodeId})`);
  }

  return (
    <MobileFrame>
      {/* 1. Pedagogical Header (Grades 1-6, Learning Rhythm, Knowledge Stars, Companion, Secondary Menu for Teachers) */}
      <DuolingoTopHeader
        selectedGrade={selectedGrade}
        onSelectGrade={(grade) => {
          setSelectedGrade(grade);
          persistChildProfile({ gradeId: grade.id });
          emitSemanticEvent('SESSION_START', `User.switchGrade(${grade.id})`);
        }}
        activeCharId={activeCharId}
        onOpenCompanionModal={() => setActiveTab('PROFILE')}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        weeklyActiveDays={weeklyActiveDays}
        learningStars={learningStars}
      />

      {/* 2. Scrollable Tab Contents Container */}
      <main
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          backgroundColor: '#ffffff',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
        }}
      >
        <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
          Math Learning Product
        </h1>
        {activeTab === 'PATH' && (
          <DuolingoPath
            selectedGrade={selectedGrade}
            activeCharId={activeCharId}
            completedNodeIds={completedNodeIds}
            onSelectNode={handleNodeSelect}
          />
        )}

        {activeTab === 'LEAGUES' && <LeaderboardView />}

        {activeTab === 'BACKPACK' && <BackpackView />}

        {activeTab === 'PROFILE' && (
          <ProfileView
            activeCharId={activeCharId}
            onSelectChar={(charId) => {
              setActiveCharId(charId);
              persistChildProfile({ activeCharId: charId });
              emitSemanticEvent('SESSION_START', `User.selectCompanion(${charId})`);
            }}
            streakDays={weeklyActiveDays}
            gemsCount={learningStars}
          />
        )}
      </main>

      {/* 3. Sticky Bottom Navigation Bar (4 child-only tabs) */}
      <DuolingoBottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          emitSemanticEvent('SESSION_START', `User.navigateTab(${tab})`);
        }}
      />

      {/* 4. Bite-sized Interactive Learning Encounter Modal */}
      {isLessonOpen && selectedNode && (
        <DuolingoLessonModal
          onClose={() => {
            setIsLessonOpen(false);
            setSelectedNode(null);
          }}
          activeCharId={activeCharId}
          activeNode={selectedNode}
          onEmitSemanticEvent={emitSemanticEvent}
          onCompleteNode={handleCompleteNode}
        />
      )}

      {/* 5. Custom Rive Auth & Child Onboarding Gateway Flow Modal */}
      {isAuthOpen && (
        <AuthFlowScreen
          onClose={() => setIsAuthOpen(false)}
          onCompleteAuth={(userData) => {
            setIsAuthOpen(false);
            if (userData.characterId) {
              setActiveCharId(userData.characterId);
            }
            if (userData.childName) {
              setChildName(userData.childName);
            }
            const foundGrade = GRADES.find((g) => g.id === userData.gradeId);
            if (foundGrade) {
              setSelectedGrade(foundGrade);
            }
            persistChildProfile({
              childName: userData.childName,
              activeCharId: userData.characterId,
              gradeId: userData.gradeId,
            });
            emitSemanticEvent(
              'SESSION_START',
              `User.authCompleted(Method=${userData.authMethod}, Grade=${userData.gradeId}, Companion=${userData.characterId})`
            );
          }}
        />
      )}
    </MobileFrame>
  );
}
