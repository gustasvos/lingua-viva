/** RF 8 — Revisão e retenção. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { flashcardsFor, imageReviewFor, spacedReviewFor } from '../mock/data';
import { Flashcard, ImageReviewItem, LanguageCode, Performance, SpacedReviewWord } from '../types';

export const reviewApi = {
  /** RF 8.1 / 8.2 */
  async flashcards(language: LanguageCode): Promise<Flashcard[]> {
    if (USE_MOCK_API) return mockResponse(flashcardsFor(language));
    return request<Flashcard[]>(endpoints.flashcards, { query: { language } });
  },

  /** RF 8.3 — repetição espaçada baseada no desempenho anterior. */
  async spaced(language: LanguageCode): Promise<SpacedReviewWord[]> {
    if (USE_MOCK_API) return mockResponse(spacedReviewFor(language));
    return request<SpacedReviewWord[]>(endpoints.spacedReview, { query: { language } });
  },

  /** RF 8.4 */
  async imageReview(language: LanguageCode): Promise<ImageReviewItem[]> {
    if (USE_MOCK_API) return mockResponse(imageReviewFor(language));
    return request<ImageReviewItem[]>(endpoints.imageReview, { query: { language } });
  },

  /** Envia a autoavaliação do cartão; o backend recalcula o próximo intervalo. */
  async rate(wordId: string, rating: Performance): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 100);
    await request(endpoints.reviewRating, { method: 'POST', body: { wordId, rating } });
  },
};
