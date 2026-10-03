import Constants from 'expo-constants';

type Extra = { apiBaseUrl?: string; useMockApi?: boolean };

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

/**
 * Configuração do acesso a dados.
 *
 * Enquanto `USE_MOCK_API` for true, todos os módulos de src/services/api
 * respondem com os dados de src/services/mock. Quando a sua API estiver no ar:
 *
 *   1. troque `useMockApi` para false em app.json (ou defina EXPO_PUBLIC_USE_MOCK_API=false);
 *   2. aponte `apiBaseUrl` para o seu backend;
 *   3. confira os caminhos em src/services/endpoints.ts.
 *
 * Nenhuma tela precisa ser alterada: todas consomem os módulos de api/.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? 'https://api.linguaviva.local';

export const USE_MOCK_API =
  process.env.EXPO_PUBLIC_USE_MOCK_API != null
    ? process.env.EXPO_PUBLIC_USE_MOCK_API === 'true'
    : extra.useMockApi !== false;

/** Atraso artificial (ms) para as respostas mock, simulando rede. */
export const MOCK_LATENCY = 350;

export const STORAGE_KEYS = {
  session: '@linguaviva/session',
  settings: '@linguaviva/settings',
  dictionaryHistory: '@linguaviva/dictionary-history',
  lessonOrder: '@linguaviva/lesson-order',
};
