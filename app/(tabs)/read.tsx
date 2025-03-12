import { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import icons
import PageDisplay from "@/components/read/pageDisplay";
import { styles, getDynamicStyles } from "../app-styles/read.styles";

export default function Read() {
    const [page, setPage] = useState(1);
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    return (
        <View style={[styles.container, dynamicStyles.container]}>
          
            {/* Header */}
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, dynamicStyles.header]}>Antigone - A Tragedy by Sophocles</Text>
                </View>
            </SafeAreaView>

            {/* PageDisplay with flex: 1 to take up available space */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid overlap
            >
                <PageDisplay page={page} />
            </ScrollView>

            {/* Pagination Controls at the Bottom */}
            <View style={[styles.paginationBottomContainer, dynamicStyles.paginationBottomContainer]}>
                {/* Previous Button */}
                <TouchableOpacity
                    style={[
                        styles.arrowButton,
                        page === 1 && styles.disabledArrowButton, // Apply disabled style if on first page
                    ]}
                    onPress={() => setPage(page - 1)}
                    disabled={page === 1} // Disable button if on first page
                >
                    <MaterialIcons
                        name="arrow-back" // Sleek icon for "Previous"
                        size={24}
                        color={page === 1 ? dynamicStyles.disabledArrowIcon.color : '#FFFFFF'}
                    />
                </TouchableOpacity>

                {/* Page Number */}
                <Text style={[styles.pageNumber, dynamicStyles.pageNumber]}>{page}/123</Text>

                {/* Next Button */}
                <TouchableOpacity
                    style={[
                        styles.arrowButton,
                        page === 123 && styles.disabledArrowButton, // Apply disabled style if on last page
                    ]}
                    onPress={() => setPage(page + 1)}
                    disabled={page === 123} // Disable button if on last page
                >
                    <MaterialIcons
                        name="arrow-forward" // Sleek icon for "Next"
                        size={24}
                        color={page === 123 ? dynamicStyles.disabledArrowIcon.color : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}