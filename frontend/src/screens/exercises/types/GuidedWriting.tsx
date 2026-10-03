import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, ScreenScroll, TextArea } from '../../../components/ui';
import { GuidedWritingExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

/** RF 5.7 — Escrita guiada com prompt visual. */
export function GuidedWriting({ exercise, onFinish, onClose }: ExerciseProps<GuidedWritingExercise>) {
  const theme = useTheme();
  const [text, setText] = useState('');

  const wordCount = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text],
  );
  const isValid = wordCount >= exercise.minWords;

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title="Escrita guiada"
        onClose={onClose}
        help="Escreva um texto curto sobre a imagem, usando no mínimo o número de palavras indicado. A correção detalhada virá do servidor quando a API estiver conectada."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        {exercise.image ? (
          <Image source={{ uri: exercise.image }} style={styles.image} />
        ) : null}

        <Badge color="violet">Escreva sobre a imagem</Badge>
        <Text style={[styles.prompt, { color: theme.colors.text }]}>{exercise.prompt}</Text>
        {exercise.hint ? (
          <Text style={{ fontSize: 12, color: theme.colors.textFaint }}>💡 {exercise.hint}</Text>
        ) : null}

        <TextArea
          value={text}
          onChangeText={setText}
          placeholder="Escreva sua resposta…"
          style={{ minHeight: 150 }}
        />
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: isValid ? theme.colors.success : theme.colors.textFaint,
          }}
        >
          {wordCount} / {exercise.minWords} palavras mínimas
        </Text>
      </ScreenScroll>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Button
          size="lg"
          fullWidth
          disabled={!isValid}
          onPress={() => onFinish(true, exercise.xp, { answer: text })}
        >
          Enviar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 12 },
  image: { width: '100%', height: 150, borderRadius: 20 },
  prompt: { fontSize: 16, fontWeight: '700', lineHeight: 23 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
