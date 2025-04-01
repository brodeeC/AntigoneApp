import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, useColorScheme } from "react-native";
import { getDynamicStyles } from "./read-styles/styles";
import { router } from "expo-router";

interface CaseInfo {
    case?: string;
    number?: string;
    gender?: string;
    person?: string;
    tense?: string;
    mood?: string;
    voice?: string;
    degree?: string;
    // Add other possible morphological properties
    [key: string]: string | undefined; // Index signature
}

type WordDetailsProps = {
    word: string;
};

export default function WordDetails({ word }: WordDetailsProps) {
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
                console.log(word)
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/word-details/${word}`);
                if (!response.ok) throw new Error("Failed to load word details");
                const json = await response.json();
                setWordData(json);
            } catch (err) {
                setError("Error loading word details");
            } finally {
                setLoading(false);
            }
        };

        fetchWordDetails();
    }, [word]);

    // Handling loading, error, or no data
    if (loading) return <ActivityIndicator size="small" color="#007AFF" />;
    if (error) return <Text style={dynamicStyles.errorText}>{error}</Text>;
    if (!wordData) return <Text style={dynamicStyles.errorText}>Data Unavailable</Text>;
    console.log(wordData)

    const lemma = wordData[0][0]?.lemma;
    const form = wordData[0][0]?.form;
    const caseInfo = wordData[0][2]?.case;
    const definitions = wordData[0][1]?.definitions;

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

            {/* Button to navigate to more details */}
            <TouchableOpacity
                onPress={() => {
                    // Route to the WordDetails page
                    router.push(`/word-details/${lemma}`);
                }}
                style={dynamicStyles.moreDetailsButton}
            >
                <Text style={dynamicStyles.moreDetailsButtonText}>More Details</Text>
            </TouchableOpacity>
        </View>
    );
}
