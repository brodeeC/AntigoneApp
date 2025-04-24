import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = "#4361EE"; // Vibrant blue
const SECONDARY_COLOR = "#3A0CA3"; // Deep purple-blue
const ACCENT_COLOR = "#4CC9F0"; // Bright cyan
const LIGHT_BACKGROUND = "#F8F9FA"; // Soft white
const DARK_BACKGROUND = "#0F0F1B"; // Deep space blue
const LIGHT_TEXT = "#2B2D42"; // Dark blue-gray
const DARK_TEXT = "#F8F9FA"; // Off-white

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
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
        color: LIGHT_TEXT,
    },
    darkText: {
        color: DARK_TEXT,
    },
    lightSubtext: {
        color: LIGHT_TEXT,
        opacity: 0.8,
    },
    darkSubtext: {
        color: DARK_TEXT,
        opacity: 0.8,
    },
});