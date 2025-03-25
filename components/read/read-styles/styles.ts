import { StyleSheet } from "react-native";

// Primary Colors
const PRIMARY_COLOR = "#6A0DAD"; // Deep purple (main accent)
const LIGHT_BLUE = "#1E88E5"; // Vibrant blue for words
const DARK_BLUE = "#64B5F6"; // Lighter blue for dark mode words

// Background & Text Colors
const LIGHT_GRAY = "#F9F9F9"; // Light mode background
const DARK_GRAY = "#1C1C1E"; // Dark mode background
const WHITE = "#FFFFFF"; // White for text in dark mode
const DARK_TEXT = "#333333"; // Dark gray for text in light mode
const MUTED_GRAY = "#888888"; // Muted gray for line numbers
const DISABLED_COLOR = "#A0A0A0"; // Gray for disabled state

export const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        padding: 20,
    },

    // ScrollView Content
    scrollViewContent: {
        paddingBottom: 80, // Add padding to ensure the last line is visible
    },

    // Header
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: DARK_TEXT, // Header text in dark gray (light mode)
    },

    // Speaker Styles
    speaker: {
        fontSize: 20,
        fontWeight: "600",
        color: DARK_TEXT, // Speaker text in dark gray (light mode)
        marginTop: 16,
        marginBottom: 8,
        paddingLeft: 8,
    },

    // Line Container
    lineContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16, // Increased space between lines
        paddingLeft: 16,
    },

    // Line Number
    lineNumber: {
        fontSize: 16, // Increased font size
        fontWeight: "bold", // Made bolder
        color: DARK_TEXT, // Line numbers in dark gray (light mode)
        width: 40,
        textAlign: "right",
        marginRight: 16, // Increased space between line number and text
    },

    // Line Text
    lineText: {
        flex: 1,
        fontSize: 18, // Increased font size
        fontWeight: "600", // Made bolder
        color: DARK_TEXT, // Line text in dark gray (light mode)
        lineHeight: 28, // Increased line height for better spacing
    },

    // Word Styles
    word: {
        fontSize: 18, // Increased font size
        fontWeight: "600", // Made bolder
        color: DARK_TEXT, // Words in dark gray (light mode)
    },

    // Loading and Error Text
    text: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: DARK_TEXT, // Loading/error text in dark gray (light mode)
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
        },
        header: {
            color: isDarkMode ? WHITE : DARK_TEXT, // Header text in white (dark mode) or dark gray (light mode)
        },
        speaker: {
            color: isDarkMode ? WHITE : DARK_TEXT, // Speaker text in white (dark mode) or dark gray (light mode)
        },
        lineNumber: {
            color: isDarkMode ? WHITE : DARK_TEXT, // Line numbers in white (dark mode) or dark gray (light mode)
        },
        lineText: {
            color: isDarkMode ? WHITE : DARK_TEXT, // Line text in white (dark mode) or dark gray (light mode)
        },
        word: {
            color: isDarkMode ? DARK_BLUE : LIGHT_BLUE, // Words in white (dark mode) or dark gray (light mode)
        },
        text: {
            color: isDarkMode ? WHITE : DARK_TEXT, // Loading/error text in white (dark mode) or dark gray (light mode)
        },
        // Word Details Container
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

        // Word Details Title
        wordDetailsTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: isDarkMode ? "#FFD54F" : "#F57C00", // Gold vs. Orange
            marginBottom: 4,
        },

        // Word Details Text
        wordDetailsText: {
            fontSize: 16,
            color: isDarkMode ? WHITE : DARK_TEXT,
        },

        // Error Message Styling
        errorText: {
            fontSize: 14,
            color: "#D32F2F", // Red for errors
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