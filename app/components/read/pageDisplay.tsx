import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, SafeAreaView, ScrollView, View, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import * as Haptics from 'expo-haptics';
import { styles, getDynamicStyles, Colors } from "./read-styles/styles";
import WordDetails from "./wordDisplay"; 
import { LinearGradient } from "expo-linear-gradient";
import TabLayout from "@/app/(tabs)/tabLayout";

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

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/api/read/${page}`);
                if (!response.ok) throw new Error("Failed to load data");
                const json = await response.json();
                setData(json);
            } catch (err) {
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [page]);

    const handleWordPress = (word: string, lineNum: number, wordIndex: number) => {
        const isSelected = selectedWord?.word === word &&
            selectedWord?.lineNum === lineNum &&
            selectedWord?.index === wordIndex;

        if (isSelected) {
            Haptics.selectionAsync(); 
            setSelectedWord(null);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
            setSelectedWord({ word, lineNum, index: wordIndex });
        }
    };

    const handleLineNumberPress = (lineNum: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
        router.push({
            pathname: "/line-details/[start]/[end]",
            params: { start: lineNum.toString(), end: lineNum.toString() },
        });
    };

    if (loading) return (
        <TabLayout>
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
        </TabLayout>
    );
    if (error) return (
    <TabLayout>
        <LinearGradient
            colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
            style={{ flex: 1 }}
        >
            <Text>{error}</Text>
        </LinearGradient>
    </TabLayout>);

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                {data.map((line, lineIndex) => {
                    const prevSpeaker = lineIndex > 0 ? data[lineIndex - 1].speaker : null;
                    const showSpeaker = line.speaker && line.speaker !== prevSpeaker;

                    return (
                        <View key={line.lineNum} style={styles.lineBlock}>
                            {showSpeaker && (
                                <>
                                    {lineIndex > 0 && (  
                                        <View style={[styles.speakerDivider, dynamicStyles.speakerDivider]} />
                                    )}
                                    <Text style={[styles.speaker, dynamicStyles.speaker]}>
                                        {line.speaker}
                                    </Text>
                                </>
                            )}
                            <View style={styles.lineContainer}>
                                <TouchableOpacity
                                    style={[styles.lineNumberButton, dynamicStyles.lineNumberButton]}
                                    onPress={() => handleLineNumberPress(line.lineNum)}
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
                            {selectedWord?.lineNum === line.lineNum && (
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