import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Button,
  IconButton,
  OptionButton,
  OptionState,
  ProgressBar,
  Screen,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { LevelId, LevelTestQuestion } from '../../services/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelTest'>;

const LEVEL_LABEL: Record<LevelId, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

/** RF 2.5 — Teste de nível inicial com recomendação do ponto de partida. */
export function LevelTestScreen({ navigation }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const questions = useApi(() => api.languages.levelTest(settings.language), [settings.language]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; level: LevelId } | null>(null);

  const finish = async (finalAnswers: number[], list: LevelTestQuestion[]) => {
    const response = await api.languages.submitLevelTest(settings.language, finalAnswers, list);
    setResult({ score: response.score, total: response.total, level: response.recommendedLevel });
  };

  const choose = (optionIndex: number, list: LevelTestQuestion[]) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const nextAnswers = [...answers, optionIndex];

    setTimeout(() => {
      setAnswers(nextAnswers);
      if (index < list.length - 1) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        finish(nextAnswers, list);
      }
    }, 800);
  };

  if (result) {
    return (
      <Screen background="plain">
        <View style={styles.resultContainer}>
          <Text style={{ fontSize: 56, marginBottom: 16 }}>🎯</Text>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
            Resultado: {LEVEL_LABEL[result.level]}
          </Text>
          <Text style={[styles.resultSubtitle, { color: theme.colors.textMuted }]}>
            Você acertou {result.score} de {result.total} questões.
          </Text>
          <Text style={[styles.resultHint, { color: theme.colors.primary }]}>
            Recomendamos começar no nível {LEVEL_LABEL[result.level]}.
          </Text>

          <Button
            size="lg"
            fullWidth
            onPress={() => {
              settings.update({ level: result.level });
              navigation.navigate('OnboardingDifficulty');
            }}
          >
            Aceitar recomendação
          </Button>
          <Pressable onPress={navigation.goBack} style={{ marginTop: 16 }}>
            <Text style={{ color: theme.colors.textFaint, fontSize: 13, fontWeight: '600' }}>
              Escolher manualmente
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen background="plain">
      <AsyncContent state={questions} loadingLabel="Preparando o teste…">
        {list => {
          const question = list[Math.min(index, list.length - 1)];
          return (
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <View style={styles.headerRow}>
                  <IconButton icon="←" onPress={navigation.goBack} />
                  <ProgressBar value={(index / list.length) * 100} style={{ flex: 1 }} />
                  <Text style={{ color: theme.colors.textFaint, fontSize: 12, fontWeight: '700' }}>
                    {index + 1}/{list.length}
                  </Text>
                </View>
                <Badge color="violet" style={{ marginTop: 16 }}>
                  Teste de nível
                </Badge>
                <Text style={[styles.question, { color: theme.colors.text }]}>
                  {question.prompt}
                </Text>
              </View>

              <View style={styles.options}>
                {question.options.map((option, optionIndex) => {
                  let state: OptionState = 'idle';
                  if (selected !== null) {
                    if (optionIndex === question.correctIndex) state = 'correct';
                    else if (optionIndex === selected) state = 'wrong';
                  }
                  return (
                    <OptionButton
                      key={optionIndex}
                      label={option}
                      state={state}
                      prefix={String.fromCharCode(65 + optionIndex)}
                      disabled={selected !== null}
                      onPress={() => choose(optionIndex, list)}
                    />
                  );
                })}
              </View>
            </View>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  question: { fontSize: 17, fontWeight: '700', marginTop: 12, lineHeight: 24 },
  options: { paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  resultTitle: { fontSize: 23, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  resultSubtitle: { fontSize: 13, marginBottom: 6 },
  resultHint: { fontSize: 13, fontWeight: '700', marginBottom: 32, textAlign: 'center' },
});
