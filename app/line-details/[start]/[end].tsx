// Updated line-details.tsx with improved styling
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, useColorScheme, Animated, ActivityIndicator, ScrollView } from "react-native";
import { styles, getDynamicStyles, Colors } from "../../../styles/line-details.styles";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import WordDisplay from "../../../components/read/wordDisplay"; 
import TabLayout from "../../(tabs)/tabLayout";
import { LinearGradient } from 'expo-linear-gradient';
import { accentFor, screenGradient } from '@/lib/appTheme';
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { getLinesUrl } from "@/lib/api";
import { addBookmark, isBookmarked, listBookmarks, removeBookmark, toggleBookmark } from '@/lib/bookmarks';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LineData {
    lineNum: number;
    line_text: string;
    speaker: string | null;
}

type SelectedWordType = {
    word: string;
    lineNum: number;
    index: number;
} | null;

export default function LineDetails() {
    const [data, setData] = useState<LineData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWord, setSelectedWord] = useState<SelectedWordType>(null);
    const [buttonScale] = useState(new Animated.Value(1));
    const [lineBookmarked, setLineBookmarked] = useState<Record<number, boolean>>({});
    const [rangeSaved, setRangeSaved] = useState(false);
    
    const router = useRouter();
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const accent = accentFor(isDarkMode);
    const insets = useSafeAreaInsets();

    const { start, end } = useLocalSearchParams();
    const startLine = start ? Number(start) : 1;
    const endLine = end ? Number(end) : startLine;

    let currentStart = startLine ?? 1;
    if (currentStart < 1){
        currentStart = 1;
    }

    let currentEnd = endLine ?? startLine;
    if (currentEnd > 1353){
        currentEnd = 1353;
    }
    const span = currentEnd - currentStart + 1;

    const [fontsLoaded] = useFonts({
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
    });

    const [isBackPressed, setIsBackPressed] = useState(false);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const goToLine = (line: number) => {
        router.push({ 
            pathname: "/line-details/[start]/[end]", 
            params: { start: line.toString(), end: line } 
        });
    };

    const goToLines = (start: number, end: number) => {
        router.push({ 
            pathname: "/line-details/[start]/[end]", 
            params: { 
                start: start.toString(),
                end: end.toString()
            } 
        });
    };

    const handleWordPress = async (word: string, lineNum: number, index: number) => {
        const isSelected = selectedWord?.word === word && 
                         selectedWord?.lineNum === lineNum && 
                         selectedWord?.index === index;

        try {
            if (isSelected) {
                setSelectedWord(null);
            } else {
                setSelectedWord({ word, lineNum, index });
            }
        } catch {
            console.log("Failed to set selected word.");
        }
    };

    const handleNavPress = () => {
    };

    const handleGoBack = () => {
        if (router.canGoBack?.()) {
            router.back();
        } else {
            router.replace('/(tabs)/home');
        }
    };



    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (startLine === null) {
                    throw new Error("No valid line number provided.");
                }
                const url = getLinesUrl(startLine, endLine !== startLine ? endLine : undefined);

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to load data");
                const json = await response.json();
                setData(Array.isArray(json) ? json : [json]);
            } catch {
                setError("Error loading data");
            } finally {
                setTimeout(() => setLoading(false), 50);
            }
        };
        loadData();
    }, [startLine, endLine]);

    useEffect(() => {
        const loadBookmarks = async () => {
            const all = await listBookmarks();
            const map: Record<number, boolean> = {};
            for (const b of all) {
                if (b.kind === 'line') map[b.line] = true;
            }
            setLineBookmarked(map);
        };
        void loadBookmarks();
    }, []);

    useEffect(() => {
        if (span <= 1) return;
        const check = async () => {
            const ok = await isBookmarked({ kind: 'range', start: currentStart, end: currentEnd });
            setRangeSaved(ok);
        };
        void check();
    }, [span, currentStart, currentEnd]);

    const toggleLineBookmark = async (lineNum: number) => {
        const next = await toggleBookmark({ kind: 'line', line: lineNum });
        setLineBookmarked((prev) => ({ ...prev, [lineNum]: next }));
    };

    const toggleRangeBookmark = async () => {
        if (rangeSaved) {
            await removeBookmark({ kind: 'range', start: currentStart, end: currentEnd });
            setRangeSaved(false);
            return;
        }

        // Save as ONE range bookmark entry
        await addBookmark({ kind: 'range', start: currentStart, end: currentEnd });
        setRangeSaved(true);

        // Auto-clean: remove any individual line bookmarks inside this range
        await Promise.all(
            Array.from({ length: currentEnd - currentStart + 1 }, (_, i) =>
                removeBookmark({ kind: 'line', line: currentStart + i })
            )
        );
        setLineBookmarked((prev) => {
            const next = { ...prev };
            for (let n = currentStart; n <= currentEnd; n++) delete next[n];
            return next;
        });
    };

    if (!fontsLoaded && !loading) {
        return (
            <TabLayout>
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
        </TabLayout>
        );
    }

    if (loading) return (
        <TabLayout>
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
        </TabLayout>
    );
    
    if (error) return (
        <LinearGradient
            colors={screenGradient(isDarkMode)}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={[dynamicStyles.text, { color: '#FF3B30', marginBottom: 10 }]}>Unable to load text</Text>
                <Text style={[dynamicStyles.text, { textAlign: 'center' }]}>Please check your connection and try again</Text>
            </View>
        </LinearGradient>
    );

    if (!data) return <Text style={[dynamicStyles.text, { textAlign: 'center', margin: 20 }]}>No text found for these lines</Text>;

    let lastSpeaker: string | null = null;
    const processedData = data
        .filter(line => line.line_text !== null)
        .map(line => {
            const speaker = line.speaker ?? lastSpeaker;
            if (line.speaker) {
                lastSpeaker = line.speaker;
            }
            return { ...line, speaker };
        });

    return (
        <>
            <Stack.Screen options={{ headerShown: false, animation: 'none' }} />
            
            <TabLayout>
                <LinearGradient
                    colors={screenGradient(isDarkMode)}
                    style={{ flex: 1 }}
                >
                    <View style={{ paddingHorizontal: 16, paddingTop: insets.top + 6, paddingBottom: 10 }}>
                        <GlassPanel isDark={isDarkMode} padding={12}>
                            <View style={{ height: 44, justifyContent: 'center' }}>
                                {/* Left slot: Back + (range) bookmark */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 132,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <TouchableOpacity
                                        onPressIn={() => setIsBackPressed(true)}
                                        onPressOut={() => setIsBackPressed(false)}
                                        onPress={handleGoBack}
                                        style={[
                                            styles.backButton,
                                            dynamicStyles.backButton,
                                            { height: 44, justifyContent: 'center' },
                                            isBackPressed && { opacity: 0.72 },
                                        ]}
                                        activeOpacity={0.85}
                                    >
                                        <Feather
                                            name="chevron-left"
                                            size={22}
                                            color={isDarkMode ? "#E2E8F0" : "#1E293B"}
                                        />
                                        <Text style={[styles.backButtonText, dynamicStyles.backButtonText]}>Back</Text>
                                    </TouchableOpacity>

                                    {span > 1 && (
                                        <TouchableOpacity
                                            onPress={() => void toggleRangeBookmark()}
                                            activeOpacity={0.85}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 12,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: 6,
                                            }}
                                        >
                                            <MaterialIcons
                                                name={rangeSaved ? 'bookmark' : 'bookmark-border'}
                                                size={22}
                                                color={rangeSaved ? accent : (isDarkMode ? 'rgba(226,232,240,0.65)' : 'rgba(30,41,59,0.45)')}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Center title: fixed left/right ensures true centering */}
                                <View style={{ position: 'absolute', left: 132, right: 44, top: 0, bottom: 0, justifyContent: 'center' }}>
                                    <Text style={[styles.lineRangeText, dynamicStyles.lineRangeText, { textAlign: 'center' }]} numberOfLines={1}>
                                        {data && data.length === 1 ? `Line ${currentStart}` : `Lines ${currentStart}–${currentEnd}`}
                                    </Text>
                                </View>

                                {/* Right slot spacer (keeps title centered) */}
                                <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 44 }} />
                            </View>
                        </GlassPanel>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                    {processedData.map((line, i) => {
                        const prevSpeaker = i > 0 ? processedData[i - 1].speaker : null;
                        const showSpeaker = line.speaker && line.speaker !== prevSpeaker;

                            return (
                                <View key={`line-${line.lineNum}`} style={{ marginBottom: i === processedData.length - 1 ? 0 : 24 }}>
                                    {showSpeaker && (
                                        <>
                                            {i > 0 && <View style={[styles.divider, dynamicStyles.divider]} />}
                                            <Text style={[styles.speaker, dynamicStyles.speaker]}>
                                                {line.speaker}
                                            </Text>
                                        </>
                                    )}
                                    
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 16, marginVertical: 8 }}>
                                        <TouchableOpacity
                                            style={[styles.lineNumberButton, dynamicStyles.lineNumberButton, { marginLeft: 0, marginVertical: 0 }]}
                                            onPress={() => goToLine(line.lineNum)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={[styles.lineNumberButtonText, dynamicStyles.lineNumberButtonText]}>
                                                {line.lineNum}
                                            </Text>
                                        </TouchableOpacity>

                                        {span === 1 && (
                                            <TouchableOpacity
                                                onPress={() => void toggleLineBookmark(line.lineNum)}
                                                activeOpacity={0.8}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                style={{ padding: 6, borderRadius: 12 }}
                                            >
                                                <MaterialIcons
                                                    name={lineBookmarked[line.lineNum] ? 'bookmark' : 'bookmark-border'}
                                                    size={22}
                                                    color={
                                                        lineBookmarked[line.lineNum]
                                                            ? (isDarkMode ? '#4CC9F0' : '#4361EE')
                                                            : (isDarkMode ? 'rgba(226,232,240,0.55)' : 'rgba(30,41,59,0.45)')
                                                    }
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    
                                    <View style={styles.lineTextContainer}>
                                        {line.line_text.split(" ").map((word, index) => {
                                            const isSelected = selectedWord?.word === word && 
                                                             selectedWord?.lineNum === line.lineNum && 
                                                             selectedWord?.index === index;

                                            return (
                                                <TouchableOpacity
                                                    key={`${line.lineNum}-${index}`}
                                                    onPress={() => handleWordPress(word, line.lineNum, index)}
                                                >
                                                    <Text style={[
                                                        styles.word,
                                                        dynamicStyles.word,
                                                        isSelected && dynamicStyles.selectedWord
                                                    ]}>
                                                        {word}{" "}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    
                                    {selectedWord?.lineNum === line.lineNum && (
                                        <View style={[styles.wordDetailsContainer, dynamicStyles.wordDetailsContainer]}>
                                            <WordDisplay word={selectedWord.word} lineNumber={line.lineNum} />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                    
                    {/* Floating navigation footer */}
                    <View style={styles.navigationContainer}>
                        <GlassPanel
                            isDark={isDarkMode}
                            padding={10}
                            style={{ marginHorizontal: 16, marginBottom: insets.bottom + 10 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.navButton,
                                            dynamicStyles.navButton,
                                            currentStart <= 1 && styles.disabledNavButton,
                                        ]}
                                        onPress={() => {
                                            handleNavPress();
                                            const newStart = Math.max(1, currentStart - span);
                                            const newEnd = Math.max(1, currentEnd - span);
                                            if (span > 1) {
                                                goToLines(newStart, newEnd);
                                            } else {
                                                goToLine(newStart);
                                            }
                                        }}
                                        onPressIn={handlePressIn}
                                        onPressOut={handlePressOut}
                                        disabled={currentStart <= 1}
                                        activeOpacity={0.85}
                                    >
                                        <MaterialIcons
                                            name="chevron-left"
                                            size={22}
                                            color={currentStart <= 1 ? (isDarkMode ? "#555555" : "#AAAAAA") : accent}
                                        />
                                        <Text style={[styles.navButtonText, dynamicStyles.navButtonText]}>Prev</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.navButton,
                                            dynamicStyles.navButton,
                                            currentEnd >= 1353 ? styles.disabledNavButton : null,
                                        ]}
                                        onPress={() => {
                                            handleNavPress();
                                            const newStart = Math.min(1353, currentStart + span);
                                            const newEnd = Math.min(1353, currentEnd + span);
                                            if (span > 1) {
                                                goToLines(newStart, newEnd);
                                            } else {
                                                goToLine(newStart);
                                            }
                                        }}
                                        onPressIn={handlePressIn}
                                        onPressOut={handlePressOut}
                                        disabled={currentEnd >= 1353}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.navButtonText, dynamicStyles.navButtonText]}>Next</Text>
                                        <MaterialIcons
                                            name="chevron-right"
                                            size={22}
                                            color={currentEnd >= 1353 ? (isDarkMode ? "#555555" : "#AAAAAA") : accent}
                                        />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </GlassPanel>
                    </View>
                </LinearGradient>
            </TabLayout>
        </>
    );
}