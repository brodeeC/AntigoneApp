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
    
    tabItem: {
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      position: 'relative',
    },
    activeTabItem: {
      
    },
    
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'none',
      color: colors.inactiveTab,
    },
    activeTabText: {
      color: colors.activeTab,
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
      backgroundColor: colors.background,
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