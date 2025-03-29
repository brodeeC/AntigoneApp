import { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    ActivityIndicator, 
    TouchableOpacity, 
    ScrollView, 
    useColorScheme 
} from "react-native";
import { getDynamicStyles } from "../app-styles/word-details.styles";
import { router, useLocalSearchParams, useRouter } from "expo-router";

// Define types for word details response
interface WordEntry {
    form: string;
    lemma: string;
    line_number: number;
    postag: string;
    speaker: string;
}

interface CaseInfo {
    [key: string]: string;
}

interface Definition {
    def_num: number;
    text: string;
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
    console.log("Fetching data for word:", word);
    const [wordData, setWordData] = useState<WordDataEntry[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    useEffect(() => {
        const fetchWordDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(`Fetching: http://brodeeclontz.com/AntigoneApp/word-details/${word}`);
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/word-details/${word}`);
                if (!response.ok) throw new Error("Failed to load word details");
                
                const json: WordDataEntry[] = await response.json();
                console.log("Fetched data:", json); // Log the response

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
        <View style={dynamicStyles.wordDetailsContainer}>
            <Text style={dynamicStyles.header}>{word}</Text>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {wordData.map((entry, index) => {
                    if (!entry || !entry[0]) return null; // Prevent errors

                    const { form, lemma, line_number, postag, speaker } = entry[0];
                    const lineNum = line_number;
                    const caseInfo: CaseInfo | null = entry[2]?.case ?? null;
                    const definitions: Definition[] = entry[1]?.definitions ?? [];

                    return (
                        <View key={index} style={dynamicStyles.entryContainer}>
                            <Text style={dynamicStyles.entryTitle}>{index + 1}</Text> {/* Displaying entry number */}
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
                                    <Text style={dynamicStyles.wordDetailsText}>
                                        {Object.entries(caseInfo)
                                            .filter(([_, value]) => value !== '-')
                                            .map(([key, value]) => (
                                                <Text key={key}>
                                                    {value}. {' '}
                                                </Text>
                                            ))
                                        }
                                    </Text>
                                ) : (
                                    <Text style={dynamicStyles.noDataText}>No morphological data available</Text>
                                )}
                            </View>

                            {/* Definitions */}
                            <View style={dynamicStyles.definitionContainer}>
                                {definitions.length > 0 ? (
                                    definitions.map(({ def_num, text }) => (
                                        <Text key={def_num} style={dynamicStyles.definitionText}>
                                            {def_num}. {text}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={dynamicStyles.noDataText}>No definitions found</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
