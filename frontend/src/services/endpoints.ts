/**
 * Todos os caminhos da API em um só lugar.
 * Ajuste aqui quando definir as rotas reais do backend.
 */
export const endpoints = {
  // RF 1
  register: '/auth/register',
  login: '/auth/login',
  loginWithGoogle: '/auth/google',
  logout: '/auth/logout',
  me: '/auth/me',

  // RF 2
  languages: '/languages',
  levelTest: (language: string) => `/languages/${language}/level-test`,
  levelTestSubmit: (language: string) => `/languages/${language}/level-test/submit`,
  lessons: '/lessons',
  lesson: (id: string) => `/lessons/${id}`,
  lessonSteps: (id: string) => `/lessons/${id}/steps`,
  lessonOrder: '/lessons/order',
  lessonPending: (id: string) => `/lessons/${id}/pending`,

  // RF 3
  vocabulary: '/vocabulary',
  vocabularyWord: (id: string) => `/vocabulary/${id}`,
  vocabularyRandom: '/vocabulary/random',

  // RF 4
  dictionarySearch: '/dictionary/search',
  dictionaryHistory: '/dictionary/history',

  // RF 5
  exercise: '/exercises',
  exerciseAttempt: '/exercises/attempts',
  lessonFeedback: '/lessons/feedback',

  // RF 8
  flashcards: '/review/flashcards',
  spacedReview: '/review/spaced',
  imageReview: '/review/images',
  reviewRating: '/review/rating',

  // RF 9
  stats: '/progress/stats',
  achievements: '/progress/achievements',
  weeklyReport: '/progress/weekly-report',

  // RF 10
  ranking: '/social/ranking',
  groups: '/social/groups',
  questions: '/social/questions',

  // RF 11
  wordOfDay: '/daily/word',
  phraseOfDay: '/daily/phrase',
  dailyChallenge: '/daily/challenge',

  // RF 12
  cultureArticles: '/culture/articles',
  cultureArticle: (id: string) => `/culture/articles/${id}`,

  // RF 13
  offlinePacks: '/packs/offline',
  storePacks: '/packs/store',
  packDownload: (id: string) => `/packs/${id}/download`,

  // RF 14
  notificationSettings: '/notifications/settings',
  notificationPreviews: '/notifications/previews',
};
