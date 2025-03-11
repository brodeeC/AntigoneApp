import { StyleSheet, Platform } from "react-native";

const PRIMARY_COLOR = "#6A0DAD"; // Deep purple
const LIGHT_GRAY = "#F9F9F9"; // Light gray for light mode backgrounds
const DARK_GRAY = "#1C1C1E"; // Dark gray for dark mode backgrounds
const WHITE = "#FFFFFF"; // White for text in dark mode
const DARK_TEXT = "#333333"; // Dark gray for text in light mode
const DISABLED_COLOR = "#A0A0A0"; // Gray for disabled state

// Base styles (shared between light and dark modes)
export const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        padding: 20,
    },

    // Header Container
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },

    // Header Text
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },

    // Pagination Bottom Container
    paginationBottomContainer: {
        flexDirection: "row",
        justifyContent: "center", // Center the page number
        alignItems: "center",
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        position: "absolute", // Position absolutely
        bottom: Platform.OS === "ios" ? 60 : 60, // Adjust for tab bar height
        left: 0, // Stretch across the screen
        right: 0, // Stretch across the screen
        backgroundColor: LIGHT_GRAY, // Light mode background
    },

    // Page Number Text
    pageNumber: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 20, // Add space around the page number
    },

    // Arrow Buttons
    arrowButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: PRIMARY_COLOR,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3, // Android shadow
    },

    // Disabled Arrow Button
    disabledArrowButton: {
        backgroundColor: DISABLED_COLOR, // Gray for disabled state
    },
});

// Dynamic styles for light/dark mode
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
            borderColor: isDarkMode ? "#3A3A3C" : "#E0E0E0", // Dark border for dark mode
        },
        disabledArrowIcon: {
            color: isDarkMode ? "#666666" : "#A0A0A0", // Gray for disabled icons
        },
    });
};