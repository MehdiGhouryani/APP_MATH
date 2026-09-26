import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { RiveView, useRive, useRiveFile, Fit } from '@rive-app/react-native';
import type { CharacterVisualState } from '@math/contracts';

interface AnimatedCharacterProps {
  state: CharacterVisualState;
  source?: string;
  size?: number;
}

const LABELS: Record<CharacterVisualState, string> = {
  IDLE: 'سلام 👋',
  THINK: 'دارم فکر می‌کنم…',
  ENCOURAGE: 'دوباره امتحان کن 💛',
  CORRECT: 'آفرین! ✨',
  CELEBRATE: 'عالی بود! 🎉',
  RECOVERY: 'با هم دوباره حلش می‌کنیم 💪',
};

export function AnimatedCharacter({ state, source, size = 220 }: AnimatedCharacterProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      pulse.value = 1;
      return;
    }
    pulse.value = withSpring(state === 'CELEBRATE' ? 1.06 : state === 'CORRECT' ? 1.03 : 1, { damping: 14, stiffness: 170 });
  }, [reducedMotion, state, pulse]);

  const animatedWrapper = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  const riveSource = useMemo(() => source ?? null, [source]);
  const { riveFile, error } = useRiveFile(riveSource ?? undefined);
  const { riveViewRef, setHybridRef } = useRive();

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReducedMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const showRive = Boolean(riveFile) && !reducedMotion && !error;

  return (
    <Animated.View style={[styles.wrapper, { width: size, height: size }, animatedWrapper]}> 
      {showRive && riveFile ? (
        <RiveView
          hybridRef={setHybridRef}
          file={riveFile}
          fit={Fit.Layout}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={styles.fallback} accessibilityRole="image" accessibilityLabel="شخصیت آموزشی">
          <Text style={styles.face}>{state === 'CELEBRATE' ? '🌟' : state === 'ENCOURAGE' ? '🙂' : '😊'}</Text>
          <Text style={styles.state}>{LABELS[state]}</Text>
          {reducedMotion ? <Text style={styles.note}>حرکت‌های غیرضروری خاموش است.</Text> : null}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  fallback: {
    flex: 1,
    width: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8ED',
  },
  face: { fontSize: 72 },
  state: { marginTop: 10, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  note: { marginTop: 8, fontSize: 11, textAlign: 'center', opacity: 0.65 },
});
