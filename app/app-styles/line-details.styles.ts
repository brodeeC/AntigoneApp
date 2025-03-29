import { StyleSheet, Platform } from "react-native";

// Color Scheme - Using your bookmark blue (#1E88E5) as primary
const PRIMARY_COLOR = "#1E88E5"; // Bookmark blue
const SECONDARY_COLOR = "#64B5F6"; // Lighter blue for accents
const LIGHT_BACKGROUND = "#FFFFFF"; // Pure white
const DARK_BACKGROUND = "#121212"; // True black background
const LIGHT_TEXT = "#333333"; // Dark gray for light mode
const DARK_TEXT = "#E5E5E5"; // Off-white for dark mode
const DISABLED_COLOR = "#555555"; // Gray for disabled state

export const styles = StyleSheet.create({
    // Main Container
    container: {
        flex: 1,
        paddingTop: Platform.select({
            ios: 90,  // Space for status bar and bookmark
            android: 70
        }),
        paddingHorizontal: 20,
        paddingBottom: 100,
    },

    headerContainer: {
        marginTop: Platform.select({
            ios: 20,
            android: 10
        }),
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 10,
        alignItems: 'center',
    },

    headerContent: {
        alignItems: 'center',
        padding: 10,
    },

    lineNumber: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 8,
        color: PRIMARY_COLOR, // Will be overridden by dynamic styles
    },

    speaker: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 5,
    },

    contentWrapper: {
        flex: 1,
        marginTop: Platform.select({
            ios: 60,  // Space for header
            android: 40
        }),
    },
    contentContainer: {
        flex: 1,
        marginTop: Platform.select({
            ios: 10,
            android: 5
        }),
    },

    // Line Text Container
    lineTextContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 5,
        marginBottom: 30
    },

    // Word Styling
    word: {
        fontSize: 20,
        fontWeight: "500",
        lineHeight: 30,
        marginRight: 6,
        marginVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
        transitionDuration: '200ms',
        transitionProperty: 'background-color, transform'
    },

    // Navigation Container
    navigationContainer: {
        position: "absolute",
        bottom: Platform.select({
            ios: 40,
            android: 20
        }),
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: LIGHT_BACKGROUND,
        borderTopWidth: 1
    },

    // Navigation Buttons
    navButton: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: PRIMARY_COLOR,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },

    // Disabled Button
    disabledNavButton: {
        backgroundColor: DISABLED_COLOR,
        shadowOpacity: 0.1
    },

    // Selected Word Highlight
    selectedWord: {
        backgroundColor: "rgba(30, 136, 229, 0.2)",
        borderRadius: 6
    },
    wordDetailsContainer: {
        backgroundColor: LIGHT_BACKGROUND,
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 20
    },
    lineNumberBadge: {
        position: 'absolute',
        bottom: Platform.select({
            ios: 100,
            android: 80
        }),
        right: 20,
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        zIndex: 10
    },

    lineNumberText: {
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
    },
    backButtonContainer: {
        position: 'absolute',
        top: Platform.select({
            ios: 50,  // Adjust to match your bookmark position
            android: 30
        }),
        left: 20,
        zIndex: 10,
    },
      
      backButtonPressed: {
        opacity: 0.7, // Feedback when pressed
      },
});

// Dynamic styles for light/dark mode
export const getDynamicStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
        },
        headerContainer: {
            borderBottomColor: isDarkMode ? '#333' : '#EEE'
        },
        lineNumber: {
            color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        },
        headerContent: {
            backgroundColor: isDarkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
        },
        speaker: {
            color: isDarkMode ? DARK_TEXT : LIGHT_TEXT,
        },
        word: {
            color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        },
        navigationContainer: {
            backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
            borderTopColor: isDarkMode ? "#333" : "#E0E0E0"
        },
        wordDetailsContainer: {
            backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
            shadowColor: isDarkMode ? "#000" : "#CCC",
        },
        
        selectedWord: {
            color: "#007AFF", 
            fontWeight: "bold"
        },
        lineNumberText: {
            color: isDarkMode ? SECONDARY_COLOR : PRIMARY_COLOR,
        },

        lineNumberBadge: {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.2)' : 'rgba(30, 136, 229, 0.1)',
        },
        // Updated back button style
        
          backButton: {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
        },
    });
};

export const Colors = {
    light: {
      // ... your existing light colors ...
      buttonBackground: '#e0e0e0', // Example - adjust to match your theme
      buttonText: '1E88E5',
    },
    dark: {
      // ... your existing dark colors ...
      buttonBackground: '#333', // Example - adjust to match your theme
      buttonText: '1E88E5',
    }
};