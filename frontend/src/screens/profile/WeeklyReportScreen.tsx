import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Button,
  Card,
  GradientHeader,
  IconButton,
  Screen,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { gradients, useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyReport'>;

const variation = (current: number, previous: number) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

/** RF 14.2 / 9.5 — resumo semanal de estudo. */
export function WeeklyReportScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();
  const state = useApi(() => api.progress.weeklyReport(language), [language]);

  return (
    <Screen edges={false}>
      <AsyncContent state={state} loadingLabel="Montando seu relatório…">
        {report => {
          const cards = [
            { icon: '⏱️', label: 'Tempo estudado', value: `${report.weekStudyTime}min`, delta: variation(report.weekStudyTime, report.prevWeekStudyTime) },
            { icon: '📚', label: 'Lições', value: report.lessonsCompleted, delta: variation(report.lessonsCompleted, report.prevLessonsCompleted) },
            { icon: '📝', label: 'Palavras', value: report.wordsLearned, delta: variation(report.wordsLearned, report.prevWordsLearned) },
            { icon: '⚡', label: 'XP ganho', value: report.xpEarned, delta: variation(report.xpEarned, report.prevXpEarned) },
          ];
          const maxXp = Math.max(...report.dailyBreakdown.map(day => day.xp), 1);

          return (
            <>
              <GradientHeader colors={gradients.brandSoft}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <IconButton icon="←" tone="light" onPress={navigation.goBack} />
                  <View>
                    <Text style={styles.title}>Relatório semanal</Text>
                    <Text style={styles.subtitle}>Resumo dos últimos 7 dias</Text>
                  </View>
                </View>

                <View style={styles.grid}>
                  {cards.map(card => (
                    <View key={card.label} style={styles.gridItem}>
                      <Text style={{ fontSize: 17 }}>{card.icon}</Text>
                      <Text style={styles.gridValue}>{card.value}</Text>
                      <Text style={styles.gridLabel}>{card.label}</Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '800',
                          color: card.delta >= 0 ? '#6EE7B7' : '#FCA5A5',
                        }}
                      >
                        {card.delta >= 0 ? '↑' : '↓'} {Math.abs(card.delta)}% vs semana anterior
                      </Text>
                    </View>
                  ))}
                </View>
              </GradientHeader>

              <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
                <Card>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, marginBottom: 16 }}>
                    XP por dia
                  </Text>
                  <View style={styles.chart}>
                    {report.dailyBreakdown.map(day => (
                      <View key={day.day} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 9, color: theme.colors.textFaint }}>
                          {day.xp || ''}
                        </Text>
                        <View
                          style={{
                            width: '70%',
                            height: day.xp === 0 ? 4 : (day.xp / maxXp) * 72,
                            borderRadius: 6,
                            backgroundColor:
                              day.xp === 0 ? theme.colors.borderStrong : theme.colors.primary,
                          }}
                        />
                        <Text style={{ fontSize: 9, color: theme.colors.textFaint }}>{day.day}</Text>
                      </View>
                    ))}
                  </View>
                </Card>

                <Card style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 26 }}>🔥</Text>
                  <Text style={{ fontSize: 30, fontWeight: '800', color: theme.palette.orange500 }}>
                    {report.streak}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
                    dias de sequência
                  </Text>
                </Card>

                <Button fullWidth size="lg" onPress={navigation.goBack}>
                  Fechar relatório
                </Button>
              </ScreenScroll>
            </>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
    gap: 2,
  },
  gridValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  gridLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 6 },
});
