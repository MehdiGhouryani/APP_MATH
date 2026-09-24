import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

type AssignmentItem = {
  assignment: { id: string; sharedObjective: string; dueAt: string | null; status: string };
  instance: { id: string; status: string; completionPayload: { target?: { stationIds?: string[] } } };
};

const API = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const LEARNING_IDENTITY = process.env.EXPO_PUBLIC_DEV_LEARNING_IDENTITY ?? 'child-dev-01';

export default function AssignmentsScreen() {
  const [items, setItems] = useState<AssignmentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/v1/learning-identities/${LEARNING_IDENTITY}/assignments`)
      .then(async (response) => {
        if (!response.ok) throw new Error('assignment fetch failed');
        return response.json() as Promise<AssignmentItem[]>;
      })
      .then(setItems)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'assignment fetch failed'));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تکلیف‌های من</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {items.length === 0 && !error && <Text style={styles.empty}>فعلاً تکلیف فعالی نداری.</Text>}
      {items.map(({ assignment, instance }) => (
        <View key={instance.id} style={styles.card}>
          <Text style={styles.cardTitle}>{assignment.sharedObjective}</Text>
          <Text>وضعیت: {instance.status}</Text>
          <Text>محدوده: {(instance.completionPayload.target?.stationIds ?? []).join(', ') || 'مسیر تطبیقی'}</Text>
          {instance.completionPayload.target?.stationIds?.[0] && (
            <Link href={`/station/${instance.completionPayload.target.stationIds[0]}`} style={styles.link}>شروع در همان مسیر یادگیری</Link>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 14, backgroundColor: '#fffaf5' },
  title: { fontSize: 28, fontWeight: '700' },
  card: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#eadfD4', gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  link: { marginTop: 6, fontSize: 16 },
  empty: { marginTop: 16, fontSize: 16 },
  error: { marginTop: 16, fontSize: 14 },
});
