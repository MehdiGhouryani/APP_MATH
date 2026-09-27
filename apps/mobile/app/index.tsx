import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🌟 ماجراجویی ریاضی</Text>
          <Text style={styles.appSubtitle}>پایه اول ابتدایی · یادگیری گام‌به‌گام و ملموس</Text>
        </View>

        {/* Mascot Greeting Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🐲</Text>
          <Text style={styles.heroTitle}>سلام قهرمان ریاضی!</Text>
          <Text style={styles.heroDescription}>
            امروز آماده‌ای ستاره‌های دانایی رو با حل معماهای جذاب کشف کنی؟
          </Text>
        </View>

        {/* Navigation Action Buttons */}
        <View style={styles.actionList}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.primaryAction, pressed && styles.buttonPressed]}
            onPress={() => router.push('/station/ST01')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🚀</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>ورود به ایستگاه ۱</Text>
              <Text style={styles.actionDesc}>شمارش تا ۵، الگوها و جدول شگفت‌انگیز</Text>
            </View>
            <Text style={styles.chevron}>◀</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.secondaryAction, pressed && styles.buttonPressed]}
            onPress={() => router.push('/assignments')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🎒</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>تکلیف‌های من</Text>
              <Text style={styles.actionDesc}>تکالیف معلم و چالش‌های تمرینی</Text>
            </View>
            <Text style={styles.chevron}>◀</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.tertiaryAction, pressed && styles.buttonPressed]}
            onPress={() => router.push('/animation')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🎭</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>آزمایشگاه انیمیشن</Text>
              <Text style={styles.actionDesc}>بررسی رویدادهای معنایی کاراکترها</Text>
            </View>
            <Text style={styles.chevron}>◀</Text>
          </Pressable>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>نسخه ۰.۱.۰ · ران‌تایم استاندارد آموزشی</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E1B4B',
    textAlign: 'center',
  },
  appSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#52525B',
    textAlign: 'center',
    fontWeight: '600',
  },
  heroCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#E2DCCE',
  },
  heroEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  actionList: {
    width: '100%',
    gap: 14,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ translateY: 2 }],
    opacity: 0.92,
  },
  primaryAction: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    shadowColor: '#4F46E5',
  },
  secondaryAction: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    shadowColor: '#D97706',
  },
  tertiaryAction: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    shadowColor: '#64748B',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'right',
  },
  actionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'right',
  },
  chevron: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '800',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
