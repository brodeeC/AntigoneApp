import { StyleSheet, Platform } from "react-native";

const PRIMARY_COLOR = "#1E88E5"; 
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
        padding: Platform.select({
            ios: 24,
            android: 20
        }),
        paddingBottom: Platform.select({
            ios: 100, 
            android: 80
        }),
    },

    
    headerContainer: {
        alignItems: "flex-start",
        justifyContent: "center",
        marginBottom: 20,
        width: "100%", 
    },
    header: {
        fontSize: Platform.select({
            ios: 26,  
            android: 24
        }),
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: Platform.select({
            ios: 0.5,  
            android: 0
        })
    },

    paginationBottomContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: Platform.OS == 'ios'? 'auto' :"100%",
        paddingVertical: 16,
        position: "absolute",
        bottom: 0, 
        left: Platform.OS == 'ios'? 0 : 20,
        right: 0,
        backgroundColor: LIGHT_GRAY,
        borderTopWidth: 1,
    },

    arrowButton: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: PRIMARY_COLOR, 
        marginHorizontal: 8, 
    },

    pageNumber: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 24,
        textAlign: "center", 
        width: 60,
    },

    disabledArrowButton: {
        backgroundColor: DISABLED_COLOR,
    },

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
            fontFamily: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif' }) 
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

        speaker: {
            fontSize: 20,
            fontWeight: "600",
            color: isDarkMode ? "#BB86FC" : "#6200EE", 
            marginBottom: 4,
        },

        lineNumber: {
            fontSize: 14,
            fontWeight: "500",
            color: isDarkMode ? MUTED_GRAY : "#555555", 
            marginRight: 10,
        },

        lineText: {
            fontSize: 16,
            color: isDarkMode ? WHITE : DARK_TEXT,
            flexWrap: "wrap",
            flexShrink: 1,
        },

        word: {
            color: isDarkMode ? DARK_BLUE : LIGHT_BLUE, 
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
    });
};
