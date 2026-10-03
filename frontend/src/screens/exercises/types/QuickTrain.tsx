import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Button,
  IconButton,
  OptionButton,
  OptionState,
  ProgressBar,
  XPBadge,
} from '../../../components/ui';
import { QuickTrainExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseProps } from './shared';

/** RF 5.9 — Treino rápido cronometrado, com perguntas aleatórias. */
export function QuickTrain({ exercise, onFinish, onClose }: ExerciseProps<QuickTrainExercise>) {
  const theme = useTheme();
  const total = exercise.durationSeconds;
  const [timeLeft, setTimeLeft] = useState(total);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const done = timeLeft <= 0;

  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => setTimeLeft(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [done]);

  const question = exercise.questions[index % exercise.questions.length];

  const choose = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore(value => value + 1);
    setTimeout(() => {
      setIndex(value => value + 1);
      setSelected(null);
    }, 700);
  };

  if (done) {
    return (
      <View style={styles.finished}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>⚡</Text>
        <Text style={[styles.finishedTitle, { color: theme.colors.text }]}>
          Treino rápido concluído
        </Text>
        <Text style={{ fontSize: 13, color: theme.colors.textMuted, marginBottom: 16 }}>
          Você acertou {score} de {index} questões
        </Text>
        <XPBadge xp={score * 10} large />
        <Button
          size="lg"
          style={{ marginTop: 32 }}
          onPress={() => onFinish(score > index / 2, score * 10, { answer: score })}
        >
          Ver resultado
        </Button>
      </View>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const urgent = timeLeft < 60;

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerRow}>
          <IconButton icon="✕" onPress={onClose} />
          <Badge color="amber">⚡ Treino rápido</Badge>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary }}>
            ✅ {score}
          </Text>
          <View
            style={[
              styles.timer,
              { backgroundColor: urgent ? theme.colors.dangerSoft : theme.colors.primarySoft },
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '800',
                color: urgent ? theme.colors.dangerText : theme.colors.primarySoftText,
              }}
            >
              ⏱️ {minutes}:{String(seconds).padStart(2, '0')}
            </Text>
          </View>
        </View>
        <ProgressBar
          value={((total - timeLeft) / total) * 100}
          color={urgent ? theme.colors.danger : theme.colors.primary}
        />
      </View>

      <View style={styles.body}>
        <Badge color="violet">Questão {index + 1}</Badge>
        <Text style={[styles.question, { color: theme.colors.text }]}>{question.prompt}</Text>

        <View style={{ gap: 12 }}>
          {question.options.map((option, optionIndex) => {
            let state: OptionState = 'idle';
            if (selected !== null) {
              if (optionIndex === question.correctIndex) state = 'correct';
              else if (optionIndex === selected) state = 'wrong';
            }
            return (
              <OptionButton
                key={optionIndex}
                label={option}
                state={state}
                disabled={selected !== null}
                onPress={() => choose(optionIndex)}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  body: { flex: 1, padding: 20, gap: 16 },
  question: { fontSize: 18, fontWeight: '700', lineHeight: 25 },
  finished: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  finishedTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
});
