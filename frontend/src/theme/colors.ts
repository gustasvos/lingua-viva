/**
 * Paleta base (equivalente aos tokens do Tailwind usados no protótipo web).
 * Mantida separada dos temas para facilitar ajustes de marca em um só lugar.
 */
export const palette = {
  violet50: '#F5F3FF',
  violet100: '#EDE9FE',
  violet200: '#DDD6FE',
  violet300: '#C4B5FD',
  violet400: '#A78BFA',
  violet500: '#8B5CF6',
  violet600: '#7C3AED',
  violet700: '#6D28D9',
  violet900: '#4C1D95',

  purple400: '#C084FC',
  purple600: '#9333EA',
  purple700: '#7E22CE',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',

  emerald50: '#ECFDF5',
  emerald100: '#D1FAE5',
  emerald400: '#34D399',
  emerald500: '#10B981',
  emerald600: '#059669',
  emerald700: '#047857',

  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber300: '#FCD34D',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  amber600: '#D97706',
  amber700: '#B45309',

  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626',
  red700: '#B91C1C',

  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',

  cyan400: '#22D3EE',
  cyan500: '#06B6D4',
  cyan600: '#0891B2',

  orange100: '#FFEDD5',
  orange500: '#F97316',
  orange600: '#EA580C',
  orange700: '#C2410C',

  teal500: '#14B8A6',
  teal600: '#0D9488',

  rose400: '#FB7185',

  white: '#FFFFFF',
  black: '#000000',
};

export type AccentName =
  | 'violet'
  | 'amber'
  | 'emerald'
  | 'red'
  | 'blue'
  | 'gray'
  | 'orange';

type AccentTone = { bg: string; fg: string };

export const lightColors = {
  /** Fundo das telas com conteúdo em cards. */
  background: palette.violet50,
  /** Fundo das telas "cheias" (onboarding, exercícios, lição). */
  backgroundPlain: palette.white,
  /** Fundo levemente acinzentado usado em listas internas. */
  backgroundMuted: palette.gray50,
  surface: palette.white,
  surfaceMuted: palette.gray50,
  surfaceStrong: palette.gray100,
  border: palette.gray100,
  borderStrong: palette.gray200,

  text: palette.gray900,
  textSecondary: palette.gray700,
  textMuted: palette.gray500,
  textFaint: palette.gray400,
  textOnPrimary: palette.white,

  primary: palette.violet600,
  primaryDark: palette.violet700,
  primarySoft: palette.violet100,
  primarySoftText: palette.violet700,
  primarySurface: palette.violet50,

  success: palette.emerald500,
  successSoft: palette.emerald50,
  successBorder: palette.emerald500,
  successText: palette.emerald700,

  warning: palette.amber500,
  warningSoft: palette.amber50,
  warningBorder: palette.amber100,
  warningText: palette.amber700,

  danger: palette.red500,
  dangerSoft: palette.red50,
  dangerBorder: palette.red400,
  dangerText: palette.red600,

  info: palette.blue500,
  infoSoft: palette.blue50,
  infoText: palette.blue700,

  overlay: 'rgba(0,0,0,0.5)',
  translucent: 'rgba(255,255,255,0.15)',
  translucentStrong: 'rgba(255,255,255,0.2)',
  skeleton: palette.gray200,
};

export const darkColors: typeof lightColors = {
  background: palette.slate950,
  backgroundPlain: palette.slate900,
  backgroundMuted: palette.slate950,
  surface: palette.slate800,
  surfaceMuted: palette.slate700,
  surfaceStrong: palette.slate700,
  border: palette.slate800,
  borderStrong: palette.slate700,

  text: palette.white,
  textSecondary: '#E2E8F0',
  textMuted: palette.gray400,
  textFaint: '#64748B',
  textOnPrimary: palette.white,

  primary: palette.violet600,
  primaryDark: palette.violet700,
  primarySoft: 'rgba(76,29,149,0.4)',
  primarySoftText: palette.violet300,
  primarySurface: 'rgba(76,29,149,0.2)',

  success: palette.emerald500,
  successSoft: 'rgba(6,78,59,0.25)',
  successBorder: palette.emerald600,
  successText: '#6EE7B7',

  warning: palette.amber500,
  warningSoft: 'rgba(120,53,15,0.25)',
  warningBorder: 'rgba(146,64,14,0.6)',
  warningText: palette.amber400,

  danger: palette.red500,
  dangerSoft: 'rgba(127,29,29,0.25)',
  dangerBorder: palette.red400,
  dangerText: '#FCA5A5',

  info: palette.blue500,
  infoSoft: 'rgba(30,58,138,0.25)',
  infoText: '#93C5FD',

  overlay: 'rgba(0,0,0,0.6)',
  translucent: 'rgba(255,255,255,0.15)',
  translucentStrong: 'rgba(255,255,255,0.2)',
  skeleton: palette.slate700,
};

export const lightAccents: Record<AccentName, AccentTone> = {
  violet: { bg: palette.violet100, fg: palette.violet700 },
  amber: { bg: palette.amber100, fg: palette.amber700 },
  emerald: { bg: palette.emerald100, fg: palette.emerald700 },
  red: { bg: palette.red100, fg: palette.red700 },
  blue: { bg: palette.blue100, fg: palette.blue700 },
  gray: { bg: palette.gray100, fg: palette.gray600 },
  orange: { bg: palette.orange100, fg: palette.orange700 },
};

export const darkAccents: Record<AccentName, AccentTone> = {
  violet: { bg: 'rgba(76,29,149,0.4)', fg: palette.violet300 },
  amber: { bg: 'rgba(120,53,15,0.4)', fg: palette.amber300 },
  emerald: { bg: 'rgba(6,78,59,0.4)', fg: '#6EE7B7' },
  red: { bg: 'rgba(127,29,29,0.4)', fg: '#FCA5A5' },
  blue: { bg: 'rgba(30,58,138,0.4)', fg: '#93C5FD' },
  gray: { bg: palette.slate700, fg: palette.gray400 },
  orange: { bg: 'rgba(124,45,18,0.4)', fg: '#FDBA74' },
};

/** Gradientes reutilizados nos cabeçalhos e CTAs. */
export const gradients = {
  brand: [palette.violet700, palette.violet600, palette.purple600] as const,
  brandSoft: [palette.violet600, palette.purple600] as const,
  brandDeep: [palette.violet700, palette.purple700] as const,
  amber: [palette.amber500, palette.orange500] as const,
  culture: [palette.blue600, palette.cyan600] as const,
  review: [palette.blue500, palette.cyan500] as const,
  success: [palette.emerald500, palette.teal500] as const,
};
