import { TouchableOpacity, ScrollView, View, Text, useColorScheme } from 'react-native';
import { router, usePathname } from 'expo-router'; // Import usePathname
import styles from '../app-styles/app.styles'; // Import styles

export default function HomeScreen() {
    const theme = useColorScheme(); // Detect system theme (dark or light)
    const pathname = usePathname(); // Get the current route path

    const navigateToRead = () => router.replace('/read');
    const navigateToSearch = () => router.replace('/search');
    const navigateToFavs = () => router.replace('/favorites');

    return (
        <ScrollView contentContainerStyle={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
            <View style={styles.header}>
                <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>Welcome to the Antigone Reader!</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={navigateToRead}>
                    <Text style={styles.buttonText}>📖 Start Reading</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={navigateToSearch}>
                    <Text style={styles.buttonText}>🔎 Start Searching</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={navigateToFavs}>
                    <Text style={styles.buttonText}>⭐ Check Favorites</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Tabs */}
            <View style={[styles.tabContainer, theme === 'dark' ? styles.darkTabContainer : styles.lightTabContainer]}>
                <TouchableOpacity style={styles.tabButton} onPress={navigateToRead}>
                    <Text style={[styles.tabText, pathname === '/read' ? styles.activeTabText : styles.inactiveTabText]}>Read</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={navigateToSearch}>
                    <Text style={[styles.tabText, pathname === '/search' ? styles.activeTabText : styles.inactiveTabText]}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={navigateToFavs}>
                    <Text style={[styles.tabText, pathname === '/favorites' ? styles.activeTabText : styles.inactiveTabText]}>Favorites</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}