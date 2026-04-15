import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  useColorScheme,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import EnIcon from 'react-native-vector-icons/Entypo';
import FoIcon from 'react-native-vector-icons/Foundation';
import { styles, getDynamicStyles } from '../../styles/tab.styles';
import { glassBorder, glassSurface } from '@/lib/appTheme';

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const isDarkMode = useColorScheme() === 'dark';
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  const fastConfig = {
    damping: 16,
    stiffness: 320,
    useNativeDriver: true,
  };

  const menuConfig = {
    damping: 18,
    stiffness: 180,
    useNativeDriver: true,
  };

  // Some stack screens draw their own glass headers; drop the FAB slightly
  // so it aligns with that header row instead of hugging the notch.
  const fabTop =
    pathname.startsWith('/line-details') || pathname.startsWith('/word-details')
      ? insets.top + 18
      : insets.top + 8;
  const fabHeight = 44;
  const menuTop = fabTop + fabHeight + 10;

  const toggleMenu = () => {
    const next = !expanded;
    const toValue = next ? 1 : 0;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(next);
    overlayOpacity.setValue(toValue);

    Animated.parallel([
      Animated.spring(overlayOpacity, {
        toValue,
        ...fastConfig,
      }),
      Animated.spring(animation, {
        toValue,
        ...menuConfig,
      }),
      Animated.spring(bookmarkScale, {
        toValue: next ? 1.03 : 1,
        ...fastConfig,
      }),
    ]).start();
  };

  const handleMenuItemPress = (route: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExpanded(false);
    overlayOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(overlayOpacity, {
        toValue: 0,
        ...fastConfig,
      }),
      Animated.spring(animation, {
        toValue: 0,
        ...fastConfig,
      }),
      Animated.spring(bookmarkScale, {
        toValue: 1,
        ...fastConfig,
      }),
    ]).start();

    router.push(route as any);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 0],
  });

  const borderCol = glassBorder(isDarkMode);
  const fallbackFab = glassSurface(isDarkMode);
  const fallbackMenu = isDarkMode ? 'rgba(26, 26, 46, 0.94)' : 'rgba(255, 255, 255, 0.94)';

  return (
    <>
      {expanded && (
        <TouchableOpacity activeOpacity={1} onPress={toggleMenu} style={styles.overlay}>
          <Animated.View style={[styles.overlayBackground, { opacity: overlayOpacity }]} />
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        {children}

        <View style={[styles.container, { top: fabTop }]}>
          <TouchableOpacity onPress={toggleMenu} activeOpacity={0.88} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <View style={styles.fabChrome}>
                {Platform.OS === 'ios' ? (
                  <BlurView
                    intensity={isDarkMode ? 42 : 50}
                    tint={isDarkMode ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                  />
                ) : (
                  <View
                    style={[StyleSheet.absoluteFill, { backgroundColor: fallbackFab }]}
                  />
                )}
                <View style={styles.fabInner}>
                  <EnIcon
                    name={expanded ? 'cross' : 'bookmark'}
                    size={28}
                    color={dynamicStyles.activeTabColor}
                  />
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.expandingMenu,
              dynamicStyles.expandingMenuStyle,
              {
                top: menuTop,
                transform: [{ translateY }],
                opacity: overlayOpacity,
                borderColor: borderCol,
              },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={isDarkMode ? 52 : 58}
                tint={isDarkMode ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: fallbackMenu }]} />
            )}
            <View style={styles.menuInner}>
              <TouchableOpacity
                onPress={() => handleMenuItemPress('/(tabs)/home')}
                style={[styles.menuItem, dynamicStyles.menuItemStyle]}
              >
                <EnIcon name="home" size={22} color={dynamicStyles.activeTabColor} />
                <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Home</Text>
              </TouchableOpacity>

              <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />

              <TouchableOpacity
                onPress={() => handleMenuItemPress('/bookmarks')}
                style={[styles.menuItem, dynamicStyles.menuItemStyle]}
              >
                <EnIcon name="bookmarks" size={22} color={dynamicStyles.activeTabColor} />
                <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Bookmarks</Text>
              </TouchableOpacity>

              <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />

              <TouchableOpacity
                onPress={() => handleMenuItemPress('/(tabs)/read')}
                style={[styles.menuItem, dynamicStyles.menuItemStyle]}
              >
                <EnIcon name="book" size={22} color={dynamicStyles.activeTabColor} />
                <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Read</Text>
              </TouchableOpacity>

              <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />

              <TouchableOpacity
                onPress={() => handleMenuItemPress('/(tabs)/search')}
                style={[styles.menuItem, dynamicStyles.menuItemStyle]}
              >
                <FoIcon name="magnifying-glass" size={22} color={dynamicStyles.activeTabColor} />
                <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>Search</Text>
              </TouchableOpacity>

              <View style={[styles.menuDivider, dynamicStyles.menuDividerStyle]} />

              <TouchableOpacity
                onPress={() => handleMenuItemPress('/(tabs)/about')}
                style={[styles.menuItem, dynamicStyles.menuItemStyle]}
              >
                <EnIcon name="info-with-circle" size={22} color={dynamicStyles.activeTabColor} />
                <Text style={[styles.menuItemText, dynamicStyles.menuItemTextStyle]}>About</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </>
  );
}
