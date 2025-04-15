import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  FlatList, 
  useColorScheme, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { searchStyles } from '@/assets/styles/search.styles';
import LineSearch from '@/components/search/LineSearch';
import SpeakerSearch from '@/components/search/SpeakerSearch';
import { router, useLocalSearchParams } from 'expo-router';
import WordSearch from '@/components/search/WordSearch';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

type ValidTab = 'Word Search' | 'Line Search' | 'Speaker Search';

type TabButtonProps = {
  name: ValidTab;
  activeTab: ValidTab;
  onPress: (name: ValidTab) => void;
  isDark: boolean;
};

const TabButton = ({ name, activeTab, onPress, isDark }: TabButtonProps) => {
  const styles = searchStyles(isDark);

  return (
    <TouchableOpacity
      style={[styles.tabItem, activeTab === name && styles.activeTabItem]}
      onPress={() => onPress(name)}
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
  const tabs: ValidTab[] = ['Word Search', 'Line Search', 'Speaker Search'];
  const styles = searchStyles(isDark);

  return (
    <View style={[styles.tabBar, { paddingTop: Platform.OS === 'ios' ? 120 : 40 }]}>
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
    </View>
  );
};

export default function SearchScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const { tab } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  const tabs: ValidTab[] = ['Word Search', 'Line Search', 'Speaker Search'];
  const tabComponents: { [key in ValidTab]: React.JSX.Element } = {
    'Word Search': <WordSearch />,
    'Line Search': <LineSearch />,
    'Speaker Search': <SpeakerSearch />,
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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <LinearGradient
        colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
        style={{ flex: 1 }}
    >
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