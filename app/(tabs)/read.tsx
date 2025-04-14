import { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import icons
import PageDisplay from "@/components/read/pageDisplay";
import { styles, getDynamicStyles } from "../../assets/styles/read.styles";
import { router } from "expo-router";

export default function Read() {
    const [page, setPage] = useState(1);
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    return (
        <View style={[styles.container, dynamicStyles.container]}>
          
            
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, dynamicStyles.header]}>Sophocles, Antigone</Text>
                </View>
            </SafeAreaView>

            
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid overlap
            >
                <PageDisplay page={page} />
            </ScrollView>

            
            <View style={[styles.paginationBottomContainer, dynamicStyles.paginationBottomContainer]}>
                
                <TouchableOpacity
                //Need to add +- 10 page button
                    style={[
                        styles.arrowButton,
                        page === 1 && styles.disabledArrowButton, 
                    ]}
                    onPress={() => setPage(page - 1)}
                    disabled={page === 1} // Disable button if on first page
                >
                    <MaterialIcons
                        name="arrow-back" 
                        size={24}
                        color={page === 1 ? dynamicStyles.disabledArrowIcon.color : '#FFFFFF'}
                    />
                </TouchableOpacity>

                <Text style={[styles.pageNumber, dynamicStyles.pageNumber]}>{page}/123</Text>

                <TouchableOpacity
                    style={[
                        styles.arrowButton,
                        page === 123 && styles.disabledArrowButton, 
                    ]}
                    onPress={() => setPage(page + 1)}
                    disabled={page === 123} // Disable button if on last page
                >
                    <MaterialIcons
                        name="arrow-forward" 
                        size={24}
                        color={page === 123 ? dynamicStyles.disabledArrowIcon.color : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}