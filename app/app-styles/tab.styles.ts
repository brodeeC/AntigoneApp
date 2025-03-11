import { Platform, StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#6A0DAD'; // Deep purple
const LIGHT_GRAY = '#F9F9F9'; // Light gray for light mode backgrounds
const DARK_GRAY = '#1C1C1E'; // Dark gray for dark mode backgrounds
const WHITE = '#FFFFFF'; // White for text in dark mode
const DARK_TEXT = '#333333'; // Dark gray for text in light mode

// Base styles (shared between light and dark modes)
export const styles = StyleSheet.create({
    tabBar: {
        height: 60, // Set a fixed height for the tab bar
        paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Add padding for iOS
        borderTopWidth: 1, // Add a border at the top
    },
});

// Dynamic styles for light/dark mode
export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        tabBar: {
            backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY, // Tab bar background color
            borderColor: isDarkMode ? '#3A3A3C' : '#E0E0E0', // Border color
        },
        activeTab: {
            color: PRIMARY_COLOR, // Active tab text/icon color
        },
        inactiveTab: {
            color: isDarkMode ? '#A0A0A0' : DARK_TEXT, // Inactive tab text/icon color
        },
    });
};