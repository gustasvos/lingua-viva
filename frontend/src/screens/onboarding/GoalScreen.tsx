import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, CheckMark, SelectableCard } from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { OnboardingStep } from './OnboardingStep';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingGoal'>;

const GOALS = [
  { xp: 50, label: 'Leve', description: '5 min por dia', emoji: '🌱' },
  { xp: 100, label: 'Regular', description: '10 min por dia', emoji: '🌿' },
  { xp: 200, label: 'Sério', description: '20 min por dia', emoji: '💪' },
  { xp: 350, label: 'Intenso', description: '30 min por dia', emoji: '🔥' },
];

/** RF 9.4 — Meta diária de estudo (último passo da configuração). */
export function GoalScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const fromSettings = route.params?.fromSettings;
  const [selected, setSelected] = useState(settings.dailyGoalXP ?? 100);

  const confirm = () => {
    settings.update({ dailyGoalXP: selected, onboardingCompleted: true });
    if (fromSettings) navigation.goBack();
  };

  return (
    <OnboardingStep
      step={4}
      title="Defina sua meta diária"
      description="Quanto você quer estudar por dia? Dá para ajustar depois."
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      footer={
        <Button size="xl" fullWidth onPress={confirm}>
          {fromSettings ? 'Salvar meta' : '🚀 Começar a aprender'}
        </Button>
      }
    >
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {GOALS.map(goal => {
          const isSelected = selected === goal.xp;
          return (
            <SelectableCard key={goal.xp} selected={isSelected} onPress={() => setSelected(goal.xp)}>
              <View style={styles.row}>
                <Text style={{ fontSize: 24 }}>{goal.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>{goal.label}</Text>
                  <Text style={[styles.description, { color: theme.colors.textMuted }]}>
                    {goal.description}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: theme.colors.primary, fontWeight: '800', fontSize: 13 }}>
                    ⚡ {goal.xp} XP
                  </Text>
                  <Text style={{ color: theme.colors.textFaint, fontSize: 11 }}>por dia</Text>
                </View>
                {isSelected ? <CheckMark size={22} /> : null}
              </View>
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
  description: { fontSize: 12, marginTop: 2 },
});
