import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = "#6A0DAD"; // Deep purple
const LIGHT_GRAY = "#F9F9F9"; // Light gray for light mode backgrounds
const DARK_GRAY = "#1C1C1E"; // Dark gray for dark mode backgrounds
const WHITE = "#FFFFFF"; // White for text in dark mode
const DARK_TEXT = "#333333"; // Dark gray for text in light mode
const LIGHT_BLUE = "#1E88E5"; // Vibrant blue for words
const DARK_BLUE = "#64B5F6"; // Lighter blue for dark mode words

export default StyleSheet.create({
    // Container
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 15, // Space between buttons
    },
    button: {
        width: '80%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: DARK_BLUE,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5, // Shadow for Android
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    lightBackground: {
        backgroundColor: LIGHT_GRAY,
    },
    darkBackground: {
        backgroundColor: DARK_GRAY,
    },
    lightText: {
        color: DARK_TEXT,
    },
    darkText: {
        color: WHITE,
    },

    // Bottom Tabs
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    lightTabContainer: {
        backgroundColor: LIGHT_GRAY,
        borderColor: '#E0E0E0',
    },
    darkTabContainer: {
        backgroundColor: DARK_GRAY,
        borderColor: '#3A3A3C',
    },
    tabButton: {
        padding: 12,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: PRIMARY_COLOR, // Purple for active tab
    },
    inactiveTabText: {
        color: DARK_TEXT, // Gray for inactive tab
    },
});