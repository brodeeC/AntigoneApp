import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, SafeAreaView, ScrollView, View, TouchableOpacity, useColorScheme } from "react-native";
import { styles, getDynamicStyles } from "./read-styles/styles";
import WordDetails from "./wordDisplay"; 

type PageDisplayProps = {
    page: number;
};

interface Line {
    lineNum: number;
    line_text: string | null;
    speaker: string | null;
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
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/read/${page}`);
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

    if (loading) return <Text style={dynamicStyles.text}>Loading...</Text>;
    if (error) return <Text style={dynamicStyles.text}>{error}</Text>;

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                {data.map((line, lineIndex) => {
                    const prevSpeaker = lineIndex > 0 ? data[lineIndex - 1].speaker : null;
                    const showSpeaker = line.speaker && line.speaker !== prevSpeaker;

                    return (
                        <View key={line.lineNum}>
                            {showSpeaker && (
                                <Text style={[styles.speaker, dynamicStyles.speaker]}>{line.speaker}</Text>
                            )}
                            <View style={styles.lineContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({
                                            pathname: "/line-details/[start]/[[end]]",
                                            params: { start: line.lineNum.toString() },
                                        })
                                    }
                                >
                                    <Text style={[styles.lineNumber, dynamicStyles.lineNumber]}>
                                        {line.lineNum}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[styles.lineText, dynamicStyles.lineText]}>
                                    {line.line_text?.split(" ").map((word, wordIndex) => {
                                        const isSelected =
                                            selectedWord?.word === word &&
                                            selectedWord?.lineNum === line.lineNum &&
                                            selectedWord?.index === wordIndex;

                                        return (
                                            <TouchableOpacity
                                                key={`${line.lineNum}-${wordIndex}`}
                                                onPress={() =>
                                                    setSelectedWord(
                                                        isSelected ? null : { word, lineNum: line.lineNum, index: wordIndex }
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.word,
                                                        dynamicStyles.word,
                                                        isSelected && { color: "#007AFF", fontWeight: "bold" }
                                                    ]}
                                                >
                                                    {word}{" "}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </Text>
                            </View>
                            {selectedWord &&
                                selectedWord.lineNum === line.lineNum &&
                                selectedWord.word === line.line_text?.split(" ")[selectedWord.index] && (
                                    <WordDetails word={selectedWord.word} />
                                )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}
