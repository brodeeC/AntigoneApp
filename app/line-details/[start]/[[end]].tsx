import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, useColorScheme, Animated, ActivityIndicator } from "react-native";
import { styles, getDynamicStyles, Colors } from "../../../assets/styles/line-details.styles";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import WordDisplay from "../../../components/read/wordDisplay"; 
import TabLayout from "../../(tabs)/tabLayout";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as Haptics from 'expo-haptics';

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
    const [data, setData] = useState<LineData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWord, setSelectedWord] = useState<SelectedWordType>(null);
    const [buttonScale] = useState(new Animated.Value(1));
    
    const router = useRouter();
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    const { start, end } = useLocalSearchParams();
    const startLine = start ? Number(start) : 1;
    const endLine = end ? Number(end) : startLine;

    const currentStart = startLine ?? 1;
    const currentEnd = endLine ?? startLine;
    const span = currentEnd ? currentEnd - currentStart + 1 : 1;

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
            pathname: "/line-details/[start]/[[end]]", 
            params: { start: line } 
          })
    };

    const goToLines = (start: number, end: number) => {
        console.log(start, end)
        if (end === start){ 
            goToLine(start) 
        }
        else router.push({ 
            pathname: "/line-details/[start]/[[end]]", 
            params: { 
              start: start, 
              end: (end + span - 1).toString() 
            } 
          })
    };

    const handleWordPress = async (isSelected: boolean, word: string, index: number) => {
        try {
            if (isSelected) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (error) {
            console.log("Haptic feedback not supported on this device");
        }
        setSelectedWord(isSelected ? null : { word, index });
    };

    const handleNavPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleGoBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let url = '';
                if (startLine !== null && endLine !== startLine) {
                    url = `http://brodeeclontz.com/AntigoneApp/lines/${startLine}/${endLine}`;
                } else if (startLine !== null) {
                    url = `http://brodeeclontz.com/AntigoneApp/lines/${startLine}`;
                } else {
                    throw new Error("No valid line number provided.");
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to load data");
                const json = await response.json();
                console.log(json)
                setData(Array.isArray(json) ? json : [json]); // always an array
            } catch (err) {
                setError("Error loading data");
            } finally {
                setTimeout(() => setLoading(false), 50);
            }
        };
        loadData();
    }, [startLine, endLine]);

    if (!fontsLoaded && !loading) {
        return (
            <TabLayout>
                <View style={[styles.loadingContainer, dynamicStyles.loadingContainer]}>
                    <ActivityIndicator size="large" color={isDarkMode ? Colors.dark.loadingIndicator : Colors.light.loadingIndicator} />
                </View>
            </TabLayout>
        );
    }


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
    if (error) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={[dynamicStyles.text, { color: '#FF3B30', marginBottom: 10 }]}>Unable to load text</Text>
            <Text style={[dynamicStyles.text, { textAlign: 'center' }]}>Please check your connection and try again</Text>
        </View>
    );

    if (!data) return <Text style={[dynamicStyles.text, { textAlign: 'center', margin: 20 }]}>No text found for these lines</Text>;

    

    return (
        <>
            <Stack.Screen options={{ headerShown: false, animation: 'none' }} />
            
            <TabLayout>
            <LinearGradient
                colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <View style={[styles.floatingLineNumber, dynamicStyles.floatingLineNumber]}>
                    <Text style={[styles.lineNumber, dynamicStyles.lineNumber]}>
                        {currentStart}{currentEnd !== currentStart ? `-${currentEnd}` : ''}
                    </Text>
                </View>

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
                {data.map((line, i) => (
                    <View key={i} style={{ marginTop: i === 0 ? 50 : 0 }}>
                        {line.speaker && (
                            <>
                                <View style={[styles.divider, dynamicStyles.divider]} />
                                <Text style={[styles.speaker, dynamicStyles.speaker]}>
                                    {line.speaker}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity
                            onPress={() => {
                                if (data.length === 1) {
                                    goToLine(line.lineNum);
                                } else {
                                    goToLines(line.lineNum, line.lineNum + span - 1);
                                }
                            }}
                        >
                            <Text style={[styles.lineNumber, dynamicStyles.lineNumber]}>
                                Line {line.lineNum}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.lineTextContainer}>
                        {line.line_text.split(" ").map((word, index) => {
                            const isSelected = selectedWord?.word === word && selectedWord?.index === index;
                            return (
                                <TouchableOpacity
                                    key={`${word}-${index}`}
                                    onPress={() => handleWordPress(isSelected, word, index)}
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
                ))}


                        
                <View style={[styles.navigationContainer, dynamicStyles.navigationContainer]}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[styles.navButton, currentStart <= 1 && styles.disabledNavButton]}
                        onPress={() => {
                            handleNavPress(); // Haptic feedback
                            const newStart = currentStart - span;
                            const newEnd = currentEnd ? currentEnd - span : null;
                            if (newStart >= 1) {
                                newEnd ? goToLines(newStart, newEnd) : goToLine(newStart);
                            }
                        }}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={currentStart <= 1}
                >
                            <MaterialIcons
                                name="arrow-back"
                                size={24}
                                color={currentStart <= 1 ? "#555555" : "#FFF"}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={[
                                styles.navButton,
                                currentEnd != null && currentEnd >= 1353 ? styles.disabledNavButton : null
                            ]}
                            onPress={() => {
                                handleNavPress(); // Haptic feedback
                                const newStart = currentStart + span;
                                const newEnd = currentEnd ? currentEnd + span : null;
                                if (!newEnd || newEnd <= 1353) {
                                    newEnd ? goToLines(newStart, newEnd) : goToLine(newStart);
                                }
                            }}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={currentEnd ? currentEnd >= 1353 : currentStart >= 1353}
                    >
                            <MaterialIcons
                                name="arrow-forward"
                                size={24}
                                color={
                                    currentEnd ? currentEnd >= 1353 ? "#555555" : "#FFF"
                                    : currentStart >= 1353 ? "#555555" : "#FFF"
                                }
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                </LinearGradient>
            </TabLayout>
        </>
    );
}