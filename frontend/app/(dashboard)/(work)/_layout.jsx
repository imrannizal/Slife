import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#6200ee'
    }}>
      <Tabs.Screen name="workspaces" options={{ title: 'All Workspaces' }} />
    </Tabs>
  );
}