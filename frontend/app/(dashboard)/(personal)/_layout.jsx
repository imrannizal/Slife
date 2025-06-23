import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#6200ee'
    }}>
      <Tabs.Screen name="notes" options={{ title: 'Notes' }} />
      <Tabs.Screen name="todos" options={{ title: 'To-dos' }} />
    </Tabs>
  );
}