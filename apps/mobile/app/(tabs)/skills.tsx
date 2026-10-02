import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../../src/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CharacterSays } from '../../src/components/CharacterAvatar';
import { useAppState } from '../../src/state/AppStateContext';
import { isStationPassed } from '../../src/state/appStateCore';
import { S } from '../../src/ui/strings.fa';

// Real skills practiced by ST01 (codes/titles from migration 0035).
const SKILLS = [
  { code: 'G1-SK001', title: 'شمارش اشیاء تا ۵ با ترتیب پایدار' },
  { code: 'G1-SK003', title: 'عدد آخر یعنی تعداد کل' },
  { code: 'G1-SK009', title: 'تشخیص الگوی تکرارشونده' },
];

export default function SkillsScreen() {
  const { state } = useAppState();
  const done = isStationPassed(state, 'ST01');
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <CharacterSays id="qbo" text={S.skills.intro} />
        <Text style={styles.title}>مهارت‌های ایستگاه ۱</Text>
        {SKILLS.map((skill) => (
          <View key={skill.code} style={styles.card}>
            <Text style={styles.icon}>{done ? '🏅' : '🌱'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.skill}>{skill.title}</Text>
              <Text style={styles.state}>{done ? S.skills.done : S.skills.learning}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.note}>{S.skills.note}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F6F0' },
  container: { padding: 20, gap: 14 },
  title: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginTop: 6 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, minHeight: 72, borderWidth: 1.5, borderColor: '#E2DCCE' },
  icon: { fontSize: 30 },
  skill: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  state: { fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 4 },
  note: { fontSize: 12, color: '#94A3B8', lineHeight: 20 },
});
