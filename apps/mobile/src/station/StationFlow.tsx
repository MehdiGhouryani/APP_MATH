import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CharacterSays } from '../components/CharacterAvatar';
import { CHARACTERS, speakerForContent, type CharacterId } from '../characters/characters';
import { makeAnimationEvent, useAnimationController } from '../animation';
import { createEncounter, getLocalContent, getRecoveryContent, getRecheckContent, shouldUseRemoteRuntime, startStationSession, submitAttempt } from './runtimeApi';
import { useAppState } from '../state/AppStateContext';
import { RESUMABLE_STAGES, getResume, shouldFastTrack, type ResumableStage } from '../state/appStateCore';
import { MACRO_LABELS, macroFilled, macroLabel } from './macro';
import { S } from '../ui/strings.fa';
import { toFa } from '../ui/digits';
import type { AnswerPayload, StationContent, StationStage, SubmitOutcome } from './types';

export function StationFlow({ stationId }: { stationId: string }) {
  const { dispatch } = useAnimationController();
  const app = useAppState();
  const router = useRouter();
  const [stage, setStage] = useState<StationStage>('ENTRY');
  const [lessonStage, setLessonStage] = useState<StationStage | null>(null);
  const [activeSkillId, setActiveSkillId] = useState<string | undefined>(undefined);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [encounterId, setEncounterId] = useState<string | null>(null);
  const [sequence, setSequence] = useState(1);
  const [lastOutcome, setLastOutcome] = useState<SubmitOutcome | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'REMOTE' | 'LOCAL'>(shouldUseRemoteRuntime() ? 'REMOTE' : 'LOCAL');
  const [message, setMessage] = useState('');
  const [localPassedChecks, setLocalPassedChecks] = useState(0);
  const [stationPassAchieved, setStationPassAchieved] = useState(false);

  // Consume the placement fast-track the first time the station really starts
  // (stage leaves ENTRY). Done here, not in start(), so a failed network call at
  // the very first encounter does not burn the fast-track.
  const { startStation } = app;
  useEffect(() => {
    if (stage !== 'ENTRY') startStation(stationId);
  }, [stage, stationId, startStation]);

  useEffect(() => {
    dispatch(makeAnimationEvent('SESSION_START', { stationId }));
  }, [dispatch, stationId]);

  const filled = macroFilled(stage, lessonStage);
  const content = useMemo(() => {
    if (stage === 'LEARN') return getLocalContent('learn');
    if (stage === 'GUIDED') return getLocalContent('guided');
    if (stage === 'GAME_PATTERN') return getLocalContent('pattern');
    if (stage === 'GAME_COUNT') return getLocalContent('count');
    if (stage === 'INDEPENDENT') return getLocalContent('independent');
    if (stage === 'REVIEW') return getLocalContent('review');
    if (stage === 'TRANSFER') return getLocalContent('transfer');
    if (stage === 'CHECK_A') return getLocalContent('checkA');
    if (stage === 'CHECK_B') return getLocalContent('checkB');
    if (stage === 'MASTERY_CHECK') return getLocalContent('mastery');
    if (stage === 'RECOVERY') return getLocalContent('recovery');
    if (stage === 'RECHECK') return getLocalContent('recheck');
    return null;
  }, [stage]);

  async function ensureSession() {
    if (sessionId) return sessionId;
    if (mode === 'LOCAL') {
      const localId = `local-session-${Date.now()}`;
      setSessionId(localId);
      return localId;
    }
    try {
      const session = await startStationSession();
      setSessionId(session.id);
      return session.id;
    } catch {
      if (__DEV__) {
        setMode('LOCAL');
        const localId = `local-session-${Date.now()}`;
        setSessionId(localId);
        // DEV-only fallback; intentionally silent for children.
        return localId;
      }
      setMessage(S.lesson.startFailed);
      throw new Error('REMOTE_RUNTIME_UNAVAILABLE');
    }
  }

  async function beginEncounter(nextContent: StationContent, nextStage: StationStage) {
    const session = await ensureSession();
    setBusy(true);
    try {
      if (mode === 'REMOTE') {
        const created = await createEncounter(session, nextContent, sequence);
        setEncounterId(created.encounter.id);
      }
      setSequence((value) => value + 1);
      setActiveSkillId(nextContent.skillId);
      setStage(nextStage);
      dispatch(makeAnimationEvent(nextStage === 'LEARN' ? 'EXPLAIN' : 'HINT_OPENED', { sessionId: session, stationId }));
    } finally {
      setBusy(false);
    }
  }

  async function answerContent(target: StationContent, answerIndex: number) {
    const session = await ensureSession();
    setBusy(true);
    try {
      let outcome: SubmitOutcome;
      if (mode === 'REMOTE' && encounterId) {
        outcome = await submitAttempt({ sessionId: session, encounterId, content: target, answer: { answerIndex, answerPayload: answerIndex }, attemptNumber });
      } else {
        // LOCAL is only a dev/startup fallback. There is no server encounter to
        // attach an idempotent attempt to, so never claim that it was queued.
        setMessage(S.lesson.submitFailed);
        return;
      }
      setLastOutcome(outcome);
      if (outcome.syncPending) {
        setMessage(S.lesson.checkQueued);
        return;
      }
      setAttemptNumber((value) => value + 1);
      dispatch(makeAnimationEvent(outcome.semanticEvent as never, { sessionId: session, stationId }));

      if (target.id === 'G1-ST01-E03') await beginEncounter(getLocalContent('count'), 'GAME_COUNT');
      else if (target.id === 'G1-ST01-E04') await beginEncounter(getLocalContent('independent'), 'INDEPENDENT');
      else if (target.id === 'G1-ST01-E05') await beginEncounter(getLocalContent('review'), 'REVIEW');
      else if (target.id === 'G1-ST01-E06') await beginEncounter(getLocalContent('checkA'), 'CHECK_A');
      else if (target.id === 'G1-ST01-E07') {
        if (outcome.correct || outcome.selectedStep === 'RECHECK') {
          await beginFreshCheckEncounter(getLocalContent('checkB'), 'CHECK_B');
        } else {
          await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
        }
      } else if (target.id === 'G1-ST01-E08') {
        const passed = outcome.stationPass;
        if (passed) {
          setStationPassAchieved(true);
          setLastOutcome({ ...outcome, stationPass: true, selectedStep: 'STATION_PASS', semanticEvent: 'STATION_PASS' });
          dispatch(makeAnimationEvent('STATION_PASS', { sessionId: session, stationId }));
          await beginEncounter(getLocalContent('transfer'), 'TRANSFER');
        } else if (outcome.selectedStep === 'RECOVERY') {
          await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
        } else {
          await beginFreshCheckEncounter(getLocalContent('checkB'), 'CHECK_B');
        }
      } else if (target.id === 'G1-ST01-E09') await beginFreshCheckEncounter(getRecheckContent(outcome?.decisionTargetSkillId ?? target.skillId), 'RECHECK');
      else if (target.id === 'G1-ST01-E10') {
        if (outcome.selectedStep === 'RECOVERY') await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
        else await beginEncounter(getLocalContent('transfer'), 'TRANSFER');
      } else if (target.id === 'G1-ST01-E11') {
        await beginFreshCheckEncounter(getLocalContent('mastery'), 'MASTERY_CHECK');
      } else setStage('RESULT');
    } catch {
      setMessage(S.lesson.submitFailed);
    } finally {
      setBusy(false);
    }
  }

  async function answerCheck(target: StationContent, answers: AnswerPayload[]) {
    const session = await ensureSession();
    setBusy(true);
    try {
      let outcome: SubmitOutcome;
      if (mode === 'REMOTE' && encounterId) {
        outcome = await submitAttempt({ sessionId: session, encounterId, content: target, answers, attemptNumber });
      } else {
        // A local fallback cannot produce an authoritative Check result.
        setMessage(S.lesson.submitFailed);
        return;
      }
      setLastOutcome(outcome);
      if (outcome.syncPending) {
        setMessage(S.lesson.checkQueued);
        return;
      }
      setAttemptNumber((value) => value + 1);
      dispatch(makeAnimationEvent(outcome.semanticEvent as never, { sessionId: session, stationId }));
      if (target.id === 'G1-ST01-E12') {
        setLastOutcome({ ...outcome, stationPass: stationPassAchieved, selectedStep: 'CONTINUE', semanticEvent: outcome.correct ? 'ANSWER_CORRECT' : 'ANSWER_WRONG' });
        setStage('COMPLETE');
      } else if (target.id === 'G1-ST01-E08') {
        if (outcome.stationPass) {
          setStationPassAchieved(true);
          setLastOutcome({ ...outcome, stationPass: true, selectedStep: 'STATION_PASS', semanticEvent: 'STATION_PASS' });
          dispatch(makeAnimationEvent('STATION_PASS', { sessionId: session, stationId }));
          await beginEncounter(getLocalContent('transfer'), 'TRANSFER');
        } else if (outcome.selectedStep === 'RECOVERY') {
          await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
        } else {
          // A single qualifying Check is not Station Pass; never advance to Transfer without the second independent pass.
          await beginFreshCheckEncounter(getLocalContent('checkB'), 'CHECK_B');
        }
      } else if (outcome.stationPass) {
        setStationPassAchieved(true);
        setLastOutcome({ ...outcome, stationPass: true, selectedStep: 'STATION_PASS', semanticEvent: 'STATION_PASS' });
        dispatch(makeAnimationEvent('STATION_PASS', { sessionId: session, stationId }));
        await beginEncounter(getLocalContent('transfer'), 'TRANSFER');
      } else if (target.id === 'G1-ST01-E07' && outcome.selectedStep !== 'RECOVERY') {
        await beginFreshCheckEncounter(getLocalContent('checkB'), 'CHECK_B');
      } else if (target.id === 'G1-ST01-E10') {
        if (outcome.selectedStep === 'RECOVERY') await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
        else if (stationPassAchieved) await beginEncounter(getLocalContent('transfer'), 'TRANSFER');
        else await beginFreshCheckEncounter(getLocalContent('checkB'), 'CHECK_B');
      } else if (target.id === 'G1-ST01-E11') {
        await beginFreshCheckEncounter(getLocalContent('mastery'), 'MASTERY_CHECK');
      } else if (outcome.selectedStep === 'RECOVERY') {
        await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
      } else if (outcome.selectedStep === 'RECHECK') {
        await beginFreshCheckEncounter(getRecheckContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECHECK');
      } else {
        setStage('RESULT');
      }
    } catch {
      setMessage(S.lesson.submitFailed);
    } finally {
      setBusy(false);
    }
  }

  async function beginFreshCheckEncounter(nextContent: StationContent, nextStage: StationStage) {
    setBusy(true);
    try {
      let freshSessionId = sessionId;
      if (mode === 'REMOTE') {
        const freshSession = await startStationSession();
        freshSessionId = freshSession.id;
        setSessionId(freshSession.id);
      } else {
        freshSessionId = `local-check-session-${Date.now()}`;
        setSessionId(freshSessionId);
      }
      if (mode === 'REMOTE') {
        const created = await createEncounter(freshSessionId!, nextContent, 1);
        setEncounterId(created.encounter.id);
      }
      setActiveSkillId(nextContent.skillId);
      setStage(nextStage);
      dispatch(makeAnimationEvent('EXPLAIN', { sessionId: freshSessionId ?? undefined, stationId }));
    } finally {
      setBusy(false);
    }
  }

  function contentForResume(stage: ResumableStage, skillId?: string): StationContent {
    switch (stage) {
      case 'LEARN': return getLocalContent('learn');
      case 'GUIDED': return getLocalContent('guided');
      case 'GAME_PATTERN': return getLocalContent('pattern');
      case 'GAME_COUNT': return getLocalContent('count');
      case 'INDEPENDENT': return getLocalContent('independent');
      case 'REVIEW': return getLocalContent('review');
      case 'TRANSFER': return getLocalContent('transfer');
      case 'CHECK_A': return getLocalContent('checkA');
      case 'CHECK_B': return getLocalContent('checkB');
      case 'MASTERY_CHECK': return getLocalContent('mastery');
      case 'RECOVERY': return getRecoveryContent(skillId ?? getLocalContent('recovery').skillId);
      case 'RECHECK': return getRecheckContent(skillId ?? getLocalContent('recheck').skillId);
    }
  }

  /**
   * Begin (or resume) the station. `fresh` ignores any saved resume point
   * ("دوباره بازی کنیم"). Never throws: failure leaves the friendly retry screen.
   */
  async function start(fresh: boolean) {
    setLocalPassedChecks(0);
    setStationPassAchieved(false);
    setLastOutcome(null);
    setMessage('');
    setAttemptNumber(1);
    setSequence(1);
    setEncounterId(null);
    setSessionId(null);
    setLessonStage(null);
    try {
      const resume = fresh ? null : getResume(app.state, stationId);
      if (resume) {
        // Child closed the app mid-station: continue at the same stage, keeping any
        // check already passed (a pass earned earlier must not be lost).
        setLocalPassedChecks(resume.checks);
        setStationPassAchieved(resume.passAchieved);
        const target = contentForResume(resume.stage, resume.skillId);
        if (resume.stage === 'CHECK_A' || resume.stage === 'CHECK_B' || resume.stage === 'MASTERY_CHECK' || resume.stage === 'RECHECK') await beginFreshCheckEncounter(target, resume.stage);
        else await beginEncounter(target, resume.stage);
        return;
      }
      // Placement fast-track (SoT S06-S08) is ONE-SHOT: it only applies until this
      // station is first started (see the effect above), so review/retry always
      // teaches from the beginning again.
      if (!fresh && app.state && shouldFastTrack(app.state, stationId)) await beginEncounter(getLocalContent('independent'), 'INDEPENDENT');
      else await beginEncounter(getLocalContent('learn'), 'LEARN');
    } catch {
      setMessage((m) => m || S.lesson.startFailed);
      setStage('ENTRY');
    }
  }

  // Open the lesson straight away (no extra "start" screen): first tap on Home = first exercise.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current) return;
    autoStarted.current = true;
    void start(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remember the last lesson stage for the macro bar and RESULT screen.
  useEffect(() => {
    if ((RESUMABLE_STAGES as readonly string[]).includes(stage)) setLessonStage(stage);
  }, [stage]);

  // Persist the resume point whenever the child reaches a resumable stage; clear it
  // when the journey is finished (and record the station pass if it was earned).
  const { saveResume, passStation } = app;
  useEffect(() => {
    if ((RESUMABLE_STAGES as readonly string[]).includes(stage)) {
      saveResume(stationId, {
        stage: stage as ResumableStage,
        checks: Math.min(2, localPassedChecks),
        passAchieved: stationPassAchieved,
        ...(stage === 'RECOVERY' || stage === 'RECHECK' ? (activeSkillId ? { skillId: activeSkillId } : {}) : {}),
      });
    } else if (stage === 'COMPLETE') {
      if (stationPassAchieved) passStation(stationId);
      else saveResume(stationId, null);
    }
  }, [stage, stationId, localPassedChecks, stationPassAchieved, activeSkillId, saveResume, passStation]);

  // Leaving a lesson is a deliberate act: ✕ and the Android back button both ask first.
  function confirmExit() {
    Alert.alert(S.lesson.exitTitle, S.lesson.exitBody, [
      { text: S.lesson.exitStay, style: 'cancel' },
      { text: S.lesson.exitLeave, style: 'destructive', onPress: leave },
    ]);
  }
  function leave() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stage === 'COMPLETE' || stage === 'ENTRY') {
        leave();
        return true;
      }
      confirmExit();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function continueFromResult() {
    if (lastOutcome?.syncPending) return;
    if (lastOutcome?.selectedStep === 'RECOVERY') void beginEncounter(getRecoveryContent(lastOutcome.decisionTargetSkillId), 'RECOVERY');
    else if (lastOutcome?.selectedStep === 'RECHECK') void beginFreshCheckEncounter(getRecheckContent(lastOutcome.decisionTargetSkillId), 'RECHECK');
    else if (lastOutcome?.stationPass) {
      app.passStation(stationId);
      setStage('COMPLETE');
    }
    else void beginEncounter(getLocalContent('pattern'), 'GAME_PATTERN');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable accessibilityRole="button" accessibilityLabel={S.lesson.exitA11y} style={styles.exit} onPress={stage === 'COMPLETE' ? leave : confirmExit}>
            <Text style={styles.exitText}>✕</Text>
          </Pressable>
          <View style={styles.macroBar} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: MACRO_LABELS.length, now: filled }}>
            {MACRO_LABELS.map((label, index) => (
              <View key={label} style={[styles.segment, index < filled && styles.segmentOn]} />
            ))}
          </View>
        </View>
        <Text style={styles.macroLabel}>{macroLabel(stage, lessonStage)}</Text>

        {(() => {
          // One speaker per screen (SoT §14.2). Main = Aria; supporting = Qbo/Dana/Jiko inside
          // their own exercises; NO character during assessments (SoT §10.5).
          let speaker: { id: CharacterId; text: string } | null = null;
          if (stage === 'ENTRY') speaker = { id: 'aria', text: message ? CHARACTERS.aria.lines.wrong : CHARACTERS.aria.lines.greet };
          else if (stage === 'RESULT') {
            speaker = lastOutcome?.correct
              ? { id: 'jiko', text: CHARACTERS.jiko.lines.correct }
              : { id: 'aria', text: CHARACTERS.aria.lines.wrong };
          } else if (stage === 'COMPLETE') speaker = { id: 'jiko', text: CHARACTERS.jiko.lines.done };
          else if (content) {
            const id = speakerForContent(content.id);
            if (id) speaker = { id, text: content.id === 'G1-ST01-E01' ? CHARACTERS[id].lines.greet : CHARACTERS[id].lines.hint };
          }
          return speaker ? <CharacterSays id={speaker.id} text={speaker.text} /> : null;
        })()}
        {message && stage !== 'ENTRY' ? <View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View> : null}

        {stage === 'ENTRY' && (
          <Card title={message ? 'یک لحظه…' : S.lesson.preparing} subtitle={message || 'درس را برایت آماده می‌کنم.'}>
            {message ? <PrimaryButton label={S.lesson.retry} onPress={() => void start(false)} /> : <Text style={styles.story}>🌟</Text>}
          </Card>
        )}

        {content && (stage === 'LEARN' || stage === 'GUIDED' || stage === 'GAME_PATTERN' || stage === 'GAME_COUNT' || stage === 'INDEPENDENT' || stage === 'REVIEW' || stage === 'TRANSFER' || stage === 'CHECK_A' || stage === 'CHECK_B' || stage === 'MASTERY_CHECK' || stage === 'RECOVERY' || stage === 'RECHECK') && (
          <Card title={content.title} subtitle={content.prompt}>
            {content.id === 'G1-ST01-E01' ? <LearnScene /> : null}
            {content.id === 'G1-ST01-E02' ? <OptionRow options={content.options ?? []} onPick={(index) => void answerContent(content, index)} /> : null}
            {content.id === 'G1-ST01-E03' || content.id === 'G1-ST01-E06' ? <PatternGame onPick={(index) => void answerContent(content, index)} /> : null}
            {(content.id === 'G1-ST01-E07' || content.id === 'G1-ST01-E08' || content.id === 'G1-ST01-E10' || content.id === 'G1-ST01-E12') && content.questions ? <CheckQuiz questions={content.questions} onSubmit={(answers) => void answerCheck(content, answers)} disabled={busy} /> : null}
            {content.id === 'G1-ST01-E04' || content.id === 'G1-ST01-E05' ? <CountGame count={content.visualCount ?? 3} options={content.options ?? []} onPick={(index) => void answerContent(content, index)} /> : null}
            {content.id === 'G1-ST01-E11' ? <OptionRow options={content.options ?? ["قرمز، آبی، قرمز، آبی", "قرمز، قرمز، آبی، آبی", "آبی، قرمز، آبی، قرمز"]} onPick={(index) => void answerContent(content, index)} /> : null}
            {content.id === 'G1-ST01-E09' ? (content.skillId === 'G1-SK009' || content.skillId === 'G1-SK011' ? <PatternGame onPick={(index) => void answerContent(content, index)} /> : <RecoveryGame onPick={(index) => void answerContent(content, index)} />) : null}
            {content.id === 'G1-ST01-E01' ? <PrimaryButton label={S.lesson.letsGo} onPress={() => void beginEncounter(getLocalContent('guided'), 'GUIDED')} disabled={busy} /> : null}
          </Card>
        )}

        {stage === 'RESULT' && (
          <Card title={lastOutcome?.correct ? S.result.okTitle : S.result.retryTitle} subtitle={lastOutcome?.correct ? S.result.okSub : S.result.retrySub}>
            <Text style={styles.resultBig}>{lastOutcome?.correct ? '✓' : '↺'}</Text>
            <PrimaryButton label={lastOutcome?.selectedStep === 'RECOVERY' ? S.lesson.easierWay : S.lesson.next} onPress={continueFromResult} />
          </Card>
        )}

        {stage === 'COMPLETE' && (
          <Card title={S.complete.title} subtitle={stationPassAchieved ? S.complete.subPassed : S.complete.subNotPassed}>
            <Text style={styles.story}>{stationPassAchieved ? '⭐' : '🌈'}</Text>
            <PrimaryButton label={S.complete.again} onPress={() => void start(true)} />
            <PrimaryButton label={S.complete.backHome} onPress={leave} secondary />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <View style={styles.card}><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text><View style={styles.body}>{children}</View></View>;
}
function PrimaryButton({ label, onPress, disabled, secondary }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.primary, secondary && styles.secondary, disabled && styles.disabled]}><Text style={[styles.primaryText, secondary && styles.secondaryText]}>{label}</Text></Pressable>;
}
function LearnScene() {
  return <View style={styles.scene}><Text style={styles.stars}>⭐ ⭐ ⭐</Text><Text style={styles.sceneText}>۱... ۲... ۳ — آخرین عدد یعنی سه تا.</Text></View>;
}
function OptionRow({ options, onPick }: { options: string[]; onPick: (index: number) => void }) {
  return <View style={styles.options}>{options.map((item, index) => <Pressable key={`${item}-${index}`} onPress={() => onPick(index)} style={styles.option}><Text style={styles.optionText}>{item}</Text></Pressable>)}</View>;
}
function PatternGame({ onPick }: { onPick: (index: number) => void }) {
  return <View><Text style={styles.pattern}>🟡 🔵 🟡 🔵 ؟</Text><OptionRow options={['🟡', '🔵', '🟢']} onPick={onPick} /></View>;
}
function CountGame({ count, options, onPick }: { count: number; options: string[]; onPick: (index: number) => void }) {
  return <View><View style={styles.objectField}>{Array.from({ length: count }, (_, index) => <Text key={index} style={styles.object}>⭐</Text>)}</View><OptionRow options={options} onPick={onPick} /></View>;
}
function CheckQuiz({ questions, onSubmit, disabled }: { questions: Array<{ prompt: string; options: string[]; expected: unknown; visualCount?: number }>; onSubmit: (answers: AnswerPayload[]) => void; disabled: boolean }) {
  const [answers, setAnswers] = useState<Array<number | null>>(() => questions.map(() => null));
  const ready = answers.every((value) => value !== null);
  return (
    <View style={{ gap: 16 }}>
      {questions.map((question, questionIndex) => (
        <View key={`${question.prompt}-${questionIndex}`} style={styles.checkCard}>
          <Text style={styles.checkIndex}>{S.lesson.questionOf(toFa(questionIndex + 1), toFa(questions.length))}</Text>
          {question.visualCount ? <Text style={styles.objectField}>{Array.from({ length: question.visualCount }, (_, i) => <Text key={i} style={styles.object}>⭐</Text>)}</Text> : null}
          <Text style={styles.checkPrompt}>{question.prompt}</Text>
          <OptionRow options={question.options} onPick={(index) => setAnswers((prev) => prev.map((value, i) => i === questionIndex ? index : value))} />
        </View>
      ))}
      <PrimaryButton label={disabled ? S.lesson.saving : S.lesson.done} onPress={() => onSubmit(answers.map((answerIndex, index) => ({ answerIndex: answerIndex as number, answerPayload: answerIndex })))} disabled={disabled || !ready} />
    </View>
  );
}

function RecoveryGame({ onPick }: { onPick: (index: number) => void }) {
  return <View><Text style={styles.recoveryCount}>⭐ ⭐ ⭐</Text><Text style={styles.sceneText}>هر ستاره را یکی‌یکی لمس کن.</Text><OptionRow options={['۱', '۲', '۳']} onPick={onPick} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F1' },
  container: { padding: 18, paddingBottom: 40 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exit: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  exitText: { fontSize: 22, fontWeight: '900', color: '#64748B' },
  macroBar: { flex: 1, flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 12, borderRadius: 6, backgroundColor: '#EADFD3' },
  segmentOn: { backgroundColor: '#7F67A8' },
  macroLabel: { textAlign: 'center', fontWeight: '800', color: '#775F43', marginTop: 6, marginBottom: 6, fontSize: 14 },
  notice: { backgroundColor: '#FFF2CF', padding: 10, borderRadius: 14, marginBottom: 12 },
  noticeText: { textAlign: 'center', color: '#695020', fontSize: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 26, padding: 20, marginTop: 6, shadowColor: '#8D735B', shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  title: { fontSize: 24, fontWeight: '900', color: '#33291F', textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 16, lineHeight: 23, color: '#5C5044', textAlign: 'center' },
  body: { marginTop: 20 },
  story: { fontSize: 17, lineHeight: 27, color: '#44372B', textAlign: 'center' },
  primary: { backgroundColor: '#6E59A8', borderRadius: 18, minHeight: 56, paddingVertical: 15, marginTop: 18, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: '#EEF2FF' },
  secondaryText: { color: '#4F46E5' },
  disabled: { opacity: 0.5 },
  primaryText: { color: 'white', fontSize: 17, fontWeight: '900' },
  footnote: { marginTop: 12, color: '#8A7F73', textAlign: 'center', fontSize: 11 },
  scene: { alignItems: 'center', padding: 12 },
  stars: { fontSize: 40, letterSpacing: 5 },
  sceneText: { marginTop: 12, textAlign: 'center', fontSize: 16, color: '#4C4034', lineHeight: 24 },
  options: { gap: 12 },
  option: { backgroundColor: '#F8F2E9', borderWidth: 1, borderColor: '#E5D8C7', borderRadius: 18, minHeight: 64, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  optionText: { fontSize: 28, fontWeight: '800' },
  pattern: { textAlign: 'center', fontSize: 38, marginBottom: 18 },
  objectField: { minHeight: 90, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FCF7EF', borderRadius: 18, marginBottom: 16 },
  object: { fontSize: 40 },
  recoveryCount: { textAlign: 'center', fontSize: 40, marginBottom: 10 },
  checkCard: { backgroundColor: '#FCF7EF', borderRadius: 18, padding: 12 },
  checkIndex: { fontSize: 12, color: '#8A7F73', textAlign: 'center', marginBottom: 6 },
  checkPrompt: { fontSize: 16, color: '#44372B', textAlign: 'center', marginBottom: 10 },
  resultBig: { textAlign: 'center', fontSize: 58, marginVertical: 8 },
  resultText: { textAlign: 'center', fontSize: 15, color: '#5C5044' },
  reward: { alignItems: 'center', backgroundColor: '#FFF4C9', borderRadius: 18, padding: 16, marginTop: 16 },
  rewardEmoji: { fontSize: 42 },
  rewardText: { marginTop: 6, fontWeight: '800', color: '#735D2C' },
});
