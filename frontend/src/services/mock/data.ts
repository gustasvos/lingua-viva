/**
 * Dados de demonstração.
 *
 * Tudo aqui existe apenas enquanto a API real não está pronta. Cada função
 * recebe `language` para que a troca de idioma já funcione de ponta a ponta —
 * era isso que o protótipo do Figma não fazia (caía sempre no conteúdo de
 * inglês). Há conteúdo completo para 'en' e 'fr'; os demais idiomas reusam a
 * estrutura do inglês marcada com `isPlaceholder`, até o backend responder.
 */
import {
  Achievement,
  CommunityQuestion,
  ContentPack,
  CultureArticle,
  DailyChallenge,
  DictionaryEntry,
  DictionaryHistoryItem,
  Exercise,
  ExerciseType,
  Flashcard,
  ImageReviewItem,
  Language,
  LanguageCode,
  Lesson,
  LessonStep,
  LevelTestQuestion,
  NotificationPreview,
  PhraseOfDay,
  RankingEntry,
  SpacedReviewWord,
  StudyGroup,
  UserStats,
  VocabularyWord,
  WeeklyReport,
  WordOfDay,
} from '../types';

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'Inglês',
    nativeName: 'English',
    flag: '🇺🇸',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#22D3EE'],
    country: 'Estados Unidos',
    speakers: '1,5 bilhões',
  },
  {
    code: 'fr',
    name: 'Francês',
    nativeName: 'Français',
    flag: '🇫🇷',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#C084FC'],
    country: 'França',
    speakers: '300 milhões',
  },
  {
    code: 'de',
    name: 'Alemão',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FBBF24'],
    country: 'Alemanha',
    speakers: '100 milhões',
  },
  {
    code: 'ko',
    name: 'Coreano',
    nativeName: '한국어',
    flag: '🇰🇷',
    color: '#EF4444',
    gradient: ['#EF4444', '#FB7185'],
    country: 'Coreia do Sul',
    speakers: '80 milhões',
  },
  {
    code: 'zh',
    name: 'Mandarim',
    nativeName: '普通话',
    flag: '🇨🇳',
    color: '#10B981',
    gradient: ['#10B981', '#34D399'],
    country: 'China',
    speakers: '1,1 bilhão',
  },
];

export const getLanguage = (code: LanguageCode): Language =>
  LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];

// ── Lições ────────────────────────────────────────────────────────────────────
const EN_LESSONS: Lesson[] = [
  {
    id: 'en-l1',
    title: 'Saudações Básicas',
    topic: 'Cumprimentos',
    level: 'beginner',
    language: 'en',
    progress: 100,
    totalItems: 12,
    completedItems: 12,
    status: 'completed',
    xp: 50,
    duration: 10,
    description: 'Aprenda as saudações mais comuns em inglês.',
    tags: ['saudações', 'básico', 'conversação'],
  },
  {
    id: 'en-l2',
    title: 'Números e Quantidades',
    topic: 'Números',
    level: 'beginner',
    language: 'en',
    progress: 75,
    totalItems: 15,
    completedItems: 11,
    status: 'in-progress',
    xp: 60,
    duration: 12,
    description: 'Aprenda a contar e usar números no dia a dia.',
    tags: ['números', 'básico', 'matemática'],
  },
  {
    id: 'en-l3',
    title: 'Cores e Formas',
    topic: 'Vocabulário Visual',
    level: 'beginner',
    language: 'en',
    progress: 0,
    totalItems: 10,
    completedItems: 0,
    status: 'locked',
    xp: 40,
    duration: 8,
    description: 'Descreva o mundo ao seu redor com cores e formas.',
    tags: ['cores', 'formas', 'vocabulário'],
  },
  {
    id: 'en-l4',
    title: 'Família e Relações',
    topic: 'Família',
    level: 'beginner',
    language: 'en',
    progress: 0,
    totalItems: 14,
    completedItems: 0,
    status: 'pending',
    xp: 55,
    duration: 11,
    description: 'Fale sobre sua família e as pessoas próximas.',
    tags: ['família', 'relações', 'vocabulário'],
  },
  {
    id: 'en-l5',
    title: 'Tempo e Clima',
    topic: 'Meteorologia',
    level: 'intermediate',
    language: 'en',
    progress: 40,
    totalItems: 18,
    completedItems: 7,
    status: 'in-progress',
    xp: 70,
    duration: 15,
    description: 'Fale sobre o tempo e condições climáticas.',
    tags: ['clima', 'tempo', 'intermediário'],
  },
  {
    id: 'en-l6',
    title: 'No Restaurante',
    topic: 'Alimentação',
    level: 'intermediate',
    language: 'en',
    progress: 0,
    totalItems: 20,
    completedItems: 0,
    status: 'locked',
    xp: 80,
    duration: 18,
    description: 'Saiba como pedir comida e interagir em restaurantes.',
    tags: ['comida', 'restaurante', 'conversação'],
  },
  {
    id: 'en-l7',
    title: 'Past Perfect Tense',
    topic: 'Gramática',
    level: 'advanced',
    language: 'en',
    progress: 0,
    totalItems: 22,
    completedItems: 0,
    status: 'locked',
    xp: 100,
    duration: 22,
    description: 'Domine o uso do Past Perfect em contextos complexos.',
    tags: ['gramática', 'verbos', 'avançado'],
  },
  {
    id: 'en-l8',
    title: 'Expressões Idiomáticas',
    topic: 'Idioms',
    level: 'advanced',
    language: 'en',
    progress: 0,
    totalItems: 25,
    completedItems: 0,
    status: 'locked',
    xp: 120,
    duration: 25,
    description: 'Aprenda expressões usadas por nativos.',
    tags: ['idioms', 'nativo', 'expressões'],
  },
];

const FR_LESSONS: Lesson[] = [
  {
    id: 'fr-l1',
    title: 'Primeiros Cumprimentos',
    topic: 'Salutations',
    level: 'beginner',
    language: 'fr',
    progress: 60,
    totalItems: 12,
    completedItems: 7,
    status: 'in-progress',
    xp: 50,
    duration: 10,
    description: 'Bonjour, salut e as fórmulas de cortesia.',
    tags: ['saudações', 'básico'],
  },
  {
    id: 'fr-l2',
    title: 'Artigos e Gênero',
    topic: 'Grammaire',
    level: 'beginner',
    language: 'fr',
    progress: 0,
    totalItems: 16,
    completedItems: 0,
    status: 'pending',
    xp: 65,
    duration: 14,
    description: 'Le, la, les: quando usar cada artigo.',
    tags: ['gramática', 'artigos'],
  },
  {
    id: 'fr-l3',
    title: 'Na Padaria',
    topic: 'Boulangerie',
    level: 'intermediate',
    language: 'fr',
    progress: 0,
    totalItems: 18,
    completedItems: 0,
    status: 'locked',
    xp: 80,
    duration: 16,
    description: 'Peça pão, croissants e converse com o atendente.',
    tags: ['comida', 'conversação'],
  },
];

const EN_STEPS: LessonStep[] = [
  {
    id: 'en-s1',
    type: 'word',
    word: 'Hello',
    translation: 'Olá',
    phonetic: '/həˈloʊ/',
    example: 'Hello, how are you?',
    exampleTranslation: 'Olá, como vai você?',
    explanation: 'A saudação mais comum em inglês, usada em contextos formais e informais.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: 'en-s2',
    type: 'word',
    word: 'Good morning',
    translation: 'Bom dia',
    phonetic: '/ɡʊd ˈmɔːrnɪŋ/',
    example: 'Good morning, everyone!',
    exampleTranslation: 'Bom dia, pessoal!',
    explanation: 'Usada para cumprimentar alguém pela manhã, geralmente até o meio-dia.',
  },
  {
    id: 'en-s3',
    type: 'word',
    word: 'Good afternoon',
    translation: 'Boa tarde',
    phonetic: '/ɡʊd ˌæftərˈnuːn/',
    example: 'Good afternoon, Mr. Smith.',
    exampleTranslation: 'Boa tarde, Sr. Smith.',
    explanation: 'Usada do meio-dia até aproximadamente 18h.',
  },
  {
    id: 'en-s4',
    type: 'word',
    word: 'How are you?',
    translation: 'Como vai você?',
    phonetic: '/haʊ ɑːr juː/',
    example: 'Hello! How are you?',
    exampleTranslation: 'Olá! Como vai?',
    explanation: 'Pergunta comum após cumprimentar. A resposta padrão é "Fine, thanks".',
  },
  { id: 'en-s5', type: 'exercise', exerciseType: 'multiple-choice' },
  {
    id: 'en-s6',
    type: 'word',
    word: 'Goodbye',
    translation: 'Adeus / Tchau',
    phonetic: '/ˌɡʊdˈbaɪ/',
    example: 'Goodbye! See you tomorrow.',
    exampleTranslation: 'Tchau! Até amanhã.',
  },
  { id: 'en-s7', type: 'exercise', exerciseType: 'fill-blank' },
];

const FR_STEPS: LessonStep[] = [
  {
    id: 'fr-s1',
    type: 'word',
    word: 'Bonjour',
    translation: 'Bom dia / Olá',
    phonetic: '/bɔ̃.ʒuʁ/',
    example: 'Bonjour, comment allez-vous ?',
    exampleTranslation: 'Olá, como vai o senhor?',
    explanation: 'Serve como "bom dia" e como "olá" em situações formais.',
  },
  {
    id: 'fr-s2',
    type: 'word',
    word: 'Merci beaucoup',
    translation: 'Muito obrigado(a)',
    phonetic: '/mɛʁ.si bo.ku/',
    example: 'Merci beaucoup pour votre aide.',
    exampleTranslation: 'Muito obrigado pela sua ajuda.',
  },
  { id: 'fr-s3', type: 'exercise', exerciseType: 'multiple-choice' },
  {
    id: 'fr-s4',
    type: 'word',
    word: 'Au revoir',
    translation: 'Até logo',
    phonetic: '/o ʁə.vwaʁ/',
    example: 'Au revoir et à bientôt !',
    exampleTranslation: 'Até logo e até breve!',
  },
];

const LESSONS_BY_LANGUAGE: Record<string, Lesson[]> = { en: EN_LESSONS, fr: FR_LESSONS };
const STEPS_BY_LANGUAGE: Record<string, LessonStep[]> = { en: EN_STEPS, fr: FR_STEPS };

/** Gera o conteúdo do idioma pedido; cai no inglês marcado como placeholder. */
export function lessonsFor(language: LanguageCode): Lesson[] {
  const own = LESSONS_BY_LANGUAGE[language];
  if (own) return own;
  return EN_LESSONS.map(l => ({ ...l, id: `${language}-${l.id}`, language }));
}

export function stepsFor(language: LanguageCode): LessonStep[] {
  return STEPS_BY_LANGUAGE[language] ?? EN_STEPS;
}

/** True quando estamos reaproveitando o conteúdo de inglês por falta de dados. */
export const isPlaceholderLanguage = (language: LanguageCode) =>
  !LESSONS_BY_LANGUAGE[language];

// ── Teste de nível (RF 2.5) ───────────────────────────────────────────────────
export const LEVEL_TEST: Record<string, LevelTestQuestion[]> = {
  en: [
    {
      id: 'lt1',
      prompt: 'What is the meaning of "serendipity"?',
      options: ['Tristeza', 'Descoberta feliz acidental', 'Dificuldade', 'Preguiça'],
      correctIndex: 1,
      level: 'advanced',
    },
    {
      id: 'lt2',
      prompt: 'Complete: "I ___ to school every day."',
      options: ['goes', 'go', 'going', 'gone'],
      correctIndex: 1,
      level: 'beginner',
    },
    {
      id: 'lt3',
      prompt: 'Translate: "She had already left when he arrived."',
      options: [
        'Ela saiu quando ele chegou',
        'Ela já havia saído quando ele chegou',
        'Ela vai sair quando ele chegar',
        'Ela sai quando ele chega',
      ],
      correctIndex: 1,
      level: 'advanced',
    },
  ],
  fr: [
    {
      id: 'lt1',
      prompt: 'Que signifie « pourtant » ?',
      options: ['Portanto', 'No entanto', 'Durante', 'Para sempre'],
      correctIndex: 1,
      level: 'intermediate',
    },
    {
      id: 'lt2',
      prompt: 'Complétez : « Je ___ étudiant. »',
      options: ['es', 'suis', 'est', 'sommes'],
      correctIndex: 1,
      level: 'beginner',
    },
    {
      id: 'lt3',
      prompt: 'Traduisez : « Il aurait dû partir plus tôt. »',
      options: [
        'Ele deveria ter saído mais cedo',
        'Ele vai sair mais cedo',
        'Ele saiu mais cedo',
        'Ele sairia mais cedo',
      ],
      correctIndex: 1,
      level: 'advanced',
    },
  ],
};

// ── Exercícios (RF 5) ─────────────────────────────────────────────────────────
const EN_EXERCISES: Record<ExerciseType, Exercise> = {
  'multiple-choice': {
    id: 'en-ex-mc',
    type: 'multiple-choice',
    topic: 'Qual a tradução?',
    question: 'Qual é a tradução de "serendipity"?',
    options: [
      'Tristeza profunda',
      'Descoberta feliz por acaso',
      'Dificuldade extrema',
      'Alegria planejada',
    ],
    correctIndex: 1,
    explanation:
      '"Serendipity" descreve a descoberta de coisas boas de forma não planejada — como encontrar algo valioso por acidente.',
    xp: 20,
  },
  'fill-blank': {
    id: 'en-ex-fb',
    type: 'fill-blank',
    sentence: 'I _____ to school every day.',
    options: ['goes', 'go', 'going', 'gone'],
    correctIndex: 1,
    hint: 'Sujeito "I" usa o verbo na forma base (infinitivo sem "to").',
    xp: 20,
  },
  'grammar-quiz': {
    id: 'en-ex-gr',
    type: 'grammar-quiz',
    topic: 'Present Perfect',
    question: 'Qual é a forma correta no Present Perfect?',
    sentence: 'She _____ (eat) breakfast already.',
    options: ['ate', 'has eaten', 'is eating', 'have eaten'],
    correctIndex: 1,
    explanation:
      'Com "already" e sujeito singular (She), usamos "has + past participle" no Present Perfect.',
    xp: 25,
  },
  reading: {
    id: 'en-ex-rd',
    type: 'reading',
    text: 'The Amazon Rainforest is often called the "lungs of the Earth." It produces about 20% of the world\'s oxygen and is home to 10% of all species on the planet. Scientists estimate that there are still many undiscovered species living there.',
    questions: [
      {
        prompt: 'Por que a Amazônia é chamada de "pulmões da Terra"?',
        options: [
          'Porque é a maior floresta',
          'Porque produz cerca de 20% do oxigênio do mundo',
          'Porque tem muitos animais',
          'Por causa das chuvas',
        ],
        correctIndex: 1,
      },
    ],
    xp: 30,
  },
  dictation: {
    id: 'en-ex-dt',
    type: 'dictation',
    phrase: 'The weather is beautiful today.',
    translation: 'O tempo está lindo hoje.',
    xp: 40,
  },
  hangman: {
    id: 'en-ex-hm',
    type: 'hangman',
    word: 'SERENDIPITY',
    hint: 'Descoberta feliz por acaso',
    maxErrors: 6,
    xp: 50,
  },
  'verb-conjugation': {
    id: 'en-ex-vb',
    type: 'verb-conjugation',
    verb: 'to go',
    tense: 'Simple Present',
    subjects: ['I', 'You', 'He/She', 'We', 'They'],
    answers: ['go', 'go', 'goes', 'go', 'go'],
    xp: 40,
  },
  'guided-writing': {
    id: 'en-ex-gw',
    type: 'guided-writing',
    prompt: 'Describe your favorite place to relax.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&auto=format',
    minWords: 20,
    hint: 'Use adjetivos descritivos e explique POR QUE você gosta deste lugar.',
    xp: 35,
  },
  'quick-train': {
    id: 'en-ex-qt',
    type: 'quick-train',
    durationSeconds: 300,
    questions: [
      { prompt: 'Tradução de "Beautiful"?', options: ['Bonito/a', 'Triste', 'Cansado', 'Forte'], correctIndex: 0 },
      { prompt: '"We ___ happy."', options: ['is', 'are', 'am', 'be'], correctIndex: 1 },
      { prompt: '"Grateful" significa?', options: ['Corajoso', 'Grato', 'Faminto', 'Ansioso'], correctIndex: 1 },
      { prompt: 'Complete: "She ___ already left."', options: ['have', 'has', 'had', 'is'], correctIndex: 1 },
      { prompt: 'Tradução de "Journey"?', options: ['Alegria', 'Jornada', 'Julgamento', 'Trabalho'], correctIndex: 1 },
    ],
    xp: 10,
  },
};

const FR_EXERCISES: Partial<Record<ExerciseType, Exercise>> = {
  'multiple-choice': {
    id: 'fr-ex-mc',
    type: 'multiple-choice',
    topic: 'Qual a tradução?',
    question: 'Qual é a tradução de « pourtant » ?',
    options: ['Portanto', 'No entanto', 'Enquanto', 'Sempre'],
    correctIndex: 1,
    explanation: '« Pourtant » indica contraste, equivalente a "no entanto" / "contudo".',
    xp: 20,
  },
  'fill-blank': {
    id: 'fr-ex-fb',
    type: 'fill-blank',
    sentence: 'Je _____ à l\'école tous les jours.',
    options: ['vas', 'vais', 'allez', 'allons'],
    correctIndex: 1,
    hint: 'Com o sujeito "je", o verbo aller vira "vais".',
    xp: 20,
  },
  hangman: {
    id: 'fr-ex-hm',
    type: 'hangman',
    word: 'BOULANGERIE',
    hint: 'Onde se compra pão fresco',
    maxErrors: 6,
    xp: 50,
  },
};

export function exerciseFor(language: LanguageCode, type: ExerciseType): Exercise {
  if (language === 'fr' && FR_EXERCISES[type]) return FR_EXERCISES[type] as Exercise;
  return EN_EXERCISES[type] ?? EN_EXERCISES['multiple-choice'];
}

// ── Vocabulário (RF 3) ────────────────────────────────────────────────────────
const EN_VOCABULARY: VocabularyWord[] = [
  {
    id: 'w1',
    word: 'Apple',
    translation: 'Maçã',
    language: 'en',
    phonetic: '/ˈæp.əl/',
    example: 'I eat an apple every day.',
    difficulty: 'easy',
    isFavorite: true,
    hasVoiceNote: false,
    mastery: 90,
    tags: ['frutas', 'comida'],
    addedAt: '2024-01-15',
    lastPerformance: 'good',
    note: 'Fruta vermelha ou verde muito comum.',
  },
  {
    id: 'w2',
    word: 'Beautiful',
    translation: 'Bonito/a',
    language: 'en',
    phonetic: '/ˈbjuːtɪfʊl/',
    example: 'What a beautiful sunset!',
    difficulty: 'easy',
    isFavorite: false,
    hasVoiceNote: true,
    mastery: 75,
    tags: ['adjetivos'],
    addedAt: '2024-01-16',
    lastPerformance: 'good',
  },
  {
    id: 'w3',
    word: 'Nevertheless',
    translation: 'No entanto / Contudo',
    language: 'en',
    phonetic: '/ˌnevərðəˈles/',
    example: 'Nevertheless, he continued.',
    difficulty: 'hard',
    isFavorite: true,
    hasVoiceNote: false,
    mastery: 30,
    tags: ['conectivos', 'avançado'],
    addedAt: '2024-01-20',
    lastPerformance: 'hard',
  },
  {
    id: 'w4',
    word: 'Serendipity',
    translation: 'Serendipidade',
    language: 'en',
    phonetic: '/ˌserənˈdɪpɪti/',
    example: 'Meeting her was pure serendipity.',
    difficulty: 'hard',
    isFavorite: false,
    hasVoiceNote: false,
    mastery: 20,
    tags: ['avançado', 'incomum'],
    addedAt: '2024-01-22',
    lastPerformance: 'hard',
  },
  {
    id: 'w5',
    word: 'Journey',
    translation: 'Jornada / Viagem',
    language: 'en',
    phonetic: '/ˈdʒɜːrni/',
    example: 'Life is a long journey.',
    difficulty: 'medium',
    isFavorite: true,
    hasVoiceNote: false,
    mastery: 60,
    tags: ['viagem'],
    addedAt: '2024-01-18',
    lastPerformance: 'okay',
  },
  {
    id: 'w6',
    word: 'Ambitious',
    translation: 'Ambicioso/a',
    language: 'en',
    phonetic: '/æmˈbɪʃəs/',
    example: 'She is very ambitious.',
    difficulty: 'medium',
    isFavorite: false,
    hasVoiceNote: false,
    mastery: 55,
    tags: ['adjetivos', 'personalidade'],
    addedAt: '2024-01-19',
    lastPerformance: 'okay',
  },
  {
    id: 'w7',
    word: 'Ephemeral',
    translation: 'Efêmero/a',
    language: 'en',
    phonetic: '/ɪˈfem.ər.əl/',
    example: 'Fame is ephemeral.',
    difficulty: 'hard',
    isFavorite: false,
    hasVoiceNote: false,
    mastery: 15,
    tags: ['avançado', 'filosofia'],
    addedAt: '2024-01-23',
    lastPerformance: 'hard',
  },
  {
    id: 'w8',
    word: 'Grateful',
    translation: 'Grato/a',
    language: 'en',
    phonetic: '/ˈɡreɪt.fəl/',
    example: 'I am grateful for your help.',
    difficulty: 'easy',
    isFavorite: true,
    hasVoiceNote: true,
    mastery: 85,
    tags: ['sentimentos', 'adjetivos'],
    addedAt: '2024-01-14',
    lastPerformance: 'good',
  },
];

const FR_VOCABULARY: VocabularyWord[] = [
  {
    id: 'fw1',
    word: 'Boulangerie',
    translation: 'Padaria',
    language: 'fr',
    phonetic: '/bu.lɑ̃ʒ.ʁi/',
    example: 'La boulangerie ouvre à sept heures.',
    difficulty: 'medium',
    isFavorite: true,
    hasVoiceNote: false,
    mastery: 65,
    tags: ['comida', 'cidade'],
    addedAt: '2024-02-02',
    lastPerformance: 'okay',
  },
  {
    id: 'fw2',
    word: 'Pourtant',
    translation: 'No entanto',
    language: 'fr',
    phonetic: '/puʁ.tɑ̃/',
    example: "C'est cher, pourtant je l'achète.",
    difficulty: 'hard',
    isFavorite: false,
    hasVoiceNote: false,
    mastery: 25,
    tags: ['conectivos'],
    addedAt: '2024-02-04',
    lastPerformance: 'hard',
  },
];

export function vocabularyFor(language: LanguageCode): VocabularyWord[] {
  if (language === 'fr') return FR_VOCABULARY;
  return EN_VOCABULARY.map(w => (language === 'en' ? w : { ...w, language }));
}

// ── Dicionário (RF 4) ─────────────────────────────────────────────────────────
const DICTIONARY_DB: Record<string, DictionaryEntry> = {
  ephemeral: {
    word: 'Ephemeral',
    phonetic: '/ɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    translation: 'Efêmero/a',
    definitions: [
      'Lasting for a very short time; temporary.',
      'Relating to plants that have a very short life cycle.',
    ],
    examples: [
      'Fame is ephemeral — it can disappear overnight.',
      'The ephemeral beauty of cherry blossoms is famous in Japan.',
    ],
    synonyms: ['temporary', 'transient', 'fleeting', 'brief'],
    antonyms: ['permanent', 'eternal', 'lasting'],
  },
  serendipity: {
    word: 'Serendipity',
    phonetic: '/ˌserənˈdɪpɪti/',
    partOfSpeech: 'noun',
    translation: 'Serendipidade',
    definitions: ['The occurrence of events by chance in a happy or beneficial way.'],
    examples: ['Meeting her was pure serendipity.'],
    synonyms: ['chance', 'luck', 'fluke'],
    antonyms: ['misfortune', 'design'],
  },
  resilient: {
    word: 'Resilient',
    phonetic: '/rɪˈzɪliənt/',
    partOfSpeech: 'adjective',
    translation: 'Resiliente',
    definitions: ['Able to recover quickly from difficult conditions.'],
    examples: ['Children are remarkably resilient.'],
    synonyms: ['tough', 'strong', 'adaptable'],
    antonyms: ['fragile', 'vulnerable'],
  },
  eloquent: {
    word: 'Eloquent',
    phonetic: '/ˈeləkwənt/',
    partOfSpeech: 'adjective',
    translation: 'Eloquente',
    definitions: ['Fluent or persuasive in speaking or writing.'],
    examples: ['She gave an eloquent speech.'],
    synonyms: ['articulate', 'expressive', 'persuasive'],
    antonyms: ['inarticulate', 'tongue-tied'],
  },
};

export function dictionaryLookup(term: string): DictionaryEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  if (DICTIONARY_DB[key]) return DICTIONARY_DB[key];
  // Entrada genérica para qualquer palavra digitada, até a API real responder.
  return {
    word: term.trim(),
    phonetic: '—',
    partOfSpeech: 'palavra',
    translation: 'Tradução indisponível no modo offline',
    definitions: [
      'Ainda não temos esta palavra no dicionário local. Conecte a API de dicionário para ver a definição completa.',
    ],
    examples: [],
    synonyms: [],
    antonyms: [],
  };
}

export const DICTIONARY_HISTORY: DictionaryHistoryItem[] = [
  { word: 'Ephemeral', translation: 'Efêmero', searchedAt: '2024-01-23' },
  { word: 'Serendipity', translation: 'Serendipidade', searchedAt: '2024-01-22' },
  { word: 'Melancholy', translation: 'Melancolia', searchedAt: '2024-01-22' },
  { word: 'Eloquent', translation: 'Eloquente', searchedAt: '2024-01-21' },
  { word: 'Resilient', translation: 'Resiliente', searchedAt: '2024-01-20' },
];

// ── Cultura (RF 12.1) ─────────────────────────────────────────────────────────
const CULTURE: Record<string, CultureArticle[]> = {
  en: [
    {
      id: 'c1',
      title: 'Tea Time na Inglaterra',
      language: 'en',
      category: 'Tradições',
      readTime: '3 min',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&auto=format',
      description: 'O chá das cinco é uma tradição britânica que remonta ao século XIX.',
      content:
        'A cerimônia do chá britânica é muito mais do que uma simples bebida. É uma tradição cultural que envolve etiqueta, conversa e uma seleção cuidadosa de acompanhamentos como scones, sanduíches e pastéis. A "afternoon tea" foi introduzida pela Duquesa de Bedford no início do século XIX.',
    },
    {
      id: 'c2',
      title: 'Thanksgiving: a festa da colheita',
      language: 'en',
      category: 'Festas',
      readTime: '4 min',
      image:
        'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=250&fit=crop&auto=format',
      description: 'Uma das celebrações mais importantes da cultura norte-americana.',
      content:
        'O Thanksgiving é celebrado na quarta quinta-feira de novembro nos EUA. A tradição tem raízes nos colonos que celebraram a primeira colheita bem-sucedida em 1621. O peru assado, a torta de abóbora e as reuniões familiares são partes essenciais desta festa.',
    },
    {
      id: 'c3',
      title: 'Música e identidade americana',
      language: 'en',
      category: 'Cultura',
      readTime: '5 min',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&auto=format',
      description: 'Do jazz ao rock, a música americana moldou culturas ao redor do mundo.',
      content:
        'A música americana é uma rica tapeçaria de influências africanas, europeias e indígenas. O jazz nasceu em New Orleans, o blues no Mississippi, e o rock and roll emergiu da mistura dessas tradições.',
    },
  ],
  fr: [
    {
      id: 'fc1',
      title: 'A arte do apéro',
      language: 'fr',
      category: 'Tradições',
      readTime: '3 min',
      image:
        'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=400&h=250&fit=crop&auto=format',
      description: 'O aperitivo francês é um ritual social antes do jantar.',
      content:
        'O "apéro" é o momento em que amigos se reúnem no fim da tarde para beber algo leve acompanhado de petiscos. Mais do que comer, é um ritual de convivência que pode durar horas e frequentemente substitui o jantar em noites de verão.',
    },
    {
      id: 'fc2',
      title: 'Por que o pão tem hora certa',
      language: 'fr',
      category: 'Gastronomia',
      readTime: '4 min',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=250&fit=crop&auto=format',
      description: 'A baguete fresca faz parte da rotina diária na França.',
      content:
        'A legislação francesa define o que pode ser chamado de "baguette de tradition": farinha, água, sal e fermento, sem aditivos. Muitas famílias compram pão duas vezes ao dia, justamente porque a baguete tradicional perde a qualidade em poucas horas.',
    },
  ],
};

export function cultureFor(language: LanguageCode): CultureArticle[] {
  return CULTURE[language] ?? CULTURE.en.map(a => ({ ...a, language }));
}

// ── Conteúdo diário (RF 11) ───────────────────────────────────────────────────
export const WORD_OF_DAY: Record<string, WordOfDay> = {
  en: {
    word: 'Serendipity',
    translation: 'Serendipidade',
    phonetic: '/ˌserənˈdɪpɪti/',
    example: 'Meeting her was pure serendipity.',
    exampleTranslation: 'Conhecê-la foi pura serendipidade.',
    explanation: 'O ato de encontrar coisas boas de forma não planejada, por acaso.',
  },
  fr: {
    word: 'Flâner',
    translation: 'Passear sem destino',
    phonetic: '/flɑ.ne/',
    example: "J'aime flâner dans les rues de Paris.",
    exampleTranslation: 'Gosto de perambular pelas ruas de Paris.',
    explanation: 'Caminhar sem pressa e sem objetivo, apenas observando a cidade.',
  },
};

export const PHRASE_OF_DAY: Record<string, PhraseOfDay> = {
  en: {
    phrase: 'Every cloud has a silver lining',
    translation: 'Depois da tempestade, vem a bonança',
    explanation: 'Expressão usada para dizer que sempre há algo positivo em situações negativas.',
  },
  fr: {
    phrase: "Ce n'est pas la mer à boire",
    translation: 'Não é nenhum bicho de sete cabeças',
    explanation: 'Literalmente "não é beber o mar": serve para dizer que a tarefa é mais fácil do que parece.',
  },
};

export const DAILY_CHALLENGE: Record<string, DailyChallenge> = {
  en: {
    id: 'dc-en',
    question: 'Qual expressão idiomática significa "estar muito ocupado"?',
    options: ['"In hot water"', '"Up to one\'s neck"', '"On thin ice"', '"Against the clock"'],
    correctIndex: 1,
    explanation:
      '"Up to one\'s neck" significa literalmente "até o pescoço" e indica que alguém está sobrecarregado.',
    xpReward: 30,
  },
  fr: {
    id: 'dc-fr',
    question: 'O que significa « avoir le cafard » ?',
    options: ['Estar com fome', 'Estar deprimido', 'Estar atrasado', 'Estar apaixonado'],
    correctIndex: 1,
    explanation: '« Avoir le cafard » é estar melancólico, para baixo.',
    xpReward: 30,
  },
};

// ── Progresso, conquistas, social ─────────────────────────────────────────────
export const USER_STATS: UserStats = {
  totalXP: 1250,
  dailyXP: 120,
  dailyGoalXP: 200,
  streak: 12,
  totalStudyTime: 1840,
  todayStudyTime: 38,
  lessonsCompleted: 3,
  wordsLearned: 8,
  currentLevel: 'beginner',
  weeklyXP: [80, 140, 60, 190, 120, 210, 120],
  monthlyXP: [400, 560, 720, 850, 1250],
  errorsByType: [
    { type: 'Múltipla Escolha', errors: 12, total: 50 },
    { type: 'Lacunas', errors: 8, total: 30 },
    { type: 'Ditado', errors: 18, total: 25 },
    { type: 'Pronúncia', errors: 22, total: 35 },
    { type: 'Gramática', errors: 15, total: 40 },
  ],
  vocabularyHeatmap: [
    { topic: 'Saudações', mastery: 90 },
    { topic: 'Números', mastery: 75 },
    { topic: 'Cores', mastery: 60 },
    { topic: 'Família', mastery: 40 },
    { topic: 'Comida', mastery: 30 },
    { topic: 'Viagens', mastery: 15 },
    { topic: 'Negócios', mastery: 5 },
    { topic: 'Saúde', mastery: 20 },
  ],
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira lição',
    icon: '🎯',
    status: 'unlocked',
    xpReward: 50,
    category: 'lessons',
    unlockedAt: '2024-01-15',
  },
  {
    id: 'a2',
    title: 'Leitor Voraz',
    description: 'Complete 10 lições',
    icon: '📚',
    status: 'in-progress',
    progress: 3,
    maxProgress: 10,
    xpReward: 200,
    category: 'lessons',
  },
  {
    id: 'a3',
    title: 'Colecionador de Palavras',
    description: 'Adicione 50 palavras ao caderno',
    icon: '📝',
    status: 'in-progress',
    progress: 8,
    maxProgress: 50,
    xpReward: 150,
    category: 'words',
  },
  {
    id: 'a4',
    title: 'Estudante Dedicado',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '🔥',
    status: 'unlocked',
    xpReward: 100,
    category: 'streak',
    unlockedAt: '2024-01-21',
  },
  {
    id: 'a5',
    title: 'Poliglota',
    description: 'Inicie o aprendizado de 2 idiomas',
    icon: '🌍',
    status: 'locked',
    xpReward: 300,
    category: 'special',
  },
  {
    id: 'a6',
    title: 'Maratonista',
    description: 'Estude por 60 minutos em um dia',
    icon: '⏱️',
    status: 'locked',
    xpReward: 200,
    category: 'lessons',
  },
  {
    id: 'a7',
    title: 'Influenciador',
    description: 'Compartilhe seu progresso',
    icon: '📣',
    status: 'unlocked',
    xpReward: 75,
    category: 'social',
    unlockedAt: '2024-01-20',
  },
  {
    id: 'a8',
    title: 'Vocabulário Mestre',
    description: 'Domine 100 palavras (90%+ de acerto)',
    icon: '🏆',
    status: 'locked',
    xpReward: 500,
    category: 'words',
  },
];

export const WEEKLY_REPORT: WeeklyReport = {
  weekStudyTime: 180,
  prevWeekStudyTime: 140,
  lessonsCompleted: 4,
  prevLessonsCompleted: 3,
  wordsLearned: 25,
  prevWordsLearned: 18,
  xpEarned: 450,
  prevXpEarned: 320,
  streak: 12,
  dailyBreakdown: [
    { day: 'Seg', minutes: 25, xp: 60 },
    { day: 'Ter', minutes: 40, xp: 95 },
    { day: 'Qua', minutes: 15, xp: 35 },
    { day: 'Qui', minutes: 50, xp: 110 },
    { day: 'Sex', minutes: 30, xp: 70 },
    { day: 'Sáb', minutes: 20, xp: 80 },
    { day: 'Dom', minutes: 0, xp: 0 },
  ],
};

export const RANKING: RankingEntry[] = [
  { id: 'u1', name: 'Ana Carolina', avatar: '👩', xp: 3200, streak: 30, rank: 1 },
  { id: 'u2', name: 'Pedro Alves', avatar: '👨', xp: 2850, streak: 22, rank: 2 },
  { id: 'u3', name: 'Você', avatar: '😊', xp: 1250, streak: 12, rank: 3, isMe: true },
  { id: 'u4', name: 'Julia Santos', avatar: '👧', xp: 980, streak: 8, rank: 4 },
  { id: 'u5', name: 'Carlos Lima', avatar: '🧑', xp: 750, streak: 5, rank: 5 },
  { id: 'u6', name: 'Mariana Costa', avatar: '👩‍🦰', xp: 620, streak: 3, rank: 6 },
];

export const STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'sg1',
    name: 'English Masters',
    language: 'en',
    members: 8,
    progress: 'Intermediário',
    lastActivity: '2h atrás',
    isAdmin: true,
    memberAvatars: ['👩', '👨', '👧', '🧑'],
  },
  {
    id: 'sg2',
    name: 'Bonjour Friends',
    language: 'fr',
    members: 5,
    progress: 'Iniciante',
    lastActivity: '1d atrás',
    isAdmin: false,
    memberAvatars: ['👩', '👨', '👧'],
  },
];

export const QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q1',
    user: 'Maria S.',
    avatar: '👩',
    question: 'Qual a diferença entre "since" e "for" em inglês?',
    answers: 3,
    votes: 12,
    time: '2h atrás',
    resolved: true,
  },
  {
    id: 'q2',
    user: 'João P.',
    avatar: '👨',
    question: 'Como usar o Present Perfect Continuous?',
    answers: 5,
    votes: 8,
    time: '5h atrás',
    resolved: false,
  },
  {
    id: 'q3',
    user: 'Ana K.',
    avatar: '👧',
    question: 'Qual a pronúncia correta de "th" em "the" e "think"?',
    answers: 7,
    votes: 21,
    time: '1d atrás',
    resolved: true,
  },
];

// ── Revisão (RF 8) ────────────────────────────────────────────────────────────
export function flashcardsFor(language: LanguageCode): Flashcard[] {
  return vocabularyFor(language)
    .slice(0, 5)
    .map(w => ({
      id: w.id,
      front: w.word,
      back: w.translation,
      phonetic: w.phonetic,
      mastery: w.lastPerformance ?? null,
    }));
}

export function spacedReviewFor(language: LanguageCode): SpacedReviewWord[] {
  const schedule = ['Hoje', 'Hoje', 'Amanhã', 'Em 2 dias'];
  return vocabularyFor(language)
    .slice()
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 4)
    .map((w, i) => ({
      id: w.id,
      word: w.word,
      translation: w.translation,
      phonetic: w.phonetic,
      mastery: w.mastery,
      lastPerformance: w.lastPerformance ?? 'okay',
      nextReview: schedule[i] ?? 'Esta semana',
    }));
}

export function imageReviewFor(language: LanguageCode): ImageReviewItem[] {
  const words = vocabularyFor(language);
  const images = [
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&auto=format',
  ];
  return images.map((image, i) => {
    const correct = words[i % words.length];
    const distractors = words.filter(w => w.id !== correct.id).slice(0, 3);
    const options = [correct, ...distractors].map(w => w.word);
    return { id: `ir-${i}`, image, options, correctIndex: 0 };
  });
}

// ── Offline e loja (RF 13) ────────────────────────────────────────────────────
export const OFFLINE_PACKS: ContentPack[] = [
  { id: 'op1', name: 'Inglês Básico', language: 'en', level: 'beginner', lessons: 20, size: '45 MB', status: 'downloaded' },
  { id: 'op2', name: 'Inglês Intermediário', language: 'en', level: 'intermediate', lessons: 30, size: '68 MB', status: 'not-downloaded' },
  { id: 'op3', name: 'Francês Básico', language: 'fr', level: 'beginner', lessons: 18, size: '40 MB', status: 'downloading', progress: 45 },
  { id: 'op4', name: 'Alemão Básico', language: 'de', level: 'beginner', lessons: 15, size: '35 MB', status: 'not-downloaded' },
];

export const STORE_PACKS: ContentPack[] = [
  {
    id: 'sp1',
    name: 'Inglês Profissional',
    description: 'Vocabulário de negócios e apresentações',
    language: 'en',
    level: 'advanced',
    lessons: 25,
    size: '55 MB',
    status: 'available',
    rating: 4.8,
    downloads: 12400,
  },
  {
    id: 'sp2',
    name: 'Viajante Global',
    description: 'Frases essenciais para viagens internacionais',
    language: 'en',
    level: 'intermediate',
    lessons: 15,
    size: '32 MB',
    status: 'downloaded',
    rating: 4.9,
    downloads: 28700,
  },
  {
    id: 'sp3',
    name: 'K-Drama Coreano',
    description: 'Vocabulário popular dos dramas coreanos',
    language: 'ko',
    level: 'beginner',
    lessons: 20,
    size: '48 MB',
    status: 'available',
    rating: 4.7,
    downloads: 9800,
  },
  {
    id: 'sp4',
    name: 'Cultura Francesa',
    description: 'Arte, gastronomia e cultura francesa',
    language: 'fr',
    level: 'intermediate',
    lessons: 12,
    size: '28 MB',
    status: 'available',
    rating: 4.6,
    downloads: 5600,
  },
];

// ── Notificações (RF 14) ──────────────────────────────────────────────────────
export const NOTIFICATION_PREVIEWS: NotificationPreview[] = [
  {
    id: 'n1',
    type: 'reminder',
    title: '⏰ Hora de estudar!',
    body: 'Você ainda não estudou hoje. Complete sua meta diária.',
    time: '18:00',
  },
  {
    id: 'n2',
    type: 'streak',
    title: '🔥 Sequência em risco!',
    body: 'Sua sequência de 12 dias está em risco. Estude agora para mantê-la.',
    time: '20:00',
  },
  {
    id: 'n3',
    type: 'achievement',
    title: '🏆 Nova conquista!',
    body: 'Você desbloqueou "Estudante Dedicado". Continue assim!',
    time: '22:00',
  },
];
