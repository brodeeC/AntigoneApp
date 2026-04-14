import { Platform, StyleSheet } from 'react-native';
import { accent } from '@/lib/appTheme';

const ACCENT_D = accent.dark;
const ACCENT_L = accent.light;
const MUTED_D = '#94A3B8';
const MUTED_L = '#64748B';
const BODY_D = '#E2E8F0';
const BODY_L = '#1E293B';

export const getDynamicStyles = (isDarkMode: boolean) => {
  const a = isDarkMode ? ACCENT_D : ACCENT_L;
  const muted = isDarkMode ? MUTED_D : MUTED_L;
  const body = isDarkMode ? BODY_D : BODY_L;
  const hero = isDarkMode ? '#F8FAFC' : '#0F172A';

  return StyleSheet.create({
    wordDetailsContainer: {
      flex: 1,
      paddingTop: Platform.select({ ios: 8, default: 4 }),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    headerGlass: {
      marginHorizontal: 16,
      marginBottom: 14,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 22,
      fontWeight: '800',
      color: hero,
      letterSpacing: 0.2,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.35)' : 'rgba(67, 97, 238, 0.25)',
      backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.12)' : 'rgba(67, 97, 238, 0.08)',
    },
    backButtonPressed: {
      opacity: 0.72,
    },
    entryWrap: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    entryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth * 2,
      borderBottomColor: isDarkMode ? 'rgba(76, 201, 240, 0.25)' : 'rgba(67, 97, 238, 0.2)',
    },
    entryIndex: {
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: a,
    },
    entryBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: muted,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 10,
      gap: 6,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: muted,
      textTransform: 'uppercase',
      minWidth: 88,
    },
    value: {
      fontSize: 16,
      fontWeight: '600',
      color: a,
      flexShrink: 1,
    },
    valuePlain: {
      fontSize: 16,
      fontWeight: '500',
      color: body,
      flexShrink: 1,
    },
    goButton: {
      marginLeft: 'auto',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: a,
      ...Platform.select({
        ios: {
          shadowColor: a,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
        },
        default: { elevation: 4 },
      }),
    },
    goButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.4,
      color: muted,
      marginBottom: 8,
      marginTop: 4,
      textTransform: 'uppercase',
    },
    morphPanel: {
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.22)' : 'rgba(67, 97, 238, 0.18)',
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.55)',
    },
    morphText: {
      fontSize: 15,
      lineHeight: 22,
      color: body,
      fontWeight: '500',
    },
    defPanel: {
      marginTop: 12,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.18)' : 'rgba(67, 97, 238, 0.14)',
      backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.06)' : 'rgba(67, 97, 238, 0.05)',
    },
    defLine: {
      fontSize: 15,
      lineHeight: 24,
      color: body,
      marginBottom: 8,
      paddingLeft: 8,
      borderLeftWidth: 3,
      borderLeftColor: a,
    },
    noDataText: {
      fontSize: 14,
      fontStyle: 'italic',
      color: muted,
    },
    toggleButton: {
      marginTop: 12,
      alignSelf: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.35)' : 'rgba(67, 97, 238, 0.28)',
      backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.08)',
    },
    toggleButtonText: {
      color: a,
      fontSize: 13,
      fontWeight: '700',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 28,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
      backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDarkMode ? 0.35 : 0.12,
          shadowRadius: 12,
        },
        default: { elevation: 6 },
      }),
    },
    paginationButton: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.35)' : 'rgba(67, 97, 238, 0.25)',
      backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.12)' : 'rgba(67, 97, 238, 0.08)',
    },
    paginationButtonDisabled: {
      opacity: 0.35,
    },
    paginationText: {
      marginHorizontal: 20,
      fontSize: 15,
      fontWeight: '800',
      color: hero,
      minWidth: 72,
      textAlign: 'center',
    },
    paginationMuted: {
      fontWeight: '600',
      color: muted,
    },
    errorText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDarkMode ? '#FCA5A5' : '#B91C1C',
      textAlign: 'center',
      marginTop: 24,
      paddingHorizontal: 24,
    },
  });
};

export const Colors = {
  light: {
    buttonBackground: 'rgba(67, 97, 238, 0.12)',
    buttonText: ACCENT_L,
    primaryText: ACCENT_L,
    secondaryText: ACCENT_L,
    background: '#F8F9FA',
  },
  dark: {
    buttonBackground: 'rgba(76, 201, 240, 0.12)',
    buttonText: ACCENT_D,
    primaryText: ACCENT_D,
    secondaryText: ACCENT_D,
    background: '#0F0F1B',
  },
};
