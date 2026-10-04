import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import {
  Badge,
  Card,
  GradientHeader,
  IconButton,
  Screen,
  ScreenScroll,
  StreakBadge,
  ToggleSwitch,
  XPBadge,
} from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { getLanguage } from '../../services/mock/data';
import { gradients, useTheme } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MENU: { icon: string; label: string; screen: keyof RootStackParamList }[] = [
  { icon: '📊', label: 'Meu progresso', screen: 'Progress' },
  { icon: '🏆', label: 'Conquistas', screen: 'Achievements' },
  { icon: '👥', label: 'Social', screen: 'Social' },
  { icon: '🌍', label: 'Cultura', screen: 'Culture' },
  { icon: '🎙️', label: 'Pronúncia', screen: 'Pronunciation' },
  { icon: '🌐', label: 'Tradução', screen: 'Translation' },
  { icon: '📦', label: 'Conteúdo offline', screen: 'Offline' },
  // { icon: '🛍️', label: 'Loja de conteúdo', screen: 'Store' },
  { icon: '📥', label: 'Importar / Exportar', screen: 'ImportExport' },
  { icon: '🔔', label: 'Notificações', screen: 'Notifications' },
  // { icon: '⚙️', label: 'Configurações', screen: 'Settings' },
];

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { user, signOut, isGuest } = useAuth();
  const settings = useSettings();

  const stats = useApi(() => api.progress.stats(settings.language), [settings.language]);
  const info = getLanguage(settings.language);
  const isDark = theme.dark;

  return (
    <Screen edges={false}>
      <GradientHeader colors={gradients.brandDeep}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            {/^https?:\/\//.test(user?.avatar ?? '') ? (
              <Image
                source={{ uri: user!.avatar }}
                style={{ width: 62, height: 62, borderRadius: 22 }}
              />
            ) : (
              <Text style={{ fontSize: 30 }}>{user?.avatar ?? '😊'}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name ?? 'Usuário'}</Text>
            <Text style={styles.email}>{user?.email || 'Sessão de visitante'}</Text>
            <Badge color="amber" style={{ marginTop: 6 }}>
              🌟 {settings.level === 'beginner' ? 'Iniciante' : settings.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </Badge>
          </View>
          <IconButton icon="⚙️" tone="light" onPress={() => navigation.navigate('Settings')} />
        </View>

        <View style={styles.statRow}>
          <View style={styles.statPill}>
            <StreakBadge streak={stats.data?.streak ?? 0} />
            <Text style={styles.statLabel}>sequência</Text>
          </View>
          <View style={styles.statPill}>
            <XPBadge xp={stats.data?.totalXP ?? 0} />
          </View>
          <View style={styles.statPill}>
            <Text style={{ fontSize: 14 }}>{info.flag}</Text>
            <Text style={styles.statLabel}>{info.code.toUpperCase()}</Text>
          </View>
        </View>
      </GradientHeader>

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* RF 12.2 — atalho rápido para o tema */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 20 }}>{isDark ? '🌙' : '☀️'}</Text>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
              Tema {isDark ? 'escuro' : 'claro'}
            </Text>
            <ToggleSwitch
              value={isDark}
              onChange={value =>
                settings.update({ themeMode: value ? 'dark' : 'light', autoNightMode: false })
              }
            />
          </View>
        </Card>

        <Card padded={false}>
          {MENU.map((item, index) => (
            <Pressable
              key={item.screen}
              onPress={() => navigation.navigate(item.screen as never)}
              style={[
                styles.menuItem,
                index < MENU.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 18, width: 28 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary }}>
                {item.label}
              </Text>
              <Text style={{ color: theme.colors.textFaint }}>›</Text>
            </Pressable>
          ))}
        </Card>

        <Card>
          <Pressable onPress={signOut} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 18 }}>🚪</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.danger }}>
              {isGuest ? 'Sair do modo visitante' : 'Sair da conta'}
            </Text>
          </Pressable>
        </Card>

        <Text style={{ textAlign: 'center', fontSize: 11, color: theme.colors.textFaint }}>
          LinguaViva v1.0.0
        </Text>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
});
