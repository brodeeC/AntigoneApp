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
      alignItems: 'center', 
    },
    tabBar: {
      width: '100%', 
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    tabItem: {
      paddingHorizontal: 60, 
      paddingVertical: 14,
    },
    tabList: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      width: '100%',
    },
    indicator: {
      position: 'absolute',
      bottom: -1, 
      left: '60%', 
      right: '60%',
      height: 3,
      backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
    },
    activeTabItem: {
      position: 'relative',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    },
    activeTabText: {
      color: isDark ? '#fff' : '#000',
      fontWeight: '600',
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