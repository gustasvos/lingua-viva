/**
 * Modelos de domínio do LinguaViva.
 *
 * Estes tipos são o "contrato" entre as telas e a API. Enquanto a API real não
 * existe, os adaptadores mock (src/services/mock) devolvem exatamente estes
 * formatos. Ao plugar o backend, basta fazer o endpoint responder no mesmo
 * formato (ou ajustar o mapper em cada módulo de src/services/api).
 */

export type LanguageCode = string; // 'en' | 'fr' | 'de' | 'ko' | 'zh' | ...
export type LevelId = 'beginner' | 'intermediate' | 'advanced';
export type DifficultyId = 'easy' | 'medium' | 'hard';
export type LessonStatus = 'completed' | 'in-progress' | 'locked' | 'pending';
export type Performance = 'good' | 'okay' | 'hard';

// ── RF 1: contas e autenticação ───────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
};

export type AuthSession = {
  token: string;
  refreshToken?: string;
  user: User;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// ── RF 2: idiomas e configuração do aprendizado ───────────────────────────────
export type Language = {
  code: LanguageCode;
  /** Nome no idioma do usuário (pt-BR). */
  name: string;
  /** Nome no próprio idioma. */
  nativeName: string;
  flag: string;
  color: string;
  gradient: [string, string];
  country: string;
  speakers: string;
};

export type LevelTestQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  level: LevelId;
};

export type LevelTestResult = {
  score: number;
  total: number;
  recommendedLevel: LevelId;
};

export type Lesson = {
  id: string;
  title: string;
  topic: string;
  level: LevelId;
  language: LanguageCode;
  description: string;
  tags: string[];
  duration: number;
  xp: number;
  totalItems: number;
  completedItems: number;
  progress: number;
  status: LessonStatus;
  /** Posição definida pelo usuário (RF 2.7 — arrastar e soltar). */
  order?: number;
};

export type LessonQuery = {
  language: LanguageCode;
  level?: LevelId | 'all';
  status?: LessonStatus | 'all';
  /** RF 2.6 — busca por palavra-chave ou tópico. */
  search?: string;
  sort?: 'default' | 'xp' | 'duration';
};

export type LessonStep =
  | {
      id: string;
      type: 'word' | 'phrase';
      word: string;
      translation: string;
      phonetic?: string;
      example?: string;
      exampleTranslation?: string;
      explanation?: string;
      image?: string;
      audioUrl?: string;
    }
  | {
      id: string;
      type: 'exercise';
      exerciseType: ExerciseType;
    };

// ── RF 5: lições e exercícios ─────────────────────────────────────────────────
export type ExerciseType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'grammar-quiz'
  | 'reading'
  | 'dictation'
  | 'verb-conjugation'
  | 'guided-writing'
  | 'hangman'
  | 'quick-train';

export type MultipleChoiceExercise = {
  id: string;
  type: 'multiple-choice' | 'grammar-quiz';
  topic?: string;
  question: string;
  /** Frase auxiliar mostrada em destaque (usada no quiz de gramática). */
  sentence?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  xp: number;
};

export type FillBlankExercise = {
  id: string;
  type: 'fill-blank';
  /** A lacuna é marcada por `_____`. */
  sentence: string;
  options: string[];
  correctIndex: number;
  hint?: string;
  xp: number;
};

export type ReadingExercise = {
  id: string;
  type: 'reading';
  text: string;
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
  }[];
  xp: number;
};

export type DictationExercise = {
  id: string;
  type: 'dictation';
  phrase: string;
  translation: string;
  audioUrl?: string;
  xp: number;
};

export type HangmanExercise = {
  id: string;
  type: 'hangman';
  word: string;
  hint: string;
  maxErrors: number;
  xp: number;
};

export type VerbConjugationExercise = {
  id: string;
  type: 'verb-conjugation';
  verb: string;
  tense: string;
  subjects: string[];
  answers: string[];
  xp: number;
};

export type GuidedWritingExercise = {
  id: string;
  type: 'guided-writing';
  prompt: string;
  image?: string;
  minWords: number;
  hint?: string;
  xp: number;
};

export type QuickTrainExercise = {
  id: string;
  type: 'quick-train';
  durationSeconds: number;
  questions: { prompt: string; options: string[]; correctIndex: number }[];
  xp: number;
};

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | ReadingExercise
  | DictationExercise
  | HangmanExercise
  | VerbConjugationExercise
  | GuidedWritingExercise
  | QuickTrainExercise;

export type ExerciseQuery = {
  language: LanguageCode;
  type: ExerciseType;
  lessonId?: string;
  difficulty?: DifficultyId;
  /** RF 5.10 — embaralhar perguntas a cada tentativa. */
  shuffle?: boolean;
};

export type ExerciseAttempt = {
  exerciseId: string;
  lessonId?: string;
  type: ExerciseType;
  correct: boolean;
  xp: number;
  /** Segundos gastos, quando medido. */
  elapsed?: number;
  answer?: unknown;
};

export type ExerciseAttemptResult = {
  xpAwarded: number;
  totalXp?: number;
  correctCount?: number;
  totalCount?: number;
  accuracy?: number;
  elapsedLabel?: string;
};

export type LessonFeedback = {
  lessonId?: string;
  /** RF 9.11 — humor após a lição. */
  mood?: string;
  /** RF 9.9 — esforço percebido. */
  effort?: string;
};

// ── RF 3: caderno de vocabulário ──────────────────────────────────────────────
export type VocabularyWord = {
  id: string;
  word: string;
  translation: string;
  language: LanguageCode;
  phonetic?: string;
  example?: string;
  difficulty: DifficultyId;
  isFavorite: boolean;
  hasVoiceNote: boolean;
  mastery: number;
  tags: string[];
  note?: string;
  lastPerformance?: Performance;
  addedAt?: string;
};

// ── RF 4: dicionário ──────────────────────────────────────────────────────────
export type DictionaryEntry = {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  translation?: string;
  definitions: string[];
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  audioUrl?: string;
};

export type DictionaryHistoryItem = {
  word: string;
  translation?: string;
  searchedAt: string;
};

// ── RF 8: revisão ─────────────────────────────────────────────────────────────
export type Flashcard = {
  id: string;
  front: string;
  back: string;
  phonetic?: string;
  mastery?: Performance | null;
};

export type SpacedReviewWord = {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  mastery: number;
  lastPerformance: Performance;
  nextReview: string;
};

export type ImageReviewItem = {
  id: string;
  image: string;
  options: string[];
  correctIndex: number;
};

// ── RF 9: progresso e gamificação ─────────────────────────────────────────────
export type UserStats = {
  totalXP: number;
  dailyXP: number;
  dailyGoalXP: number;
  streak: number;
  totalStudyTime: number;
  todayStudyTime: number;
  lessonsCompleted: number;
  wordsLearned: number;
  currentLevel: LevelId;
  weeklyXP: number[];
  monthlyXP: number[];
  errorsByType: { type: string; errors: number; total: number }[];
  vocabularyHeatmap: { topic: string; mastery: number }[];
  weekDays?: { label: string; state: 'done' | 'missed' | 'today' | 'future' }[];
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'unlocked' | 'in-progress' | 'locked';
  progress?: number;
  maxProgress?: number;
  xpReward: number;
  category: string;
  unlockedAt?: string;
};

export type WeeklyReport = {
  weekStudyTime: number;
  prevWeekStudyTime: number;
  lessonsCompleted: number;
  prevLessonsCompleted: number;
  wordsLearned: number;
  prevWordsLearned: number;
  xpEarned: number;
  prevXpEarned: number;
  streak: number;
  dailyBreakdown: { day: string; minutes: number; xp: number }[];
};

// ── RF 10: social ─────────────────────────────────────────────────────────────
export type RankingEntry = {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  rank: number;
  isMe?: boolean;
};

export type StudyGroup = {
  id: string;
  name: string;
  language: LanguageCode;
  members: number;
  progress: string;
  lastActivity: string;
  isAdmin: boolean;
  memberAvatars: string[];
};

export type CommunityQuestion = {
  id: string;
  user: string;
  avatar: string;
  question: string;
  answers: number;
  votes: number;
  time: string;
  resolved: boolean;
};

// ── RF 11: conteúdo diário ────────────────────────────────────────────────────
export type WordOfDay = {
  word: string;
  translation: string;
  phonetic?: string;
  example?: string;
  exampleTranslation?: string;
  explanation?: string;
};

export type PhraseOfDay = {
  phrase: string;
  translation: string;
  explanation: string;
  audioUrl?: string;
};

export type DailyChallenge = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  xpReward: number;
};

// ── RF 12: cultura ────────────────────────────────────────────────────────────
export type CultureArticle = {
  id: string;
  title: string;
  language: LanguageCode;
  category: string;
  readTime: string;
  image?: string;
  description: string;
  content: string;
};

// ── RF 13: offline e loja ─────────────────────────────────────────────────────
export type ContentPack = {
  id: string;
  name: string;
  description?: string;
  language: LanguageCode;
  level: LevelId;
  lessons: number;
  size: string;
  status: 'downloaded' | 'downloading' | 'not-downloaded' | 'available' | 'error';
  progress?: number;
  rating?: number;
  downloads?: number;
};

// ── RF 14: notificações ───────────────────────────────────────────────────────
export type NotificationPreview = {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
};

export type NotificationSettings = {
  enabled: boolean;
  reminderTime: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  weeklyReportEmail: boolean;
};
