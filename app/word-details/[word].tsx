import { useCallback, useEffect, useState } from "react";
import { 
    View, 
    Text, 
    ActivityIndicator, 
    TouchableOpacity, 
    ScrollView, 
    useColorScheme 
} from "react-native";
import * as Haptics from 'expo-haptics';
import { Colors, getDynamicStyles } from "../../assets/styles/word-details.styles";
import { router, useLocalSearchParams } from "expo-router";
import TabLayout from "../(tabs)/tabLayout";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

interface WordEntry {
    form: string;
    lemma: string;
    line_number: string;
    postag: string;
    speaker: string;
}

interface CaseInfo {
    [key: string]: string;
}

interface Definition {
    def_num: number;
    short_def: string;
}

interface WordDataEntry {
    [0]: WordEntry;
    [1]?: { case?: CaseInfo };
    [2]?: { definitions?: Definition[] };
}

interface WordDetailsProps {
    word: string;
}

export default function WordDetails() {
    const { word } = useLocalSearchParams();  
    const [wordData, setWordData] = useState<WordDataEntry[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isBackPressed, setIsBackPressed] = useState(false);

    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    const [collapsedEntries, setCollapsedEntries] = useState<Record<number, boolean>>(() => {
        const initialCollapsed: Record<number, boolean> = {};
        if (wordData) {
            wordData.forEach((_, index) => {
                initialCollapsed[index] = true;
            });
        }
        return initialCollapsed;
    });

    const toggleDefinitionCollapse = useCallback((index: number) => {
        Haptics.selectionAsync(); // Light feedback for toggle action
        setCollapsedEntries(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    }, []);

    const handleGoBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Feedback for navigation
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push('/(tabs)');
        }
    };

    const handleLineNavigation = (lineNum: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Stronger feedback for line navigation
        router.push({ 
            pathname: "/line-details/[start]/[[end]]", 
            params: { start: lineNum } 
        });
    };

    useEffect(() => {
        const fetchWordDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/word-details/${word}`);
                if (!response.ok) throw new Error("Failed to load word details");
                
                const json: WordDataEntry[] = await response.json();
    
                if (!json || json.length === 0) {
                    setError("No data available for this word");
                    setWordData(null);
                } else {
                    setWordData(json);
                    const initialCollapsed: Record<number, boolean> = {};
                    json.forEach((_, index) => {
                        initialCollapsed[index] = true;
                    });
                    setCollapsedEntries(initialCollapsed);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Error loading word details");
            } finally {
                setLoading(false);
            }
        };
        fetchWordDetails();
    }, [word]);

    if (loading) return (
        <LinearGradient
            colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
            style={{ flex: 1 }}
        >
            <View style={dynamicStyles.loadingContainer}>
                <ActivityIndicator size="small" color={isDarkMode ? "#64B5F6" : "#1E88E5"} />
            </View>
        </LinearGradient>
    );
    if (error) return <Text style={dynamicStyles.errorText}>{error}</Text>;
    if (!wordData) return <Text style={dynamicStyles.errorText}>Data Unavailable</Text>;

    return (
        <TabLayout>
            <LinearGradient
                colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <View style={dynamicStyles.wordDetailsContainer}>
                    <View style={dynamicStyles.headerContainer}>
                        <TouchableOpacity 
                            onPressIn={() => {
                                setIsBackPressed(true);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            onPressOut={() => setIsBackPressed(false)}
                            onPress={handleGoBack}
                            style={[
                                dynamicStyles.backButton,
                                isBackPressed && dynamicStyles.backButtonPressed
                            ]}
                            activeOpacity={0.7}
                        >
                            <Feather 
                                name="chevron-left" 
                                size={24} 
                                color={isDarkMode ? Colors.dark.buttonText : Colors.light.buttonText} 
                            />
                        </TouchableOpacity>
                        <Text style={dynamicStyles.header}>{word ?? 'Unknown'}</Text>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {wordData.map((entry, index) => {
                            if (!entry || !entry[0]) return null; 

                            const isCollapsed = collapsedEntries[index] !== false;

                            const { form, lemma, line_number, postag, speaker } = entry[0];
                            const lineNum = line_number;
                            const caseInfo: CaseInfo | null = entry[1]?.case ?? null;

                            const definitions: Definition[] = entry[2]?.definitions ?? [];

                            return (
                                <View key={index} style={dynamicStyles.entryContainer}>
                                    <Text style={dynamicStyles.entryTitle}>{index + 1}</Text> 
                                    <View style={dynamicStyles.entryContent}>
                                        <Text style={dynamicStyles.entryLabel}>Form: </Text>
                                        <Text style={dynamicStyles.entryValue}>{form}</Text>
                                    </View>
                                    <View style={dynamicStyles.entryContent}>
                                        <Text style={dynamicStyles.entryLabel}>Lemma: </Text>
                                        <Text style={dynamicStyles.entryValue}>{lemma}</Text>
                                    </View>
                                    <View style={dynamicStyles.entryContent}>
                                        <Text style={dynamicStyles.entryLabel}>Line Number: </Text>
                                        <Text style={dynamicStyles.entryValue}>{lineNum}</Text>
                                        <TouchableOpacity 
                                            style={dynamicStyles.goButton}
                                            onPress={() => handleLineNavigation(lineNum)}
                                        >
                                            <Text style={dynamicStyles.goButtonText}>Go</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={dynamicStyles.entryContent}>
                                        <Text style={dynamicStyles.entryLabel}>POS Tag: </Text>
                                        <Text style={dynamicStyles.entryValue}>{postag}</Text>
                                    </View>
                                    <View style={dynamicStyles.entryContent}>
                                        <Text style={dynamicStyles.entryLabel}>Speaker: </Text>
                                        <Text style={dynamicStyles.entryValue}>{speaker}</Text>
                                    </View>

                                    <View style={dynamicStyles.caseContainer}>
                                        <Text style={dynamicStyles.wordDetailsLabel}>Morphology:</Text>
                                        {caseInfo ? (
                                            <View>
                                                <Text style={dynamicStyles.wordDetailsText}>
                                                    {Object.entries(caseInfo)
                                                        .filter(([_, value]) => value !== '-')
                                                        .map(([key, value]) => `${String(value)}. `)
                                                        .join(" ")}
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text style={dynamicStyles.noDataText}>No morphological data available</Text>
                                        )}
                                    </View>

                                    <View style={dynamicStyles.definitionContainer}>
                                        {definitions.length > 0 ? (
                                            <>
                                                {/* Always show first 3 definitions */}
                                                {definitions.slice(0, 3).map(({ def_num, short_def }) => (
                                                    <Text key={def_num} style={dynamicStyles.definitionText}>
                                                        {`${def_num}. ${short_def}`}
                                                    </Text>
                                                ))}
                                                
                                                {/* Show additional definitions if NOT collapsed */}
                                                {collapsedEntries[index] === false && definitions.length > 3 && 
                                                    definitions.slice(3).map(({ def_num, short_def }) => (
                                                        <Text key={def_num} style={dynamicStyles.definitionText}>
                                                            {`${def_num}. ${short_def}`}
                                                        </Text>
                                                    ))
                                                }
                                                
                                                {/* Only show toggle if more than 3 definitions exist */}
                                                {definitions.length > 3 && (
                                                    <TouchableOpacity 
                                                        onPress={() => toggleDefinitionCollapse(index)}
                                                        style={dynamicStyles.toggleButton}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={dynamicStyles.toggleButtonText}>
                                                            {collapsedEntries[index] === true
                                                                ? `Show ${definitions.length - 3} more definitions` 
                                                                : 'Show less'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </>
                                        ) : (
                                            <Text style={dynamicStyles.noDataText}>No definitions found</Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </LinearGradient>
        </TabLayout>
    );
}