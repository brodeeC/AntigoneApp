import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function WordDetails() {
    const { word } = useLocalSearchParams(); 
    // For data need to also pass the lineNum to this page

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Line {word}</Text>
            <Text>Display details about this line here.</Text>
        </View>
    );
}
