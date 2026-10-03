import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { LearnScreen } from '../screens/learn/LearnScreen';
import { ReviewScreen } from '../screens/review/ReviewScreen';
import { VocabularyScreen } from '../screens/vocabulary/VocabularyScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, string> = {
  Home: '🏠',
  Learn: '📖',
  Review: '🔄',
  Vocabulary: '📝',
  Profile: '👤',
};

const LABELS: Record<keyof TabParamList, string> = {
  Home: 'Início',
  Learn: 'Aprender',
  Review: 'Revisar',
  Vocabulary: 'Vocabulário',
  Profile: 'Perfil',
};

export function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundPlain,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused }) => {
          const key = route.name as keyof TabParamList;
          return (
            <View style={styles.tabItem}>
              <Text style={{ fontSize: focused ? 22 : 20 }}>{ICONS[key]}</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  { color: focused ? theme.colors.primary : theme.colors.textFaint },
                ]}
              >
                {LABELS[key]}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Review" component={ReviewScreen} />
      <Tab.Screen name="Vocabulary" component={VocabularyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 74, gap: 2 },
  tabLabel: { fontSize: 10, fontWeight: '700' },
});
