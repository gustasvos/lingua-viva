import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, ScreenScroll, TextArea } from '../../../components/ui';
import { useSettings } from '../../../contexts/SettingsContext';
import { DictationExercise } from '../../../services/types';
import { useTheme } from '../../../theme';
import { ExerciseHeader, FeedbackBox } from '../ExerciseHeader';
import { ExerciseProps } from './shared';

/** Normaliza para comparar ignorando caixa, acentos e pontuação (RF 5.5). */
function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ');
}

/** RF 5.5 — Ditado com verificação automática de ortografia. */
export function Dictation({ exercise, onFinish, onClose }: ExerciseProps<DictationExercise>) {
  const theme = useTheme();
  const { showSubtitles } = useSettings();
  const [text, setText] = useState('');
  const [played, setPlayed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [subtitlesVisible, setSubtitlesVisible] = useState(false);

  const isCorrect = normalize(text) === normalize(exercise.phrase);

  return (
    <View style={{ flex: 1 }}>
      <ExerciseHeader
        title="Ditado"
        onClose={onClose}
        help="Ouça a frase quantas vezes precisar (há a opção devagar) e digite exatamente o que entendeu. A correção ignora acentos e pontuação."
      />

      <ScreenScroll contentContainerStyle={styles.body}>
        <Badge color="violet" style={{ alignSelf: 'center' }}>
          Ouça e escreva
        </Badge>

        <View style={[styles.player, { backgroundColor: theme.colors.primarySurface }]}>
          <Text style={{ fontSize: 44 }}>🎧</Text>
          <View style={styles.playerRow}>
            {/* RF 6.4 — reprodução manual; RF 6.2 — velocidade lenta */}
            <Pressable
              onPress={() => setPlayed(true)}
              style={[
                styles.playerButton,
                { backgroundColor: played ? theme.colors.primary : theme.colors.primarySoft },
              ]}
            >
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 13,
                  color: played ? '#FFFFFF' : theme.colors.primarySoftText,
                }}
              >
                🔊 {played ? 'Ouvir novamente' : 'Ouvir frase'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPlayed(true)}
              style={[styles.playerButton, { backgroundColor: theme.colors.surfaceStrong }]}
            >
              <Text style={{ fontWeight: '700', fontSize: 13, color: theme.colors.textSecondary }}>
                🐢 Devagar
              </Text>
            </Pressable>
          </View>

          {/* RF 6.3 — legendas opcionais */}
          {played && showSubtitles ? (
            <Pressable onPress={() => setSubtitlesVisible(v => !v)}>
              <Text style={{ fontSize: 12, color: theme.colors.primary, fontWeight: '600' }}>
                {subtitlesVisible ? 'Ocultar legenda' : 'Mostrar legenda'}
              </Text>
            </Pressable>
          ) : null}
          {subtitlesVisible ? (
            <Text style={{ fontSize: 13, color: theme.colors.textMuted, fontStyle: 'italic' }}>
              {exercise.phrase}
            </Text>
          ) : null}
        </View>

        {played ? (
          <>
            <TextArea
              value={text}
              onChangeText={setText}
              editable={!checked}
              placeholder="Digite o que você ouviu…"
            />
            {checked ? (
              <FeedbackBox
                tone={isCorrect ? 'success' : 'error'}
                title={isCorrect ? `✅ Perfeito! +${exercise.xp} XP` : '❌ Quase lá!'}
                description={
                  isCorrect
                    ? undefined
                    : `Resposta correta: "${exercise.phrase}"\nTradução: "${exercise.translation}"`
                }
              />
            ) : null}
          </>
        ) : (
          <Text style={[styles.waiting, { color: theme.colors.textFaint }]}>
            Toque em ouvir para liberar o campo de resposta.
          </Text>
        )}
      </ScreenScroll>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Button
          size="lg"
          fullWidth
          disabled={!played || !text.trim()}
          onPress={() => {
            if (!checked) setChecked(true);
            else onFinish(isCorrect, isCorrect ? exercise.xp : 10, { answer: text });
          }}
        >
          {checked ? 'Continuar' : 'Verificar'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 16 },
  player: { alignItems: 'center', padding: 24, borderRadius: 24, gap: 14 },
  playerRow: { flexDirection: 'row', gap: 12 },
  playerButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  waiting: { fontSize: 13, textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
