import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, IconButton, ProgressBar, Screen } from '../../components/ui';
import { useTheme } from '../../theme';

/** Cabeçalho compartilhado pelos 4 passos de configuração (RF 2). */
export function OnboardingStep({
  step,
  totalSteps = 4,
  title,
  description,
  onBack,
  children,
  footer,
}: {
  step: number;
  totalSteps?: number;
  title: string;
  description?: React.ReactNode;
  onBack?: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Screen background="plain">
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack ? <IconButton icon="←" onPress={onBack} /> : null}
          <Text style={[styles.stepLabel, { color: theme.colors.textFaint }]}>
            Passo {step} de {totalSteps}
          </Text>
          <View style={{ flex: 1 }} />
          <Badge color="violet">Configuração</Badge>
        </View>
        <ProgressBar value={(step / totalSteps) * 100} height={6} style={{ marginVertical: 16 }} />
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {typeof description === 'string' ? (
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>{description}</Text>
        ) : (
          description
        )}
      </View>

      <View style={{ flex: 1 }}>{children}</View>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>{footer}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepLabel: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 23, fontWeight: '800', marginBottom: 4 },
  description: { fontSize: 13, lineHeight: 19 },
  footer: { paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
