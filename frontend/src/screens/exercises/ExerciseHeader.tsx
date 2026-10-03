import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HelpButton, IconButton, ProgressBar } from '../../components/ui';
import { useTheme } from '../../theme';

export function ExerciseHeader({
  title,
  onClose,
  current = 1,
  total = 1,
  help,
}: {
  title: string;
  onClose: () => void;
  current?: number;
  total?: number;
  help?: string;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.row}>
        <IconButton icon="✕" accessibilityLabel="Sair do exercício" onPress={onClose} />
        <ProgressBar value={(current / total) * 100} style={{ flex: 1 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textFaint }}>
          {current}/{total}
        </Text>
        {help ? <HelpButton title={title} description={help} /> : null}
      </View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textMuted }}>{title}</Text>
    </View>
  );
}

/** Caixa de feedback (acerto/erro/explicação) reutilizada pelos exercícios. */
export function FeedbackBox({
  tone,
  title,
  description,
}: {
  tone: 'success' | 'error' | 'hint';
  title: string;
  description?: string;
}) {
  const theme = useTheme();
  const palette = {
    success: { bg: theme.colors.successSoft, border: theme.colors.successBorder, fg: theme.colors.successText },
    error: { bg: theme.colors.dangerSoft, border: theme.colors.dangerBorder, fg: theme.colors.dangerText },
    hint: { bg: theme.colors.warningSoft, border: theme.colors.warningBorder, fg: theme.colors.warningText },
  }[tone];

  return (
    <View
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: theme.radius.lg,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '800', color: palette.fg }}>{title}</Text>
      {description ? (
        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 6, lineHeight: 18 }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
