import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AsyncContent,
  AudioPlayer,
  Button,
  Card,
  IconButton,
  MasteryBar,
  Screen,
  ScreenScroll,
  TextArea,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { DifficultyId } from '../../services/types';
import { gradients, useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WordDetail'>;

const DIFFICULTIES: { id: DifficultyId; label: string }[] = [
  { id: 'easy', label: '😊 Fácil' },
  { id: 'medium', label: '💪 Médio' },
  { id: 'hard', label: '😰 Difícil' },
];

const PERFORMANCE_LABEL = { good: '😊 Bem', okay: '😐 Ok', hard: '😰 Difícil' };

/** RF 3.2 / 3.3 / 3.4 / 3.5 — favorito, dificuldade, anotação e nota de voz. */
export function WordDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const { wordId } = route.params;

  const state = useApi(
    async () => (await api.vocabulary.list(language)).find(item => item.id === wordId) ?? null,
    [wordId, language],
  );

  const [favorite, setFavorite] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyId>('medium');
  const [note, setNote] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!state.data) return;
    setFavorite(state.data.isFavorite);
    setDifficulty(state.data.difficulty);
    setNote(state.data.note ?? '');
  }, [state.data]);

  return (
    <Screen background="plain" edges={false}>
      <AsyncContent state={state} loadingLabel="Carregando palavra…">
        {word =>
          !word ? null : (
            <>
              <LinearGradient
                colors={gradients.brandSoft}
                style={[styles.header, { paddingTop: insets.top + 12 }]}
              >
                <View style={styles.headerRow}>
                  <IconButton icon="←" tone="light" onPress={navigation.goBack} />
                  <View style={{ flex: 1 }} />
                  <Pressable
                    onPress={() => {
                      const next = !favorite;
                      setFavorite(next);
                      api.vocabulary.update(word.id, { isFavorite: next });
                    }}
                    style={styles.headerIcon}
                  >
                    <Text style={{ fontSize: 16 }}>{favorite ? '❤️' : '🤍'}</Text>
                  </Pressable>
                </View>

                <Text style={styles.phonetic}>{word.phonetic}</Text>
                <Text style={styles.word}>{word.word}</Text>
                <Text style={styles.translation}>{word.translation}</Text>

                <View style={styles.audioRow}>
                  <AudioPlayer playing={playing} onPress={() => setPlaying(value => !value)} />
                  <Pressable onPress={() => setPlaying(true)} style={styles.slowButton}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                      🐢 Devagar
                    </Text>
                  </Pressable>
                </View>
              </LinearGradient>

              <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
                <Card>
                  <Text style={[styles.label, { color: theme.colors.textFaint }]}>
                    Nível de domínio
                  </Text>
                  <MasteryBar value={word.mastery} />
                  {word.lastPerformance ? (
                    <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 8 }}>
                      Última revisão: {PERFORMANCE_LABEL[word.lastPerformance]}
                    </Text>
                  ) : null}
                </Card>

                {/* RF 3.3 — atribuir dificuldade à palavra */}
                <View>
                  <Text style={[styles.label, { color: theme.colors.textFaint }]}>Dificuldade</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {DIFFICULTIES.map(option => {
                      const active = difficulty === option.id;
                      return (
                        <Pressable
                          key={option.id}
                          onPress={() => {
                            setDifficulty(option.id);
                            api.vocabulary.update(word.id, { difficulty: option.id });
                          }}
                          style={[
                            styles.difficultyButton,
                            {
                              backgroundColor: active
                                ? theme.colors.primarySoft
                                : theme.colors.surfaceStrong,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '700',
                              color: active ? theme.colors.primarySoftText : theme.colors.textFaint,
                            }}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {word.example ? (
                  <Card>
                    <Text style={[styles.label, { color: theme.colors.textFaint }]}>
                      Exemplo de uso
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', fontStyle: 'italic', color: theme.colors.textSecondary }}>
                      {word.example}
                    </Text>
                  </Card>
                ) : null}

                {/* RF 3.4 — anotação pessoal */}
                <Card>
                  <View style={styles.noteHeader}>
                    <Text style={[styles.label, { color: theme.colors.textFaint, marginBottom: 0 }]}>
                      Anotação pessoal
                    </Text>
                    <Pressable
                      onPress={() => {
                        if (editingNote) api.vocabulary.update(word.id, { note });
                        setEditingNote(value => !value);
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.primary }}>
                        {editingNote ? 'Salvar' : 'Editar'}
                      </Text>
                    </Pressable>
                  </View>
                  {editingNote ? (
                    <TextArea value={note} onChangeText={setNote} placeholder="Adicione uma anotação…" />
                  ) : (
                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 8 }}>
                      {note || 'Nenhuma anotação ainda.'}
                    </Text>
                  )}
                </Card>

                {/* RF 3.5 — nota de voz */}
                <Card>
                  <Text style={[styles.label, { color: theme.colors.textFaint }]}>Nota de voz</Text>
                  {word.hasVoiceNote ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <AudioPlayer size="sm" />
                      <View style={{ flex: 1 }}>
                        <MasteryBar value={65} showValue={false} />
                      </View>
                      <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>0:12</Text>
                    </View>
                  ) : (
                    <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.primary }}>
                      🎙️ Gravar nota de voz
                    </Text>
                  )}
                </Card>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Button
                    style={{ flex: 1 }}
                    variant="secondary"
                    onPress={() => navigation.navigate('Flashcards')}
                  >
                    🃏 Revisar
                  </Button>
                  <Button
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate('Pronunciation', {
                        word: word.word,
                        phonetic: word.phonetic,
                      })
                    }
                  >
                    🎙️ Pronúncia
                  </Button>
                </View>
              </ScreenScroll>
            </>
          )
        }
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonetic: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  word: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  translation: { fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  slowButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 8 },
  difficultyButton: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  noteHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
