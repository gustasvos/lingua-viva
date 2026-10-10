import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  AudioPlayer,
  Badge,
  Button,
  Card,
  GradientHeader,
  IconButton,
  OptionButton,
  OptionState,
  Screen,
  ScreenHeader,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { gradients, useTheme } from '../../theme';

type ChallengeProps = NativeStackScreenProps<RootStackParamList, 'DailyChallenge'>;
type PhraseProps = NativeStackScreenProps<RootStackParamList, 'PhraseOfDay'>;

/** RF 11.1 — Desafio diário. */
export function DailyChallengeScreen({ navigation }: ChallengeProps) {
  const theme = useTheme();
  const { language } = useSettings();
  const state = useApi(() => api.daily.challenge(language), [language]);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Screen edges={false}>
      <AsyncContent state={state} loadingLabel="Carregando o desafio…">
        {challenge => {
          const isCorrect = selected === challenge.correctIndex;
          return (
            <>
              <GradientHeader colors={gradients.amber}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <IconButton icon="←" tone="light" onPress={navigation.goBack} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eyebrow}>HOJE</Text>
                    <Text style={styles.title}>Desafio diário</Text>
                  </View>
                  <Badge color="amber">+{challenge.xpReward} XP</Badge>
                </View>
                <Text style={styles.question}>{challenge.question}</Text>
              </GradientHeader>

              <ScreenScroll contentContainerStyle={{ padding: 20, gap: 12 }}>
                {challenge.options.map((option, index) => {
                  let optionState: OptionState = 'idle';
                  if (selected !== null) {
                    if (index === challenge.correctIndex) optionState = 'correct';
                    else if (index === selected) optionState = 'wrong';
                  }
                  return (
                    <OptionButton
                      key={index}
                      label={option}
                      state={optionState}
                      disabled={selected !== null}
                      onPress={() => setSelected(index)}
                    />
                  );
                })}

                {selected !== null ? (
                  <>
                    <Card
                      style={{
                        backgroundColor: isCorrect
                          ? theme.colors.successSoft
                          : theme.colors.warningSoft,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                        {isCorrect ? `🎉 Correto! +${challenge.xpReward} XP` : '💡 Não foi dessa vez'}
                      </Text>
                      {challenge.explanation ? (
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 8, lineHeight: 18 }}>
                          {challenge.explanation}
                        </Text>
                      ) : null}
                    </Card>
                    <Button fullWidth size="lg" onPress={() => navigation.goBack()}>
                      Voltar ao início
                    </Button>
                  </>
                ) : null}
              </ScreenScroll>
            </>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

/** RF 11.2 — Frase do dia com explicação e áudio. */
export function PhraseOfDayScreen({ navigation }: PhraseProps) {
  const theme = useTheme();
  const { language } = useSettings();
  const state = useApi(() => api.daily.phraseOfDay(language), [language]);
  const [playing, setPlaying] = useState(false);

  return (
    <Screen>
      <ScreenHeader title="Frase do dia" onBack={navigation.goBack} />
      <AsyncContent state={state} loadingLabel="Carregando…">
        {phrase => (
          <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
            <Card style={{ alignItems: 'center', paddingVertical: 32, gap: 12 }}>
              <Text style={{ fontSize: 34 }}>💬</Text>
              <Text style={[styles.phrase, { color: theme.colors.text }]}>{phrase.phrase}</Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted, textAlign: 'center' }}>
                {phrase.translation}
              </Text>
              <AudioPlayer size="lg" playing={playing} onPress={() => setPlaying(v => !v)} />
            </Card>

            <Card>
              <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, marginBottom: 8 }}>
                O que significa
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 21, color: theme.colors.textSecondary }}>
                {phrase.explanation}
              </Text>
            </Card>

            <Button
              fullWidth
              onPress={() =>
                Share.share({ message: `${phrase.phrase}\n\n${phrase.translation}` })
              }
            >
              📤 Compartilhar frase
            </Button>
          </ScreenScroll>
        )}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  question: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 16, lineHeight: 23 },
  phrase: { fontSize: 20, fontWeight: '800', textAlign: 'center', paddingHorizontal: 12 },
});
