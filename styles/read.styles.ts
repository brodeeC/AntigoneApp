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
        paddingHorizontal: 24,
        paddingTop: Platform.select({ ios: 60, android: 40 }),
    },
    headerContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        fontFamily: 'Inter-Bold',
        letterSpacing: 0.5,
    },
    author: {
        fontSize: 18,
        fontFamily: 'Inter-Medium',
        opacity: 0.8,
        marginTop: 4,
    },
    headerDivider: {
        height: 1,
        width: '40%',
        marginTop: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderTopWidth: 1,
    },
    navButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
    },
    pageJumpButton: {
        padding: 12,
        borderRadius: 8,
    },
    pageNumberContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    pageNumber: {
        fontSize: 24,
        fontFamily: 'Inter-SemiBold',
    },
    pageCount: {
        fontSize: 16,
        opacity: 0.6,
    },
    // Line number button styles
    lineNumberButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
        borderWidth: 1,
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
    pageJumpText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: -1,
    },
});

export const getDynamicStyles = (isDarkMode: boolean) => {
    const accentColor = isDarkMode ? '#4CC9F0' : '#4361EE';

    return StyleSheet.create({
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
        container: {
            backgroundColor: 'transparent',
        },
        header: {
            color: isDarkMode ? '#F8F9FA' : '#2B2D42',
        },
        author: {
            color: isDarkMode ? 'rgba(248, 249, 250, 0.8)' : 'rgba(43, 45, 66, 0.8)',
        },
        headerDivider: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        paginationContainer: {
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(248, 249, 250, 0.8)',
        },
        pageNumber: {
            color: accentColor,
        },
        pageCount: {
            color: isDarkMode ? 'rgba(248, 249, 250, 0.6)' : 'rgba(43, 45, 66, 0.6)',
        },
        navIcon: {
            color: accentColor,
        },
        pageJumpText: {
            color: accentColor,
            fontFamily: 'Inter-SemiBold',
        },
        // Line number styles
        lineNumberButton: {
            backgroundColor: isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.1)',
            borderColor: isDarkMode ? 'rgba(76, 201, 240, 0.3)' : 'rgba(67, 97, 238, 0.2)',
        },
        lineNumberText: {
            color: accentColor,
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
        },
        // Word and speaker styles
        word: {
            color: accentColor,
            fontFamily: 'Inter-Medium',
        },
        speaker: {
            color: accentColor,
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
    });
};
