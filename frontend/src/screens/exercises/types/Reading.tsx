import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, OptionButton, OptionState, ScreenScroll } from '../../../components/ui';
import { ReadingExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader, FeedbackBox } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

/** RF 5.4 — Leitura e compreensão, com destaque de palavras no texto. */
export function Reading({ exercise, onFinish, onClose }: ExerciseProps<ReadingExercise>) {
  const theme = useTheme();
  const [phase, setPhase] = useState<'read' | 'question'>('read');
  const [selected, setSelected] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());

  const question = exercise.questions[0];
  const isCorrect = selected === question.correctIndex;
  const words = exercise.text.split(' ');

  const toggleHighlight = (index: number) => {
    setHighlighted(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title="Leitura e compreensão"
        onClose={onClose}
        help="Leia o texto e toque nas palavras que quiser destacar. Depois responda à pergunta de compreensão."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        {phase === 'read' ? (
          <>
            <Badge color="blue">Leia com atenção</Badge>
            <View style={[styles.textBox, { backgroundColor: theme.colors.surfaceMuted }]}>
              <Text style={styles.paragraph}>
                {words.map((word, index) => (
                  <Text
                    key={index}
                    onPress={() => toggleHighlight(index)}
                    style={{
                      fontSize: 14,
                      lineHeight: 24,
                      color: theme.colors.textSecondary,
                      backgroundColor: highlighted.has(index)
                        ? theme.colors.warningSoft
                        : 'transparent',
                    }}
                  >
                    {word}{' '}
                  </Text>
                ))}
              </Text>
            </View>
            <Text style={[styles.hint, { color: theme.colors.textFaint }]}>
              Toque em uma palavra para destacá-la
            </Text>
            <Button size="lg" fullWidth onPress={() => setPhase('question')}>
              Responder pergunta
            </Button>
          </>
        ) : (
          <>
            <Badge color="blue">Compreensão</Badge>
            <Text style={[styles.question, { color: theme.colors.text }]}>{question.prompt}</Text>
            <View style={{ gap: 12 }}>
              {question.options.map((option, index) => {
                let state: OptionState = 'idle';
                if (selected !== null) {
                  if (index === question.correctIndex) state = 'correct';
                  else if (index === selected) state = 'wrong';
                }
                return (
                  <OptionButton
                    key={index}
                    label={option}
                    state={state}
                    disabled={selected !== null}
                    onPress={() => setSelected(index)}
                  />
                );
              })}
            </View>
            {selected !== null ? (
              <FeedbackBox
                tone={isCorrect ? 'success' : 'error'}
                title={isCorrect ? `✅ Correto! +${exercise.xp} XP` : '❌ Releia o trecho destacado'}
              />
            ) : null}
            <Pressable onPress={() => setPhase('read')}>
              <Text style={{ textAlign: 'center', color: theme.colors.primary, fontWeight: '700', fontSize: 13 }}>
                ← Voltar ao texto
              </Text>
            </Pressable>
          </>
        )}
      </ScreenScroll>

      {phase === 'question' ? (
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Button
            size="lg"
            fullWidth
            disabled={selected === null}
            onPress={() => onFinish(isCorrect, isCorrect ? exercise.xp : 5, { answer: selected })}
          >
            Finalizar
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 16 },
  textBox: { padding: 20, borderRadius: 24 },
  paragraph: { flexWrap: 'wrap' },
  hint: { fontSize: 12, textAlign: 'center' },
  question: { fontSize: 16, fontWeight: '700', lineHeight: 23 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
