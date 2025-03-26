import { Platform, StyleSheet } from 'react-native';

const LIGHT_BLUE = "#1E88E5";
const DARK_BLUE = "#64B5F6";

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.select({
            ios: 50,
            android: 20
        }),
        left: 20,
        zIndex: 100, // Higher than content
    },
    bookmarkButton: {
        backgroundColor: 'transparent',
        zIndex: 101, // Highest priority
    },
    expandingMenu: {
        position: 'absolute',
        top: Platform.select({
            ios: 90,
            android: 60
        }),
        left: 0,
        zIndex: 99, // Below button but above content
    },
    menuContent: {
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    menuItem: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => ({
    activeTab: {
        color: isDarkMode ? DARK_BLUE : LIGHT_BLUE,
    },
});