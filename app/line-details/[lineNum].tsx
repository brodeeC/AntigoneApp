import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { styles, getDynamicStyles } from "../app-styles/line-details.styles"; // Import styles

interface LineData {
    lineNum: number;
    line_text: string;
    speaker: string | null;
}


export default function LineDetails() {
    const [data, setData] = useState<LineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isDarkMode = useColorScheme() === "dark"; // Detect light/dark mode
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const { lineNum } = useLocalSearchParams(); 
    const currentLine = Number(lineNum); // Convert to number

    const goToLine = (line: number) => {
        console.log(`Navigating to line: ${line}`);
        router.replace(`/line-details/${line}`);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/lines/${lineNum}`);
                if (!response.ok) throw new Error("Failed to load data");
                const json = await response.json();
                
                if (Array.isArray(json) && json.length > 0) {
                    setData(json[0]); // Extract first object if response is an array
                } else {
                    setData(null); // No valid data
                }
            } catch (err) {
                setError("Error loading data");
            } finally {
                setTimeout(() => setLoading(false), 50); // Small delay for smoother transition
            }
        };
        loadData();
    }, [currentLine]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>{error}</Text>;
    if (!data) return <Text>No line data found.</Text>;

    return (
        <>
            {/* Removes default header */}
            <Stack.Screen options={{ 
                    headerShown: false, 
                    animation:'none' 
                }} 
            />
            
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={[styles.lineNumber, dynamicStyles.lineNumber]}>
                        Line {data.lineNum}
                    </Text>
                    {data.speaker && (
                        <Text style={[styles.speaker, dynamicStyles.speaker]}>
                            {data.speaker}
                        </Text>
                    )}
                </View>

                {/* Line Text Section */}
                <View style={styles.lineTextContainer}>
                    {data.line_text.split(" ").map((word, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => router.push(`/word-details/${word}`)}
                        >
                            <Text style={[styles.speaker, dynamicStyles.speaker]}>{word} </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Navigation Buttons */}
                <View style={styles.navigationContainer}>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={[styles.navButton, currentLine === 1 && styles.disabledNavButton]}
                        onPress={() => goToLine(currentLine - 1)}
                        disabled={currentLine === 1}
                    >
                        <Text style={[styles.navButtonText, currentLine === 1 && styles.disabledNavButtonText]}>
                            ← Previous
                        </Text>
                    </TouchableOpacity>

                    {/* Forward Button */}
                    <TouchableOpacity
                        style={[styles.navButton, currentLine === 1353 && styles.disabledNavButton]}
                        onPress={() => goToLine(currentLine + 1)}
                        disabled={currentLine === 1353}
                    >
                        <Text style={[styles.navButtonText, currentLine === 1353 && styles.disabledNavButtonText]}>
                            Next →
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}
