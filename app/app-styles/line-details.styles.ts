import { StyleSheet } from "react-native";

const PRIMARY_COLOR = "#6A0DAD"; // Deep purple
const LIGHT_BACKGROUND = "#F9F9F9"; // Light mode background
const DARK_BACKGROUND = "#121212"; // Dark mode background (near black)
const OFF_WHITE = "#E5E5E5"; // Off-white for text in dark mode
const DARK_TEXT = "#333333"; // Dark text in light mode
const MUTED_PURPLE = "#B19CD9"; // Muted purple for buttons
const DISABLED_COLOR = "#555555"; // Gray for disabled buttons

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    // Header container (Line number + Speaker)
    headerContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
    },

    // Line Number
    lineNumber: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },

    // Speaker Name
    speaker: {
        fontSize: 18,
        fontWeight: "600",
    },

    // Line Text
    lineTextContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    // Word Styling
    word: {
        fontSize: 18,
        color: MUTED_PURPLE,
        marginRight: 5,
    },

    // Navigation Container
    navigationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    // Navigation Buttons
    navButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: MUTED_PURPLE,
        width: "45%",
        alignItems: "center",
    },

    navButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },

    // Disabled Button
    disabledNavButton: {
        backgroundColor: DISABLED_COLOR,
    },

    disabledNavButtonText: {
        color: "#888",
    },
});

// Dynamic styles for light/dark mode
export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        speaker: {
            color: isDarkMode ? OFF_WHITE : DARK_TEXT,
        },
        lineNumber: {
            color: isDarkMode ? OFF_WHITE : PRIMARY_COLOR,
        },
        word: {
            color: isDarkMode ? "#A48AD4" : MUTED_PURPLE, // Softer purple in dark mode
        },
    });
};
