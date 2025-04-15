import { Platform, StyleSheet } from 'react-native';

export const searchStyles = (isDark: boolean) => {
  const colors = {
    background: isDark ? '#121212' : '#F9F9F9',
    activeTab: isDark ? '#64B5F6' : '#1E88E5',
    inactiveTab: isDark ? '#888' : '#999',
    indicator: isDark ? '#64B5F6' : '#1E88E5',
    text: isDark ? '#E5E5E5' : '#333333',
    tabBarBackground: isDark ? 'rgba(28, 28, 30, 0.9)' : 'rgba(249, 249, 249, 0.9)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.tabBarBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      zIndex: 5,
    },
    
    tabList: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    
    tabItem: {
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      position: 'relative',
    },
    
    activeTabItem: {
      // Add any active tab specific styles
    },
    
    label: {
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'none',
      color: colors.inactiveTab,
      fontFamily: 'Inter-Medium',
    },
    
    activeTabText: {
      color: colors.activeTab,
      fontFamily: 'Inter-SemiBold',
    },
    
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      width: '80%',
      alignSelf: 'center',
      backgroundColor: colors.indicator,
      borderRadius: 2,
    },
    
    contentContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    
    scrollableTabContainer: {
      paddingHorizontal: 8,
    },
    
    tabButtonPressed: {
      opacity: 0.8,
    },
  });
};