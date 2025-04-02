import { StyleSheet } from "react-native";

const PRIMARY_COLOR = "#6A0DAD"; 
const LIGHT_BLUE = "#1E88E5"; 
const DARK_BLUE = "#64B5F6"; 

const LIGHT_GRAY = "#F9F9F9"; // Light mode background
const DARK_GRAY = "#1C1C1E"; // Dark mode background
const WHITE = "#FFFFFF"; // White for text in dark mode
const DARK_TEXT = "#333333"; // Dark gray for text in light mode
const MUTED_GRAY = "#888888"; // Muted gray for line numbers
const DISABLED_COLOR = "#A0A0A0"; // Gray for disabled state

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    scrollViewContent: {
        paddingBottom: 80, 
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: DARK_TEXT, 
    },

    speaker: {
        fontSize: 20,
        fontWeight: "600",
        color: DARK_TEXT, 
        marginTop: 16,
        marginBottom: 8,
        paddingLeft: 8,
    },

    lineContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16, 
        paddingLeft: 16,
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

    word: {
        fontSize: 18, 
        fontWeight: "600", 
        color: DARK_TEXT, 
    },

    text: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: DARK_TEXT, 
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
        },
        header: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        speaker: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        lineNumber: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        lineText: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        word: {
            color: isDarkMode ? DARK_BLUE : LIGHT_BLUE, 
        },
        text: {
            color: isDarkMode ? WHITE : DARK_TEXT, 
        },
        wordDetailsContainer: {
            backgroundColor: isDarkMode ? "#1E1E1E" : "#F5F5F5",
            padding: 12,
            marginTop: 6,
            borderRadius: 8,
            shadowColor: isDarkMode ? "#000" : "#CCC",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
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