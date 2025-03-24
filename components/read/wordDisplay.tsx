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
            <Text style={dynamicStyles.wordDetailsText}>
                <Text style={dynamicStyles.wordDetailsLabel}>Speaker: </Text>
                {wordData[0][0].speaker}
            </Text>
            <Text style={dynamicStyles.wordDetailsText}>
                <Text style={dynamicStyles.wordDetailsLabel}>Word: </Text>
                {wordData[0][0].form}
            </Text>

            {/* Case information */}
            <View style={dynamicStyles.caseContainer}>
                <Text style={dynamicStyles.wordDetailsLabel}>Case Information:</Text>
                {wordData[0][2].case && (
                    <View>
                        {Object.entries(wordData[0][2].case as CaseInfo).map(([key, value], idx) => (
                            <Text key={idx} style={dynamicStyles.wordDetailsText}>
                                {key}: {value}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

            {/* Definitions */}
            <View style={dynamicStyles.definitionsContainer}>
                <Text style={dynamicStyles.wordDetailsLabel}>Definitions:</Text>
                {wordData[0][1].definitions && Array.isArray(wordData[0][1].definitions) && (
                    <View>
                        {wordData[0][1].definitions.length === 1 ? (
                            // If there's only one definition, show it directly
                            <View key={0} style={dynamicStyles.definitionContainer}>
                                <Text style={dynamicStyles.definitionText}>
                                    {wordData[0][1].definitions[0].short_def}
                                </Text>
                            </View>
                        ) : (
                            // If there are multiple definitions, map through them
                            wordData[0][1].definitions.map((def: any, idx: number) => (
                                <View key={idx} style={dynamicStyles.definitionContainer}>
                                    <Text style={dynamicStyles.definitionText}>{def.short_def}</Text>
                                </View>
                            ))
                        )}
                    </View>
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
