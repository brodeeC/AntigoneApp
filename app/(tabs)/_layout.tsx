import { Tabs } from 'expo-router';
import TabLayout from './tabLayout';
import { View } from 'react-native';

export default function TabLayoutNav() {
  return (
    <TabLayout> {/* Wrap everything with your TabLayout */}
      <View style={{ flex: 1 }}> {/* Container for the tab views */}
        <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
          <Tabs.Screen name="read" />
          <Tabs.Screen name="search" />
          <Tabs.Screen name="favorites" />
        </Tabs>
      </View>
    </TabLayout>
  );
}