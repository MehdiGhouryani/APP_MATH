import type { ColorValue } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../../src/state/AppStateContext';
import { FONT } from '../../src/ui/AppText';

// Labelled bottom tabs (Duolingo lesson: unlabeled icons are not self-explanatory).
// One vector icon family (emoji render differently on every phone brand).
// 3 tabs only until "practice"/"treasure" content exists (SoT §4).
const icon =
  (filled: keyof typeof Ionicons.glyphMap, outline: keyof typeof Ionicons.glyphMap) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) =>
    <Ionicons name={focused ? filled : outline} size={26} color={color as string} />;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { entry } = useAppState();
  // First run vs returning (DEC-010): only a valid saved profile reaches Home.
  if (entry.kind !== 'RETURNING') return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: { fontSize: 13, fontFamily: FONT.black },
        tabBarStyle: { height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom, paddingTop: 6, borderTopColor: '#E2E8F0' },
        tabBarItemStyle: { minHeight: 48 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'مسیر', tabBarIcon: icon('map', 'map-outline') }} />
      <Tabs.Screen name="skills" options={{ title: 'مهارت‌ها', tabBarIcon: icon('ribbon', 'ribbon-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'پروفایل', tabBarIcon: icon('person-circle', 'person-circle-outline') }} />
    </Tabs>
  );
}
