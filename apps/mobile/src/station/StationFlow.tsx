import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedCharacter } from '../components/AnimatedCharacter';
import { makeAnimationEvent, useAnimationController } from '../animation';
import { createEncounter, getLocalContent, getRecoveryContent, getRecheckContent, shouldUseRemoteRuntime, startStationSession, submitAttempt } from './runtimeApi';
import type { AnswerPayload, StationContent, StationStage, SubmitOutcome } from './types';

const stageProgress: Record<StationStage, number> = {
  ENTRY: 0.05, LEARN: 0.18, GUIDED: 0.32, GAME_PATTERN: 0.48, GAME_COUNT: 0.60,
  INDEPENDENT: 0.48, REVIEW: 0.56, TRANSFER: 0.62, CHECK_A: 0.68, CHECK_B: 0.76, MASTERY_CHECK: 0.88, RESULT: 0.82, RECOVERY: 0.86, RECHECK: 0.93, COMPLETE: 1,
};

export function StationFlow({ stationId }: { stationId: string }) {
  const { state, dispatch } = useAnimationController();
  const [stage, setStage] = useState<StationStage>('ENTRY');
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

  useEffect(() => {
    dispatch(makeAnimationEvent('SESSION_START', { stationId }));
  }, [dispatch, stationId]);

  const progress = stageProgress[stage];
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
        setMessage('حالت تمرین آفلاینِ نمایشی فعال شد. این حالت فقط برای توسعه است.');
        return localId;
      }
      setMessage('سرور آموزشی در دسترس نیست؛ برای جلوگیری از ثبت محلیِ Learning Truth، تمرین متوقف شد.');
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
        const correct = target.expected === answerIndex;
        outcome = {
          correct,
          score: correct ? 1 : 0,
          maxScore: 1,
          semanticEvent: correct ? 'ANSWER_CORRECT' : 'ANSWER_WRONG',
          stationPass: false,
          selectedStep: correct ? 'CONTINUE' : (target.learningRole === 'MASTERY_CHECK' ? 'RECOVERY' : 'CONTINUE'),
          learningState: correct ? 'BUILDING' : 'NEEDS_REVIEW',
        };
      }
      setLastOutcome(outcome);
      if (outcome.syncPending) {
        setMessage('نتیجه در دستگاه نگه‌داری شد؛ بعد از اتصال دوباره همگام می‌شود. برای ادامه، همین تمرین را دوباره با اتصال ارسال کن.');
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
          if (mode === 'LOCAL') setLocalPassedChecks((value) => value + 1);
          await beginFreshCheckEncounter(getLocalContent('checkB'), 'CHECK_B');
        } else {
          await beginEncounter(getRecoveryContent(outcome.decisionTargetSkillId ?? target.skillId), 'RECOVERY');
        }
      } else if (target.id === 'G1-ST01-E08') {
        const passed = mode === 'LOCAL' ? outcome.stationPass : outcome.stationPass;
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
      setMessage('نتیجه این تمرین ثبت نشد. دوباره امتحان کن.');
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
        const expected = target.questions?.map((question) => question.expected) ?? [];
        const correctCount = answers.reduce((count, answer, index) => count + (Object.is(answer.answerPayload, expected[index]) ? 1 : 0), 0);
        const qualifying = expected.length === 5 && correctCount >= 4;
        const isStationGate = target.id === 'G1-ST01-E07' || target.id === 'G1-ST01-E08';
        const nextPassedChecks = isStationGate ? localPassedChecks + (qualifying ? 1 : 0) : localPassedChecks;
        if (isStationGate && qualifying) setLocalPassedChecks(nextPassedChecks);
        outcome = {
          correct: qualifying, score: correctCount, maxScore: expected.length || 5, semanticEvent: qualifying ? 'ANSWER_CORRECT' : 'ANSWER_WRONG',
          stationPass: isStationGate && nextPassedChecks >= 2, selectedStep: isStationGate && nextPassedChecks >= 2 ? 'STATION_PASS' : (qualifying ? 'CONTINUE' : 'RECOVERY'),
          learningState: qualifying ? 'BUILDING' : 'NEEDS_REVIEW',
        };
      }
      setLastOutcome(outcome);
      if (outcome.syncPending) {
        setMessage('این بررسی آفلاین در صف همگام‌سازی قرار گرفت و هنوز نتیجهٔ نهایی سرور نیست.');
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
      setMessage('این بررسی ثبت نشد. نتیجه در این دستگاه نگه داشته می‌شود تا دوباره تلاش کنیم.');
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
      setStage(nextStage);
      dispatch(makeAnimationEvent('EXPLAIN', { sessionId: freshSessionId ?? undefined, stationId }));
    } finally {
      setBusy(false);
    }
  }

  function start() {
    setLocalPassedChecks(0);
    setStationPassAchieved(false);
    setLastOutcome(null);
    setMessage('');
    setAttemptNumber(1);
    setSequence(1);
    setEncounterId(null);
    setSessionId(null);
    void beginEncounter(getLocalContent('learn'), 'LEARN');
  }

  function continueFromResult() {
    if (lastOutcome?.syncPending) return;
    if (lastOutcome?.selectedStep === 'RECOVERY') void beginEncounter(getRecoveryContent(lastOutcome.decisionTargetSkillId), 'RECOVERY');
    else if (lastOutcome?.selectedStep === 'RECHECK') void beginFreshCheckEncounter(getRecheckContent(lastOutcome.decisionTargetSkillId), 'RECHECK');
    else if (lastOutcome?.stationPass) setStage('COMPLETE');
    else void beginEncounter(getLocalContent('pattern'), 'GAME_PATTERN');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>ایستگاه ۱</Text></View>
          <Text style={styles.progressText}>{Math.round(progress * 100)}٪</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>

        <AnimatedCharacter state={state} size={150} />
        {message ? <View style={styles.notice}><Text style={styles.noticeText}>{message}</Text></View> : null}

        {stage === 'ENTRY' && (
          <Card title="ماجراجویی شمارش و الگو" subtitle="چند تمرین کوتاه داریم؛ هر کدام یک بازی کوچولو است.">
            <Text style={styles.story}>امروز قرار است به دوست کوچولومان کمک کنیم ستاره‌ها را بشمارد و مسیر الگو را پیدا کند. 🌟</Text>
            <PrimaryButton label={busy ? 'در حال آماده‌سازی…' : 'شروع کنیم 🚀'} onPress={start} disabled={busy} />
            <Text style={styles.footnote}>{mode === 'REMOTE' ? 'نتیجه‌ها از Learning Runtime سرور ثبت می‌شوند.' : 'حالت محلی برای پیش‌نمایش فعال است.'}</Text>
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
            {content.id === 'G1-ST01-E01' ? <PrimaryButton label="بزن بریم تمرین" onPress={() => void beginEncounter(getLocalContent('guided'), 'GUIDED')} disabled={busy} /> : null}
          </Card>
        )}

        {stage === 'RESULT' && (
          <Card title={lastOutcome?.correct ? 'آفرین! ✨' : 'اشکالی نداره 💛'} subtitle={lastOutcome?.correct ? 'یک قدم جلو رفتی.' : 'اشتباه هم بخشی از یادگیریه.'}>
            <Text style={styles.resultBig}>{lastOutcome?.correct ? '✓' : '↺'}</Text>
            <Text style={styles.resultText}>وضعیت مهارت: {lastOutcome?.learningState ?? 'UNKNOWN'}</Text>
            <PrimaryButton label={lastOutcome?.selectedStep === 'RECOVERY' ? 'بریم یک راه ساده‌تر' : 'ادامه بده'} onPress={continueFromResult} />
          </Card>
        )}

        {stage === 'COMPLETE' && (
          <Card title="مسیر تمرین کامل شد! 🎉" subtitle={stationPassAchieved ? 'گیت پیشرفت ایستگاه هم با دو بررسی مستقل ثبت شده است.' : 'تمرین، بازی، بررسی و انتقال را کامل کردی.'}>
            <Text style={styles.story}>این پایانِ تجربهٔ آموزشی است؛ نتیجهٔ نهایی مهارت و مسترشدن، فقط توسط Learning Engine ثبت و تفسیر می‌شود.</Text>
            {stationPassAchieved ? <Text style={styles.resultText}>وضعیت ایستگاه: Station Pass ثبت شده ✓</Text> : <Text style={styles.resultText}>وضعیت ایستگاه: Pass ثبت نشده</Text>}
            <PrimaryButton label="دوباره از مسیر لذت ببر" onPress={() => setStage('ENTRY')} />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <View style={styles.card}><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text><View style={styles.body}>{children}</View></View>;
}
function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.primary, disabled && styles.disabled]}><Text style={styles.primaryText}>{label}</Text></Pressable>;
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
          <Text style={styles.checkIndex}>چالش {questionIndex + 1} از {questions.length}</Text>
          {question.visualCount ? <Text style={styles.objectField}>{Array.from({ length: question.visualCount }, (_, i) => <Text key={i} style={styles.object}>⭐</Text>)}</Text> : null}
          <Text style={styles.checkPrompt}>{question.prompt}</Text>
          <OptionRow options={question.options} onPick={(index) => setAnswers((prev) => prev.map((value, i) => i === questionIndex ? index : value))} />
        </View>
      ))}
      <PrimaryButton label={disabled ? 'در حال ثبت…' : 'پایان بررسی'} onPress={() => onSubmit(answers.map((answerIndex, index) => ({ answerIndex: answerIndex as number, answerPayload: answerIndex })))} disabled={disabled || !ready} />
    </View>
  );
}

function RecoveryGame({ onPick }: { onPick: (index: number) => void }) {
  return <View><Text style={styles.recoveryCount}>⭐ ⭐ ⭐</Text><Text style={styles.sceneText}>هر ستاره را یکی‌یکی لمس کن.</Text><OptionRow options={['۱', '۲', '۳']} onPick={onPick} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F1' },
  container: { padding: 18, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#F0E4FF', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  badgeText: { fontWeight: '800', color: '#5A3D7A' },
  progressText: { fontWeight: '800', color: '#775F43' },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#EADFD3', overflow: 'hidden', marginTop: 10, marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#7F67A8', borderRadius: 999 },
  notice: { backgroundColor: '#FFF2CF', padding: 10, borderRadius: 14, marginBottom: 12 },
  noticeText: { textAlign: 'center', color: '#695020', fontSize: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 26, padding: 20, marginTop: 6, shadowColor: '#8D735B', shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  title: { fontSize: 24, fontWeight: '900', color: '#33291F', textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 16, lineHeight: 23, color: '#5C5044', textAlign: 'center' },
  body: { marginTop: 20 },
  story: { fontSize: 17, lineHeight: 27, color: '#44372B', textAlign: 'center' },
  primary: { backgroundColor: '#6E59A8', borderRadius: 18, paddingVertical: 15, marginTop: 18, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  primaryText: { color: 'white', fontSize: 17, fontWeight: '900' },
  footnote: { marginTop: 12, color: '#8A7F73', textAlign: 'center', fontSize: 11 },
  scene: { alignItems: 'center', padding: 12 },
  stars: { fontSize: 40, letterSpacing: 5 },
  sceneText: { marginTop: 12, textAlign: 'center', fontSize: 16, color: '#4C4034', lineHeight: 24 },
  options: { gap: 12 },
  option: { backgroundColor: '#F8F2E9', borderWidth: 1, borderColor: '#E5D8C7', borderRadius: 18, paddingVertical: 15, alignItems: 'center' },
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
