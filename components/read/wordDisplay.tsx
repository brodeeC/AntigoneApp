import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, useColorScheme, Linking } from "react-native";
import { getDynamicStyles } from "./read-styles/styles";
import { router } from "expo-router";

type CaseInfo = { [key: string]: string };

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
                const response = await fetch(`http://brodeeclontz.com/AntigoneApp/word-details/${word}`);
                console.log(response)
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

    if (loading) return <ActivityIndicator size="small" color="#007AFF" />;
    if (error) return <Text style={dynamicStyles.errorText}>{error}</Text>;
    if (!wordData) return null;

    return (
        <View style={dynamicStyles.wordDetailsContainer}>
            <Text style={dynamicStyles.wordDetailsTitle}>{wordData[0][0].lemma}</Text>
            
            <Text style={dynamicStyles.wordDetailsLabel}>
                {wordData[0][0].form}
            </Text>

            {/* Case information */}
            <View style={dynamicStyles.caseContainer}>
                {wordData[0][2].case && (
                    <View>
                        <Text style={dynamicStyles.wordDetailsText}>
                        {Object.entries(wordData[0][2].case as CaseInfo)
                            .map(([key, value]) => (value !== '-' ? `${value}. ` : ''))
                            .join('')}
                        </Text>
                  </View>
                )}
            </View>

            <View style={dynamicStyles.definitionsContainer}>
                {Array.isArray(wordData[0][1]?.definitions) && wordData[0][1].definitions.length > 0 ? (
                    wordData[0][1].definitions.map((def: any, idx: number) => (
                        def.short_def !== "[unavailable]" && (
                            <View key={idx} style={dynamicStyles.definitionContainer}>
                                <Text style={dynamicStyles.definitionText}>
                                    {def.short_def}
                                </Text>
                            </View>
                        )
                    ))
                ) : (
                    <Text style={dynamicStyles.definitionText}>No definitions found.</Text>
                )}
            </View>





            {/* Button to navigate to more details */}
            <TouchableOpacity
                onPress={() => {
                    // Route to the WordDetails page
                    router.push(`/word-details/${word}`);
                }}
                style={dynamicStyles.moreDetailsButton}
            >
                <Text style={dynamicStyles.moreDetailsButtonText}>More Details</Text>
            </TouchableOpacity>
        </View>
    );
}
