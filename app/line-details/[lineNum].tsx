import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function LineDetails() {
    const { lineNum } = useLocalSearchParams(); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
      const loadData = async () => {
          try {
              const response = await fetch(`http://brodeeclontz.com/AntigoneApp/lines/${lineNum}`);
              if (!response.ok) throw new Error("Failed to load data");
              const json = await response.json();
              setData(json);
          } catch (err) {
              setError("Error loading data");
          } finally {
              setLoading(false);
          }
        };
        loadData();
    }, []);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>{error}</Text>;

    const line = data[0]

    return (
        <SafeAreaView>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Line: {lineNum}</Text>
            
            {/* <Text>
              {line.line_text?.split(" ").map((word, i) => (
                  <TouchableOpacity
                      key={i}
                      onPress={() => router.push(`/word-details/${word}`)}
                  >
                      <Text>{word} </Text>
                  </TouchableOpacity>
              ))}
          </Text> */}
        </SafeAreaView>
    );
}
