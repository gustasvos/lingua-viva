/** RF 11 — Desafio diário, palavra e frase do dia. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { DAILY_CHALLENGE, PHRASE_OF_DAY, WORD_OF_DAY } from '../mock/data';
import { DailyChallenge, LanguageCode, PhraseOfDay, WordOfDay } from '../types';

export const dailyApi = {
  async wordOfDay(language: LanguageCode): Promise<WordOfDay> {
    if (USE_MOCK_API) return mockResponse(WORD_OF_DAY[language] ?? WORD_OF_DAY.en);
    return request<WordOfDay>(endpoints.wordOfDay, { query: { language } });
  },

  /** RF 11.2 */
  async phraseOfDay(language: LanguageCode): Promise<PhraseOfDay> {
    if (USE_MOCK_API) return mockResponse(PHRASE_OF_DAY[language] ?? PHRASE_OF_DAY.en);
    return request<PhraseOfDay>(endpoints.phraseOfDay, { query: { language } });
  },

  /** RF 11.1 */
  async challenge(language: LanguageCode): Promise<DailyChallenge> {
    if (USE_MOCK_API) return mockResponse(DAILY_CHALLENGE[language] ?? DAILY_CHALLENGE.en);
    return request<DailyChallenge>(endpoints.dailyChallenge, { query: { language } });
  },
};
