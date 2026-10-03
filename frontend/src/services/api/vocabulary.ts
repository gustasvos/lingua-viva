/** RF 3 — Caderno de vocabulário. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { vocabularyFor } from '../mock/data';
import { DifficultyId, LanguageCode, VocabularyWord } from '../types';

export type VocabularyFilter = 'all' | 'favorites' | 'hard' | 'easy';

export const vocabularyApi = {
  async list(
    language: LanguageCode,
    options: { search?: string; filter?: VocabularyFilter; sort?: 'recent' | 'mastery' } = {},
  ): Promise<VocabularyWord[]> {
    if (USE_MOCK_API) {
      const term = (options.search ?? '').trim().toLowerCase();
      let words = vocabularyFor(language).filter(word => {
        const matchesSearch =
          !term ||
          word.word.toLowerCase().includes(term) ||
          word.translation.toLowerCase().includes(term);
        const matchesFilter =
          !options.filter ||
          options.filter === 'all' ||
          (options.filter === 'favorites' && word.isFavorite) ||
          (options.filter === 'hard' && word.difficulty === 'hard') ||
          (options.filter === 'easy' && word.difficulty === 'easy');
        return matchesSearch && matchesFilter;
      });
      if (options.sort === 'mastery') words = [...words].sort((a, b) => a.mastery - b.mastery);
      return mockResponse(words);
    }
    return request<VocabularyWord[]>(endpoints.vocabulary, {
      query: { language, search: options.search, filter: options.filter, sort: options.sort },
    });
  },

  /** RF 3.7 — palavra aleatória do caderno a cada abertura do app. */
  async random(language: LanguageCode): Promise<VocabularyWord | null> {
    if (USE_MOCK_API) {
      const words = vocabularyFor(language);
      if (!words.length) return null;
      return mockResponse(words[Math.floor(Math.random() * words.length)], 120);
    }
    return request<VocabularyWord>(endpoints.vocabularyRandom, { query: { language } });
  },

  /** RF 3.1 */
  async add(word: Omit<VocabularyWord, 'id'>): Promise<VocabularyWord> {
    if (USE_MOCK_API) return mockResponse({ ...word, id: `local-${Date.now()}` });
    return request<VocabularyWord>(endpoints.vocabulary, { method: 'POST', body: word });
  },

  /** RF 3.2 / 3.3 / 3.4 — favorito, dificuldade e anotação. */
  async update(
    id: string,
    changes: Partial<Pick<VocabularyWord, 'isFavorite' | 'difficulty' | 'note' | 'tags'>>,
  ): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 120);
    await request(endpoints.vocabularyWord(id), { method: 'PATCH', body: changes });
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 120);
    await request(endpoints.vocabularyWord(id), { method: 'DELETE' });
  },

  /**
   * RF 3.5 — nota de voz.
   * TODO: gravar com expo-av e enviar o arquivo em multipart para o backend.
   */
  async attachVoiceNote(id: string, fileUri: string): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 200);
    await request(`${endpoints.vocabularyWord(id)}/voice-note`, {
      method: 'POST',
      body: { fileUri },
    });
  },

  difficulties: ['easy', 'medium', 'hard'] as DifficultyId[],
};
