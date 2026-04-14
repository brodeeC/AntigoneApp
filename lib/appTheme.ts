/**
 * Shared screen chrome (matches Home): gradients, accents, glass borders.
 */

export const screenGradient = (isDark: boolean): [string, string] =>
  isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF'];

export const accent = {
  light: '#4361EE',
  dark: '#4CC9F0',
} as const;

export const accentFor = (isDark: boolean) => (isDark ? accent.dark : accent.light);

export const glassBorder = (isDark: boolean) =>
  isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';

export const glassSurface = (isDark: boolean) =>
  isDark ? 'rgba(26, 26, 46, 0.72)' : 'rgba(255, 255, 255, 0.82)';
