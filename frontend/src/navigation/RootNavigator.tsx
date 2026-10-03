import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../theme';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';

// RF 1
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { RegisterScreen } from '../screens/onboarding/RegisterScreen';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { AppLockScreen } from '../screens/onboarding/AppLockScreen';
// RF 2
import { LanguageSelectionScreen } from '../screens/onboarding/LanguageSelectionScreen';
import { LevelSelectionScreen } from '../screens/onboarding/LevelSelectionScreen';
import { LevelTestScreen } from '../screens/onboarding/LevelTestScreen';
import { DifficultyScreen } from '../screens/onboarding/DifficultyScreen';
import { GoalScreen } from '../screens/onboarding/GoalScreen';
// RF 2 / 5
import { LessonContentScreen } from '../screens/learn/LessonContentScreen';
import { ExerciseScreen } from '../screens/exercises/ExerciseScreen';
import { ExerciseResultScreen } from '../screens/exercises/ExerciseResultScreen';
// RF 3 / 4
import { WordDetailScreen } from '../screens/vocabulary/WordDetailScreen';
import { DictionaryScreen } from '../screens/vocabulary/DictionaryScreen';
// RF 8
import { FlashcardsScreen } from '../screens/review/FlashcardsScreen';
import { SpacedReviewScreen } from '../screens/review/SpacedReviewScreen';
import { ImageReviewScreen } from '../screens/review/ImageReviewScreen';
// RF 6 / 7
import {
  ActiveListeningScreen,
  PassiveLearningScreen,
  PronunciationScreen,
} from '../screens/practice/PronunciationScreens';
import { ConversationScreen, TranslationScreen } from '../screens/practice/TranslationScreens';
// RF 9 / 10
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { AchievementsScreen } from '../screens/progress/AchievementsScreen';
import { ShareProgressScreen, SocialScreen } from '../screens/progress/SocialScreen';
// RF 11 / 12
import { DailyChallengeScreen, PhraseOfDayScreen } from '../screens/content/DailyContentScreens';
import { CultureScreen } from '../screens/culture/CultureScreen';
import { CultureArticleScreen } from '../screens/culture/CultureArticleScreen';
// RF 13 / 14
import { ImportExportScreen, OfflineScreen, StoreScreen } from '../screens/content/PacksScreens';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { WeeklyReportScreen } from '../screens/profile/WeeklyReportScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();
  const { user, unlocked } = useAuth();
  const { onboardingCompleted, appLockEnabled } = useSettings();

  const navTheme = theme.dark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.colors.background,
          card: theme.colors.backgroundPlain,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          card: theme.colors.backgroundPlain,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      };

  // RF 1.3 — a trava por PIN/biometria vem antes de qualquer conteúdo.
  const needsUnlock = Boolean(user) && appLockEnabled && !unlocked;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!user ? (
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        ) : needsUnlock ? (
          <Stack.Screen name="AppLock" component={AppLockScreen} />
        ) : !onboardingCompleted ? (
          <Stack.Group>
            <Stack.Screen name="OnboardingLanguage" component={LanguageSelectionScreen} />
            <Stack.Screen name="OnboardingLevel" component={LevelSelectionScreen} />
            <Stack.Screen name="LevelTest" component={LevelTestScreen} />
            <Stack.Screen name="OnboardingDifficulty" component={DifficultyScreen} />
            <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Tabs" component={MainTabs} />

            <Stack.Screen name="LessonContent" component={LessonContentScreen} />
            <Stack.Screen
              name="Exercise"
              component={ExerciseScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="ExerciseResult"
              component={ExerciseResultScreen}
              options={{ animation: 'fade' }}
            />

            <Stack.Screen name="WordDetail" component={WordDetailScreen} />
            <Stack.Screen name="Dictionary" component={DictionaryScreen} />

            <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
            <Stack.Screen name="SpacedReview" component={SpacedReviewScreen} />
            <Stack.Screen name="ImageReview" component={ImageReviewScreen} />

            <Stack.Screen name="Pronunciation" component={PronunciationScreen} />
            <Stack.Screen name="ActiveListening" component={ActiveListeningScreen} />
            <Stack.Screen name="PassiveLearning" component={PassiveLearningScreen} />
            <Stack.Screen name="Translation" component={TranslationScreen} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />

            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
            <Stack.Screen name="Social" component={SocialScreen} />
            <Stack.Screen name="ShareProgress" component={ShareProgressScreen} />

            <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
            <Stack.Screen name="PhraseOfDay" component={PhraseOfDayScreen} />
            <Stack.Screen name="Culture" component={CultureScreen} />
            <Stack.Screen name="CultureArticle" component={CultureArticleScreen} />

            <Stack.Screen name="Offline" component={OfflineScreen} />
            <Stack.Screen name="Store" component={StoreScreen} />
            <Stack.Screen name="ImportExport" component={ImportExportScreen} />

            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />

            {/* Reconfiguração a partir das Configurações (RF 2) */}
            <Stack.Screen name="OnboardingLanguage" component={LanguageSelectionScreen} />
            <Stack.Screen name="OnboardingLevel" component={LevelSelectionScreen} />
            <Stack.Screen name="LevelTest" component={LevelTestScreen} />
            <Stack.Screen name="OnboardingDifficulty" component={DifficultyScreen} />
            <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
            <Stack.Screen name="AppLock" component={AppLockScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
