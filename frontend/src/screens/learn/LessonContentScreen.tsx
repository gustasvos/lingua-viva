import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Button,
  Card,
  HelpButton,
  IconButton,
  ProgressBar,
  Screen,
  ScreenScroll,
  TextArea,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { LessonStep } from '../../services/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonContent'>;

/** RF 2.3 e RF 5 — conteúdo da lição, passo a passo, com exercícios intercalados. */
export function LessonContentScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { lessonId, lessonTitle } = route.params;
  const { language, autoPlayAudio, showSubtitles } = useSettings();

  const steps = useApi(() => api.lessons.steps(lessonId, language), [lessonId, language]);
  const lesson = useApi(() => api.lessons.detail(lessonId, language), [lessonId, language]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlayAudio);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

  const toggle = (set: Set<string>, id: string, update: (next: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update(next);
  };

  const goNext = (list: LessonStep[]) => {
    const step = list[index];
    if (step.type === 'exercise') {
      navigation.navigate('Exercise', {
        type: step.exerciseType,
        lessonId,
        lessonTitle: lessonTitle ?? lesson.data?.title,
      });
      return;
    }
    if (index === list.length - 1) {
      navigation.navigate('ExerciseResult', {
        xp: lesson.data?.xp ?? 50,
        correct: true,
        lessonTitle: lessonTitle ?? lesson.data?.title,
      });
      return;
    }
    setIndex(value => value + 1);
    setPlaying(autoPlayAudio);
    setNoteOpen(false);
  };

  const goPrevious = () => {
    if (index > 0) setIndex(value => value - 1);
    else navigation.goBack();
  };

  return (
    <Screen background="plain">
      <AsyncContent state={steps} loadingLabel="Carregando a lição…">
        {list => {
          const step = list[Math.min(index, list.length - 1)];
          const isLast = index === list.length - 1;

          return (
            <View style={{ flex: 1 }}>
              <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <View style={styles.headerRow}>
                  <IconButton icon="←" onPress={goPrevious} />
                  <ProgressBar value={((index + 1) / list.length) * 100} style={{ flex: 1 }} />
                  <HelpButton
                    title="Como funciona a lição"
                    description="Cada lição é dividida em passos com palavras, exemplos e exercícios. Você pode ouvir o áudio (normal ou devagar), salvar a palavra no caderno, marcar como favorita e escrever uma anotação pessoal."
                  />
                </View>
                <View style={styles.headerInfo}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>
                      {lessonTitle ?? lesson.data?.title ?? 'Lição'}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary }}>
                      Passo {index + 1} de {list.length}
                    </Text>
                  </View>
                  <Badge color={step.type === 'exercise' ? 'amber' : 'violet'}>
                    {step.type === 'exercise' ? '✏️ Exercício' : '📖 Vocabulário'}
                  </Badge>
                </View>
              </View>

              <ScreenScroll contentContainerStyle={{ padding: 20 }}>
                {step.type === 'exercise' ? (
                  <View style={styles.exercisePrompt}>
                    <Text style={{ fontSize: 44, marginBottom: 12 }}>✏️</Text>
                    <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>
                      Hora de praticar
                    </Text>
                    <Text style={[styles.exerciseSubtitle, { color: theme.colors.textMuted }]}>
                      Vamos testar o que você aprendeu até aqui.
                    </Text>
                    <Button size="lg" onPress={() => goNext(list)}>
                      Iniciar exercício
                    </Button>
                  </View>
                ) : (
                  <>
                    <View style={[styles.wordCard, { backgroundColor: theme.colors.primarySurface }]}>
                      {step.image ? (
                        <Image source={{ uri: step.image }} style={styles.image} />
                      ) : null}
                      <Text style={[styles.word, { color: theme.colors.primarySoftText }]}>
                        {step.word}
                      </Text>
                      {step.phonetic ? (
                        <Text style={[styles.phonetic, { color: theme.colors.textFaint }]}>
                          {step.phonetic}
                        </Text>
                      ) : null}
                      <Text style={[styles.translation, { color: theme.colors.textSecondary }]}>
                        {step.translation}
                      </Text>

                      {/* RF 6.2 / 6.4 — velocidade do áudio e reprodução manual */}
                      <View style={styles.audioRow}>
                        <Pressable
                          onPress={() => setPlaying(value => !value)}
                          style={[
                            styles.audioButton,
                            {
                              backgroundColor: playing
                                ? theme.colors.primary
                                : theme.colors.primarySoft,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '700',
                              color: playing ? '#FFFFFF' : theme.colors.primarySoftText,
                            }}
                          >
                            🔊 {playing ? 'Reproduzindo…' : 'Ouvir'}
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setPlaying(true)}
                          style={[styles.audioButton, { backgroundColor: theme.colors.surfaceStrong }]}
                        >
                          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary }}>
                            🐢 Devagar
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {step.example ? (
                      <Card style={{ marginTop: 12 }}>
                        <Text style={[styles.cardLabel, { color: theme.colors.textFaint }]}>
                          Exemplo
                        </Text>
                        <Text style={[styles.example, { color: theme.colors.text }]}>
                          {step.example}
                        </Text>
                        {/* RF 6.3 — legendas/tradução exibidas junto do áudio */}
                        {showSubtitles && step.exampleTranslation ? (
                          <Text style={[styles.exampleTranslation, { color: theme.colors.textMuted }]}>
                            {step.exampleTranslation}
                          </Text>
                        ) : null}
                      </Card>
                    ) : null}

                    {step.explanation ? (
                      <Card
                        style={{
                          marginTop: 12,
                          backgroundColor: theme.colors.warningSoft,
                          borderColor: theme.colors.warningBorder,
                        }}
                      >
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <Text style={{ fontSize: 18 }}>💡</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.cardLabel, { color: theme.colors.warningText }]}>
                              Dica cultural
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, lineHeight: 18 }}>
                              {step.explanation}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    ) : null}

                    <View style={styles.actions}>
                      <ActionChip
                        label={saved.has(step.id) ? '✅ No caderno' : '📝 Salvar'}
                        active={saved.has(step.id)}
                        onPress={() => {
                          toggle(saved, step.id, setSaved);
                          // RF 3.1 — adiciona a palavra ao caderno pessoal
                          if (!saved.has(step.id)) {
                            api.vocabulary.add({
                              word: step.word,
                              translation: step.translation,
                              language,
                              phonetic: step.phonetic,
                              example: step.example,
                              difficulty: 'medium',
                              isFavorite: false,
                              hasVoiceNote: false,
                              mastery: 0,
                              tags: [],
                            });
                          }
                        }}
                      />
                      <ActionChip
                        label={favorites.has(step.id) ? '❤️ Favoritada' : '🤍 Favoritar'}
                        active={favorites.has(step.id)}
                        onPress={() => toggle(favorites, step.id, setFavorites)}
                      />
                      <ActionChip label="✏️ Anotação" onPress={() => setNoteOpen(value => !value)} />
                      <ActionChip
                        label="🎙️ Pronúncia"
                        onPress={() =>
                          navigation.navigate('Pronunciation', {
                            word: step.word,
                            phonetic: step.phonetic,
                          })
                        }
                      />
                    </View>

                    {/* RF 3.4 — anotações pessoais na lição */}
                    {noteOpen ? (
                      <View style={{ marginTop: 12, gap: 8 }}>
                        <TextArea
                          value={note}
                          onChangeText={setNote}
                          placeholder="Escreva uma anotação sobre esta palavra…"
                        />
                        <Button size="sm" onPress={() => setNoteOpen(false)}>
                          Salvar anotação
                        </Button>
                      </View>
                    ) : null}
                  </>
                )}
              </ScreenScroll>

              <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
                <Button size="lg" fullWidth onPress={() => goNext(list)}>
                  {step.type === 'exercise'
                    ? 'Fazer exercício'
                    : isLast
                      ? 'Concluir lição 🎉'
                      : 'Próximo'}
                </Button>
              </View>
            </View>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

function ActionChip({
  label,
  onPress,
  active,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: theme.radius.md,
        backgroundColor: active ? theme.colors.successSoft : theme.colors.surfaceStrong,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: active ? theme.colors.successText : theme.colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wordCard: { borderRadius: 24, padding: 24, alignItems: 'center' },
  image: { width: '100%', height: 140, borderRadius: 16, marginBottom: 16 },
  word: { fontSize: 28, fontWeight: '800' },
  phonetic: { fontSize: 13, marginTop: 4 },
  translation: { fontSize: 17, fontWeight: '600', marginTop: 8 },
  audioRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  audioButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  cardLabel: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
  example: { fontSize: 14, fontWeight: '600' },
  exampleTranslation: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  exercisePrompt: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  exerciseTitle: { fontSize: 19, fontWeight: '800' },
  exerciseSubtitle: { fontSize: 13, marginBottom: 20, textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
