import { StyleSheet, Platform } from "react-native";

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
    navButton: {
        padding: 16,
        borderRadius: 28,
        width: 64, 
        height: 64, 
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 32, 
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        borderWidth: 1,
    },
    navigationContainer: {
        position: "absolute",
        bottom: 40, 
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: 'transparent', 
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
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    backButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        marginLeft: 8,
    },
    backButtonContainer: {
        position: 'absolute',
        top: Platform.select({
            ios: 60,
            android: 30
        }),
        left: 24,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.3,
        includeFontPadding: false,
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
    scrollContainer: {
        paddingBottom: 120, 
    },
    wordDetailsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    wordDetailsText: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 14,
        marginTop: 8,
    },
    definitionContainer: {
        marginTop: 6,
    },
    definitionText: {
        fontSize: 14,
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    const accentColor = isDarkMode ? ACCENT_COLOR_DARK : ACCENT_COLOR_LIGHT;
    const mutedColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_GRAY,
        },
        lineNumber: {
            color: accentColor,
        },
        speaker: {
            color: accentColor,
        },
        word: {
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        navigationContainer: {
            backgroundColor: 'transparent',
        },
        navButton: {
            backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.3)' : 'rgba(67, 97, 238, 0.3)',
        },
        wordDetailsContainer: {
            backgroundColor: isDarkMode ? "#1E1E1E" : "#F5F5F5",
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.2)' : 'rgba(67, 97, 238, 0.1)',
        },
        selectedWord: {
            backgroundColor: isDarkMode ? "rgba(76, 201, 240, 0.2)" : "rgba(67, 97, 238, 0.2)",
            color: accentColor,
        },
        backButton: {
            backgroundColor: 'transparent',
        },
        backButtonText: {
            color: accentColor,
        },
        loadingContainer: {
            //backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
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
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        lineRangeText: {
            color: accentColor,
        },
        lineRangeContainer: {
            backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.3)' : 'rgba(67, 97, 238, 0.3)',
        },
        lineNumberButton: {
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.3)' : 'rgba(67, 97, 238, 0.3)',
        },
        lineNumberButtonText: {
            color: isDarkMode ? 'rgba(76, 201, 240, 0.8)' : 'rgba(67, 97, 238, 0.8)',
        },
        wordDetailsTitle: {
            color: isDarkMode ? "#FFD54F" : "#F57C00",
        },
        wordDetailsText: {
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        errorText: {
            color: "#D32F2F",
        },
        definitionText: {
            color: isDarkMode ? "#bbb" : "#555",
        },
    });
};

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