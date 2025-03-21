import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, SafeAreaView, ScrollView, View, TouchableOpacity, useColorScheme } from "react-native";
import { styles, getDynamicStyles } from "./read-styles/styles"; // Import styles

type PageDisplayProps = {
    page: number;
};

interface Line {
    lineNum: number;
    line_text: string | null;
    speaker: string | null;
}

export default function PageDisplay({ page }: PageDisplayProps) {
    const [data, setData] = useState<Line[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const isDarkMode = useColorScheme() === "dark"; // Detect light/dark mode
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

            {/* ScrollView with padding to ensure content is fully visible */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent} // Add padding to avoid cutoff
            >
                {data.map((line, index) => {
                    const prevSpeaker = index > 0 ? data[index - 1].speaker : null;
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
                                            pathname: "/line-details/[lineNum]",
                                            params: { lineNum: line.lineNum.toString() },
                                        })
                                    }
                                >
                                    <Text style={[styles.lineNumber, dynamicStyles.lineNumber]}>
                                        {line.lineNum}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[styles.lineText, dynamicStyles.lineText]}>
                                    {line.line_text?.split(" ").map((word, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => router.push(`/word-details/${word}`)}
                                        >
                                            <Text style={[styles.word, dynamicStyles.word]}>{word} </Text>
                                        </TouchableOpacity>   
                                    ))}
                                    {/** When click on word, display a little bit of details underneath
                                    Also leave the word-details button as well, but change where it is. */}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}