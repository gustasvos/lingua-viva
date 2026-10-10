import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  Input,
  Screen,
  ScreenHeader,
  ScreenScroll,
  SectionHeader,
  ToggleSwitch,
} from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { NotificationSettings } from '../../services/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const FREQUENCIES: { id: NotificationSettings['frequency']; label: string }[] = [
  { id: 'daily', label: '📅 Todos os dias' },
  { id: 'weekdays', label: '💼 Dias de semana' },
  { id: 'custom', label: '🎛️ Personalizado' },
];

/** RF 14.1 — lembretes de estudo. RF 14.2 — relatório semanal por e-mail. */
export function NotificationsScreen({ navigation }: Props) {
  const theme = useTheme();
  const remote = useApi(() => api.notifications.settings(), []);
  const previews = useApi(() => api.notifications.previews(), []);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    if (remote.data) setSettings(remote.data);
  }, [remote.data]);

  const update = (changes: Partial<NotificationSettings>) =>
    setSettings(prev => (prev ? { ...prev, ...changes } : prev));

  return (
    <Screen>
      <ScreenHeader title="Notificações" onBack={navigation.goBack} />
      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        {settings ? (
          <>
            <SectionHeader title="⏰ Lembretes de estudo" />
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary }}>
                  Ativar lembretes
                </Text>
                <ToggleSwitch
                  value={settings.enabled}
                  onChange={value => update({ enabled: value })}
                />
              </View>

              <Input
                label="Horário do lembrete"
                value={settings.reminderTime}
                onChangeText={value => update({ reminderTime: value })}
                placeholder="18:00"
                keyboardType="numbers-and-punctuation"
                containerStyle={{ marginBottom: 16 }}
              />

              <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, marginBottom: 8 }}>
                Frequência
              </Text>
              <View style={{ gap: 8 }}>
                {FREQUENCIES.map(option => {
                  const active = settings.frequency === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => update({ frequency: option.id })}
                      style={[
                        styles.frequency,
                        {
                          borderColor: active ? theme.colors.primary : theme.colors.border,
                          backgroundColor: active ? theme.colors.primarySurface : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: '700',
                          color: active ? theme.colors.primarySoftText : theme.colors.textSecondary,
                        }}
                      >
                        {option.label}
                      </Text>
                      {active ? <Text style={{ color: theme.colors.primary }}>✓</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
            </Card>

            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                    Relatório semanal
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 2 }}>
                    Resumo do seu progresso por e-mail
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.weeklyReportEmail}
                  onChange={value => update({ weeklyReportEmail: value })}
                />
              </View>
            </Card>

            <Button fullWidth onPress={() => api.notifications.updateSettings(settings)}>
              Salvar preferências
            </Button>
          </>
        ) : null}

        <SectionHeader title="📱 Exemplos de notificação" style={{ marginTop: 12 }} />
        {(previews.data ?? []).map(item => (
          <Card key={item.id} padded={false}>
            <View style={[styles.preview, { backgroundColor: theme.palette.gray800 }]}>
              <View style={[styles.previewIcon, { backgroundColor: theme.colors.primary }]}>
                <Text style={{ fontSize: 14 }}>🌐</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                  {item.title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 }}>
                  {item.body}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{item.time}</Text>
            </View>
          </Card>
        ))}

        <Button fullWidth variant="secondary" onPress={() => navigation.navigate('WeeklyReport')}>
          📊 Ver relatório semanal
        </Button>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  frequency: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 2 },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  previewIcon: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
