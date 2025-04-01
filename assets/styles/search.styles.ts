import { StyleSheet } from 'react-native';

export const searchStyles = (isDark: boolean) => {
  const colors = {
    background: isDark ? '#121212' : '#F9F9F9',
    activeTab: isDark ? '#64B5F6' : '#1E88E5',
    inactiveTab: isDark ? '#888' : '#999',
    indicator: isDark ? '#64B5F6' : '#1E88E5',
    text: isDark ? '#E5E5E5' : '#333333',
    tabBarBackground: isDark ? '#1C1C1E' : '#F9F9F9',
    border: isDark ? '#333' : '#e0e0e0',
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Tab bar styles
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.tabBarBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabList: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    // Tab item styles
    tabItem: {
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      position: 'relative',
    },
    activeTabItem: {
      // Additional styles for active tab if needed
    },
    // Text styles
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'none',
      color: colors.inactiveTab,
    },
    activeTabText: {
      color: colors.activeTab,
    },
    // Indicator styles
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      width: '80%',
      alignSelf: 'center',
      backgroundColor: colors.indicator,
      borderRadius: 2,
    },
    // Content styles
    contentContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    // Add these if you need scrollable tabs
    scrollableTabContainer: {
      paddingHorizontal: 8,
    },
    // Add these for tab button states
    tabButtonPressed: {
      opacity: 0.8,
    },
  });
};