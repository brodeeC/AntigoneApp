import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';

const PRIMARY_COLOR = '#4361EE';
const ACCENT_COLOR = '#4CC9F0';

interface DynamicStyles {
  activeTabColor: string;
  menuItemStyle: ViewStyle;
  menuItemTextStyle: TextStyle;
  expandingMenuStyle: ViewStyle;
  menuDividerStyle: ViewStyle;
}

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
    // `top` set in tabLayout from safe-area insets
  },
  /** Rounded chip (not a circle) — bookmark reads as a nav affordance, not a heavy FAB orb */
  fabChrome: {
    height: 44,
    minWidth: 48,
    paddingHorizontal: 13,
    borderRadius: 14,
    overflow: 'hidden',
    zIndex: 101,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      default: {
        elevation: 5,
      },
    }),
  },
  fabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandingMenu: {
    position: 'absolute',
    right: 20,
    zIndex: 99,
    borderRadius: 20,
    minWidth: 176,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      default: {
        elevation: 16,
      },
    }),
  },
  menuInner: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginVertical: 2,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 6,
    width: '86%',
    alignSelf: 'center',
  },
});

export const getDynamicStyles = (isDarkMode: boolean): DynamicStyles => ({
  activeTabColor: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
  menuItemStyle: {
    backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.12)' : 'rgba(67, 97, 238, 0.1)',
  },
  menuItemTextStyle: {
    color: isDarkMode ? '#F8FAFC' : '#1E293B',
  },
  expandingMenuStyle: {
    backgroundColor: 'transparent',
    borderColor: isDarkMode ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.1)',
  },
  menuDividerStyle: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
  },
});
