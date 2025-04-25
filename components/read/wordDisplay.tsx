import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, useColorScheme } from "react-native";
import { getDynamicStyles } from "../../styles/styles";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface CaseInfo {
    case?: string;
    number?: string;
    gender?: string;
    person?: string;
    tense?: string;
    mood?: string;
    voice?: string;
    degree?: string;
    [key: string]: string | undefined; 
}

type WordDetailsProps = {
    word: string;
    lineNumber: number;
};

export default function WordDetails({ word, lineNumber }: WordDetailsProps) {
    const [wordData, setWordData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    useEffect(() => {
        const fetchWordDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/api/word-details/${word}`);
                if (!response.ok) throw new Error("Failed to load word details");
                const json = await response.json();
    
                // Find the first entry where line number matches if no match, first entry
                const matchingEntry = json.find((entry: any) => entry[0]?.line_number === lineNumber)|| json[0];
    
                if (matchingEntry) {
                    setWordData(matchingEntry);
                } else {
                    setWordData(null);
                    setError("No matching word found for this line.");
                }
            } catch (err) {
                setError("Error loading word details");
            } finally {
                setLoading(false);
            }
        };
    
        fetchWordDetails();
    }, [word, lineNumber]);

    const handleMoreDetailsPress = () => {
        // Route to the WordDetails page
        router.push(`/word-details/${wordData[0]?.lemma}`);
    };

    // Handling loading, error, or no data
    if (loading) return (
        <LinearGradient
            colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="small" color={isDarkMode ? "#64B5F6" : "#1E88E5"} />
            </View>
        </LinearGradient>
    );
    if (error) return <Text style={dynamicStyles.errorText}>{error}</Text>;
    if (!wordData) return <Text style={dynamicStyles.errorText}>Data Unavailable</Text>;

    const lemma = wordData[0]?.lemma;
    const form = wordData[0]?.form;
    const caseInfo = wordData[1]?.case;
    const definitions = wordData[2]?.definitions;

    return (
        <View style={dynamicStyles.wordDetailsContainer}>
            {/* Lemma */}
            <Text style={dynamicStyles.wordDetailsTitle}>
                {lemma || "Word data not found"}
            </Text>
            
            {/* Form */}
            <Text style={dynamicStyles.wordDetailsLabel}>
                {form || "Form data unavailable"}
            </Text>

            {/* Case Information */}
            <View style={dynamicStyles.caseContainer}>
                {caseInfo ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {Object.entries(caseInfo)
                            .filter(([key, value]) => value && value !== '-')
                            .map(([key, value]) => (
                                <Text key={key} style={dynamicStyles.wordDetailsText}>
                                    {`${value}. `}
                                </Text>
                            ))
                        }
                    </View>
                ) : (
                    <Text style={dynamicStyles.wordDetailsText}>Morphological data not found</Text>
                )}
            </View>

            {/* Definitions */}
            <View style={dynamicStyles.definitionsContainer}>
                {Array.isArray(definitions) && definitions.length > 0 ? (
                    definitions.slice(0, 3).map((def: any, idx: number) => (
                        def.short_def !== "[unavailable]" && (
                            <View key={idx} style={dynamicStyles.definitionContainer}>
                                <Text style={dynamicStyles.definitionText}>
                                    {def.short_def}
                                </Text>
                            </View>
                        )
                    ))
                ) : (
                    <Text style={dynamicStyles.definitionText}>Definitions not found</Text>
                )}
            </View>

            <TouchableOpacity
                onPress={handleMoreDetailsPress}
                style={dynamicStyles.moreDetailsButton}
            >
                <Text style={dynamicStyles.moreDetailsButtonText}>More Details</Text>
            </TouchableOpacity>
        </View>
    );
}