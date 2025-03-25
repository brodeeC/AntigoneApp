import { StyleSheet, Platform } from "react-native";

// Primary Colors
const PRIMARY_COLOR = "#1E88E5"; // Using your bookmark blue
const LIGHT_BLUE = "#1E88E5"; // Now same as primary
const DARK_BLUE = "#64B5F6"; // Lighter blue for dark mode

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
        padding: Platform.select({
            ios: 24,
            android: 20
        }),
        paddingBottom: Platform.select({
            ios: 100, // Extra space at bottom for iOS
            android: 80
        }),
    },

    // Header - Perfectly centered
    headerContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        width: "100%", // Ensure full width for centering
    },
    header: {
        fontSize: Platform.select({
            ios: 28,  // Slightly larger on iOS
            android: 24
        }),
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: Platform.select({
            ios: 0.5,  // More elegant spacing
            android: 0
        })
    },

    // Pagination Container - Fixed positioning
    paginationBottomContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: Platform.OS == 'ios'? 'auto' :"100%",
        paddingVertical: 16,
        position: "absolute",
        bottom: 0, // Stick to bottom
        left: Platform.OS == 'ios'? 0 : 20,
        right: 0,
        backgroundColor: LIGHT_GRAY,
        borderTopWidth: 1,
    },

    // Arrow Buttons - Centered with new color
    arrowButton: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: PRIMARY_COLOR, // Using bookmark blue
        marginHorizontal: 8, // Space between buttons and text
    },

    // Page Number - Perfectly centered
    pageNumber: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 24,
        textAlign: "center", // Ensure text centering
        width: 60, // Fixed width for perfect centering
    },

    disabledArrowButton: {
        backgroundColor: DISABLED_COLOR,
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
            textShadowColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2
        },
        pageNumber: {
            color: isDarkMode ? WHITE : DARK_TEXT,
            fontFamily: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif' }) // Platform fonts
        },
        paginationBottomContainer: {
            backgroundColor: isDarkMode ? DARK_GRAY : LIGHT_GRAY,
            borderColor: isDarkMode ? "#3A3A3C" : "#E0E0E0",
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: -5 }
                }
            })
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
