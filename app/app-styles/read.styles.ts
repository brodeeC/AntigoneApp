import { StyleSheet, Platform } from "react-native";

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

// Shared Base Styles
export const styles = StyleSheet.create({
    // Main Container
    container: {
        flex: 1,
        padding: 20,
    },

    // Header
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },

    // Pagination Container
    paginationBottomContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        position: "absolute",
        bottom: Platform.OS === "ios" ? 60 : 5,
        left: 20,
        right: 0,
        backgroundColor: LIGHT_GRAY,
    },
    pageNumber: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 20,
    },

    // Arrow Buttons
    arrowButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: LIGHT_BLUE,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3, // Android shadow
    },
    disabledArrowButton: {
        backgroundColor: DARK_BLUE,
    },

    // Line & Word Styling
    lineContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    word: {
        fontSize: 16,
        fontWeight: "500",
        marginHorizontal: 1,
    },
});

// Dynamic Styles for Light/Dark Mode
export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
        },
        header: {
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        pageNumber: {
            color: isDarkMode ? WHITE : DARK_TEXT,
        },
        paginationBottomContainer: {
            backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
            borderColor: isDarkMode ? "#3A3A3C" : "#E0E0E0",
        },
        disabledArrowIcon: {
            color: isDarkMode ? "#666666" : "#A0A0A0",
        },

        // Speaker Styling
        speaker: {
            fontSize: 20,
            fontWeight: "600",
            color: isDarkMode ? "#BB86FC" : "#6200EE", // Purple hues for elegance
            marginBottom: 4,
        },

        // Line Number Styling
        lineNumber: {
            fontSize: 14,
            fontWeight: "500",
            color: isDarkMode ? MUTED_GRAY : "#555555", // Subtle contrast
            marginRight: 10,
        },

        // Line Text Styling
        lineText: {
            fontSize: 16,
            color: isDarkMode ? WHITE : DARK_TEXT,
            flexWrap: "wrap",
            flexShrink: 1,
        },

        // Word Styling
        word: {
            color: isDarkMode ? DARK_BLUE : LIGHT_BLUE, // Dynamic accent color
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
    });
};
