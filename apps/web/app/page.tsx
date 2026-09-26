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
import { AdultsView } from '../components/AdultsView';
import { ProfileView } from '../components/ProfileView';
import { AuthFlowScreen } from '../components/AuthFlowScreen';
import type { AnimationSemanticEvent } from '@math/contracts';

export default function MobileAppPage() {
  const [selectedGrade, setSelectedGrade] = useState<GradeMeta>(GRADES[0]!);
  const [activeTab, setActiveTab] = useState<MainTabType>('PATH');
  const [activeCharId, setActiveCharId] = useState<string>('aria');
  const [childName, setChildName] = useState<string>('آرش');

  // Auth & Onboarding Flow State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Progressive unlocking of learning nodes in Station 1
  // Step 1 and Step 2 are completed, Step 3 is active, Steps 4-8 are locked
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(['step-1', 'step-2']);

  // Pedagogical metrics (Rhythm & Stars - No punitive streak or heart penalties)
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<number>(3);
  const [learningStars, setLearningStars] = useState<number>(120);

  // Lesson Modal State
  const [isLessonOpen, setIsLessonOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<PathNodeItem | null>(null);

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
    setCompletedNodeIds((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
    setLearningStars((prev) => prev + 3);
    emitSemanticEvent('STATION_PASS', `Runtime.awardMastery(Node=${nodeId})`);
  }

  return (
    <MobileFrame>
      {/* 1. Pedagogical Header (Grades 1-6, Learning Rhythm, Knowledge Stars, Companion) */}
      <DuolingoTopHeader
        selectedGrade={selectedGrade}
        onSelectGrade={(grade) => {
          setSelectedGrade(grade);
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

        {activeTab === 'ADULTS' && (
          <AdultsView semanticEventLog={semanticEventLog} />
        )}

        {activeTab === 'PROFILE' && (
          <ProfileView
            activeCharId={activeCharId}
            onSelectChar={(charId) => {
              setActiveCharId(charId);
              emitSemanticEvent('SESSION_START', `User.selectCompanion(${charId})`);
            }}
            streakDays={weeklyActiveDays}
            gemsCount={learningStars}
          />
        )}
      </main>

      {/* 3. Sticky Bottom Navigation Bar (5 tabs) */}
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

      {/* 5. Custom Rive Auth & Onboarding Gateway Flow Modal */}
      {isAuthOpen && (
        <AuthFlowScreen
          onClose={() => setIsAuthOpen(false)}
          onCompleteAuth={(userData) => {
            setIsAuthOpen(false);
            if (userData.characterId) setActiveCharId(userData.characterId);
            if (userData.childName) setChildName(userData.childName);
            const foundGrade = GRADES.find((g) => g.id === userData.gradeId);
            if (foundGrade) setSelectedGrade(foundGrade);
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
