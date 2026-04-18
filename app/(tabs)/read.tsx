import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { screenGradient } from '@/lib/appTheme';
import PageDisplay from "@/components/read/pageDisplay";
import { styles, getDynamicStyles, Colors } from "../../styles/read.styles";
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { fetchMetadata } from "@/lib/api";
import { getLastReadPage, setLastReadPage } from "@/lib/readingProgress";
import { useLocalSearchParams } from "expo-router";
import { GlassPanel } from "@/components/ui/GlassPanel";

const DEFAULT_LAST_PAGE = 123;

export default function Read() {
    const [page, setPage] = useState(1);
    const [lastPageBound, setLastPageBound] = useState(DEFAULT_LAST_PAGE);
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const { page: pageParam } = useLocalSearchParams();

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
        const n =
            typeof pageParam === 'string'
                ? parseInt(pageParam, 10)
                : Array.isArray(pageParam) && typeof pageParam[0] === 'string'
                    ? parseInt(pageParam[0], 10)
                    : NaN;
        if (Number.isFinite(n) && n >= 1) {
            setPage((prev) => (prev === n ? prev : Math.max(1, Math.min(n, lastPageBound))));
        }
    }, [pageParam, lastPageBound]);

    useEffect(() => {
        setPage((p) => Math.min(p, lastPageBound));
    }, [lastPageBound]);

    const handlePageChange = (newPage : number) => {
        setPage(Math.max(1, Math.min(newPage, lastPageBound)));
    };

    // Page bookmarks are surfaced inline in the reading content (line-range headers).

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
                colors={screenGradient(isDarkMode)}
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
            colors={screenGradient(isDarkMode)}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.header, dynamicStyles.header]}>Antigone</Text>
                        <Text style={[styles.author, dynamicStyles.author]}>Sophocles</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
                <View style={[styles.headerDivider, dynamicStyles.headerDivider]} />

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                >
                    <PageDisplay page={page} />
                </ScrollView>

                {/* Pagination */}
                <View style={styles.paginationOuter}>
                    <GlassPanel isDark={isDarkMode} padding={10} style={styles.paginationGlass}>
                        <View style={styles.paginationContainer}>
                            <View style={styles.navGroup}>
                                <TouchableOpacity
                                    style={[styles.navButton, page === 1 && styles.navButtonDisabled]}
                                    onPress={() => handleFastForward(false)}
                                    disabled={page === 1}
                                    activeOpacity={0.85}
                                >
                                    <MaterialIcons name="keyboard-double-arrow-left" size={22} color={dynamicStyles.navIcon.color} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.navButton, page === 1 && styles.navButtonDisabled]}
                                    onPress={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    activeOpacity={0.85}
                                >
                                    <MaterialIcons name="chevron-left" size={22} color={dynamicStyles.navIcon.color} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.pagePill}>
                                <Text style={[styles.pageNumber, dynamicStyles.pageNumber]}>{page}</Text>
                                <Text style={[styles.pageCount, dynamicStyles.pageCount]}>of {lastPageBound}</Text>
                            </View>

                            <View style={styles.navGroup}>
                                <TouchableOpacity
                                    style={[styles.navButton, page === lastPageBound && styles.navButtonDisabled]}
                                    onPress={() => handlePageChange(page + 1)}
                                    disabled={page === lastPageBound}
                                    activeOpacity={0.85}
                                >
                                    <MaterialIcons name="chevron-right" size={22} color={dynamicStyles.navIcon.color} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.navButton, page === lastPageBound && styles.navButtonDisabled]}
                                    onPress={() => handleFastForward(true)}
                                    disabled={page === lastPageBound}
                                    activeOpacity={0.85}
                                >
                                    <MaterialIcons name="keyboard-double-arrow-right" size={22} color={dynamicStyles.navIcon.color} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GlassPanel>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}