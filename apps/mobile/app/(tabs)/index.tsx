import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../../src/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CharacterAvatar, CharacterSays } from '../../src/components/CharacterAvatar';
import { CHARACTERS } from '../../src/characters/characters';
import { useAppState } from '../../src/state/AppStateContext';
import { dailyGoalDone, getResume, isStationPassed, localDay, starsEarned } from '../../src/state/appStateCore';
import { macroLabel } from '../../src/station/macro';
import { S } from '../../src/ui/strings.fa';
import { toFa } from '../../src/ui/digits';

// Only ST01 has seeded encounter content (PHASE-00 report §12); the rest are
// shown locked with their real titles (migration 0035) — honest, not fake progress.
const STATIONS = [
  { id: 'ST01', title: 'الگو، موقعیت و شمارش تا ۵' },
  { id: 'ST02', title: 'جهت و ساختارهای شبکه‌ای' },
  { id: 'ST03', title: 'جمع‌های آغازین و نمایش عدد' },
  { id: 'ST04', title: 'شکل‌ها، ضلع و گوشه' },
  { id: 'ST05', title: 'جمع و تفریق با چوب‌خط' },
];
const OFFSETS = [0, 46, 0, -46, 0]; // gentle zig-zag path (Duolingo-style), mirrored by RTL

export default function PathScreen() {
  const router = useRouter();
  const { state } = useAppState();
  const childName = state?.profile.childName ?? '';
  const passedIds = STATIONS.filter((s) => isStationPassed(state, s.id)).map((s) => s.id);
  const done = isStationPassed(state, 'ST01');
  const current = 0; // only ST01 has content today (PHASE-00 report §12)
  const resume = getResume(state, 'ST01');
  const goalDone = dailyGoalDone(state, localDay(new Date()));
  const stars = starsEarned(state);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Calm status row: stars + a gentle daily goal. No streak, no punishment (SoT §37). */}
        <View style={styles.status}>
          <View style={styles.pill} accessibilityLabel={`${toFa(stars)} ستاره`}>
            <Text style={styles.pillText}>⭐ {toFa(stars)}</Text>
          </View>
          <View style={[styles.pill, goalDone && styles.pillDone]}>
            <Text style={[styles.pillText, goalDone && styles.pillTextDone]}>{goalDone ? S.home.goalDone : S.home.goalOpen}</Text>
          </View>
        </View>

        <CharacterSays id="aria" text={done ? CHARACTERS.aria.lines.done : childName ? (resume ? S.home.welcomeBack(childName) : S.home.hello(childName)) + ' ' + CHARACTERS.aria.lines.greet.replace('سلام! ', '') : CHARACTERS.aria.lines.greet} size={64} />

        {/* Khan-Kids-style single big "play" action */}
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.play, pressed && styles.pressed]}
          onPress={() => router.push(`/station/${STATIONS[current]!.id}`)}
        >
          <Text style={styles.playLabel}>{resume ? S.home.resume : done ? S.home.replay : S.home.play}</Text>
          <Text style={styles.playSub}>{resume ? macroLabel(resume.stage, null) + ' · ' : ''}ایستگاه {toFa(current + 1)} · {STATIONS[current]!.title}</Text>
        </Pressable>

        {/* Duolingo-style vertical path */}
        <View style={styles.path}>
          {STATIONS.map((station, index) => {
            const isDone = passedIds.includes(station.id);
            const isCurrent = index === current && !isDone;
            const locked = index !== 0 && !isDone;
            return (
              <View key={station.id} style={[styles.nodeWrap, { transform: [{ translateX: OFFSETS[index]! }] }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`ایستگاه ${toFa(index + 1)}: ${station.title}${locked ? ` (${S.home.soon})` : ''}`}
                  disabled={locked}
                  onPress={() => router.push(`/station/${station.id}`)}
                  style={[styles.node, isDone && styles.nodeDone, isCurrent && styles.nodeCurrent, locked && styles.nodeLocked]}
                >
                  <Text style={styles.nodeIcon}>{isDone ? '✓' : locked ? '🔒' : '⭐'}</Text>
                </Pressable>
                <Text style={[styles.nodeLabel, locked && styles.nodeLabelLocked]} numberOfLines={2}>
                  {station.title}
                </Text>
                {isCurrent && (
                  <View style={styles.companion}>
                    <CharacterAvatar id="aria" size={44} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F6F0' },
  container: { padding: 20, paddingBottom: 32, gap: 20 },
  play: { backgroundColor: '#4F46E5', borderRadius: 24, minHeight: 84, padding: 18, justifyContent: 'center', shadowColor: '#312E81', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  pressed: { transform: [{ translateY: 2 }], opacity: 0.92 },
  playLabel: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  playSub: { color: '#E0E7FF', fontSize: 13, fontWeight: '600', marginTop: 4 },
  status: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  pill: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2DCCE', alignItems: 'center', justifyContent: 'center' },
  pillDone: { backgroundColor: '#ECFDF5', borderColor: '#34D399' },
  pillText: { fontSize: 14, fontWeight: '800', color: '#334155' },
  pillTextDone: { color: '#047857' },
  path: { alignItems: 'center', gap: 22, paddingVertical: 8 },
  nodeWrap: { alignItems: 'center', width: 200 },
  node: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#818CF8', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderBottomColor: '#4F46E5' },
  nodeDone: { backgroundColor: '#34D399', borderBottomColor: '#059669' },
  nodeCurrent: { backgroundColor: '#4F46E5', borderBottomColor: '#312E81' },
  nodeLocked: { backgroundColor: '#E2E8F0', borderBottomColor: '#CBD5E1' },
  nodeIcon: { fontSize: 30, color: '#FFFFFF' },
  nodeLabel: { marginTop: 8, fontSize: 13, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  nodeLabelLocked: { color: '#94A3B8' },
  companion: { position: 'absolute', top: 14, end: -8 },
});
