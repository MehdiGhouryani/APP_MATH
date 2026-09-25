'use client';

import React, { useState } from 'react';
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
import type { AnimationSemanticEvent } from '@math/contracts';

export default function MobileAppPage() {
  const [selectedGrade, setSelectedGrade] = useState<GradeMeta>(GRADES[0]!);
  const [activeTab, setActiveTab] = useState<MainTabType>('PATH');
  const [activeCharId, setActiveCharId] = useState<string>('aria');

  // Pedagogical metrics (Rhythm & Stars - No punitive streak or heart penalties)
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<number>(3);
  const [learningStars, setLearningStars] = useState<number>(120);

  // Lesson Modal State
  const [isLessonOpen, setIsLessonOpen] = useState<boolean>(false);

  // Semantic Animation Event Log (ADR 0002 & ADR 0004)
  const [semanticEventLog, setSemanticEventLog] = useState<
    Array<{ event: string; time: string; source: string }>
  >([
    {
      event: 'SESSION_START',
      time: new Date().toLocaleTimeString('fa-IR'),
      source: 'MobileShell.init()',
    },
  ]);

  function emitSemanticEvent(event: AnimationSemanticEvent, source: string) {
    setSemanticEventLog((prev) => [
      { event, time: new Date().toLocaleTimeString('fa-IR'), source },
      ...prev.slice(0, 9),
    ]);
  }

  function handleNodeSelect(node: PathNodeItem) {
    if (node.status === 'LOCKED') {
      alert('این مرحله هنوز قفل است! ابتدا مراحل قبلی را کامل کنید.');
      return;
    }
    // Launch bite-sized learning encounter
    emitSemanticEvent('SESSION_START', `User.startLesson(${node.id})`);
    setIsLessonOpen(true);
  }

  function handleCompleteLesson() {
    setLearningStars((prev) => prev + 3);
    emitSemanticEvent('STATION_PASS', 'Runtime.awardMastery(Station=ST01)');
  }

  return (
    <MobileFrame>
      {/* Pedagogical Header (Grades 1-6, Learning Rhythm, Knowledge Stars, Companion) */}
      <DuolingoTopHeader
        selectedGrade={selectedGrade}
        onSelectGrade={(grade) => {
          setSelectedGrade(grade);
          emitSemanticEvent('SESSION_START', `User.switchGrade(${grade.id})`);
        }}
        activeCharId={activeCharId}
        onOpenCompanionModal={() => setActiveTab('PROFILE')}
        weeklyActiveDays={weeklyActiveDays}
        learningStars={learningStars}
      />

      {/* Tab Contents */}
      <div style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'PATH' && (
          <DuolingoPath
            selectedGrade={selectedGrade}
            activeCharId={activeCharId}
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
      </div>

      {/* Bite-sized Interactive Learning Encounter Modal */}
      {isLessonOpen && (
        <DuolingoLessonModal
          onClose={() => setIsLessonOpen(false)}
          activeCharId={activeCharId}
          onEmitSemanticEvent={emitSemanticEvent}
          onCompleteLesson={handleCompleteLesson}
        />
      )}

      {/* Sticky Bottom Navigation Bar (5 tabs) */}
      <DuolingoBottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          emitSemanticEvent('SESSION_START', `User.navigateTab(${tab})`);
        }}
      />
    </MobileFrame>
  );
}
