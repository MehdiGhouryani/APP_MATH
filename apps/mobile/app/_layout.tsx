import { useEffect } from 'react';
import { AppState, I18nManager, type AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
// Import only the 3 weights we use (the package barrel would bundle all 9, ~1 MB extra).
import { Vazirmatn_400Regular } from '@expo-google-fonts/vazirmatn/400Regular';
import { Vazirmatn_700Bold } from '@expo-google-fonts/vazirmatn/700Bold';
import { Vazirmatn_900Black } from '@expo-google-fonts/vazirmatn/900Black';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider, useAppState } from '../src/state/AppStateContext';
import { flushPendingSync } from '../src/station/runtimeApi';

// Keep the native splash up until fonts + app state are ready: no spinner flash,
// and the brand is the first thing seen (E6).
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

// RTL is forced natively by plugins/withForceRtl.js so the VERY FIRST launch is
// already RTL (E5). This JS call is only a safety net for dev clients.
I18nManager.allowRTL(true);
if (!I18nManager.isRTL) I18nManager.forceRTL(true);

function Shell() {
  const { ready } = useAppState();
  const [fontsLoaded, fontError] = useFonts({ Vazirmatn_400Regular, Vazirmatn_700Bold, Vazirmatn_900Black });
  const done = ready && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (done) void SplashScreen.hideAsync().catch(() => undefined);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    void flushPendingSync();
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') void flushPendingSync();
    });
    return () => subscription.remove();
  }, [done]);

  if (!done) return null;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
      <Stack.Screen name="station/[stationId]" />
      <Stack.Screen name="parent" />
      <Stack.Screen name="assignments" options={{ headerShown: true, title: 'تکلیف‌های من' }} />
      <Stack.Screen name="animation" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <Shell />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
