import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AnimationSemanticEvent } from '@math/contracts';
import { AnimatedCharacter } from './AnimatedCharacter';
import { makeAnimationEvent, useAnimationController } from '../animation';

const EVENTS: AnimationSemanticEvent[] = [
  'SESSION_START',
  'EXPLAIN',
  'ANSWER_CORRECT',
  'ANSWER_WRONG',
  'HINT_OPENED',
  'RECOVERY',
  'STATION_PASS',
  'MILESTONE',
  'REWARD_GRANTED',
];

export function SemanticAnimationDemo() {
  const { state, dispatch } = useAnimationController();
  return (
    <View style={styles.container}>
      <AnimatedCharacter state={state} />
      <Text style={styles.title}>Animation Runtime Spike</Text>
      <Text style={styles.subtitle}>این دکمه‌ها فقط event آزمایشی هستند؛ Learning Engine را دور نمی‌زنند.</Text>
      <View style={styles.grid}>
        {EVENTS.map((event) => (
          <Pressable key={event} style={styles.button} onPress={() => dispatch(makeAnimationEvent(event))}>
            <Text style={styles.buttonText}>{event}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { marginTop: 12, fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 8, textAlign: 'center', opacity: 0.7 },
  grid: { width: '100%', marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  button: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, backgroundColor: '#EEE4D7' },
  buttonText: { fontSize: 11, fontWeight: '700' },
});
