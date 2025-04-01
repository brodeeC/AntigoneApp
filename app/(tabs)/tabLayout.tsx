import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, useColorScheme, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import EnIcon from 'react-native-vector-icons/Entypo';
import FoIcon from 'react-native-vector-icons/Foundation';
import { styles, getDynamicStyles } from '../../assets/styles/tab.styles';

export default function TabLayout({ children }: { children: React.ReactNode }) {
    const isDarkMode = useColorScheme() === 'dark';
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const bookmarkRotation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = expanded ? 0 : 1;
        
        Animated.parallel([
            Animated.timing(animation, {
                toValue,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(bookmarkRotation, {
                toValue: expanded ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setExpanded(!expanded);
        });
    };

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    const rotate = bookmarkRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const menuBackgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            'rgba(255, 255, 255, 0)',
            isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'
        ]
    });

    return (
        <>
            {expanded && (
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={toggleMenu}
                    style={styles.overlay}
                >
                    <Animated.View style={[styles.overlayBackground, { opacity: overlayOpacity }]} />
                </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
                {children}

            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={toggleMenu} 
                    style={styles.bookmarkButton}
                    activeOpacity={0.7}
                >
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <EnIcon 
                            name="bookmark" 
                            size={50} 
                            color={dynamicStyles.activeTab.color} 
                        />
                    </Animated.View>
                </TouchableOpacity>

                {expanded && (
                    <Animated.View style={[
                        styles.expandingMenu, 
                        { 
                            transform: [{ translateY }],
                            backgroundColor: menuBackgroundColor,
                            opacity: animation,
                        }
                    ]}>
                        <TouchableOpacity 
                            onPress={() => { router.push('/(tabs)'); toggleMenu(); }} 
                            style={styles.menuItem}
                        >
                            <EnIcon name="home" size={30} color={dynamicStyles.activeTab.color} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => { router.navigate('/(tabs)/read'); toggleMenu(); }} 
                            style={styles.menuItem}
                        >
                            <EnIcon name="book" size={30} color={dynamicStyles.activeTab.color} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => { router.push('/(tabs)/search'); toggleMenu(); }} 
                            style={styles.menuItem}
                        >
                            <FoIcon name="magnifying-glass" size={30} color={dynamicStyles.activeTab.color} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity 
                            onPress={() => { router.push('/favorites'); toggleMenu(); }} 
                            style={styles.menuItem}
                        >
                            <EnIcon name="bookmark" size={30} color={dynamicStyles.activeTab.color} />
                        </TouchableOpacity> */}
                    </Animated.View>
                )}
            </View>
            </View>
        </>
    );
}