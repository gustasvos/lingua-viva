/** RF 2 — Idiomas disponíveis e teste de nível. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { LANGUAGES, LEVEL_TEST } from '../mock/data';
import { Language, LanguageCode, LevelId, LevelTestQuestion, LevelTestResult } from '../types';

export const languagesApi = {
  /** RF 2.1 / 2.2 */
  async list(): Promise<Language[]> {
    if (USE_MOCK_API) return mockResponse(LANGUAGES);
    return request<Language[]>(endpoints.languages);
  },

  /** RF 2.5 — teste de nível inicial. */
  async levelTest(language: LanguageCode): Promise<LevelTestQuestion[]> {
    if (USE_MOCK_API) return mockResponse(LEVEL_TEST[language] ?? LEVEL_TEST.en);
    return request<LevelTestQuestion[]>(endpoints.levelTest(language));
  },

  async submitLevelTest(
    language: LanguageCode,
    answers: number[],
    questions: LevelTestQuestion[],
  ): Promise<LevelTestResult> {
    if (USE_MOCK_API) {
      const score = answers.reduce(
        (acc, answer, i) => acc + (questions[i] && answer === questions[i].correctIndex ? 1 : 0),
        0,
      );
      const recommendedLevel: LevelId =
        score <= 1 ? 'beginner' : score === 2 ? 'intermediate' : 'advanced';
      return mockResponse({ score, total: questions.length, recommendedLevel });
    }
    return request<LevelTestResult>(endpoints.levelTestSubmit(language), {
      method: 'POST',
      body: { answers },
    });
  },
};
