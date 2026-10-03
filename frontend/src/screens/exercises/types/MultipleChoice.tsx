import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Button, OptionButton, OptionState, ScreenScroll } from '../../../components/ui';
import { MultipleChoiceExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader, FeedbackBox } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

/** RF 5.1 (quiz de lição) e RF 5.3 (quiz de gramática) usam o mesmo componente. */
export function MultipleChoice({ exercise, onFinish, onClose }: ExerciseProps<MultipleChoiceExercise>) {
  const theme = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === exercise.correctIndex;
  const isGrammar = exercise.type === 'grammar-quiz';

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title={isGrammar ? 'Quiz de gramática' : 'Múltipla escolha'}
        onClose={onClose}
        help="Escolha a alternativa correta. Depois de responder você vê o gabarito e uma explicação — a resposta não pode ser trocada."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        {exercise.topic ? <Badge color="violet">{exercise.topic}</Badge> : null}
        <Text style={[styles.question, { color: theme.colors.text }]}>{exercise.question}</Text>

        {exercise.sentence ? (
          <View style={[styles.sentence, { backgroundColor: theme.colors.surfaceMuted }]}>
            <Text style={{ fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: theme.colors.textSecondary }}>
              {exercise.sentence}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: 12 }}>
          {exercise.options.map((option, index) => {
            let state: OptionState = 'idle';
            if (selected !== null) {
              if (index === exercise.correctIndex) state = 'correct';
              else if (index === selected) state = 'wrong';
            }
            return (
              <OptionButton
                key={index}
                label={option}
                state={state}
                disabled={selected !== null}
                prefix={
                  state === 'correct' ? '✓' : state === 'wrong' ? '✕' : String.fromCharCode(65 + index)
                }
                onPress={() => setSelected(index)}
              />
            );
          })}
        </View>

        {/* RF 5.3 — explicação para respostas incorretas */}
        {selected !== null ? (
          <FeedbackBox
            tone={isCorrect ? 'success' : 'error'}
            title={
              isCorrect
                ? `🎉 Correto! +${exercise.xp} XP`
                : '😅 Não foi dessa vez — mas o erro também ensina.'
            }
            description={!isCorrect ? exercise.explanation : undefined}
          />
        ) : null}
      </ScreenScroll>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Button
          size="lg"
          fullWidth
          disabled={selected === null}
          onPress={() => onFinish(isCorrect, isCorrect ? exercise.xp : 5, { answer: selected })}
        >
          {selected === null ? 'Selecione uma resposta' : 'Continuar'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 16 },
  question: { fontSize: 19, fontWeight: '700', lineHeight: 26 },
  sentence: { padding: 16, borderRadius: 16 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
