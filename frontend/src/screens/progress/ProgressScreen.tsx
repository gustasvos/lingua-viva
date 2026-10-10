import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Button,
  Card,
  HelpButton,
  MasteryBar,
  ProgressBar,
  Screen,
  ScreenHeader,
  ScreenScroll,
  SectionHeader,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

/** RF 9.2 (gráfico), 9.5/9.6 (tempo), 9.7 (erros) e 9.8 (mapa de calor). */
export function ProgressScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();
  const state = useApi(() => api.progress.stats(language), [language]);

  return (
    <Screen>
      <ScreenHeader
        title="Meu progresso"
        onBack={navigation.goBack}
        right={
          <HelpButton
            title="Progresso"
            description="O gráfico mostra o XP de cada dia da semana. Mais abaixo, as estatísticas de erro indicam em quais tipos de exercício você mais erra, e o mapa de calor mostra quais áreas do vocabulário já domina."
          />
        }
      />

      <AsyncContent state={state} loadingLabel="Calculando seu progresso…">
        {stats => {
          const maxWeekly = Math.max(...stats.weeklyXP, 1);
          const hours = Math.floor(stats.totalStudyTime / 60);

          return (
            <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {[
                  { icon: '⚡', value: stats.totalXP, label: 'XP total' },
                  { icon: '🔥', value: stats.streak, label: 'Sequência' },
                  { icon: '⏱️', value: `${hours}h`, label: 'Tempo total' },
                ].map(item => (
                  <Card key={item.label} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: theme.colors.text }}>
                      {item.value}
                    </Text>
                    <Text style={{ fontSize: 10, color: theme.colors.textMuted }}>{item.label}</Text>
                  </Card>
                ))}
              </View>

              {/* RF 9.2 — gráfico de evolução */}
              <Card>
                <SectionHeader title="XP nos últimos 7 dias" />
                <View style={styles.chart}>
                  {stats.weeklyXP.map((value, index) => (
                    <View key={index} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 9, color: theme.colors.textFaint }}>{value}</Text>
                      <View
                        style={{
                          width: '65%',
                          height: Math.max(4, (value / maxWeekly) * 80),
                          borderRadius: 6,
                          backgroundColor: theme.colors.primary,
                        }}
                      />
                      <Text style={{ fontSize: 9, color: theme.colors.textFaint }}>
                        {DAYS[index]}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>

              {/* RF 9.6 — tempo acumulado */}
              <Card>
                <SectionHeader title="Tempo de estudo" />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.primary }}>
                      {stats.todayStudyTime}min
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>hoje</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text }}>
                      {hours}h{stats.totalStudyTime % 60}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>acumulado</Text>
                  </View>
                </View>
              </Card>

              {/* RF 9.7 — estatísticas de erro */}
              <Card>
                <SectionHeader title="Onde você mais erra" />
                <View style={{ gap: 12 }}>
                  {stats.errorsByType.map(item => {
                    const rate = Math.round((item.errors / item.total) * 100);
                    return (
                      <View key={item.type} style={{ gap: 4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary }}>
                            {item.type}
                          </Text>
                          <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                            {item.errors}/{item.total} ({rate}%)
                          </Text>
                        </View>
                        <ProgressBar
                          value={rate}
                          height={6}
                          color={rate > 50 ? theme.colors.danger : theme.colors.warning}
                          trackColor={theme.colors.borderStrong}
                        />
                      </View>
                    );
                  })}
                </View>
              </Card>

              {/* RF 9.8 — mapa de calor do vocabulário */}
              <Card>
                <SectionHeader title="Domínio por área" />
                <View style={{ gap: 12 }}>
                  {stats.vocabularyHeatmap.map(item => (
                    <View key={item.topic} style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary }}>
                        {item.topic}
                      </Text>
                      <MasteryBar value={item.mastery} />
                    </View>
                  ))}
                </View>
              </Card>

              <Button fullWidth variant="secondary" onPress={() => navigation.navigate('Achievements')}>
                🏆 Ver conquistas
              </Button>
            </ScreenScroll>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 4 },
});
