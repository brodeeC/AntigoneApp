import { Platform, StyleSheet } from "react-native";

const PRIMARY_COLOR = "#1E88E5";
const LIGHT_BLUE = "#1E88E5";
const DARK_BLUE = "#64B5F6";
const LIGHT_GRAY = "#F9F9F9";
const DARK_GRAY = "#1C1C1E";
const WHITE = "#FFFFFF";
const DARK_TEXT = "#333333";
const MUTED_GRAY = "#888888";
const DISABLED_COLOR = "#A0A0A0";

export const getDynamicStyles = (isDarkMode: boolean) => StyleSheet.create({
    wordDetailsContainer: {
        flex: 1,
        paddingTop: Platform.select({
            ios: 20,
            android: 10
        }),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 40,
    },
    paginationButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        marginVertical: 4,
    },
    paginationButtonDisabled: {
        opacity: 0.5,
        backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.05)' : 'rgba(30, 136, 229, 0.05)',
    },
    paginationText: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? '#E2E8F0' : '#475569',
        minWidth: 60,
        textAlign: 'center',
        marginVertical: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
    },
    backButton: {
        marginRight: 12,
        padding: 8,
        borderRadius: 8,
        backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
    },
    backButtonPressed: {
        opacity: 0.7,
    },
    entryContainer: {
        backgroundColor: isDarkMode ? "#1E293B" : "#F8F8F8",
        borderRadius: 12,
        padding: 16,
        margin: 16,
        marginBottom: 12,
        shadowColor: isDarkMode ? "#000" : "#CCC",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    entryTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? "#444" : "#EEE",
        paddingBottom: 8,
    },
    entryContent: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "center",
        flexWrap: 'wrap',
    },
    entryLabel: {
        fontWeight: "600",
        fontSize: 16,
        color: isDarkMode ? WHITE : DARK_TEXT,
        minWidth: 100,
    },
    entryValue: {
        fontSize: 16,
        color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        lineHeight: 22,
    },
    goButton: {
        backgroundColor: 'transparent',
        borderRadius: 6,
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 8,
        borderColor: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
    },
    goButtonText: {
        color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    caseContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: isDarkMode ? "#2A2A2C" : "#F0F0F0",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
    },
    wordDetailsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? "#BBBBBB" : "#666666",
        marginBottom: 6,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    wordDetailsText: {
        fontSize: 15,
        lineHeight: 22,
        color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        fontWeight: '500',
    },
    definitionContainer: {
        marginTop: 16,
        borderRadius: 8,
        padding: 12,
        backgroundColor: isDarkMode ? "#2A2A2C" : "#F0F0F0",
        borderLeftWidth: 4,
        borderLeftColor: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
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
    toggleButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
    },
    toggleButtonText: {
        color: isDarkMode ? DARK_BLUE : PRIMARY_COLOR,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
});

export const Colors = {
    light: {
        buttonBackground: 'rgba(30, 136, 229, 0.1)',
        buttonText: PRIMARY_COLOR,
        primaryText: PRIMARY_COLOR,
        secondaryText: DARK_BLUE,
        background: LIGHT_GRAY,
    },
    dark: {
        buttonBackground: 'rgba(100, 181, 246, 0.1)',
        buttonText: DARK_BLUE,
        primaryText: DARK_BLUE,
        secondaryText: '#90CAF9',
        background: DARK_GRAY,
    }
};