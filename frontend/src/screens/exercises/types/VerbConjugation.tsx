import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Input, ScreenScroll } from '../../../components/ui';
import { VerbConjugationExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

/** RF 5.6 — Treino de conjugações verbais. */
export function VerbConjugation({
  exercise,
  onFinish,
  onClose,
}: ExerciseProps<VerbConjugationExercise>) {
  const theme = useTheme();
  const [answers, setAnswers] = useState<string[]>(() => exercise.subjects.map(() => ''));
  const [checked, setChecked] = useState(false);

  const matches = answers.map(
    (answer, index) => answer.trim().toLowerCase() === exercise.answers[index].toLowerCase(),
  );
  const allCorrect = matches.every(Boolean);

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title="Treino de verbos"
        onClose={onClose}
        help="Complete a conjugação para cada pronome. Ao verificar, as respostas certas ficam verdes e as erradas mostram a forma correta."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        <Badge color="violet">{exercise.tense}</Badge>
        <Text style={[styles.verb, { color: theme.colors.primary }]}>{exercise.verb}</Text>
        <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
          Complete todas as conjugações
        </Text>

        <View style={{ gap: 12, marginTop: 8 }}>
          {exercise.subjects.map((subject, index) => (
            <View key={subject + index} style={styles.row}>
              <Text style={[styles.subject, { color: theme.colors.textMuted }]}>{subject}</Text>
              <Input
                containerStyle={{ flex: 1 }}
                placeholder="conjugação…"
                autoCapitalize="none"
                editable={!checked}
                value={answers[index]}
                onChangeText={value =>
                  setAnswers(prev => prev.map((item, i) => (i === index ? value : item)))
                }
              />
              {checked ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    width: 70,
                    color: matches[index] ? theme.colors.success : theme.colors.danger,
                  }}
                >
                  {matches[index] ? '✓' : `→ ${exercise.answers[index]}`}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScreenScroll>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Button
          size="lg"
          fullWidth
          onPress={() => {
            if (!checked) setChecked(true);
            else onFinish(allCorrect, allCorrect ? exercise.xp : 15, { answer: answers });
          }}
        >
          {checked ? 'Continuar' : 'Verificar'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 8 },
  verb: { fontSize: 24, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  subject: { width: 70, fontSize: 13, fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
