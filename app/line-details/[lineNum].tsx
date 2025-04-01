import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, useColorScheme, Animated, ActivityIndicator } from "react-native";
import { styles, getDynamicStyles, Colors } from "../../assets/styles/line-details.styles";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import WordDisplay from "../../components/read/wordDisplay"; 
import TabLayout from "../(tabs)/tabLayout";

interface LineData {
    lineNum: number;
    line_text: string;
    speaker: string | null;
}

type SelectedWordType = {
    word: string;
    index: number;
} | null;

export default function LineDetails() {
    const [data, setData] = useState<LineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWord, setSelectedWord] = useState<SelectedWordType>(null);
    const [buttonScale] = useState(new Animated.Value(1));
    
    const router = useRouter();
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const { lineNum } = useLocalSearchParams(); 
    const currentLine = Number(lineNum);
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
        router.push(`/line-details/${line}`);
    };

    const handleGoBack = () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          // Fallback to home if no history
          router.replace('/');
        }
      };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/lines/${lineNum}`);
                if (!response.ok) throw new Error("Failed to load data");
                const json = await response.json();
                setData(Array.isArray(json) && json.length > 0 ? json[0] : null);
            } catch (err) {
                setError("Error loading data");
            } finally {
                setTimeout(() => setLoading(false), 50);
            }
        };
        loadData();
    }, [currentLine]);

    if (loading) return (
        <TabLayout>
            <View style={[styles.loadingContainer, dynamicStyles.loadingContainer]}>
                <ActivityIndicator 
                    size="large" 
                    color={isDarkMode ? Colors.dark.loadingIndicator : Colors.light.loadingIndicator} 
                />
            </View>
        </TabLayout>
    );
    if (error) return <Text>{error}</Text>;
    if (!data) return <Text>No line data found.</Text>;

    

    return (
        <>
            <Stack.Screen options={{ headerShown: false, animation: 'none' }} />
            
            <TabLayout>
                <SafeAreaView style={[styles.container, dynamicStyles.container]}>

                <View style={styles.backButtonContainer}>
                    <TouchableOpacity 
                        onPressIn={() => setIsBackPressed(true)}
                        onPressOut={() => setIsBackPressed(false)}
                        onPress={handleGoBack}
                        style={[
                            styles.backButton,
                            dynamicStyles.backButton,
                            isBackPressed && { opacity: 0.7 }
                        ]}
                        activeOpacity={0.7}
                    >
                        <Feather 
                            name="chevron-left" 
                            size={24} 
                            color={isDarkMode ? "#1E88E5" : "#1E88E5"} 
                        />
                    </TouchableOpacity>
                </View>
                    {/* Header Section */}
                    <View style={styles.headerContainer}>
                        <View style={styles.headerContent}>
                            {data.speaker && (
                                <Text style={[styles.speaker, dynamicStyles.speaker]}>
                                    {data.speaker}
                                </Text>
                            )}
                            <Text style={[styles.lineNumber, dynamicStyles.lineNumber]}>
                                Line {data.lineNum}
                            </Text>
                        </View>
                    </View>

                    

                    {/* Line Text with Selectable Words */}
                    <View style={styles.contentContainer}>
                        <View style={styles.lineTextContainer}>
                            {data.line_text.split(" ").map((word, index) => {
                                const isSelected = selectedWord?.word === word && selectedWord?.index === index;
                                
                                return (
                                    <TouchableOpacity
                                        key={`${word}-${index}`}
                                        onPress={() => {
                                            setSelectedWord(isSelected ? null : { word, index });
                                        }}
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

                        {/* Word Display Panel */}
                        {selectedWord && (
                            <View style={[styles.wordDetailsContainer, dynamicStyles.wordDetailsContainer]}>
                                <WordDisplay word={selectedWord.word} />
                            </View>
                        )}
                    </View>
                    {/* Navigation Buttons */}
                    <View style={[styles.navigationContainer, dynamicStyles.navigationContainer]}>
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                style={[styles.navButton, currentLine === 1 && styles.disabledNavButton]}
                                onPress={() => goToLine(currentLine - 1)}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                disabled={currentLine === 1}
                            >
                                <MaterialIcons
                                    name="arrow-back"
                                    size={24}
                                    color={currentLine === 1 ? "#555555" : "#FFF"}
                                />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                style={[styles.navButton, currentLine === 1353 && styles.disabledNavButton]}
                                onPress={() => goToLine(currentLine + 1)}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                disabled={currentLine === 1353}
                            >
                                <MaterialIcons
                                    name="arrow-forward"
                                    size={24}
                                    color={currentLine === 1353 ? "#555555" : "#FFF"}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </TabLayout>
        </>
    );
}