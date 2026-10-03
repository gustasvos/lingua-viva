import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Remove o fundo/borda padrão (útil quando o card recebe um gradiente). */
  bare?: boolean;
};

export function Card({ children, onPress, padded = true, style, bare = false }: Props) {
  const theme = useTheme();
  const base: ViewStyle = {
    backgroundColor: bare ? 'transparent' : theme.colors.surface,
    borderRadius: theme.radius['2xl'],
    borderWidth: bare ? 0 : StyleSheet.hairlineWidth * 2,
    borderColor: theme.colors.border,
    padding: padded ? theme.spacing.lg : 0,
    overflow: 'hidden',
  };

  if (!onPress) return <View style={[base, style]}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [base, pressed && { transform: [{ scale: 0.985 }] }, style]}
    >
      {children}
    </Pressable>
  );
}
