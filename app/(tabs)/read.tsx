import { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PageDisplay from "@/app/components/read/pageDisplay";
import { styles, getDynamicStyles } from "../../frontend/styles/read.styles";

export default function Read() {
    const [page, setPage] = useState(1);
    const isDarkMode = useColorScheme() === "dark";
    const dynamicStyles = getDynamicStyles(isDarkMode);

    const handlePageChange = (newPage : number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPage(newPage);
    };

    const handleFastForward = (forward = true) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPage(forward ? Math.min(123, page + 10) : Math.max(1, page - 10));
    };

    return (
        <LinearGradient
            colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                {/* Header with subtle separation */}
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, dynamicStyles.header]}>Antigone</Text>
                    <Text style={[styles.author, dynamicStyles.author]}>Sophocles</Text>
                    <View style={[styles.headerDivider, dynamicStyles.headerDivider]} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                >
                    <PageDisplay page={page} />
                </ScrollView>

                {/* Enhanced Pagination */}
                <View style={[styles.paginationContainer, dynamicStyles.paginationContainer]}>
                    <TouchableOpacity
                        style={[styles.navButton, page === 1 && styles.disabledArrowButton]}
                        onPress={() => handleFastForward(false)}
                        disabled={page === 1}
                    >
                        <MaterialIcons name="keyboard-double-arrow-left" size={24} color={dynamicStyles.navIcon.color} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, page === 1 && styles.disabledArrowButton]}
                        onPress={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <MaterialIcons
                            name="chevron-left"
                            size={24}
                            color={dynamicStyles.navIcon.color}
                        />
                    </TouchableOpacity>

                    <View style={styles.pageNumberContainer}>
                        <Text style={[styles.pageNumber, dynamicStyles.pageNumber]}>{page}</Text>
                        <Text style={[styles.pageCount, dynamicStyles.pageCount]}>/ 123</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.navButton, page === 123 && styles.disabledArrowButton]}
                        onPress={() => handlePageChange(page + 1)}
                        disabled={page === 123}
                    >
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={dynamicStyles.navIcon.color}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, page === 123 && styles.disabledArrowButton]}
                        onPress={() => handleFastForward(true)}
                        disabled={page === 123}
                    >
                        <MaterialIcons name="keyboard-double-arrow-right" size={24} color={dynamicStyles.navIcon.color} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}