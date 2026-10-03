/** RF 10 — Recursos sociais. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { QUESTIONS, RANKING, STUDY_GROUPS } from '../mock/data';
import { CommunityQuestion, LanguageCode, RankingEntry, StudyGroup } from '../types';

export const socialApi = {
  async ranking(language: LanguageCode): Promise<RankingEntry[]> {
    if (USE_MOCK_API) return mockResponse(RANKING);
    return request<RankingEntry[]>(endpoints.ranking, { query: { language } });
  },

  async groups(): Promise<StudyGroup[]> {
    if (USE_MOCK_API) return mockResponse(STUDY_GROUPS);
    return request<StudyGroup[]>(endpoints.groups);
  },

  async questions(language: LanguageCode): Promise<CommunityQuestion[]> {
    if (USE_MOCK_API) return mockResponse(QUESTIONS);
    return request<CommunityQuestion[]>(endpoints.questions, { query: { language } });
  },
};
