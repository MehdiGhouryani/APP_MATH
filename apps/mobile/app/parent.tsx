import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParentGate } from '../src/components/ParentGate';
import { useAppState } from '../src/state/AppStateContext';
import { isStationPassed } from '../src/state/appStateCore';
import { Text } from '../src/ui/AppText';
import { S } from '../src/ui/strings.fa';
import { toFa } from '../src/ui/digits';

/**
 * Parent area (SoT §20): behind the Parent Gate (a UX boundary, NOT authorization).
 * Shows a small progress summary and offers the one thing parents must be able to
 * do: delete everything stored about the child.
 */
export default function ParentScreen() {
  const router = useRouter();
  const { state, resetAll } = useAppState();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  function askDelete() {
    Alert.alert(S.parent.deleteTitle, S.parent.deleteBody, [
      { text: S.parent.deleteCancel, style: 'cancel' },
      {
        text: S.parent.deleteConfirm,
        style: 'destructive',
        onPress: async () => {
          const ok = await resetAll();
          if (ok) router.replace('/onboarding');
          else setFailed(true);
        },
      },
    ]);
  }

  const passed = ['ST01'].filter((id) => isStationPassed(state, id)).length;
  const last = state?.lastActiveDay;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{S.parent.title}</Text>
        {!open ? (
          <ParentGate intro={S.parent.gateIntro} onPass={() => setOpen(true)} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{S.parent.summary}</Text>
              <Text style={styles.line}>{state?.profile.childName}</Text>
              <Text style={styles.line}>{S.parent.stationsPassed}: {toFa(passed)}</Text>
              <Text style={styles.line}>{S.parent.lastActive}: {last ? toFa(last) : S.parent.never}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{S.parent.sound}</Text>
              <Text style={styles.muted}>{S.parent.soundSoon}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{S.parent.deleteTitle}</Text>
              <Text style={styles.muted}>{S.parent.deleteBody}</Text>
              {failed && <Text style={styles.err}>{S.parent.deleteFailed}</Text>}
              <Pressable accessibilityRole="button" style={styles.danger} onPress={askDelete}>
                <Text style={styles.dangerText}>{S.parent.deleteTitle}</Text>
              </Pressable>
            </View>
          </>
        )}
        <Pressable accessibilityRole="button" style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>{S.parent.close}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F6F0' },
  container: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, gap: 8, borderWidth: 1.5, borderColor: '#E2DCCE' },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  line: { fontSize: 15, color: '#334155' },
  muted: { fontSize: 13, color: '#64748B', lineHeight: 22 },
  err: { color: '#B45309', fontWeight: '700' },
  danger: { minHeight: 56, borderRadius: 16, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  dangerText: { color: '#B91C1C', fontSize: 15, fontWeight: '900' },
  back: { minHeight: 56, borderRadius: 16, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 15, fontWeight: '800', color: '#475569' },
});
