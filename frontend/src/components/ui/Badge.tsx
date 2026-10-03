import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AccentName, useTheme } from '../../theme';

export function Badge({
  children,
  color = 'violet',
  style,
}: {
  children: React.ReactNode;
  color?: AccentName;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const tone = theme.accents[color];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tone.bg, borderRadius: theme.radius.md },
        style,
      ]}
    >
      <Text style={[styles.text, { color: tone.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
