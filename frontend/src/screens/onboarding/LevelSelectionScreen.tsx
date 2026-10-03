import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, CheckMark, SelectableCard } from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { LevelId } from '../../services/types';
import { useTheme } from '../../theme';
import { OnboardingStep } from './OnboardingStep';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingLevel'>;

const LEVELS: { id: LevelId; label: string; emoji: string; summary: string; detail: string }[] = [
  {
    id: 'beginner',
    label: 'Iniciante',
    emoji: '🌱',
    summary: 'Nunca aprendi ou sei poucas palavras',
    detail: 'Começamos do zero, com vocabulário básico e frases simples.',
  },
  {
    id: 'intermediate',
    label: 'Intermediário',
    emoji: '🌿',
    summary: 'Tenho a base e quero evoluir',
    detail: 'Ampliamos vocabulário e gramática com contextos reais.',
  },
  {
    id: 'advanced',
    label: 'Avançado',
    emoji: '🌳',
    summary: 'Já me comunico e busco fluência',
    detail: 'Expressões idiomáticas, nuances e conversação avançada.',
  },
];

/** RF 2.3 — organização por níveis. RF 2.5 — atalho para o teste de nível. */
export function LevelSelectionScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const fromSettings = route.params?.fromSettings;
  const [selected, setSelected] = useState<LevelId | null>(settings.level ?? null);

  const confirm = () => {
    if (!selected) return;
    settings.update({ level: selected });
    if (fromSettings) navigation.goBack();
    else navigation.navigate('OnboardingDifficulty');
  };

  return (
    <OnboardingStep
      step={2}
      title="Qual é o seu nível?"
      description={
        <Text style={{ fontSize: 13, color: theme.colors.textMuted, lineHeight: 19 }}>
          Não tem certeza? Faça o{' '}
          <Text
            onPress={() => navigation.navigate('LevelTest')}
            style={{ color: theme.colors.primary, fontWeight: '700' }}
          >
            teste de nível
          </Text>{' '}
          e receba uma recomendação.
        </Text>
      }
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      footer={
        <Button size="xl" fullWidth disabled={!selected} onPress={confirm}>
          {fromSettings ? 'Salvar nível' : 'Próximo'}
        </Button>
      }
    >
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {LEVELS.map(level => {
          const isSelected = selected === level.id;
          return (
            <SelectableCard
              key={level.id}
              selected={isSelected}
              onPress={() => setSelected(level.id)}
            >
              <View style={styles.row}>
                <Text style={{ fontSize: 24 }}>{level.emoji}</Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>{level.label}</Text>
                <View style={{ flex: 1 }} />
                {isSelected ? <CheckMark size={22} /> : null}
              </View>
              <Text style={[styles.summary, { color: theme.colors.textMuted }]}>
                {level.summary}
              </Text>
              {isSelected ? (
                <Text style={[styles.detail, { color: theme.colors.primarySoftText }]}>
                  {level.detail}
                </Text>
              ) : null}
            </SelectableCard>
          );
        })}

        <Pressable onPress={() => navigation.navigate('LevelTest')} style={{ paddingVertical: 8 }}>
          <Text style={{ textAlign: 'center', color: theme.colors.primary, fontWeight: '700', fontSize: 13 }}>
            🎯 Fazer teste de nível
          </Text>
        </Pressable>
      </ScrollView>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontSize: 15, fontWeight: '700' },
  summary: { fontSize: 12, marginTop: 6, marginLeft: 36 },
  detail: { fontSize: 12, marginTop: 8, marginLeft: 36, fontWeight: '600', lineHeight: 17 },
});
