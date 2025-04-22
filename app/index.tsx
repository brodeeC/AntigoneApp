import { TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles/app.styles';
import TabLayout from './(tabs)/tabLayout';

export default function HomeScreen() {
    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    const actions = [
        {
            icon: 'menu-book',
            title: 'Start Reading',
            onPress: () => router.push('./read')
        },
        {
            icon: 'search',
            title: 'Text Search',
            onPress: () => router.push('./search?tab=Word%20Search')
        },
        {
            icon: 'info-outline',
            title: 'About',
            onPress: () => router.push('./about')
        },
    ];

    return (
        <TabLayout>
        <LinearGradient
            colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                        Antigone Reader
                    </Text>
                    <Text style={[styles.subtitle, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                        Explore Sophocles' classic tragedy
                    </Text>
                </View>

                <View style={styles.buttonGrid}>
                    {actions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.buttonCard,
                                isDarkMode ? styles.darkCard : styles.lightCard
                            ]}
                            onPress={action.onPress}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconContainer}>
                                <Icon 
                                    name={action.icon} 
                                    size={28} 
                                    color={isDarkMode ? "#4CC9F0" : "#4361EE"} 
                                />
                            </View>
                            <Text style={[styles.buttonText, isDarkMode ? styles.darkText : styles.lightText]}>
                                {action.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </LinearGradient>
        </TabLayout>
    );
}