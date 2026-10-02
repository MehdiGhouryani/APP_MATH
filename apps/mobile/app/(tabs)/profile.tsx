import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../../src/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CharacterAvatar } from '../../src/components/CharacterAvatar';
import { CHARACTERS } from '../../src/characters/characters';
import { S } from '../../src/ui/strings.fa';

export default function ProfileScreen() {
  const router = useRouter();
  const friends = [CHARACTERS.qbo, CHARACTERS.dana, CHARACTERS.jiko];
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <CharacterAvatar id="aria" size={96} />
          <Text style={styles.name}>{CHARACTERS.aria.name}</Text>
          <Text style={styles.role}>{CHARACTERS.aria.catchphrase}</Text>
        </View>

        <Text style={styles.section}>دوستان ماجراجویی</Text>
        <View style={styles.friends}>
          {friends.map((f) => (
            <View key={f.id} style={styles.friend}>
              <CharacterAvatar id={f.id} size={56} />
              <Text style={[styles.friendName, { color: f.color }]}>{f.name}</Text>
              <Text style={styles.friendRole}>{f.role}</Text>
            </View>
          ))}
        </View>

        <Pressable accessibilityRole="button" style={styles.row} onPress={() => router.push('/parent')}>
          <Text style={styles.rowText}>🔒 {S.parent.row}</Text>
        </Pressable>
        {/* Assignments need a real learner identity + server; hidden from release builds until account linking exists. */}
        {__DEV__ && (
          <Pressable accessibilityRole="button" style={styles.row} onPress={() => router.push('/assignments')}>
            <Text style={styles.rowText}>🎒 تکلیف‌های من (فقط توسعه)</Text>
          </Pressable>
        )}
        {__DEV__ && (
          <Pressable accessibilityRole="button" style={styles.row} onPress={() => router.push('/animation')}>
            <Text style={styles.rowText}>🎭 آزمایشگاه انیمیشن (فقط توسعه)</Text>
          </Pressable>
        )}
        <Text style={styles.version}>نسخه ۰.۱.۰</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F6F0' },
  container: { padding: 20, gap: 16 },
  hero: { alignItems: 'center', gap: 6, paddingVertical: 12 },
  name: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  role: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  section: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  friends: { flexDirection: 'row', justifyContent: 'space-around', gap: 8 },
  friend: { alignItems: 'center', flex: 1, gap: 4 },
  friendName: { fontSize: 14, fontWeight: '900' },
  friendRole: { fontSize: 11, color: '#64748B', textAlign: 'center' },
  row: { minHeight: 56, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#E2DCCE', justifyContent: 'center', paddingHorizontal: 16 },
  rowText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  version: { textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 8 },
});
