import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import EnIcon from 'react-native-vector-icons/Entypo';
import F6Icon from 'react-native-vector-icons/FontAwesome6';
import FoIcon from 'react-native-vector-icons/Foundation';
import { styles, getDynamicStyles } from '../app-styles/tab.styles'; // Import styles

export default function TabLayout() {
    const isDarkMode = useColorScheme() === 'dark';
    const dynamicStyles = getDynamicStyles(isDarkMode);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    dynamicStyles.tabBar,
                    Platform.select({
                        ios: { position: 'absolute' },
                        default: {},
                    }),
                ],
                tabBarActiveTintColor: dynamicStyles.activeTab.color, // Active tab text/icon color
                tabBarInactiveTintColor: dynamicStyles.inactiveTab.color, // Inactive tab text/icon color
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <F6Icon size={28} name="house" color={color} />,
                }}
            />
            <Tabs.Screen
                name="read"
                options={{
                    title: 'Read',
                    tabBarIcon: ({ color }) => <EnIcon size={28} name="book" color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <FoIcon size={28} name="page-search" color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color }) => <EnIcon size={28} name="bookmark" color={color} />,
                }}
            />
        </Tabs>
    );
}