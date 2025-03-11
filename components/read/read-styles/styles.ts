import { StyleSheet } from "react-native";

const PRIMARY_COLOR = "#6A0DAD"; // Deep purple (for buttons only)
const MUTED_PURPLE = "#957FEF"; // Muted purple (for accents, if needed)
const LIGHT_GRAY = "#F9F9F9"; // Light gray for light mode backgrounds
const DARK_GRAY = "#1C1C1E"; // Dark gray for dark mode backgrounds
const WHITE = "#FFFFFF"; // White for text in dark mode
const DARK_TEXT = "#333333"; // Dark gray for text in light mode

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
            color: isDarkMode ? WHITE : DARK_TEXT, // Words in white (dark mode) or dark gray (light mode)
        },
        text: {
            color: isDarkMode ? WHITE : DARK_TEXT, // Loading/error text in white (dark mode) or dark gray (light mode)
        },
    });
};