import { StyleSheet } from "react-native";



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
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
    lineBlock: {
        marginBottom: 24,
    },
    speakerDivider: {
        height: 1,
        width: '40%',
        marginBottom: 12,
        alignSelf: 'center',
    },
    speaker: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        letterSpacing: 1,
        marginBottom: 12,
        textAlign: 'center',
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    lineNumberButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginRight: 12,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: 'transparent', 
        marginTop: 4,
        marginLeft: 4,
    },
    lineNumberText: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
    },
    lineTextContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    word: {
        fontSize: 18,
        fontFamily: 'Inter-Medium',
        lineHeight: 28,
        marginRight: 6,
        marginVertical: 2,
    },
    wordDetailsContainer: {
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 24,
        width: 400,
        borderWidth: 1,
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: DARK_TEXT, 
    },
    lineNumber: {
        fontSize: 16,
        fontWeight: "bold", 
        color: DARK_TEXT,
        width: 40,
        textAlign: "right",
        marginRight: 16, 
    },

    lineText: {
        flex: 1,
        fontSize: 18, 
        fontWeight: "600", 
        color: DARK_TEXT, 
        lineHeight: 28,
    },

    text: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: DARK_TEXT, 
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    const accentColor = isDarkMode ? '#4CC9F0' : '#4361EE';
    const mutedColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    return StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
        },
        speakerDivider: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        speaker: {
            color: accentColor,
        },
        lineNumberButton: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        },
        lineNumberText: {
            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            fontSize: 12,
            fontFamily: 'Inter-Medium',
        },
        word: {
            color: isDarkMode ? '#E5E5E5' : '#2B2D42',
        },
        selectedWord: {
            color: accentColor,
            backgroundColor: mutedColor,
            borderRadius: 4,
            paddingHorizontal: 2,
        },
        wordDetailsContainer: {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(248, 249, 250, 0.8)',
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.2)' : 'rgba(67, 97, 238, 0.1)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 16,
        },
        header: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        lineNumber: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        lineText: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        text: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        highlightedWord: {
            backgroundColor: "#64B5F6", 
            borderRadius: 5,
            padding: 2,
        },
        

        wordDetailsTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: isDarkMode ? "#FFD54F" : "#F57C00", 
            marginBottom: 4,
        },

        wordDetailsText: {
            fontSize: 16,
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        loadingContainer: {
            //backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
        },
        errorText: {
            fontSize: 14,
            color: "#D32F2F", 
            marginTop: 8,
        },
        wordDetailsLabel: {
            fontWeight: "bold",
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        caseContainer: {
            marginTop: 12,
        },
        definitionsContainer: {
            marginTop: 12,
        },
        definitionContainer: {
            marginTop: 6,
        },
        definitionText: {
            fontSize: 14,
            color: isDarkMode ? "#bbb" : "#555",
        },
        moreDetailsButton: {
            marginTop: 12,
            paddingVertical: 8,
            backgroundColor: "#007AFF",
            borderRadius: 4,
            alignItems: "center",
        },
        moreDetailsButtonText: {
            color: "#fff",
            fontWeight: "bold",
        },
        linkText: {
            color: "#007AFF",
        },
        definitionLabel: {
            fontWeight: "bold",
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