import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Button, OptionButton, OptionState, ScreenScroll } from '../../../components/ui';
import { FillBlankExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader, FeedbackBox } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

/** RF 5.2 — Preenchimento de lacunas. */
export function FillBlank({ exercise, onFinish, onClose }: ExerciseProps<FillBlankExercise>) {
  const theme = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === exercise.correctIndex;
  const [before, after] = exercise.sentence.split('_____');

  const blankColor =
    selected === null
      ? theme.colors.primary
      : isCorrect
        ? theme.colors.success
        : theme.colors.danger;

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title="Complete a frase"
        onClose={onClose}
        help="Escolha a palavra que completa a lacuna. A dica gramatical aparece depois da resposta."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        <Badge color="blue">Preencha a lacuna</Badge>

        <View style={[styles.sentenceBox, { backgroundColor: theme.colors.primarySurface }]}>
          <Text style={[styles.sentence, { color: theme.colors.text }]}>
            {before}
            <Text style={{ color: blankColor, textDecorationLine: 'underline', fontWeight: '800' }}>
              {selected !== null ? exercise.options[selected] : '_____'}
            </Text>
            {after}
          </Text>
        </View>

        <Text style={[styles.hint, { color: theme.colors.textFaint }]}>
          Escolha a palavra correta
        </Text>

        <View style={styles.grid}>
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
                onPress={() => setSelected(index)}
                style={styles.gridItem}
                textStyle={{ textAlign: 'center' }}
              />
            );
          })}
        </View>

        {selected !== null ? (
          <FeedbackBox
            tone={isCorrect ? 'success' : 'hint'}
            title={isCorrect ? `✅ Correto! +${exercise.xp} XP` : '❌ Resposta incorreta'}
            description={exercise.hint}
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
          {selected === null ? 'Selecione uma opção' : 'Continuar'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 16 },
  sentenceBox: { padding: 20, borderRadius: 24 },
  sentence: { fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 28 },
  hint: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%', justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
