/** RF 13 — Conteúdo offline, loja interna e importação/exportação. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { OFFLINE_PACKS, STORE_PACKS } from '../mock/data';
import { ContentPack } from '../types';

export const packsApi = {
  async offline(): Promise<ContentPack[]> {
    if (USE_MOCK_API) return mockResponse(OFFLINE_PACKS);
    return request<ContentPack[]>(endpoints.offlinePacks);
  },

  async store(): Promise<ContentPack[]> {
    if (USE_MOCK_API) return mockResponse(STORE_PACKS);
    return request<ContentPack[]>(endpoints.storePacks);
  },

  /**
   * RF 13.1 — inicia o download de um pacote.
   * TODO: usar expo-file-system (createDownloadResumable) para baixar de fato
   * e reportar progresso; aqui apenas simulamos.
   */
  async download(id: string, onProgress?: (progress: number) => void): Promise<void> {
    if (USE_MOCK_API) {
      return new Promise(resolve => {
        let progress = 0;
        const timer = setInterval(() => {
          progress += 15;
          if (progress >= 100) {
            clearInterval(timer);
            onProgress?.(100);
            resolve();
          } else {
            onProgress?.(progress);
          }
        }, 400);
      });
    }
    await request(endpoints.packDownload(id), { method: 'POST' });
    onProgress?.(100);
  },
};
