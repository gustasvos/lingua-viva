import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Button,
  OptionButton,
  OptionState,
  ProgressBar,
  Screen,
  ScreenHeader,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageReview'>;

/** RF 8.4 — Revisão por imagens. */
export function ImageReviewScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();
  const items = useApi(() => api.review.imageReview(language), [language]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const next = (total: number, correct: boolean) => {
    if (correct) setScore(value => value + 1);
    setSelected(null);
    if (index < total - 1) setIndex(value => value + 1);
    else setFinished(true);
  };

  return (
    <Screen background="plain">
      <ScreenHeader title="Revisão por imagens" onBack={navigation.goBack} />
      <AsyncContent state={items} loadingLabel="Carregando imagens…">
        {list => {
          if (finished) {
            return (
              <View style={styles.done}>
                <Text style={{ fontSize: 52, marginBottom: 12 }}>🖼️</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text }}>
                  {score} de {list.length} corretas
                </Text>
                <Button size="lg" style={{ marginTop: 28 }} onPress={navigation.goBack}>
                  Voltar
                </Button>
              </View>
            );
          }

          const item = list[Math.min(index, list.length - 1)];
          const isCorrect = selected === item.correctIndex;

          return (
            <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
              <ProgressBar value={((index + 1) / list.length) * 100} />
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.text, textAlign: 'center' }}>
                Qual palavra corresponde à imagem?
              </Text>

              <View style={{ gap: 12 }}>
                {item.options.map((option, optionIndex) => {
                  let state: OptionState = 'idle';
                  if (selected !== null) {
                    if (optionIndex === item.correctIndex) state = 'correct';
                    else if (optionIndex === selected) state = 'wrong';
                  }
                  return (
                    <OptionButton
                      key={optionIndex}
                      label={option}
                      state={state}
                      disabled={selected !== null}
                      onPress={() => setSelected(optionIndex)}
                    />
                  );
                })}
              </View>

              {selected !== null ? (
                <Button size="lg" fullWidth onPress={() => next(list.length, isCorrect)}>
                  {index < list.length - 1 ? 'Próxima' : 'Finalizar'}
                </Button>
              ) : null}
            </ScreenScroll>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 200, borderRadius: 24 },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
