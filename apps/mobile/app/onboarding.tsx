import { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CharacterAvatar, CharacterSays } from '../src/components/CharacterAvatar';
import { ParentGate } from '../src/components/ParentGate';
import { CHARACTERS } from '../src/characters/characters';
import { useAppState } from '../src/state/AppStateContext';
import { PLACEMENT_ITEMS, isValidName, nextStep, prevStep, progressFraction, scorePlacement, type OnboardingStep } from '../src/onboarding/flow';
import { Text, TextInput } from '../src/ui/AppText';
import { toFa } from '../src/ui/digits';

/**
 * First Run (DEC-010): Welcome -> Placement (first mini-lesson) -> Result ->
 * Parent Gate + consent -> Name -> save -> Home.
 * EVERYTHING before the final save lives in memory only: nothing about the child
 * is written to the device until a parent has consented.
 * No separate "meet the characters" screen (DEC-009): Qbo and Dana appear inside
 * the two questions, Jiko in the result, Aria everywhere else.
 */
export default function Onboarding() {
  const router = useRouter();
  const { entry, completeOnboarding } = useAppState();
  const [step, setStep] = useState<OnboardingStep>('WELCOME');
  const [answers, setAnswers] = useState<Array<string | undefined>>([undefined, undefined]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const consentAt = useRef<string | null>(null);
  const { fastTrack } = scorePlacement(answers);

  // Android back = one step back; only on the first step does it leave the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const prev = prevStep(step);
      if (!prev) return false;
      setStep(prev);
      return true;
    });
    return () => sub.remove();
  }, [step]);

  if (entry.kind === 'RETURNING') return <Redirect href="/" />;

  const prev = prevStep(step);
  const qIndex = step === 'Q1' ? 0 : step === 'Q2' ? 1 : -1;

  function choose(option: string) {
    setAnswers((a) => a.map((v, i) => (i === qIndex ? option : v)));
    setStep(nextStep(step));
  }

  async function finish() {
    if (busy || !isValidName(name) || !consentAt.current) return;
    setBusy(true);
    setSaveFailed(false);
    const ok = await completeOnboarding({ childName: name.trim(), gradeId: 'G1', consentAt: consentAt.current }, fastTrack);
    setBusy(false);
    if (ok) router.replace('/');
    else setSaveFailed(true);
  }

  const recoverNote =
    entry.kind === 'RECOVER'
      ? entry.reason === 'NEWER_VERSION'
        ? 'اطلاعات ذخیره‌شده با نسخه‌ی جدیدتری از اپ ساخته شده. اپ را به‌روز کن تا پیشرفتت برگردد.'
        : 'پیشرفت قبلی‌ات پیدا نشد؛ اشکالی نداره، از نو شروع می‌کنیم 🌈'
      : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {prev ? (
          <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" style={styles.back} onPress={() => setStep(prev)}>
            <Text style={styles.backText}>→</Text>
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progressFraction(step) * 100) }}>
          <View style={[styles.fill, { width: `${Math.max(4, progressFraction(step) * 100)}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {step === 'WELCOME' && (
          <>
            <View style={styles.hero}>
              <CharacterAvatar id="aria" size={132} />
            </View>
            <CharacterSays id="aria" text="سلام! من آریا هستم، راهنمای ماجراجویی ریاضی. اول با هم دو تا سؤال کوتاه را امتحان می‌کنیم!" size={56} />
            {recoverNote && <Text style={styles.note}>{recoverNote}</Text>}
            <Pressable accessibilityRole="button" style={styles.btn} onPress={() => setStep('Q1')}>
              <Text style={styles.btnText}>بزن بریم</Text>
            </Pressable>
          </>
        )}

        {qIndex >= 0 && (
          <>
            <Text style={styles.count}>سؤال {toFa(qIndex + 1)} از {toFa(PLACEMENT_ITEMS.length)}</Text>
            <CharacterSays id={qIndex === 0 ? 'qbo' : 'dana'} text={qIndex === 0 ? CHARACTERS.qbo.lines.greet : CHARACTERS.dana.lines.greet} size={56} />
            <Text style={styles.prompt}>{PLACEMENT_ITEMS[qIndex]!.prompt}</Text>
            <Text style={styles.display}>{PLACEMENT_ITEMS[qIndex]!.display}</Text>
            <View style={styles.opts}>
              {PLACEMENT_ITEMS[qIndex]!.options.map((o) => (
                <Pressable key={o} accessibilityRole="button" accessibilityState={{ selected: answers[qIndex] === o }} style={[styles.opt, answers[qIndex] === o && styles.optOn]} onPress={() => choose(o)}>
                  <Text style={styles.optText}>{o}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 'RESULT' && (
          <>
            <CharacterSays id={fastTrack ? 'jiko' : 'aria'} text={fastTrack ? 'جیک‌جیک! عالی بود! از تمرین‌های مستقل شروع می‌کنیم.' : 'اشکالی نداره؛ با هم قدم‌به‌قدم از اول شروع می‌کنیم.'} size={64} />
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.resultNote}>ستارهٔ اول مال توست!</Text>
            <Pressable accessibilityRole="button" style={styles.btn} onPress={() => setStep('GATE')}>
              <Text style={styles.btnText}>ادامه</Text>
            </Pressable>
          </>
        )}

        {step === 'GATE' && (
          <ParentGate
            requireConsent
            intro="برای ذخیره‌ی پیشرفتت به یک بزرگ‌تر نیاز داریم. لطفاً گوشی را به او بده."
            onPass={() => {
              consentAt.current = new Date().toISOString();
              setStep('NAME');
            }}
          />
        )}

        {step === 'NAME' && (
          <>
            <CharacterSays id="aria" text="اسمت چیه؟ (اسم کوچک یا اسم مستعار کافی است)" size={64} />
            <TextInput value={name} onChangeText={setName} placeholder="مثلاً آرش" maxLength={20} style={styles.input} accessibilityLabel="نام کودک" onSubmitEditing={finish} />
            {saveFailed && <Text style={styles.err}>ذخیره نشد. یک بار دیگه امتحان کن.</Text>}
            <Pressable accessibilityRole="button" disabled={!isValidName(name) || busy} style={[styles.btn, (!isValidName(name) || busy) && styles.btnOff]} onPress={finish}>
              <Text style={styles.btnText}>شروع ماجراجویی</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F6F0' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingTop: 8 },
  back: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 26, fontWeight: '900', color: '#4F46E5' },
  track: { flex: 1, height: 12, borderRadius: 6, backgroundColor: '#E2E8F0', flexDirection: 'row', overflow: 'hidden' },
  fill: { height: 12, borderRadius: 6, backgroundColor: '#4F46E5' },
  container: { padding: 20, gap: 18, flexGrow: 1, justifyContent: 'center' },
  hero: { alignItems: 'center' },
  btn: { backgroundColor: '#4F46E5', borderRadius: 18, minHeight: 60, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#CBD5E1' },
  btnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  note: { textAlign: 'center', fontSize: 13, color: '#B45309', fontWeight: '700', lineHeight: 22 },
  count: { textAlign: 'center', color: '#64748B', fontSize: 13 },
  prompt: { textAlign: 'center', fontSize: 20, fontWeight: '900', color: '#1E293B' },
  display: { textAlign: 'center', fontSize: 44, letterSpacing: 4 },
  opts: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  opt: { minWidth: 84, minHeight: 72, borderRadius: 18, borderWidth: 2, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  optOn: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  optText: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  star: { textAlign: 'center', fontSize: 64 },
  resultNote: { textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#475569' },
  input: { borderWidth: 2, borderColor: '#CBD5E1', borderRadius: 16, minHeight: 60, fontSize: 20, fontWeight: '800', textAlign: 'center', backgroundColor: '#FFFFFF' },
  err: { textAlign: 'center', color: '#B45309', fontWeight: '700' },
});
