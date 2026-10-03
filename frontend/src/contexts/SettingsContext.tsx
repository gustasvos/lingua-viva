import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeMode } from '../theme';
import { STORAGE_KEYS } from '../services/config';
import { DifficultyId, LanguageCode, LevelId } from '../services/types';

export type Settings = {
  /** RF 2.1 — idioma de aprendizado ativo. */
  language: LanguageCode;
  /** RF 2.2 — idioma secundário, quando houver. */
  secondaryLanguage: LanguageCode | null;
  /** RF 2.3 / 2.5 */
  level: LevelId;
  /** RF 2.4 */
  difficulty: DifficultyId;
  /** RF 9.4 — meta diária em XP. */
  dailyGoalXP: number;
  /** RF 12.2 / 12.3 */
  themeMode: ThemeMode;
  autoNightMode: boolean;
  /** RF 6.2 / 6.3 / 6.4 */
  autoPlayAudio: boolean;
  showSubtitles: boolean;
  slowAudio: boolean;
  /** RF 6.8 */
  speechSensitivity: 'strict' | 'tolerant';
  /** RF 1.3 */
  appLockEnabled: boolean;
  biometricEnabled: boolean;
  /** Já passou pelo fluxo de configuração inicial. */
  onboardingCompleted: boolean;
};

const DEFAULTS: Settings = {
  language: 'en',
  secondaryLanguage: null,
  level: 'beginner',
  difficulty: 'medium',
  dailyGoalXP: 100,
  themeMode: 'light',
  autoNightMode: false,
  autoPlayAudio: true,
  showSubtitles: true,
  slowAudio: false,
  speechSensitivity: 'tolerant',
  appLockEnabled: false,
  biometricEnabled: false,
  onboardingCompleted: false,
};

type SettingsContextValue = Settings & {
  ready: boolean;
  update: (changes: Partial<Settings>) => void;
  /** RF 2.2 — alterna entre principal e secundário sem perder progresso. */
  swapLanguages: () => void;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextValue>({} as SettingsContextValue);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
        if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) });
      } catch {
        // usa os padrões
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings)).catch(() => {});
  }, [settings, ready]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      ready,
      update: changes => setSettings(prev => ({ ...prev, ...changes })),
      swapLanguages: () =>
        setSettings(prev =>
          prev.secondaryLanguage
            ? { ...prev, language: prev.secondaryLanguage, secondaryLanguage: prev.language }
            : prev,
        ),
      reset: () => setSettings(DEFAULTS),
    }),
    [settings, ready],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
