import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  setData: (value: T | null) => void;
};

/**
 * Executa uma chamada de API e expõe loading/erro/dados.
 *
 * As telas usam este hook em vez de importar dados estáticos, então quando a
 * API real entrar no lugar dos mocks nada muda na camada de interface.
 *
 *   const { data: licoes, loading } = useApi(
 *     () => api.lessons.list({ language }),
 *     [language],
 *   );
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: { enabled?: boolean } = {},
): AsyncState<T> {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);
  const mounted = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef
      .current()
      .then(result => {
        if (!cancelled && mounted.current) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled && mounted.current) {
          setError(err instanceof Error ? err : new Error('Falha ao carregar os dados'));
        }
      })
      .finally(() => {
        if (!cancelled && mounted.current) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce, enabled]);

  const refetch = useCallback(() => setNonce(n => n + 1), []);

  return { data, loading, error, refetch, setData };
}

/** Versão para ações disparadas pelo usuário (salvar, enviar, etc.). */
export function useAsyncAction<Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (...args: Args): Promise<R | null> => {
      setLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Falha na operação'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { run, loading, error };
}
