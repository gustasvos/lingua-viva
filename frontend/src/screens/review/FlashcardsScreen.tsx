import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Button,
  Card,
  ProgressBar,
  Screen,
  ScreenHeader,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { Performance } from '../../services/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Flashcards'>;

const RATINGS: { id: Performance; label: string; emoji: string }[] = [
  { id: 'hard', label: 'Difícil', emoji: '😰' },
  { id: 'okay', label: 'Ok', emoji: '😐' },
  { id: 'good', label: 'Fácil', emoji: '😊' },
];

/** RF 8.1 e 8.2 — Flashcards com animação de virar o cartão. */
export function FlashcardsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();
  const cards = useApi(() => api.review.flashcards(language), [language]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Performance>>({});
  const [done, setDone] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;

  const flip = () => {
    Animated.timing(rotation, {
      toValue: flipped ? 0 : 1,
      duration: 450,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    setFlipped(value => !value);
  };

  const frontStyle = {
    transform: [
      {
        rotateY: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }),
      },
    ],
    opacity: rotation.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] }),
  };

  const backStyle = {
    transform: [
      {
        rotateY: rotation.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }),
      },
    ],
    opacity: rotation.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [0, 0, 1, 1] }),
  };

  const rate = (cardId: string, rating: Performance, total: number) => {
    setRatings(prev => ({ ...prev, [cardId]: rating }));
    api.review.rate(cardId, rating);
    rotation.setValue(0);
    setFlipped(false);
    if (index < total - 1) setIndex(value => value + 1);
    else setDone(true);
  };

  if (done) {
    const values = Object.values(ratings);
    const counts = {
      good: values.filter(v => v === 'good').length,
      okay: values.filter(v => v === 'okay').length,
      hard: values.filter(v => v === 'hard').length,
    };
    return (
      <Screen background="plain">
        <ScreenHeader title="Resultado" onBack={navigation.goBack} />
        <View style={styles.result}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>🃏</Text>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>Revisão concluída</Text>
          <Text style={{ fontSize: 13, color: theme.colors.textMuted, marginBottom: 24 }}>
            Você revisou {values.length} cartões
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {RATINGS.map(rating => (
              <Card key={rating.id} style={styles.resultCard}>
                <Text style={{ fontSize: 26 }}>{rating.emoji}</Text>
                <Text style={{ fontSize: 19, fontWeight: '800', color: theme.colors.text }}>
                  {counts[rating.id]}
                </Text>
                <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>{rating.label}</Text>
              </Card>
            ))}
          </View>

          <Button size="lg" style={{ marginTop: 32 }} onPress={navigation.goBack}>
            Voltar para revisão
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen background="plain">
      <AsyncContent state={cards} loadingLabel="Preparando os cartões…">
        {list => {
          const card = list[Math.min(index, list.length - 1)];
          return (
            <View style={{ flex: 1 }}>
              <ScreenHeader
                title="Flashcards"
                subtitle={`Cartão ${index + 1} de ${list.length}`}
                onBack={navigation.goBack}
              />
              <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                <ProgressBar value={((index + 1) / list.length) * 100} />
              </View>

              <View style={styles.cardArea}>
                <Pressable onPress={flip} style={{ width: '100%', height: 280 }}>
                  <Animated.View
                    style={[
                      styles.flipCard,
                      { backgroundColor: theme.colors.primarySurface },
                      frontStyle,
                    ]}
                  >
                    <Badge color="violet">Toque para revelar</Badge>
                    <Text style={[styles.cardFront, { color: theme.colors.primarySoftText }]}>
                      {card.front}
                    </Text>
                    {card.phonetic ? (
                      <Text style={{ fontSize: 13, color: theme.colors.textFaint }}>
                        {card.phonetic}
                      </Text>
                    ) : null}
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.flipCard,
                      styles.flipBack,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
                      backStyle,
                    ]}
                  >
                    <Badge color="emerald">Tradução</Badge>
                    <Text style={[styles.cardBack, { color: theme.colors.text }]}>{card.back}</Text>
                  </Animated.View>
                </Pressable>
              </View>

              <View style={styles.footer}>
                {flipped ? (
                  <>
                    <Text style={{ fontSize: 12, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 12 }}>
                      Quão fácil foi lembrar?
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      {RATINGS.map(rating => (
                        <Button
                          key={rating.id}
                          style={{ flex: 1 }}
                          variant={
                            rating.id === 'good'
                              ? 'success'
                              : rating.id === 'hard'
                                ? 'danger'
                                : 'secondary'
                          }
                          onPress={() => rate(card.id, rating.id, list.length)}
                        >
                          {`${rating.emoji} ${rating.label}`}
                        </Button>
                      ))}
                    </View>
                  </>
                ) : (
                  <Button size="lg" fullWidth variant="secondary" onPress={flip}>
                    Revelar tradução
                  </Button>
                )}
              </View>
            </View>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  flipCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backfaceVisibility: 'hidden',
  },
  flipBack: { borderWidth: 2 },
  cardFront: { fontSize: 32, fontWeight: '800', textAlign: 'center', paddingHorizontal: 16 },
  cardBack: { fontSize: 26, fontWeight: '800', textAlign: 'center', paddingHorizontal: 16 },
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  resultTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  resultCard: { alignItems: 'center', gap: 4, width: 92 },
});
