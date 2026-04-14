import type { ReactNode } from 'react';
import { View, StyleSheet, Platform, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { glassBorder, glassSurface } from '@/lib/appTheme';

type GlassPanelProps = {
  isDark: boolean;
  children: ReactNode;
  style?: ViewStyle;
  /** Inner padding (default 16) */
  padding?: number;
};

/**
 * Home-style frosted panel: BlurView on iOS, solid glass fill on Android.
 */
export function GlassPanel({ isDark, children, style, padding = 16 }: GlassPanelProps) {
  const border = glassBorder(isDark);
  const fill = glassSurface(isDark);

  return (
    <View
      style={[
        {
          borderRadius: 18,
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: border,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.4 : 0.15,
              shadowRadius: 16,
            },
            default: { elevation: 8 },
          }),
        },
        style,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={isDark ? 50 : 58}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
      )}
      <View style={{ position: 'relative', padding }}>{children}</View>
    </View>
  );
}
