import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  FlatList, 
  useColorScheme, 
  ScrollView, 
  Dimensions,
  StyleSheet 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { searchStyles } from '@/frontend/styles/search.styles';
import LineSearch from '@/frontend/components/search/LineSearch';
import { router, useLocalSearchParams } from 'expo-router';
import WordSearch from '@/frontend/components/search/WordSearch';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

type ValidTab = 'Word Search' | 'Line Search';

type TabButtonProps = {
  name: ValidTab;
  activeTab: ValidTab;
  onPress: (name: ValidTab) => void;
  isDark: boolean;
};

const TabButton = ({ name, activeTab, onPress, isDark }: TabButtonProps) => {
  const styles = searchStyles(isDark);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(name);
  };

  return (
    <TouchableOpacity
      style={[styles.tabItem, activeTab === name && styles.activeTabItem]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, activeTab === name && styles.activeTabText]}>
        {name}
      </Text>
      {activeTab === name && <View style={styles.indicator} />}
    </TouchableOpacity>
  );
};

const Tabs = ({ activeTab, setActiveTab, isDark }: { 
  activeTab: ValidTab; 
  setActiveTab: (tab: ValidTab) => void; 
  isDark: boolean 
}) => {
  const tabs: ValidTab[] = ['Word Search', 'Line Search'];
  const styles = searchStyles(isDark);

  return (
    <View style={[styles.tabBarContainer]}> 
      <LinearGradient
        colors={isDark ? ['rgba(15,15,27,0.9)', 'rgba(26,26,46,0.9)'] : ['rgba(248,249,250,0.9)', 'rgba(255,255,255,0.9)']}
        style={styles.tabBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0 }}
      >
        <FlatList
          data={tabs}
          renderItem={({ item }) => (
            <TabButton 
              name={item} 
              activeTab={activeTab} 
              onPress={setActiveTab} 
              isDark={isDark} 
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
          keyExtractor={(item) => item}
        />
      </LinearGradient>
    </View>
  );
};

export default function SearchScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const { tab } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  const tabs: ValidTab[] = ['Word Search', 'Line Search'];
  const tabComponents: { [key in ValidTab]: React.JSX.Element } = {
    'Word Search': <WordSearch />,
    'Line Search': <LineSearch />,
  };

  const [activeTab, setActiveTab] = useState<ValidTab>(
    typeof tab === 'string' && tabs.includes(tab as ValidTab) ? (tab as ValidTab) : 'Word Search'
  );

  useEffect(() => {
    if (activeTab !== tab) {
      router.setParams({ tab: activeTab });
    }
  }, [activeTab]);

  const handleTabPress = (tabName: ValidTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tabName);
    const tabIndex = tabs.indexOf(tabName);
    scrollViewRef.current?.scrollTo({ x: width * tabIndex, animated: true });
  };

  const handleScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const tabIndex = Math.round(offsetX / width);
    setActiveTab(tabs[tabIndex]);
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('../(tabs)');
    }
  };

  const styles = searchStyles(isDark);

  return (
    <LinearGradient
      colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={{ flex: 1 }}
    >
      <View style={[
        styles.headerContainer,
        isDark ? styles.darkHeader : styles.lightHeader
      ]}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather 
            name="chevron-left" 
            size={24} 
            color={isDark ? '#E2E8F0' : '#2D3748'} 
          />
        </TouchableOpacity>
        <Text style={[
          styles.headerText,
          isDark ? styles.darkHeaderText : styles.lightHeaderText
        ]}>
          Explore Antigone
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>
      <View style={{ flex: 1 }}>        
        <Tabs activeTab={activeTab} setActiveTab={handleTabPress} isDark={isDark} />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {tabs.map((tab) => (
            <View key={tab} style={{ width, paddingTop: 10 }}>
              {tabComponents[tab]}
            </View>
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}