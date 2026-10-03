import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, ScreenScroll } from '../../components/ui';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { gradients, useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseResult'>;

const MOODS = [
  { emoji: '😄', label: 'Ótimo' },
  { emoji: '😊', label: 'Bem' },
  { emoji: '😐', label: 'Ok' },
  { emoji: '😔', label: 'Difícil' },
];

const EFFORTS = [
  { emoji: '😌', label: 'Fácil' },
  { emoji: '💪', label: 'Médio' },
  { emoji: '🔥', label: 'Difícil' },
];

type Step = 'result' | 'mood' | 'effort' | 'xp';

/** Resultado do exercício + RF 9.11 (humor) e RF 9.9 (esforço percebido). */
export function ExerciseResultScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { xp, correct, lessonTitle, correctCount, totalCount } = route.params;
  const [step, setStep] = useState<Step>('result');
  const [mood, setMood] = useState<string | null>(null);

  const goHome = () => navigation.navigate('Tabs');

  if (step === 'mood' || step === 'effort') {
    const isMood = step === 'mood';
    const options = isMood ? MOODS : EFFORTS;
    return (
      <Screen background="plain">
        <View style={styles.centered}>
          <Text style={{ fontSize: 44, marginBottom: 16 }}>{isMood ? '🤔' : '📊'}</Text>
          <Text style={[styles.centeredTitle, { color: theme.colors.text }]}>
            {isMood ? 'Como você está?' : 'Qual foi o esforço?'}
          </Text>
          <Text style={[styles.centeredSubtitle, { color: theme.colors.textMuted }]}>
            {isMood
              ? 'Registre seu humor ao final desta lição.'
              : 'Isso ajusta as recomendações das próximas lições.'}
          </Text>

          <View style={styles.optionRow}>
            {options.map(option => (
              <Pressable
                key={option.label}
                onPress={() => {
                  if (isMood) {
                    setMood(option.label);
                    setStep('effort');
                  } else {
                    api.exercises.sendFeedback({ mood: mood ?? undefined, effort: option.label });
                    setStep('xp');
                  }
                }}
                style={[styles.optionCard, { borderColor: theme.colors.border }]}
              >
                <Text style={{ fontSize: 34 }}>{option.emoji}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary }}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => setStep(isMood ? 'effort' : 'xp')} style={{ marginTop: 24 }}>
            <Text style={{ color: theme.colors.textFaint, fontSize: 13, fontWeight: '600' }}>
              Pular
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (step === 'xp') {
    return (
      <LinearGradient colors={gradients.brandSoft} style={styles.xpContainer}>
        <Text style={{ fontSize: 64, marginBottom: 12 }}>⚡</Text>
        <Text style={styles.xpLabel}>Você ganhou</Text>
        <Text style={styles.xpValue}>+{xp} XP</Text>
        <Text style={styles.xpHint}>Continue assim para manter sua sequência.</Text>
        <Button size="lg" variant="inverse" onPress={goHome}>
          Ir para o início 🏠
        </Button>
      </LinearGradient>
    );
  }

  const stats = [
    { icon: '✅', label: 'Questões certas', value: `${correctCount ?? (correct ? 1 : 0)}/${totalCount ?? 1}` },
    { icon: '🎯', label: 'Resultado', value: correct ? 'Acertou' : 'Errou' },
    { icon: '⚡', label: 'XP ganho', value: `+${xp}` },
    { icon: '🔥', label: 'Sequência', value: 'Mantida' },
  ];

  return (
    <Screen background="plain" edges={false}>
      <LinearGradient colors={gradients.brandSoft} style={styles.resultHeader}>
        <Text style={{ fontSize: 56, marginBottom: 8 }}>{correct ? '🎉' : '💪'}</Text>
        <Text style={styles.resultTitle}>{correct ? 'Excelente!' : 'Bom esforço!'}</Text>
        <Text style={styles.resultSubtitle}>{lessonTitle ?? 'Exercício'} · concluído</Text>
      </LinearGradient>

      <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={styles.statGrid}>
          {stats.map(stat => (
            <Card key={stat.label} style={styles.statCard}>
              <Text style={{ fontSize: 22 }}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <Button size="lg" fullWidth onPress={() => setStep('mood')}>
          Continuar
        </Button>
        <Button
          size="lg"
          fullWidth
          variant="secondary"
          onPress={() => navigation.navigate('SpacedReview')}
        >
          🔄 Revisar palavras difíceis
        </Button>
        <Pressable onPress={goHome} style={{ paddingVertical: 8 }}>
          <Text style={{ textAlign: 'center', color: theme.colors.textFaint, fontWeight: '600', fontSize: 13 }}>
            Ir para o início
          </Text>
        </Pressable>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  centeredTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  centeredSubtitle: { fontSize: 13, textAlign: 'center', marginBottom: 32 },
  optionRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  optionCard: { alignItems: 'center', gap: 8, padding: 16, borderRadius: 24, borderWidth: 2 },
  xpContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  xpLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  xpValue: { color: '#FCD34D', fontSize: 52, fontWeight: '800', marginVertical: 8 },
  xpHint: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 32, textAlign: 'center' },
  resultHeader: { paddingTop: 80, paddingBottom: 32, alignItems: 'center' },
  resultTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  resultSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 19, fontWeight: '800' },
});
