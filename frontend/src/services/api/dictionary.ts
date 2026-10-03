/** RF 4 — Dicionário integrado e histórico. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { DICTIONARY_HISTORY, dictionaryLookup } from '../mock/data';
import { DictionaryEntry, DictionaryHistoryItem, LanguageCode } from '../types';

async function readLocalHistory(): Promise<DictionaryHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.dictionaryHistory);
    return raw ? (JSON.parse(raw) as DictionaryHistoryItem[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalHistory(items: DictionaryHistoryItem[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.dictionaryHistory, JSON.stringify(items.slice(0, 30)));
  } catch {
    // histórico é acessório: falhar em silêncio é aceitável aqui
  }
}

export const dictionaryApi = {
  /**
   * RF 4.1 — busca o significado de uma palavra.
   * TODO: apontar para a API de dicionário escolhida (ex.: dictionaryapi.dev,
   * Wordnik, Free Dictionary) ou para o seu backend fazendo proxy dela.
   */
  async search(term: string, language: LanguageCode): Promise<DictionaryEntry | null> {
    const entry = USE_MOCK_API
      ? await mockResponse(dictionaryLookup(term), 600)
      : await request<DictionaryEntry>(endpoints.dictionarySearch, {
          query: { term, language },
        });

    if (entry) {
      const history = await readLocalHistory();
      const next = [
        { word: entry.word, translation: entry.translation, searchedAt: new Date().toISOString() },
        ...history.filter(h => h.word.toLowerCase() !== entry.word.toLowerCase()),
      ];
      await writeLocalHistory(next);
    }
    return entry;
  },

  /** RF 4.2 — histórico de pesquisas (local + servidor). */
  async history(): Promise<DictionaryHistoryItem[]> {
    const local = await readLocalHistory();
    if (USE_MOCK_API) {
      return local.length ? local : mockResponse(DICTIONARY_HISTORY, 150);
    }
    const remote = await request<DictionaryHistoryItem[]>(endpoints.dictionaryHistory);
    return [...local, ...remote].slice(0, 30);
  },

  async clearHistory(): Promise<void> {
    await writeLocalHistory([]);
  },
};
