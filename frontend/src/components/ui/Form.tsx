import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const theme = useTheme();
  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: error ? theme.colors.dangerBorder : theme.colors.borderStrong,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        {icon ? <Text style={styles.inputIcon}>{icon}</Text> : null}
        <TextInput
          placeholderTextColor={theme.colors.textFaint}
          style={[styles.input, { color: theme.colors.text }, style]}
          {...rest}
        />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={8}>
            <Text style={styles.inputIcon}>{rightIcon}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

export function TextArea({ style, ...props }: TextInputProps) {
  const theme = useTheme();
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={theme.colors.textFaint}
      style={[
        styles.textArea,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderStrong,
          borderRadius: theme.radius.lg,
          color: theme.colors.text,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function Chip({
  children,
  active = false,
  onPress,
}: {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: theme.radius.md,
        backgroundColor: active ? theme.colors.primary : theme.colors.surfaceStrong,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: active ? theme.colors.textOnPrimary : theme.colors.textSecondary,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={{
        width: 48,
        height: 26,
        borderRadius: 13,
        padding: 3,
        justifyContent: 'center',
        backgroundColor: value ? theme.colors.primary : theme.colors.borderStrong,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          alignSelf: value ? 'flex-end' : 'flex-start',
        }}
      />
    </Pressable>
  );
}

export type OptionState = 'idle' | 'correct' | 'wrong' | 'selected';

/**
 * Alternativa de quiz usada por todos os exercícios (RF 5).
 * Concentra aqui as cores de acerto/erro para manter o feedback consistente.
 */
export function OptionButton({
  label,
  state = 'idle',
  onPress,
  prefix,
  disabled,
  style,
  textStyle,
}: {
  label: string;
  state?: OptionState;
  onPress?: () => void;
  /** Letra (A, B, C…) ou ícone mostrado à esquerda. */
  prefix?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  const theme = useTheme();

  const tones: Record<OptionState, { bg: string; border: string; fg: string }> = {
    idle: {
      bg: theme.colors.surface,
      border: theme.colors.border,
      fg: theme.colors.textSecondary,
    },
    selected: {
      bg: theme.colors.primarySurface,
      border: theme.colors.primary,
      fg: theme.colors.primarySoftText,
    },
    correct: {
      bg: theme.colors.successSoft,
      border: theme.colors.successBorder,
      fg: theme.colors.successText,
    },
    wrong: {
      bg: theme.colors.dangerSoft,
      border: theme.colors.dangerBorder,
      fg: theme.colors.dangerText,
    },
  };
  const tone = tones[state];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
          borderRadius: theme.radius.lg,
          transform: [{ scale: pressed && !disabled ? 0.99 : 1 }],
        },
        style,
      ]}
    >
      {prefix ? (
        <View
          style={[
            styles.optionPrefix,
            {
              backgroundColor:
                state === 'correct'
                  ? theme.colors.success
                  : state === 'wrong'
                    ? theme.palette.red400
                    : theme.colors.surfaceStrong,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '800',
              color: state === 'idle' ? theme.colors.textMuted : '#FFFFFF',
            }}
          >
            {prefix}
          </Text>
        </View>
      ) : null}
      <Text style={[styles.optionLabel, { color: tone.fg }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

/** Cartão de escolha usado no onboarding (idioma, nível, dificuldade, meta). */
export function SelectableCard({
  selected,
  onPress,
  children,
  style,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderWidth: 2,
          borderRadius: theme.radius['2xl'],
          padding: theme.spacing.lg,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          backgroundColor: selected ? theme.colors.primarySurface : theme.colors.surface,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

export function CheckMark({ size = 24 }: { size?: number }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.5, fontWeight: '800' }}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 8,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, fontWeight: '500' },
  inputIcon: { fontSize: 15 },
  error: { fontSize: 11, marginTop: 4 },
  textArea: { borderWidth: 1, padding: 14, fontSize: 14, minHeight: 96 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    padding: 14,
  },
  optionPrefix: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  optionLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
});
