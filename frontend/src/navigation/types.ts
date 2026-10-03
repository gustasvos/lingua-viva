import { ExerciseType, LevelId } from '../services/types';

export type RootStackParamList = {
  // RF 1 — autenticação
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  AppLock: undefined;

  // RF 2 — configuração do aprendizado
  OnboardingLanguage: { fromSettings?: boolean } | undefined;
  OnboardingLevel: { fromSettings?: boolean } | undefined;
  LevelTest: undefined;
  OnboardingDifficulty: { fromSettings?: boolean } | undefined;
  OnboardingGoal: { fromSettings?: boolean } | undefined;

  Tabs: undefined;

  // RF 2 / 5 — lições e exercícios
  LessonContent: { lessonId: string; lessonTitle?: string };
  Exercise: { type: ExerciseType; lessonId?: string; lessonTitle?: string };
  ExerciseResult: {
    xp: number;
    correct: boolean;
    lessonTitle?: string;
    exerciseType?: ExerciseType;
    correctCount?: number;
    totalCount?: number;
  };

  // RF 3 / 4 — vocabulário e dicionário
  WordDetail: { wordId: string };
  Dictionary: undefined;

  // RF 8 — revisão
  Flashcards: undefined;
  SpacedReview: undefined;
  ImageReview: undefined;

  // RF 6 — áudio e pronúncia
  Pronunciation: { word?: string; phonetic?: string } | undefined;
  ActiveListening: undefined;
  PassiveLearning: undefined;

  // RF 7 — tradução e conversação
  Translation: undefined;
  Conversation: undefined;

  // RF 9 — progresso
  Progress: undefined;
  Achievements: undefined;

  // RF 10 — social
  Social: undefined;
  ShareProgress: undefined;

  // RF 11 — conteúdo diário
  DailyChallenge: undefined;
  PhraseOfDay: undefined;

  // RF 12 — cultura e ajuda
  Culture: undefined;
  CultureArticle: { articleId: string };

  // RF 13 — offline e loja
  Offline: undefined;
  Store: undefined;
  ImportExport: undefined;

  // RF 14 e configurações
  Settings: undefined;
  Notifications: undefined;
  WeeklyReport: undefined;
};

export type TabParamList = {
  Home: undefined;
  Learn: undefined;
  Review: undefined;
  Vocabulary: undefined;
  Profile: undefined;
};

export type RecommendedLevel = LevelId;
