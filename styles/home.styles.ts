import { StyleSheet, Platform } from 'react-native';

export const homeColors = {
  lightAccent: '#4361EE',
  darkAccent: '#4CC9F0',
  lightBg: ['#F8F9FA', '#FFFFFF'] as const,
  darkBg: ['#0F0F1B', '#1A1A2E'] as const,
};

export const homeStyles = (isDark: boolean) => {
  const accent = isDark ? homeColors.darkAccent : homeColors.lightAccent;
  const borderGlass = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? 'rgba(30,41,59,0.65)' : 'rgba(255,255,255,0.85)';

  return StyleSheet.create({
    safe: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 22,
      paddingBottom: 120,
      paddingTop: Platform.select({ ios: 8, default: 16 }),
    },
    eyebrow: {
      fontSize: 12,
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 8,
    },
    heroTitle: {
      fontSize: 36,
      fontFamily: 'Inter-Bold',
      color: isDark ? '#F1F5F9' : '#0F172A',
      letterSpacing: 0.5,
    },
    heroAuthor: {
      fontSize: 20,
      fontFamily: 'Inter-Medium',
      color: isDark ? '#94A3B8' : '#475569',
      marginTop: 4,
    },
    metaLine: {
      marginTop: 16,
      fontSize: 13,
      lineHeight: 20,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 22,
      alignItems: 'stretch',
    },
    /** Equal-width columns; minWidth 0 lets flex shrink evenly on narrow screens */
    actionHalf: {
      flex: 1,
      minWidth: 0,
      alignSelf: 'stretch',
    },
    /** Search pair: same visual height so bottoms line up */
    searchCardInner: {
      flex: 1,
      minHeight: 132,
      justifyContent: 'flex-start',
    },
    glassCard: {
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: borderGlass,
      marginBottom: 14,
    },
    cardInner: {
      paddingVertical: 16,
      paddingHorizontal: 18,
      backgroundColor: cardBg,
    },
    cardTitle: {
      fontSize: 17,
      fontFamily: 'Inter-SemiBold',
      color: isDark ? '#F8FAFC' : '#1E293B',
    },
    cardSubtitle: {
      fontSize: 13,
      marginTop: 6,
      color: isDark ? '#94A3B8' : '#64748B',
      lineHeight: 18,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
      gap: 8,
    },
    primaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: accent,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    primaryButtonText: {
      color: '#FFF',
      fontSize: 15,
      fontFamily: 'Inter-SemiBold',
    },
    ghostButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderGlass,
    },
    ghostButtonText: {
      color: isDark ? '#E2E8F0' : '#334155',
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
    },
    jumpInput: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      paddingHorizontal: 14,
      fontSize: 16,
      color: isDark ? '#F8FAFC' : '#0F172A',
      backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(248,250,252,0.95)',
      borderWidth: 1,
      borderColor: borderGlass,
    },
    jumpButton: {
      backgroundColor: accent,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 12,
    },
    jumpButtonText: {
      color: '#FFF',
      fontFamily: 'Inter-SemiBold',
      fontSize: 15,
    },
    sectionLabel: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 10,
      marginTop: 6,
    },
    linkText: {
      fontSize: 14,
      color: accent,
      fontFamily: 'Inter-Medium',
    },
    sectionPad: { marginTop: 8 },
    errorText: {
      fontSize: 12,
      color: '#F87171',
      marginTop: 6,
    },
  });
};
