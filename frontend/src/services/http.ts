import { API_BASE_URL, MOCK_LATENCY } from './config';

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status = 0, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

let authToken: string | null = null;

/** Chamado pelo AuthContext ao entrar/sair. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const base = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  if (!query) return base;
  const params = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return params.length ? `${base}?${params.join('&')}` : base;
}

/** Cliente HTTP mínimo. Substitua por axios/react-query se preferir. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, headers, signal } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : null),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? safeJson(text) : null;

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ?? `Falha na requisição (${response.status})`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Resolve um valor mock respeitando a latência simulada. */
export function mockResponse<T>(value: T, latency = MOCK_LATENCY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), latency));
}
