import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';

const SECONDARY_COLOR = "#3A0CA3"; // Deep purple-blue
const ACCENT_COLOR = "#4CC9F0"; // Bright cyan
const LIGHT_BACKGROUND = "#F8F9FA"; // Soft white
const LIGHT_TEXT = "#2B2D42"; // Dark blue-gray

const PRIMARY_COLOR = "#1E88E5"; 
const LIGHT_BLUE = "#1E88E5"; 
const DARK_BLUE = "#64B5F6"; 
const ACCENT_COLOR_LIGHT = "#4361EE";
const ACCENT_COLOR_DARK = "#4CC9F0";
const DARK_BACKGROUND = "#0F0F1B";

const LIGHT_GRAY = "#F9F9F9"; // Light mode background
const DARK_GRAY = "#1C1C1E"; // Dark mode background
const WHITE = "#FFFFFF"; // White for text in dark mode
const DARK_TEXT = "#333333"; // Dark gray for text in light mode
const MUTED_GRAY = "#888888"; // Muted gray for line numbers
const DISABLED_COLOR = "#A0A0A0"; // Gray for disabled state

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginTop: Platform.select({
            ios: 30,
        }),
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Inter-Bold',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        opacity: 0.8,
    },
    buttonGrid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    buttonCard: {
        width: '100%',
        height: 120,
        borderRadius: 20,
        padding: 24,
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    lightCard: {
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(67, 97, 238, 0.1)',
    },
    darkCard: {
        backgroundColor: '#1A1A2E',
        borderColor: 'rgba(76, 201, 240, 0.2)',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        marginTop: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightBackground: {
        backgroundColor: LIGHT_BACKGROUND,
    },
    darkBackground: {
        backgroundColor: DARK_BACKGROUND,
    },
    lightText: {
        color: DARK_TEXT,
    },
    darkText: {
        color: WHITE,
    },
    lightSubtext: {
        color: DARK_TEXT,
        opacity: 0.8,
    },
    darkSubtext: {
        color: WHITE,
        opacity: 0.8,
    },
});

export const Colors = {
    light: {
        buttonBackground: ACCENT_COLOR_LIGHT,
        buttonText: WHITE,
        background: LIGHT_GRAY,
        loadingBackground: LIGHT_GRAY,
        loadingIndicator: ACCENT_COLOR_LIGHT,
        text: DARK_TEXT,
    },
    dark: {
        buttonBackground: ACCENT_COLOR_DARK,
        buttonText: WHITE,
        background: DARK_BACKGROUND,
        loadingBackground: '#121212',
        loadingIndicator: ACCENT_COLOR_DARK,
        text: WHITE,
    }
};