// Updated line-details.styles.ts
import { StyleSheet, Platform } from "react-native";

// Updated color palette to match the subtle filled buttons
const PRIMARY_COLOR = "#1E88E5"; // Lighter blue
const DARK_BLUE = "#64B5F6"; // Even lighter blue for dark mode
const LIGHT_BACKGROUND = "#F9F9F9"; // Slightly off-white
const DARK_BACKGROUND = "#1C1C1E"; // Dark gray
const LIGHT_TEXT = "#333333"; // Dark gray for light mode
const DARK_TEXT = "#E5E5E5"; // Light gray for dark mode
const DISABLED_COLOR = "#A0A0A0"; // Gray for disabled state

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
        borderRadius: 28, 
        width: 56,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 24, 
        backgroundColor: 'rgba(30, 136, 229, 0.1)', 
        borderWidth: 1,
    },
    disabledNavButton: {
        opacity: 0.5,
    },
    selectedWord: {
        backgroundColor: "rgba(30, 136, 229, 0.2)",
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
    },
    backButton: {
        padding: 16,
        borderRadius: 28, // Fully rounded
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 136, 229, 0.1)', // Matching fill
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButtonContainer: {
        position: 'absolute',
        top: Platform.select({
            ios: 65,
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
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        borderRadius: 20,
        paddingVertical: 11,
        paddingHorizontal: 16,
        zIndex: 24,
        borderWidth: 1,
    },
    divider: {
        height: 1,
        marginVertical: 16,
        width: '40%',
        alignSelf: 'center',
    },
    lineRangeContainer: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 2,
        marginTop: Platform.select({
            ios: 50,
            android: 0
        }),
    },
    lineRangeText: {
        fontSize: 18, // Slightly larger
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.3,
        includeFontPadding: false, // Better vertical alignment
    },
    lineNumberButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginVertical: 8,
        marginLeft: 8,
        backgroundColor: 'transparent',
        borderWidth: 1,
        minWidth: 48,
        alignItems: 'center',
    },
    lineNumberButtonText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        lineNumber: {
            color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        },
        speaker: {
            color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        },
        word: {
            color: isDarkMode ? DARK_TEXT : LIGHT_TEXT,
        },
        navigationContainer: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        wordDetailsContainer: {
            backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
            borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.2)' : 'rgba(30, 136, 229, 0.1)',
        },
        selectedWord: {
            backgroundColor: isDarkMode ? "rgba(100, 181, 246, 0.2)" : "rgba(30, 136, 229, 0.2)",
            color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        },
        backButton: {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
            borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(30, 136, 229, 0.3)',
        },
        loadingContainer: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        floatingLineNumber: {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
            borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(30, 136, 229, 0.2)',
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
            color: isDarkMode ? "#64B5F6" : "#1E88E5",
        },
        lineRangeContainer: {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
            borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(30, 136, 229, 0.3)',
        },
        lineNumberButton: {
            borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(30, 136, 229, 0.3)',
        },
        lineNumberButtonText: {
            color: isDarkMode ? 'rgba(100, 181, 246, 0.8)' : 'rgba(30, 136, 229, 0.8)',
        },
        navButton: {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
            borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(30, 136, 229, 0.3)',
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
        buttonBackground: DARK_BLUE,
        buttonText: '#FFFFFF',
        background: DARK_BACKGROUND,
        loadingBackground: '#121212',
        loadingIndicator: DARK_BLUE,
        text: DARK_TEXT,
    }
};