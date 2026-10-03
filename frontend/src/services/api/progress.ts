/** RF 9 — Progresso, metas e gamificação. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { ACHIEVEMENTS, USER_STATS, WEEKLY_REPORT } from '../mock/data';
import { Achievement, LanguageCode, UserStats, WeeklyReport } from '../types';

export const progressApi = {
  async stats(language: LanguageCode): Promise<UserStats> {
    if (USE_MOCK_API) return mockResponse(USER_STATS);
    return request<UserStats>(endpoints.stats, { query: { language } });
  },

  /** RF 9.10 */
  async achievements(language: LanguageCode): Promise<Achievement[]> {
    if (USE_MOCK_API) return mockResponse(ACHIEVEMENTS);
    return request<Achievement[]>(endpoints.achievements, { query: { language } });
  },

  /** RF 14.2 */
  async weeklyReport(language: LanguageCode): Promise<WeeklyReport> {
    if (USE_MOCK_API) return mockResponse(WEEKLY_REPORT);
    return request<WeeklyReport>(endpoints.weeklyReport, { query: { language } });
  },
};
