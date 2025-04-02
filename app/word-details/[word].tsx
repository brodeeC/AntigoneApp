import { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    ActivityIndicator, 
    TouchableOpacity, 
    ScrollView, 
    useColorScheme 
} from "react-native";
import { Colors, getDynamicStyles } from "../../assets/styles/word-details.styles";
import { router, useLocalSearchParams } from "expo-router";
import TabLayout from "../(tabs)/tabLayout";
import { Feather } from "@expo/vector-icons";

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
    [1]?: { definitions?: Definition[] };
    [2]?: { case?: CaseInfo };
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

    const [collapsedEntries, setCollapsedEntries] = useState<Record<number, boolean>>({});

    const toggleDefinitionCollapse = (index: number) => {
        setCollapsedEntries(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleGoBack = () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push('/(tabs)');
        }
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
        <View style={dynamicStyles.loadingContainer}>
            <ActivityIndicator size="small" color={isDarkMode ? "#64B5F6" : "#1E88E5"} />
        </View>
    );
    if (error) return <Text style={dynamicStyles.errorText}>{error}</Text>;
    if (!wordData) return <Text style={dynamicStyles.errorText}>Data Unavailable</Text>;

    return (
        <TabLayout>
        <View style={dynamicStyles.wordDetailsContainer}>
            <View style={dynamicStyles.headerContainer}>
                <TouchableOpacity 
                onPressIn={() => setIsBackPressed(true)}
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
                    const caseInfo: CaseInfo | null = entry[2]?.case ?? null;
                    const definitions: Definition[] = entry[1]?.definitions ?? [];

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
                                    onPress={() => router.push(`/line-details/${lineNum}`)}
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
                                    <Text style={dynamicStyles.definitionText}>
                                        {`1. ${definitions[0].short_def}`}
                                    </Text>
                                    
                                    {definitions.length > 1 && (
                                        <>
                                            {!isCollapsed && definitions.slice(1).map(({ def_num, short_def }) => (
                                                <Text key={def_num} style={dynamicStyles.definitionText}>
                                                    {`${def_num}. ${short_def}`}
                                                </Text>
                                            ))}
                                            <TouchableOpacity 
                                                onPress={() => toggleDefinitionCollapse(index)}
                                                style={dynamicStyles.toggleButton}
                                            >
                                                <Text style={dynamicStyles.toggleButtonText}>
                                                    {isCollapsed 
                                                        ? `Show ${definitions.length - 1} more...` 
                                                        : 'Show less'}
                                                </Text>
                                            </TouchableOpacity>
                                        </>
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
        </TabLayout>
    );
}
