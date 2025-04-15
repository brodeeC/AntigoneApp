import { StyleSheet, Platform } from "react-native";

// Modern color palette
const PRIMARY_COLOR = "#4361EE"; // Vibrant blue
const SECONDARY_COLOR = "#3A0CA3"; // Deep purple-blue
const ACCENT_COLOR = "#4CC9F0"; // Bright cyan
const LIGHT_BACKGROUND = "#F8F9FA"; // Soft white
const DARK_BACKGROUND = "#0F0F1B"; // Deep space blue
const LIGHT_TEXT = "#2B2D42"; // Dark blue-gray
const DARK_TEXT = "#F8F9FA"; // Off-white
const DISABLED_COLOR = "#6C757D"; // Modern gray

// Gradient colors
const GRADIENT_START = "#4361EE";
const GRADIENT_END = "#3A0CA3";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.select({
            ios: 80,  
            android: 80  
        }),
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    headerContainer: {
        marginBottom: 20,
        paddingBottom: 10,
        alignItems: 'center',
    },
    speaker: {
        fontSize: 22,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    lineNumber: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: PRIMARY_COLOR,
        letterSpacing: 0.5,
    },
    word: {
        fontSize: 22,
        fontFamily: 'Inter-Medium',
        lineHeight: 32,
        marginRight: 8,
        marginVertical: 2,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    lineTextContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 8,
        marginBottom: 30,
    },
    navigationContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    navButton: {
        padding: 16,
        borderRadius: Platform.select({
            ios: 16,
            android: 31.9,
        }),
        width: 64,
        height: 64,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 32,
        shadowColor: "#FFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    disabledNavButton: {
        opacity: 0.5,
    },
    selectedWord: {
        backgroundColor: "rgba(67, 97, 238, 0.2)",
        transform: [{ scale: 1.05 }],
    },
    wordDetailsContainer: {
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(67, 97, 238, 0.1)',
    },
    backButton: {
        padding: 14,
        borderRadius: Platform.select({
            ios: 14,
            android: 26,
        }),
        justifyContent: 'center',
        alignItems: 'center',
        width: 52,
        height: 52,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        shadowColor: '#FFF',
    },
    backButtonContainer: {
        position: 'absolute',
        top: Platform.select({
            ios: 50,
            android: 24
        }),
        left: 24,
        zIndex: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '500',
    },
    floatingLineNumber: {
        position: 'absolute',
        top: Platform.select({
            ios: 110,
            android: 90
        }),
        textAlign: 'center',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        borderRadius: 20,
        paddingVertical: 11,
        paddingHorizontal: 16,
        zIndex: 24,
        borderWidth: 1,
        borderColor: 'rgba(67, 97, 238, 0.2)',
    },
    divider: {
        height: 1,
        marginVertical: 16,
        width: '40%',
        alignSelf: 'center',
    },
    lineRangeContainer: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 8,
        marginTop: Platform.select({
            ios: 40,
            android: 0
        }),
    },
    lineRangeText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.5,
    },
    lineNumberButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: Platform.select({
            ios: 16,
            android: 26,
        }),
        alignSelf: 'flex-start',
        marginVertical: 8,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lineNumberButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        lineNumber: {
            color: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
        },
        speaker: {
            color: isDarkMode ? DARK_TEXT : LIGHT_TEXT,
        },
        word: {
            color: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
        },
        navigationContainer: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        wordDetailsContainer: {
            backgroundColor: isDarkMode ? "#1A1A2E" : "#FFFFFF",
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.2)' : 'rgba(67, 97, 238, 0.1)',
        },
        selectedWord: {
            backgroundColor: isDarkMode ? "rgba(76, 201, 240, 0.2)" : "rgba(67, 97, 238, 0.2)",
            color: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
        },
        backButton: {
            backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
        },
        loadingContainer: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        floatingLineNumber: {
            backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.3)' : 'rgba(67, 97, 238, 0.2)',
        },
        divider: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        text: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            color: isDarkMode ? DARK_TEXT : LIGHT_TEXT,
        },
        lineRangeText: {
            color: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
        },
        lineNumberButton: {
            backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.3)' : 'rgba(67, 97, 238, 0.2)',
            borderWidth: 1,
        },
        lineNumberButtonText: {
            color: isDarkMode ? ACCENT_COLOR : PRIMARY_COLOR,
        },
    });
};

export const Colors = {
    light: {
        buttonBackground: PRIMARY_COLOR,
        buttonText: '#FFFFFF',
        background: LIGHT_BACKGROUND,
        loadingBackground: LIGHT_BACKGROUND,
        loadingIndicator: PRIMARY_COLOR,
        text: LIGHT_TEXT,
    },
    dark: {
        buttonBackground: ACCENT_COLOR,
        buttonText: '#FFFFFF',
        background: DARK_BACKGROUND,
        loadingBackground: '#121212',
        loadingIndicator: ACCENT_COLOR,
        text: DARK_TEXT,
    }
};