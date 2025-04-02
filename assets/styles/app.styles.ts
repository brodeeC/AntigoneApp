import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = "#6A0DAD"; // Deep purple
const SECONDARY_COLOR = "#1E88E5"; // Vibrant blue
const LIGHT_GRAY = "#F9F9F9";
const DARK_GRAY = "#1C1C1E";
const WHITE = "#FFFFFF";
const DARK_TEXT = "#333333";

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonGrid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    buttonHalf: {
        width: '48%', 
        minHeight: 120,
        borderRadius: 12,
        padding: 16,
        backgroundColor: SECONDARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    buttonContent: {
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: WHITE,
        textAlign: 'center',
    },
    iconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
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
});