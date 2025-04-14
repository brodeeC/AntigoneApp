import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Modern color palette matching your line-details styles
const PRIMARY_COLOR = "#4361EE";
const SECONDARY_COLOR = "#3A0CA3";
const ACCENT_COLOR = "#4CC9F0";
const LIGHT_BACKGROUND = "#F8F9FA";
const DARK_BACKGROUND = "#0F0F1B";

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
        top: Platform.select({
            ios: 60,
            android: 40
        }),
        right: 24,
        zIndex: 100,
    },
    bookmarkButton: {
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        width: 56,
        height: 56,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 101,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(67, 97, 238, 0.2)',
    },
    expandingMenu: {
        position: 'absolute',
        top: Platform.select({
            ios: 120,
            android: 100
        }),
        right: 24,
        zIndex: 99,
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 8,
        minWidth: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginVertical: 4,
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuDivider: {
        height: 1,
        marginVertical: 8,
        width: '80%',
        alignSelf: 'center',
    }
});

export const getDynamicStyles = (isDarkMode: boolean): DynamicStyles => ({
    activeTabColor: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
    menuItemStyle: {
      backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
    },
    menuItemTextStyle: {
      color: isDarkMode ? '#F8F9FA' : '#2B2D42',
    },
    expandingMenuStyle: {
      backgroundColor: isDarkMode ? '#1A1A2E' : '#FFFFFF',
      borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.2)' : 'rgba(67, 97, 238, 0.1)',
      borderWidth: 1,
    },
    menuDividerStyle: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    }
  });