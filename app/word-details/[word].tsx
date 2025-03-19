import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function WordDetails() {
    const { word } = useLocalSearchParams(); 
    /**
     * Will need a route for next and previous words
     * - Passing lineNum to this page would be ideal to help <- ->
     *
     * Find a way to display the data, use containers for the different columns of data
     * */ 

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Word: {word}</Text>
            <Text>Display details about this line here.</Text>
        </View>
    );
}
