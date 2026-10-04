import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle, Image } from 'react-native';
import { AccentName, useTheme } from '../../theme';
import { Badge } from './Badge';
import { LevelId } from '../../services/types';

export function ProgressBar({
  value,
  max = 100,
  height = 8,
  color,
  trackColor,
  style,
}: {
  value: number;
  max?: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const pct = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(pct), min: 0, max: 100 }}
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: trackColor ?? theme.colors.primarySoft,
          overflow: 'hidden',
          width: '100%',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color ?? theme.colors.primary,
        }}
      />
    </View>
  );
}

/** Barra de domínio do vocabulário, com cor derivada do valor. */
export function MasteryBar({ value, showValue = true }: { value: number; showValue?: boolean }) {
  const theme = useTheme();
  const color =
    value >= 80 ? theme.colors.success : value >= 50 ? theme.colors.warning : theme.palette.red400;
  return (
    <View style={styles.row}>
      <ProgressBar
        value={value}
        height={6}
        color={color}
        trackColor={theme.colors.borderStrong}
        style={{ flex: 1 }}
      />
      {showValue ? (
        <Text style={[styles.masteryValue, { color: theme.colors.textMuted }]}>{value}%</Text>
      ) : null}
    </View>
  );
}

export function XPBadge({ xp, large = false }: { xp: number; large?: boolean }) {
  const theme = useTheme();
  return (
    <Text style={{ color: theme.palette.amber600, fontWeight: '800', fontSize: large ? 18 : 13 }}>
      ⚡ {xp} XP
    </Text>
  );
}

export function StreakBadge({ streak }: { streak: number }) {
  const theme = useTheme();
  return (
    <Text style={{ color: theme.palette.orange500, fontWeight: '800', fontSize: 13 }}>
      🔥 {streak}
    </Text>
  );
}

const LEVEL_LABELS: Record<LevelId, { label: string; color: AccentName }> = {
  beginner: { label: 'Iniciante', color: 'emerald' },
  intermediate: { label: 'Intermediário', color: 'amber' },
  advanced: { label: 'Avançado', color: 'red' },
};

export function LevelChip({ level }: { level: LevelId }) {
  const config = LEVEL_LABELS[level] ?? { label: level, color: 'gray' as AccentName };
  return <Badge color={config.color}>{config.label}</Badge>;
}

/**
 * Botão de áudio.
 * TODO (RF 6.1): trocar o estado visual por reprodução real com expo-av,
 * usando a `audioUrl` que a API devolver.
 */
export function AudioPlayer({
  playing = false,
  onPress,
  size = 'md',
}: {
  playing?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const theme = useTheme();
  const dimension = size === 'sm' ? 32 : size === 'lg' ? 56 : 40;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Parar áudio' : 'Ouvir pronúncia'}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: playing ? theme.colors.primary : theme.colors.primarySoft,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
      ]}
    >
      {playing ? (
        <View style={styles.wave}>
          {[10, 16, 8, 14, 11].map((h, i) => (
            <View
              key={i}
              style={{ width: 3, height: h, borderRadius: 2, backgroundColor: '#FFFFFF' }}
            />
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: dimension * 0.42 }}>🔊</Text>
      )}
    </Pressable>
  );
}

export function Avatar({ emoji, size = 'md' }: { emoji: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const theme = useTheme();
  const dimension = { sm: 32, md: 40, lg: 48, xl: 64 }[size];
  const isUrl = /^https?:\/\//.test(emoji);

  return (
    <View
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {isUrl ? (
        <Image source={{ uri: emoji }} style={{ width: dimension, height: dimension }} />
      ) : (
        <Text style={{ fontSize: dimension * 0.5 }}>{emoji}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  masteryValue: { fontSize: 11, fontWeight: '700', width: 34, textAlign: 'right' },
  wave: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 16 },
});
