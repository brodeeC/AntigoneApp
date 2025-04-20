import { Tabs } from 'expo-router';
import TabLayout from './tabLayout';
import { View } from 'react-native';

export default function TabLayoutNav() {
  return (
    <TabLayout> 
      <View style={{ flex: 1 }}> 
        <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="read" />
          <Tabs.Screen name="search" />
          <Tabs.Screen name="about" />
        </Tabs>
      </View>
    </TabLayout>
  );
}