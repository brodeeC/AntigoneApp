import { Platform, StyleSheet } from "react-native";

const PRIMARY_COLOR = "#1E88E5"; // Bookmark blue
const SECONDARY_COLOR = "#64B5F6"; // Lighter blue for accents
const LIGHT_BACKGROUND = "#FFFFFF"; // Pure white
const DARK_BACKGROUND = "#121212"; // True black background
const LIGHT_TEXT = "#333333"; // Dark gray for light mode
const DARK_TEXT = "#E5E5E5"; // Off-white for dark mode
const DISABLED_COLOR = "#555555"; // Gray for disabled state

export const getDynamicStyles = (isDarkMode: boolean) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
    },

    safeAreaPadding: {
        paddingTop: Platform.select({
            ios: 44, // Extra space for iOS camera bar
            android: 0
        }),
    },

    wordDetailsContainer: {
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        paddingTop: Platform.select({
            ios: 20,
            android: 10
        }),
    },
    goButton: {
        backgroundColor: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    goButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        paddingTop: Platform.select({
            ios: 20,
            android: 20
        }),
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        zIndex: 10,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, 
    },

    entryContainer: {
        backgroundColor: isDarkMode ? "#2C2C2E" : "#F8F8F8",
        borderRadius: 12,
        padding: 16,
        shadowColor: isDarkMode ? "#000" : "#CCC",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "center", 
        flexWrap: 'wrap',
    },

    entryTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? "#444" : "#EEE",
        paddingBottom: 8,
    },

    entryContent: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "flex-start",
    },

    entryLabel: {
        fontWeight: "600",
        fontSize: 16,
        color: isDarkMode ? DARK_TEXT : LIGHT_TEXT,
        minWidth: 100, 
    },

    entryValue: {
        fontSize: 16,
        flex: 1,
        color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        lineHeight: 22,
    },
    definitionContainer: {
        marginTop: 16,
        borderRadius: 8,
        padding: 12,
        backgroundColor: isDarkMode ? "#2A2A2C" : "#F0F0F0",
        borderLeftWidth: 4,
        borderLeftColor: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
    },

    definitionText: {
        fontSize: 15,
        lineHeight: 22,
        color: isDarkMode ? "#DDD" : "#444",
        marginBottom: 6,
    },

    noDataText: {
        fontSize: 14,
        fontStyle: "italic",
        color: isDarkMode ? "#888" : "#999",
        marginTop: 4,
    },

    errorText: {
        fontSize: 16,
        color: "#FF3B30",
        textAlign: "center",
        marginTop: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
    },
    caseContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: isDarkMode ? "#2A2A2C" : "#F0F0F0",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
    },
    
    wordDetailsText: {
        fontSize: 15,
        lineHeight: 22,
        color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        fontWeight: '500',
    },
    wordDetailsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? "#BBBBBB" : "#666666",
        marginBottom: 6,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16, 
        paddingTop: Platform.select({
            ios: 40,
            android: 20
        }),
      },
      
      backButton: {
        marginRight: 12,
        padding: 8,
        borderRadius: 8, 
        backgroundColor: isDarkMode ? Colors.dark.buttonBackground : Colors.light.buttonBackground,
      },
      
      backButtonPressed: {
        opacity: 0.7, 
      },
      toggleButton: {
        marginTop: 8,
        paddingVertical: 4,
    },
    toggleButtonText: {
        color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText,
        fontSize: 14,
        fontStyle: 'italic',
    },
});
export const Colors = {
    light: {
      buttonBackground: '#e0e0e0', 
      buttonText: '#1E88E5',
      primaryText: '#1E88E5',       
      secondaryText: '#64B5F6',
      background: '#F9F9F9',
    },
    dark: {
      buttonBackground: '#333', 
      buttonText: '#1E88E5',
      primaryText: '#64B5F6',      
      secondaryText: '#90CAF9',
      background: '#121212',
    }
  };