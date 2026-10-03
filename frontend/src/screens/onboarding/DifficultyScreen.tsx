import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, CheckMark, SelectableCard } from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { DifficultyId } from '../../services/types';
import { useTheme } from '../../theme';
import { OnboardingStep } from './OnboardingStep';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingDifficulty'>;

const OPTIONS: { id: DifficultyId; label: string; emoji: string; summary: string; detail: string }[] = [
  {
    id: 'easy',
    label: 'Fácil',
    emoji: '😊',
    summary: 'Sessões curtas, ritmo tranquilo',
    detail: '5 min/dia · vocabulário gradual · revisão frequente',
  },
  {
    id: 'medium',
    label: 'Médio',
    emoji: '💪',
    summary: 'Ritmo equilibrado para estudo constante',
    detail: '15 min/dia · gramática introduzida · desafios moderados',
  },
  {
    id: 'hard',
    label: 'Difícil',
    emoji: '🔥',
    summary: 'Intenso, para aprender rápido',
    detail: '30 min/dia · gramática avançada · alta exigência',
  },
];

/** RF 2.4 — Seleção de dificuldade do conteúdo. */
export function DifficultyScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const fromSettings = route.params?.fromSettings;
  const [selected, setSelected] = useState<DifficultyId | null>(settings.difficulty ?? null);

  const confirm = () => {
    if (!selected) return;
    settings.update({ difficulty: selected });
    if (fromSettings) navigation.goBack();
    else navigation.navigate('OnboardingGoal');
  };

  return (
    <OnboardingStep
      step={3}
      title="Qual a dificuldade?"
      description="Você pode alterar isso quando quiser nas configurações."
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      footer={
        <Button size="xl" fullWidth disabled={!selected} onPress={confirm}>
          {fromSettings ? 'Salvar dificuldade' : 'Próximo'}
        </Button>
      }
    >
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {OPTIONS.map(option => {
          const isSelected = selected === option.id;
          return (
            <SelectableCard
              key={option.id}
              selected={isSelected}
              onPress={() => setSelected(option.id)}
            >
              <View style={styles.row}>
                <Text style={{ fontSize: 24 }}>{option.emoji}</Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>{option.label}</Text>
                <View style={{ flex: 1 }} />
                {isSelected ? <CheckMark size={22} /> : null}
              </View>
              <Text style={[styles.summary, { color: theme.colors.textMuted }]}>
                {option.summary}
              </Text>
              {isSelected ? (
                <Text style={[styles.detail, { color: theme.colors.primarySoftText }]}>
                  {option.detail}
                </Text>
              ) : null}
            </SelectableCard>
          );
        })}
      </ScrollView>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontSize: 15, fontWeight: '700' },
  summary: { fontSize: 12, marginTop: 6, marginLeft: 36 },
  detail: { fontSize: 12, marginTop: 8, marginLeft: 36, fontWeight: '600' },
});
