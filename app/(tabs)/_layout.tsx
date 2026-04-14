import { Tabs } from 'expo-router';
import TabLayout from './tabLayout';
import { View } from 'react-native';

export default function TabLayoutNav() {
  return (
    <TabLayout> 
      <View style={{ flex: 1 }}> 
        <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
          <Tabs.Screen name="home" options={{ title: 'Home' }} />
          <Tabs.Screen name="read" options={{ title: 'Read' }} />
          <Tabs.Screen name="search" options={{ title: 'Search' }} />
          <Tabs.Screen name="about" options={{ title: 'About' }} />
        </Tabs>
      </View>
    </TabLayout>
  );
}