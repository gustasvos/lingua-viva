import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { STORAGE_KEYS } from '../services/config';
import { setAuthToken } from '../services/http';
import { AuthSession, LoginPayload, RegisterPayload, User } from '../services/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


type AuthContextValue = {
  user: User | null;
  /** Ainda lendo a sessão salva no dispositivo. */
  initializing: boolean;
  signingIn: boolean;
  error: string | null;
  signIn: (payload: LoginPayload) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signUp: (payload: RegisterPayload) => Promise<boolean>;
  /** "Explorar sem cadastro": sessão local, sem token. */
  continueAsGuest: () => void;
  isGuest: boolean;
  signOut: () => Promise<void>;
  /** RF 1.3 — trava do app já satisfeita nesta sessão. */
  unlocked: boolean;
  markUnlocked: () => void;
  lock: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.session);
        if (raw) {
          const session = JSON.parse(raw) as AuthSession;
          setAuthToken(session.token);
          setUser(session.user);
        }
      } catch {
        // sessão inválida: segue como visitante
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({ webClientId: '521064247308-n8hum167s7gf0a2umefojslujv9gpogb.apps.googleusercontent.com' });
  }, []);

  const persist = useCallback(async (session: AuthSession) => {
    setAuthToken(session.token);
    setUser(session.user);
    setUnlocked(true);
    await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  }, []);

  const runAuth = useCallback(
    async (operation: () => Promise<AuthSession>) => {
      setSigningIn(true);
      setError(null);
      try {
        const session = await operation();
        await persist(session);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível entrar. Tente novamente.');
        return false;
      } finally {
        setSigningIn(false);
      }
    },
    [persist],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      signingIn,
      error,
      unlocked,
      signIn: payload => runAuth(() => api.auth.login(payload)),
      signInWithGoogle: () => runAuth(() => api.auth.loginWithGoogle()),
      signUp: payload => runAuth(() => api.auth.register(payload)),
      continueAsGuest: () => {
        setAuthToken(null);
        setUser({ id: 'guest', name: 'Visitante', email: '', avatar: '🙂' });
        setUnlocked(true);
      },
      isGuest: user?.id === 'guest',
      signOut: async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEYS.session);
          const refreshToken = raw ? (JSON.parse(raw) as AuthSession).refreshToken : undefined;
          await api.auth.logout(refreshToken);
        } catch {
          // mesmo se o servidor falhar, limpamos a sessão local
        }
        setAuthToken(null);
        setUser(null);
        setUnlocked(false);
        await AsyncStorage.removeItem(STORAGE_KEYS.session);
      },
      markUnlocked: () => setUnlocked(true),
      lock: () => setUnlocked(false),
      clearError: () => setError(null),
    }),
    [user, initializing, signingIn, error, unlocked, runAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
