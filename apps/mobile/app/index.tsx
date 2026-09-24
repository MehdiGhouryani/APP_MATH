import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Math Learning</Text>
      <Text style={styles.subtitle}>Child Mobile — V1 bootstrap</Text>
      <Link href="/station/ST01" style={styles.link}>
        Open Station 01 shell
      </Link>
      <Link href="/animation" style={styles.link}>
        Open Animation Runtime
      </Link>
      <Link href="/assignments" style={styles.link}>
        تکلیف‌های من
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 8, fontSize: 16 },
  link: { marginTop: 24, fontSize: 18 },
});
