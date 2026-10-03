/** RF 2.3 / 2.6 / 2.7 / 2.8 e RF 5 — Lições e seus passos. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { isPlaceholderLanguage, lessonsFor, stepsFor } from '../mock/data';
import { LanguageCode, Lesson, LessonQuery, LessonStep } from '../types';

function applyQuery(lessons: Lesson[], query: LessonQuery): Lesson[] {
  const term = (query.search ?? '').trim().toLowerCase();
  let result = lessons.filter(lesson => {
    const matchesSearch =
      !term ||
      lesson.title.toLowerCase().includes(term) ||
      lesson.topic.toLowerCase().includes(term) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(term));
    const matchesLevel = !query.level || query.level === 'all' || lesson.level === query.level;
    const matchesStatus = !query.status || query.status === 'all' || lesson.status === query.status;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  if (query.sort === 'xp') result = [...result].sort((a, b) => b.xp - a.xp);
  if (query.sort === 'duration') result = [...result].sort((a, b) => a.duration - b.duration);
  return result;
}

/** RF 2.7 — a ordem definida por arrastar e soltar fica salva no dispositivo. */
async function readOrder(language: LanguageCode): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.lessonOrder}:${language}`);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function sortByCustomOrder(lessons: Lesson[], order: string[]): Lesson[] {
  if (!order.length) return lessons;
  const index = new Map(order.map((id, i) => [id, i]));
  return [...lessons].sort(
    (a, b) => (index.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (index.get(b.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

export const lessonsApi = {
  async list(query: LessonQuery): Promise<Lesson[]> {
    if (USE_MOCK_API) {
      const base = applyQuery(lessonsFor(query.language), query);
      const order = await readOrder(query.language);
      return mockResponse(query.sort === 'default' ? sortByCustomOrder(base, order) : base);
    }
    return request<Lesson[]>(endpoints.lessons, {
      query: {
        language: query.language,
        level: query.level === 'all' ? undefined : query.level,
        status: query.status === 'all' ? undefined : query.status,
        search: query.search,
        sort: query.sort,
      },
    });
  },

  async detail(id: string, language: LanguageCode): Promise<Lesson | null> {
    if (USE_MOCK_API) {
      return mockResponse(lessonsFor(language).find(l => l.id === id) ?? null);
    }
    return request<Lesson>(endpoints.lesson(id));
  },

  /** RF 2.3 — passos da lição (palavra, tradução, áudio) e exercícios intercalados. */
  async steps(lessonId: string, language: LanguageCode): Promise<LessonStep[]> {
    if (USE_MOCK_API) return mockResponse(stepsFor(language));
    return request<LessonStep[]>(endpoints.lessonSteps(lessonId));
  },

  /** RF 2.7 — persiste a nova ordem das lições. */
  async saveOrder(language: LanguageCode, orderedIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.lessonOrder}:${language}`,
        JSON.stringify(orderedIds),
      );
    } catch {
      // ignora falha de storage local
    }
    if (!USE_MOCK_API) {
      await request(endpoints.lessonOrder, {
        method: 'PUT',
        body: { language, orderedIds },
      });
    }
  },

  /** RF 2.8 — marca/desmarca lição como pendente de revisão. */
  async togglePending(lessonId: string, pending: boolean): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 120);
    await request(endpoints.lessonPending(lessonId), { method: 'PUT', body: { pending } });
  },

  /** Sinaliza à UI que o conteúdo mostrado é reaproveitado de outro idioma. */
  isPlaceholderContent(language: LanguageCode) {
    return USE_MOCK_API && isPlaceholderLanguage(language);
  },
};
