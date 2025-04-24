import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, useColorScheme, Text } from 'react-native';
import { useRouter } from 'expo-router';
import EnIcon from 'react-native-vector-icons/Entypo';
import FoIcon from 'react-native-vector-icons/Foundation';
import { styles, getDynamicStyles } from '../../styles/tab.styles';
import * as Haptics from 'expo-haptics';
export default function TabLayout({ children }: { children: React.ReactNode }) {
    const isDarkMode = useColorScheme() === 'dark';
    const dynamicStyles = getDynamicStyles(isDarkMode);
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    
    // Animation values
    const animation = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const bookmarkScale = useRef(new Animated.Value(1)).current;

    // Fast animation config
    const fastConfig = {
        damping: 15,
        stiffness: 300,  // Faster response
        useNativeDriver: true,
    };

    // Smooth menu animation config
    const menuConfig = {
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
    };

    const toggleMenu = () => {
        const toValue = expanded ? 0 : 1;
        
        // Immediate visual feedback
        setExpanded(!expanded);
        overlayOpacity.setValue(toValue); // Jump to target opacity
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        Animated.parallel([
            // Fast overlay fade (already at target)
            Animated.spring(overlayOpacity, {
                toValue,
                ...fastConfig,
            }),
            // Smooth menu movement
            Animated.spring(animation, {
                toValue,
                ...menuConfig,
            }),
            // Fast button scale
            Animated.spring(bookmarkScale, {
                toValue: expanded ? 1 : 1.1,
                ...fastConfig,
            })
        ]).start();
    };

    const handleMenuItemPress = (route: 
        | '/'
        | '/(tabs)/read' 
        | '/(tabs)/search'
        | '/(tabs)/about'
      ) => {
        Haptics.selectionAsync();
        
        // Immediate close
        setExpanded(false);
        overlayOpacity.setValue(0);
        
        Animated.parallel([
            Animated.spring(overlayOpacity, {
                toValue: 0,
                ...fastConfig,
            }),
            Animated.spring(animation, {
                toValue: 0,
                ...fastConfig, // Faster close
            }),
            Animated.spring(bookmarkScale, {
                toValue: 1,
                ...fastConfig,
            })
        ]).start();
        
        router.push(route);
    };

    // Animation interpolations
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 0],
    });

    const scale = bookmarkScale.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.1]
    });

    return (
        <>
            {expanded && (
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={toggleMenu}
                    style={styles.overlay}
                >
                    <Animated.View style={[styles.overlayBackground, { 
                        opacity: overlayOpacity 
                    }]} />
                </TouchableOpacity>
            )}
            
            <View style={{ flex: 1 }}>
                {children}
                
                <View style={styles.container}>
                    <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
                        <Animated.View style={[
                            styles.bookmarkButton,
                            { 
                                transform: [{ scale }], 
                                borderColor: dynamicStyles.activeTabColor 
                            }
                        ]}>
                            <EnIcon 
                                name={expanded ? "cross" : "bookmark"} 
                                size={40} 
                                color={dynamicStyles.activeTabColor} 
                            />
                        </Animated.View>
                    </TouchableOpacity>

                    {/* Menu - smooth animation */}
                    <Animated.View style={[
                        styles.expandingMenu, 
                        dynamicStyles.expandingMenuStyle,
                        { 
                            transform: [{ translateY }],
                            opacity: overlayOpacity, 
                        }
                    ]}>
                        <TouchableOpacity 
                            onPress={() => handleMenuItemPress('/')} 
                            style={[styles.menuItem, dynamicStyles.menuItemStyle]}
                        >
                            <EnIcon name="home" size={24} color={dynamicStyles.activeTabColor} />
                            <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Home</Text>
                        </TouchableOpacity>
                        
                        <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />
                        
                        <TouchableOpacity 
                            onPress={() => handleMenuItemPress('/(tabs)/read')} 
                            style={[styles.menuItem, dynamicStyles.menuItemStyle]}
                        >
                            <EnIcon name="book" size={24} color={dynamicStyles.activeTabColor} />
                            <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Read</Text>
                        </TouchableOpacity>
                        
                        <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />
                        
                        <TouchableOpacity 
                            onPress={() => handleMenuItemPress('/(tabs)/search')} 
                            style={[styles.menuItem, dynamicStyles.menuItemStyle]}
                        >
                            <FoIcon name="magnifying-glass" size={24} color={dynamicStyles.activeTabColor} />
                            <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Search</Text>
                        </TouchableOpacity>

                        <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />
                        
                        <TouchableOpacity 
                            onPress={() => handleMenuItemPress('/(tabs)/about')} 
                            style={[styles.menuItem, dynamicStyles.menuItemStyle]}
                        >
                            <EnIcon name="info-with-circle" size={24} color={dynamicStyles.activeTabColor} />
                            <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>About</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </>
    );
}