import { TouchableOpacity, ScrollView, View, Text, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../assets/styles/app.styles';

export default function HomeScreen() {
    const theme = useColorScheme();

    const actions = [
        {
            icon: 'menu-book',
            title: 'Start Reading',
            onPress: () => router.push('/read')
        },
        {
            icon: 'search',
            title: 'Text Search',
            onPress: () => router.push('/search?tab=Word%20Search')
        },
        // {
        //     icon: 'list',
        //     title: 'Line Search',
        //     onPress: () => router.push('/search?tab=Line%20Search')
        // },
        // {
        //     icon: 'record-voice-over',
        //     title: 'Speaker Search',
        //     onPress: () => router.push('/search?tab=Speaker%20Search')
        // }
    ];

    return (
        <ScrollView contentContainerStyle={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
            <View style={styles.header}>
                <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
                    Welcome to the Antigone Reader
                </Text>
            </View>

            <View style={styles.buttonGrid}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.buttonHalf}
                        onPress={action.onPress}
                    >
                        <View style={styles.buttonContent}>
                            <View style={styles.iconContainer}>
                                <Icon 
                                    name={action.icon} 
                                    size={24} 
                                    color={"#FFFFFF"} 
                                />
                            </View>
                            <Text style={styles.buttonText}>{action.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}