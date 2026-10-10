import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Card,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

/** RF 9.10 — Medalhas por marcos. */
export function AchievementsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();
  const state = useApi(() => api.progress.achievements(language), [language]);

  return (
    <Screen>
      <ScreenHeader title="Conquistas" onBack={navigation.goBack} />
      <AsyncContent state={state} loadingLabel="Carregando conquistas…">
        {list => {
          const unlocked = list.filter(item => item.status === 'unlocked');
          const others = list.filter(item => item.status !== 'unlocked');

          return (
            <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
              <Card style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 30 }}>🏆</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.text }}>
                  {unlocked.length} / {list.length}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                  conquistas desbloqueadas
                </Text>
                <ProgressBar
                  value={unlocked.length}
                  max={list.length}
                  style={{ marginTop: 12 }}
                />
              </Card>

              <SectionHeader title="Desbloqueadas" style={{ marginTop: 8 }} />
              {unlocked.map(item => (
                <Card key={item.id}>
                  <View style={styles.row}>
                    <View style={[styles.icon, { backgroundColor: theme.colors.successSoft }]}>
                      <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                        {item.description}
                      </Text>
                    </View>
                    <Badge color="emerald">+{item.xpReward} XP</Badge>
                  </View>
                </Card>
              ))}

              <SectionHeader title="Em andamento e bloqueadas" style={{ marginTop: 8 }} />
              {others.map(item => (
                <Card key={item.id} style={{ opacity: item.status === 'locked' ? 0.6 : 1 }}>
                  <View style={styles.row}>
                    <View style={[styles.icon, { backgroundColor: theme.colors.surfaceStrong }]}>
                      <Text style={{ fontSize: 22 }}>
                        {item.status === 'locked' ? '🔒' : item.icon}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                        {item.description}
                      </Text>
                      {item.status === 'in-progress' && item.maxProgress ? (
                        <View style={{ marginTop: 8 }}>
                          <ProgressBar
                            value={item.progress ?? 0}
                            max={item.maxProgress}
                            height={6}
                          />
                          <Text style={{ fontSize: 10, color: theme.colors.textFaint, marginTop: 4 }}>
                            {item.progress} de {item.maxProgress}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Badge color="gray">+{item.xpReward} XP</Badge>
                  </View>
                </Card>
              ))}
            </ScreenScroll>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 48, height: 48, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
