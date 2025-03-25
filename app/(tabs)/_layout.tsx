import { Tabs } from 'expo-router';
import TabLayout from './tabLayout';

export default function TabLayoutNav() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
        <Tabs.Screen name="read" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="favorites" />
      </Tabs>
      <TabLayout />
    </>
  );
}