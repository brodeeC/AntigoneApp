import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, getDynamicStyles, Colors } from "../../styles/styles";
import WordDetails from "./wordDisplay"; 
import { LinearGradient } from "expo-linear-gradient";
import { accentFor, screenGradient } from "@/lib/appTheme";
import { getReadPageUrl } from "@/lib/api";
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


type PageDisplayProps = {
    page: number;
};

interface Line {
    lineNum: number;
    line_text: string | null;
    speaker: string;
}

type SelectedWordType = {
    word: string;
    lineNum: number;
    index: number;
} | null;

export default function PageDisplay({ page }: PageDisplayProps) {
    const [data, setData] = useState<Line[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWord, setSelectedWord] = useState<SelectedWordType>(null);

    const router = useRouter();
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const accent = accentFor(isDarkMode);
    const [pageSaved, setPageSaved] = useState(false);

    const [fontsLoaded] = useFonts({
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch(getReadPageUrl(page));
                if (!response.ok) throw new Error("Failed to load data");
                const json = await response.json();
                setData(json);
            } catch {
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [page]);

    useEffect(() => {
        const check = async () => {
            const ok = await isBookmarked({ kind: 'page', page });
            setPageSaved(ok);
        };
        void check();
    }, [page]);

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

    const handleWordPress = (word: string, lineNum: number, wordIndex: number) => {
        const isSelected = selectedWord?.word === word &&
            selectedWord?.lineNum === lineNum &&
            selectedWord?.index === wordIndex;

        if (isSelected) {
            setSelectedWord(null);
        } else {
            setSelectedWord({ word, lineNum, index: wordIndex });
        }
    };

    const handleLineNumberPress = (lineNum: number) => {
        router.push({
            pathname: "/line-details/[start]/[end]",
            params: { start: lineNum.toString(), end: lineNum.toString() },
        });
    };

    if (loading) return (
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
    if (error) return (
        <LinearGradient
            colors={screenGradient(isDarkMode)}
            style={{ flex: 1 }}
        >
            <Text>{error}</Text>
        </LinearGradient>
    );

    const segments: { speaker: string; startLine: number; endLine: number; lines: Line[] }[] = [];
    {
        let current: { speaker: string; startLine: number; endLine: number; lines: Line[] } | null = null;
        for (const l of data) {
            const sp = l.speaker || '';
            if (!current || current.speaker !== sp) {
                if (current) segments.push(current);
                current = { speaker: sp, startLine: l.lineNum, endLine: l.lineNum, lines: [l] };
            } else {
                current.endLine = l.lineNum;
                current.lines.push(l);
            }
        }
        if (current) segments.push(current);
    }

    const pageStartLine = data.length > 0 ? data[0].lineNum : 0;
    const pageEndLine = data.length > 0 ? data[data.length - 1].lineNum : 0;

    const togglePage = async () => {
        const next = await toggleBookmark({ kind: 'page', page });
        setPageSaved(next);
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                {!!pageStartLine && !!pageEndLine && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '900',
                                letterSpacing: 2.2,
                                textTransform: 'uppercase',
                                color: accent,
                            }}
                        >
                            {`Page lines ${pageStartLine}\u2013${pageEndLine}`}
                        </Text>
                        <TouchableOpacity
                            onPress={() => void togglePage()}
                            activeOpacity={0.85}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialIcons
                                name={pageSaved ? 'bookmark' : 'bookmark-border'}
                                size={22}
                                color={
                                    pageSaved ? accent : (isDarkMode ? 'rgba(226,232,240,0.6)' : 'rgba(30,41,59,0.45)')
                                }
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {segments.map((seg, segIndex) => {
                    return (
                        <View key={`${seg.speaker}-${seg.startLine}`} style={styles.lineBlock}>
                            {segIndex > 0 && <View style={[styles.speakerDivider, dynamicStyles.speakerDivider]} />}

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        fontWeight: '800',
                                        letterSpacing: 2.2,
                                        textTransform: 'uppercase',
                                        color: accent,
                                    }}
                                >
                                    {`Lines ${seg.startLine}\u2013${seg.endLine}`}
                                </Text>
                            </View>

                            <Text style={[styles.speaker, dynamicStyles.speaker]}>
                                {seg.speaker}
                            </Text>

                            {seg.lines.map((line) => (
                                <View key={line.lineNum} style={styles.lineContainer}>
                                    <TouchableOpacity
                                        style={[styles.lineNumberButton, dynamicStyles.lineNumberButton]}
                                        onPress={() => handleLineNumberPress(line.lineNum)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.lineNumberText, dynamicStyles.lineNumberText]}>
                                            {line.lineNum}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.lineTextContainer}>
                                        {line.line_text?.split(" ").map((word, wordIndex) => {
                                            const isSelected = selectedWord?.word === word &&
                                                selectedWord?.lineNum === line.lineNum &&
                                                selectedWord?.index === wordIndex;

                                            return (
                                                <TouchableOpacity
                                                    key={`${line.lineNum}-${wordIndex}`}
                                                    onPress={() => handleWordPress(word, line.lineNum, wordIndex)}
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
                                </View>
                            ))}

                            {selectedWord && seg.lines.some((l) => l.lineNum === selectedWord.lineNum) && (
                                <View style={[styles.wordDetailsContainer, dynamicStyles.wordDetailsContainer]}>
                                    <WordDetails word={selectedWord.word} lineNumber={selectedWord.lineNum} />
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}