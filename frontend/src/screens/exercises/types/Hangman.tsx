import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, ScreenScroll } from '../../../components/ui';
import { HangmanExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** RF 5.8 — Jogo da Forca com palavras do vocabulário do usuário. */
export function Hangman({ exercise, onFinish, onClose }: ExerciseProps<HangmanExercise>) {
  const theme = useTheme();
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  const word = exercise.word.toUpperCase();
  const letters = Array.from(new Set(word.replace(/[^A-Z]/g, '').split('')));
  const errors = [...guessed].filter(letter => !word.includes(letter)).length;
  const won = letters.every(letter => guessed.has(letter));
  const lost = errors >= exercise.maxErrors;
  const finished = won || lost;

  const face = lost ? '💀' : errors === 0 ? '😊' : errors < 3 ? '😟' : '😰';

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title="Jogo da forca"
        onClose={onClose}
        help="Descubra a palavra escolhendo letras. Cada letra errada consome uma das chances disponíveis."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        <Badge color="violet" style={{ alignSelf: 'center' }}>
          💡 {exercise.hint}
        </Badge>

        <View style={[styles.faceBox, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text style={{ fontSize: 48 }}>{face}</Text>
        </View>

        <Text style={[styles.errorCount, { color: theme.colors.textFaint }]}>
          Erros: {errors}/{exercise.maxErrors}
        </Text>
        <View style={styles.lives}>
          {Array.from({ length: exercise.maxErrors }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.life,
                {
                  backgroundColor:
                    index < errors ? theme.palette.red400 : theme.colors.borderStrong,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.wordRow}>
          {word.split('').map((letter, index) => (
            <View key={index} style={styles.letterSlot}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: guessed.has(letter) || letter === ' ' ? theme.colors.primary : 'transparent',
                }}
              >
                {letter === ' ' ? ' ' : letter}
              </Text>
              <View style={[styles.underline, { backgroundColor: theme.colors.textFaint }]} />
            </View>
          ))}
        </View>

        {finished ? (
          <View
            style={[
              styles.result,
              {
                backgroundColor: won ? theme.colors.successSoft : theme.colors.dangerSoft,
              },
            ]}
          >
            <Text style={{ fontSize: 19, fontWeight: '800', color: theme.colors.text }}>
              {won ? '🎉 Parabéns!' : '😅 Fim de jogo'}
            </Text>
            <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>
              A palavra era: {word}
            </Text>
          </View>
        ) : (
          <View style={styles.keyboard}>
            {ALPHABET.map(letter => {
              const isGuessed = guessed.has(letter);
              const isRight = isGuessed && word.includes(letter);
              return (
                <Pressable
                  key={letter}
                  disabled={isGuessed}
                  onPress={() => setGuessed(prev => new Set([...prev, letter]))}
                  style={[
                    styles.key,
                    {
                      backgroundColor: isRight
                        ? theme.colors.success
                        : isGuessed
                          ? theme.palette.red400
                          : theme.colors.surfaceStrong,
                      opacity: isGuessed && !isRight ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: '800',
                      fontSize: 13,
                      color: isGuessed ? '#FFFFFF' : theme.colors.textSecondary,
                    }}
                  >
                    {letter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScreenScroll>

      {finished ? (
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Button
            size="lg"
            fullWidth
            onPress={() => onFinish(won, won ? exercise.xp : 10, { answer: [...guessed] })}
          >
            Continuar
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 12, alignItems: 'center' },
  faceBox: { width: 120, height: 120, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  errorCount: { fontSize: 12, fontWeight: '600' },
  lives: { flexDirection: 'row', gap: 8 },
  life: { width: 22, height: 22, borderRadius: 11 },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginVertical: 12 },
  letterSlot: { alignItems: 'center', width: 26 },
  underline: { width: 22, height: 2, marginTop: 4 },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  key: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  result: { padding: 20, borderRadius: 20, alignItems: 'center', width: '100%' },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, width: '100%' },
});
