import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Button,
  Card,
  EmptyState,
  MasteryBar,
  ProgressBar,
  Screen,
  ScreenHeader,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { Performance } from '../../services/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SpacedReview'>;

const RATINGS: { id: Performance; label: string; emoji: string }[] = [
  { id: 'hard', label: 'Difícil', emoji: '😰' },
  { id: 'okay', label: 'Quase', emoji: '😐' },
  { id: 'good', label: 'Lembrei', emoji: '😊' },
];

/** RF 8.3 — Revisão espaçada: a API escolhe as palavras pelo desempenho anterior. */
export function SpacedReviewScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();
  const words = useApi(() => api.review.spaced(language), [language]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const answer = (wordId: string, rating: Performance, total: number) => {
    api.review.rate(wordId, rating);
    setRevealed(false);
    if (index < total - 1) setIndex(value => value + 1);
    else setFinished(true);
  };

  return (
    <Screen background="plain">
      <ScreenHeader title="Revisão espaçada" onBack={navigation.goBack} />
      <AsyncContent
        state={words}
        loadingLabel="Selecionando palavras…"
        empty={
          <EmptyState
            icon="🎉"
            title="Nada para revisar"
            description="Você está em dia com as revisões. Volte amanhã."
          />
        }
      >
        {list => {
          if (finished) {
            return (
              <View style={styles.done}>
                <Text style={{ fontSize: 52, marginBottom: 12 }}>✅</Text>
                <Text style={[styles.doneTitle, { color: theme.colors.text }]}>
                  Revisão concluída
                </Text>
                <Text style={{ fontSize: 13, color: theme.colors.textMuted, marginBottom: 28, textAlign: 'center' }}>
                  As próximas datas de revisão foram recalculadas com base nas suas respostas.
                </Text>
                <Button size="lg" onPress={navigation.goBack}>
                  Voltar
                </Button>
              </View>
            );
          }

          const word = list[Math.min(index, list.length - 1)];
          return (
            <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
              <ProgressBar value={((index + 1) / list.length) * 100} />
              <Text style={{ fontSize: 12, color: theme.colors.textFaint, textAlign: 'center' }}>
                Palavra {index + 1} de {list.length}
              </Text>

              <Card style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
                <Badge color={word.lastPerformance === 'hard' ? 'red' : 'amber'}>
                  Próxima revisão: {word.nextReview}
                </Badge>
                <Text style={{ fontSize: 30, fontWeight: '800', color: theme.colors.primary }}>
                  {word.word}
                </Text>
                {word.phonetic ? (
                  <Text style={{ fontSize: 13, color: theme.colors.textFaint }}>
                    {word.phonetic}
                  </Text>
                ) : null}

                {revealed ? (
                  <Text style={{ fontSize: 19, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 8 }}>
                    {word.translation}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 13, color: theme.colors.textFaint, marginTop: 8 }}>
                    Tente lembrar antes de revelar
                  </Text>
                )}

                <View style={{ width: '100%', marginTop: 16 }}>
                  <MasteryBar value={word.mastery} />
                </View>
              </Card>

              {revealed ? (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {RATINGS.map(rating => (
                    <Button
                      key={rating.id}
                      style={{ flex: 1 }}
                      variant={
                        rating.id === 'good' ? 'success' : rating.id === 'hard' ? 'danger' : 'secondary'
                      }
                      onPress={() => answer(word.id, rating.id, list.length)}
                    >
                      {`${rating.emoji} ${rating.label}`}
                    </Button>
                  ))}
                </View>
              ) : (
                <Button size="lg" fullWidth onPress={() => setRevealed(true)}>
                  Revelar tradução
                </Button>
              )}
            </ScreenScroll>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  doneTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
});
