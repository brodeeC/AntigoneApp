import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, FlatList, useColorScheme, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { searchStyles } from '@/assets/styles/search.styles';
import TextSearch from '@/components/search/TextSearch';
import LineSearch from '@/components/search/LineSearch';
import SpeakerSearch from '@/components/search/SpeakerSearch';
import { router, useLocalSearchParams } from 'expo-router';

type ValidTab = 'Text Search' | 'Line Search' | 'Speaker Search';

type TabButtonProps = {
  name: ValidTab; // Changed from string to ValidTab
  activeTab: ValidTab;
  onPress: (name: ValidTab) => void; // Changed from string to ValidTab
  isDark: boolean;
};

const TabButton = ({ name, activeTab, onPress, isDark }: TabButtonProps) => {
  const styles = searchStyles(isDark);

  return (
    <TouchableOpacity
      style={[styles.tabItem, activeTab === name && styles.activeTabItem]}
      onPress={() => onPress(name)}
    >
      <Text style={[styles.label, activeTab === name && styles.activeTabText]}>
        {name}
      </Text>
      {activeTab === name && <View style={styles.indicator} />}
    </TouchableOpacity>
  );
};

type TabsProps = {
  activeTab: ValidTab;
  setActiveTab: (tab: ValidTab) => void;
  isDark: boolean;
};

type TabComponents = {
  [key in ValidTab]: React.JSX.Element;
};

const Tabs = ({ activeTab, setActiveTab, isDark }: TabsProps) => {
  const tabs: ValidTab[] = ['Text Search', 'Line Search', 'Speaker Search']; // Explicitly typed as ValidTab[]
  const styles = searchStyles(isDark);

  return (
    <View style={[styles.tabBar, { paddingTop: Platform.OS === 'ios' ? 100 : 0 }]}>
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
  
  const [activeTab, setActiveTab] = React.useState<ValidTab>(
    typeof tab === 'string' && ['Text Search', 'Line Search', 'Speaker Search'].includes(tab) 
        ? tab as ValidTab 
        : 'Text Search'
  );

  // Sync with URL when tab changes
  React.useEffect(() => {
    if (activeTab !== tab) {
      router.setParams({ tab: activeTab });
    }
  }, [activeTab]);

  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');
  const [isSwiping, setIsSwiping] = React.useState(false);

  const tabs: ValidTab[] = ['Text Search', 'Line Search', 'Speaker Search'];
  const tabComponents: TabComponents = {
    'Text Search': <TextSearch />,
    'Line Search': <LineSearch />,
    'Speaker Search': <SpeakerSearch />,
  };

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

  return (
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
        onScrollBeginDrag={() => setIsSwiping(true)}
        onScrollEndDrag={() => setIsSwiping(false)}
      >
        {tabs.map((tab) => (
          <View key={tab} style={{ width }}>
            {tabComponents[tab]}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}