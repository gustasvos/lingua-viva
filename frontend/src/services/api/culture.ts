/** RF 12.1 — Seção de Cultura. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { cultureFor } from '../mock/data';
import { CultureArticle, LanguageCode } from '../types';

export const cultureApi = {
  async list(language: LanguageCode, category?: string): Promise<CultureArticle[]> {
    if (USE_MOCK_API) {
      const items = cultureFor(language);
      return mockResponse(category ? items.filter(a => a.category === category) : items);
    }
    return request<CultureArticle[]>(endpoints.cultureArticles, {
      query: { language, category },
    });
  },

  async detail(id: string, language: LanguageCode): Promise<CultureArticle | null> {
    if (USE_MOCK_API) {
      return mockResponse(cultureFor(language).find(a => a.id === id) ?? null);
    }
    return request<CultureArticle>(endpoints.cultureArticle(id));
  },
};
