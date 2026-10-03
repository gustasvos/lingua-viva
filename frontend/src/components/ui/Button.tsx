import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const SIZES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 7, paddingHorizontal: 12, fontSize: 13 },
  md: { paddingVertical: 11, paddingHorizontal: 16, fontSize: 14 },
  lg: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
  xl: { paddingVertical: 17, paddingHorizontal: 32, fontSize: 17 },
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: Props) {
  const theme = useTheme();
  const sizing = SIZES[size];
  const isDisabled = disabled || loading;

  const variants: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: theme.colors.primary, fg: theme.colors.textOnPrimary },
    secondary: { bg: theme.colors.primarySoft, fg: theme.colors.primarySoftText },
    ghost: { bg: 'transparent', fg: theme.colors.textSecondary },
    danger: { bg: theme.colors.danger, fg: '#FFFFFF' },
    success: { bg: theme.colors.success, fg: '#FFFFFF' },
    outline: { bg: 'transparent', fg: theme.colors.primary, border: theme.colors.primary },
    inverse: { bg: '#FFFFFF', fg: theme.palette.violet700 },
  };
  const tone = variants[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: tone.bg,
          borderRadius: theme.radius.lg,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
          borderWidth: tone.border ? 2 : 0,
          borderColor: tone.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tone.fg} />
      ) : (
        <View style={styles.content}>
          {icon ? <Text style={{ fontSize: sizing.fontSize + 2 }}>{icon}</Text> : null}
          {typeof children === 'string' ? (
            <Text
              numberOfLines={1}
              style={[styles.label, { color: tone.fg, fontSize: sizing.fontSize }, textStyle]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '700',
  },
});
