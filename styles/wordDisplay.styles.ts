import { StyleSheet, Platform } from 'react-native';
import { accent } from '@/lib/appTheme';

/** Inline lexicon card on Read tab — bold, distinct from old orange/blue mix */
export const getWordDisplayStyles = (isDark: boolean) => {
  const a = isDark ? accent.dark : accent.light;
  const muted = isDark ? '#94A3B8' : '#64748B';
  const body = isDark ? '#E2E8F0' : '#1E293B';

  return StyleSheet.create({
    eyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2,
      color: a,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    heroLemma: {
      fontSize: 26,
      fontWeight: '800',
      color: isDark ? '#F8FAFC' : '#0F172A',
      letterSpacing: 0.3,
      marginBottom: 4,
    },
    formLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: muted,
      marginTop: 12,
      textTransform: 'uppercase',
    },
    formValue: {
      fontSize: 20,
      fontWeight: '600',
      color: a,
      marginTop: 4,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: muted,
      marginBottom: 8,
      marginTop: 18,
      textTransform: 'uppercase',
    },
    morphBlock: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(76, 201, 240, 0.22)' : 'rgba(67, 97, 238, 0.18)',
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.55)',
    },
    morphText: {
      fontSize: 15,
      lineHeight: 22,
      color: body,
      fontWeight: '500',
    },
    defRow: {
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderLeftWidth: 3,
      borderLeftColor: a,
      backgroundColor: isDark ? 'rgba(76, 201, 240, 0.08)' : 'rgba(67, 97, 238, 0.06)',
    },
    defText: {
      fontSize: 14,
      lineHeight: 20,
      color: body,
    },
    cta: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: a,
      paddingVertical: 14,
      borderRadius: 14,
      ...Platform.select({
        ios: {
          shadowColor: a,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
        default: { elevation: 6 },
      }),
    },
    ctaText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    errorBanner: {
      marginTop: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(248, 113, 113, 0.12)' : 'rgba(220, 38, 38, 0.08)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(248, 113, 113, 0.35)' : 'rgba(220, 38, 38, 0.25)',
    },
    errorText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FCA5A5' : '#B91C1C',
      textAlign: 'center',
    },
  });
};
