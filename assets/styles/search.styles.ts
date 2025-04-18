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
    tabBarContainer: {
      width: '100%',
      zIndex: 10,
    },
    tabBar: {
      paddingHorizontal: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    tabItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 4,
    },
    activeTabItem: {
      position: 'relative',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    },
    activeTabText: {
      color: isDark ? '#fff' : '#000',
      fontWeight: '600',
    },
    indicator: {
      position: 'absolute',
      bottom: -1,
      left: 16,
      right: 16,
      height: 2,
      backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
      borderRadius: 2,
    },
    tabList: {
      alignItems: 'center',
      justifyContent: 'center',
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
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? 70 : 30,
      paddingHorizontal: 20,
      paddingBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
    },
    darkHeader: {
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(26, 26, 46, 0.7)',
    },
    lightHeader: {
      borderBottomColor: 'rgba(0, 0, 0, 0.05)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    headerText: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.5,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 10,
    },
    darkHeaderText: {
      color: '#E2E8F0',
    },
    lightHeaderText: {
      color: '#2D3748',
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    headerRightSpacer: {
      width: 40, 
    },
  });
};