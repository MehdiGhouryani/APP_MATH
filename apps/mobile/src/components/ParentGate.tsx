import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '../ui/AppText';
import { toEn, toFa } from '../ui/digits';

/**
 * Parent Gate (SoT §0.1/§20). A UX boundary for adults, NOT authentication:
 * server-side authorization stays mandatory. Consent wording is a product
 * placeholder pending legal review (COPPA/GDPR-K).
 */
const challenge = () => {
  const a = 12 + Math.floor(Math.random() * 8);
  const b = 3 + Math.floor(Math.random() * 6);
  return { a, b };
};

export function ParentGate({ onPass, requireConsent = false, intro }: { onPass: () => void; requireConsent?: boolean; intro?: string }) {
  const [q, setQ] = useState(challenge);
  const [value, setValue] = useState('');
  const [consent, setConsent] = useState(false);
  const [fails, setFails] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [error, setError] = useState('');
  const answer = useMemo(() => String(q.a * q.b), [q]);

  function submit() {
    if (Date.now() < lockedUntil) return;
    if (requireConsent && !consent) return setError('برای ادامه، تأیید والد/سرپرست لازم است.');
    if (toEn(value).trim() === answer) return onPass();
    const n = fails + 1;
    setValue('');
    setQ(challenge());
    if (n >= 3) {
      setFails(0);
      setLockedUntil(Date.now() + 30_000);
      setError('چند بار اشتباه شد. کمی بعد دوباره امتحان کنید.');
    } else {
      setFails(n);
      setError('پاسخ درست نبود. یک سؤال تازه آماده شد.');
    }
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>🔒 بخش ویژه بزرگسالان</Text>
      {intro ? <Text style={styles.consentText}>{intro}</Text> : null}
      {requireConsent && (
        <View style={styles.consent}>
          <Text style={styles.consentText}>
            حریم خصوصی کودک: فقط حداقل اطلاعات لازم (نام مستعار، پایه و پیشرفت یادگیری) ذخیره می‌شود. شمارهٔ تلفن الزامی نیست و اطلاعات کودک برای تبلیغات استفاده نمی‌شود.
          </Text>
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consent }} style={styles.checkRow} onPress={() => setConsent(!consent)}>
            <Text style={styles.check}>{consent ? '☑' : '☐'}</Text>
            <Text style={styles.consentText}>من والد یا سرپرست قانونی هستم و موافقم.</Text>
          </Pressable>
        </View>
      )}
      <Text style={styles.q}>پاسخ را بنویسید: {toFa(q.a)} × {toFa(q.b)} = ؟</Text>
      <TextInput value={value} onChangeText={setValue} keyboardType="number-pad" style={styles.input} onSubmitEditing={submit} accessibilityLabel="پاسخ سؤال والد" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable accessibilityRole="button" style={[styles.btn, !value.trim() && styles.btnOff]} disabled={!value.trim()} onPress={submit}>
        <Text style={styles.btnText}>تأیید</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 14 },
  title: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  consent: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, gap: 10 },
  consentText: { flex: 1, fontSize: 13, lineHeight: 22, color: '#334155' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  check: { fontSize: 26, color: '#4F46E5' },
  q: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  input: { borderWidth: 2, borderColor: '#CBD5E1', borderRadius: 14, minHeight: 56, fontSize: 20, fontWeight: '800', textAlign: 'center', backgroundColor: '#FFFFFF' },
  error: { color: '#B45309', fontSize: 13, fontWeight: '700' },
  btn: { backgroundColor: '#4F46E5', borderRadius: 16, minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#CBD5E1' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});
