import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function LineDetails() {
    const { lineNum } = useLocalSearchParams(); // Get the line number from URL params

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Line {lineNum}</Text>
            <Text>Display details about this line here.</Text>
        </View>
    );
}
