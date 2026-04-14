import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, useColorScheme, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons"; 
import { LinearGradient } from 'expo-linear-gradient';
import PageDisplay from "@/components/read/pageDisplay";
import { styles, getDynamicStyles, Colors } from "../../styles/read.styles";
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { fetchMetadata } from "@/lib/api";
import { getLastReadPage, setLastReadPage } from "@/lib/readingProgress";

const DEFAULT_LAST_PAGE = 123;

export default function Read() {
    const [page, setPage] = useState(1);
    const [lastPageBound, setLastPageBound] = useState(DEFAULT_LAST_PAGE);
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const m = await fetchMetadata();
                if (cancelled) return;
                setLastPageBound(m.lastPage);
                const stored = await getLastReadPage();
                if (cancelled) return;
                if (stored != null) {
                    setPage((prev) =>
                        Math.max(1, Math.min(stored, m.lastPage))
                    );
                }
            } catch {
                const stored = await getLastReadPage();
                if (cancelled) return;
                if (stored != null) {
                    setPage((prev) =>
                        Math.max(1, Math.min(stored, DEFAULT_LAST_PAGE))
                    );
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        void setLastReadPage(page);
    }, [page]);

    useEffect(() => {
        setPage((p) => Math.min(p, lastPageBound));
    }, [lastPageBound]);

    const handlePageChange = (newPage : number) => {
        setPage(Math.max(1, Math.min(newPage, lastPageBound)));
    };

    const handleFastForward = (forward = true) => {
        setPage(forward ? Math.min(lastPageBound, page + 10) : Math.max(1, page - 10));
    };

    const [fontsLoaded] = useFonts({
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <LinearGradient
                colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <View style={[styles.loadingContainer, dynamicStyles.loadingContainer]}>
                    <ActivityIndicator 
                        size="large" 
                        color={isDarkMode ? Colors.dark.loadingIndicator : Colors.light.loadingIndicator} 
                    />
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, dynamicStyles.header]}>Antigone</Text>
                    <Text style={[styles.author, dynamicStyles.author]}>Sophocles</Text>
                    <View style={[styles.headerDivider, dynamicStyles.headerDivider]} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                >
                    <PageDisplay page={page} />
                </ScrollView>

                {/* Pagination */}
                <View style={[styles.paginationContainer, dynamicStyles.paginationContainer]}>
                    <TouchableOpacity
                        style={[styles.navButton, page === 1 && styles.disabledArrowButton]}
                        onPress={() => handleFastForward(false)}
                        disabled={page === 1}
                    >
                        <MaterialIcons name="keyboard-double-arrow-left" size={24} color={dynamicStyles.navIcon.color} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, page === 1 && styles.disabledArrowButton]}
                        onPress={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <MaterialIcons
                            name="chevron-left"
                            size={24}
                            color={dynamicStyles.navIcon.color}
                        />
                    </TouchableOpacity>

                    <View style={styles.pageNumberContainer}>
                        <Text style={[styles.pageNumber, dynamicStyles.pageNumber]}>{page}</Text>
                        <Text style={[styles.pageCount, dynamicStyles.pageCount]}>/ {lastPageBound}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.navButton, page === lastPageBound && styles.disabledArrowButton]}
                        onPress={() => handlePageChange(page + 1)}
                        disabled={page === lastPageBound}
                    >
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={dynamicStyles.navIcon.color}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, page === lastPageBound && styles.disabledArrowButton]}
                        onPress={() => handleFastForward(true)}
                        disabled={page === lastPageBound}
                    >
                        <MaterialIcons name="keyboard-double-arrow-right" size={24} color={dynamicStyles.navIcon.color} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}