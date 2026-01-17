import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../src/utils/theme';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? 'speedometer' : 'speedometer-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? 'library' : 'library-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="borrows"
        options={{
          title: 'Borrows',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
