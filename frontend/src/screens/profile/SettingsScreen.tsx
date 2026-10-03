import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Card,
  HelpButton,
  Screen,
  ScreenHeader,
  ScreenScroll,
  ToggleSwitch,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { getLanguage } from '../../services/mock/data';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const LEVEL_LABEL = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };
const DIFFICULTY_LABEL = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };

export function SettingsScreen({ navigation }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const info = getLanguage(settings.language);

  return (
    <Screen>
      <ScreenHeader
        title="Configurações"
        onBack={navigation.goBack}
        right={
          <HelpButton
            title="Configurações"
            description="Ajuste idioma, nível e dificuldade a qualquer momento — o conteúdo das lições é recarregado automaticamente. O modo noturno automático sobrepõe a escolha manual de tema entre 19h e 6h."
          />
        }
      />

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* RF 2 */}
        <Section title="Idioma e aprendizado">
          <Row
            icon="🌐"
            label="Idioma principal"
            value={`${info.flag} ${info.name}`}
            onPress={() => navigation.navigate('OnboardingLanguage', { fromSettings: true })}
          />
          {/* RF 2.2 — alternar entre idiomas sem perder progresso */}
          <Row
            icon="🔀"
            label="Idioma secundário"
            value={
              settings.secondaryLanguage
                ? `${getLanguage(settings.secondaryLanguage).flag} trocar`
                : 'Nenhum'
            }
            onPress={settings.swapLanguages}
          />
          <Row
            icon="📊"
            label="Nível"
            value={LEVEL_LABEL[settings.level]}
            onPress={() => navigation.navigate('OnboardingLevel', { fromSettings: true })}
          />
          <Row
            icon="🎯"
            label="Dificuldade"
            value={DIFFICULTY_LABEL[settings.difficulty]}
            onPress={() => navigation.navigate('OnboardingDifficulty', { fromSettings: true })}
          />
          <Row
            icon="⚡"
            label="Meta diária"
            value={`${settings.dailyGoalXP} XP`}
            onPress={() => navigation.navigate('OnboardingGoal', { fromSettings: true })}
          />
        </Section>

        {/* RF 12.2 / 12.3 */}
        <Section title="Aparência">
          <Toggle
            icon="🌙"
            label="Tema escuro"
            value={theme.dark}
            disabled={settings.autoNightMode}
            onChange={value => settings.update({ themeMode: value ? 'dark' : 'light' })}
          />
          <Toggle
            icon="🌅"
            label="Modo noturno automático"
            hint="Ativa o tema escuro entre 19h e 6h"
            value={settings.autoNightMode}
            onChange={value => settings.update({ autoNightMode: value })}
          />
          <Toggle
            icon="📱"
            label="Seguir o tema do sistema"
            value={settings.themeMode === 'system'}
            disabled={settings.autoNightMode}
            onChange={value =>
              settings.update({ themeMode: value ? 'system' : theme.dark ? 'dark' : 'light' })
            }
          />
        </Section>

        {/* RF 6 */}
        <Section title="Áudio e pronúncia">
          <Toggle
            icon="▶️"
            label="Reprodução automática"
            value={settings.autoPlayAudio}
            onChange={value => settings.update({ autoPlayAudio: value })}
          />
          <Toggle
            icon="📝"
            label="Mostrar legendas"
            value={settings.showSubtitles}
            onChange={value => settings.update({ showSubtitles: value })}
          />
          <Row
            icon="🎙️"
            label="Sensibilidade do reconhecimento"
            value={settings.speechSensitivity === 'tolerant' ? '😌 Tolerante' : '🎯 Rigoroso'}
            onPress={() =>
              settings.update({
                speechSensitivity: settings.speechSensitivity === 'tolerant' ? 'strict' : 'tolerant',
              })
            }
          />
        </Section>

        {/* RF 1.3 */}
        <Section title="Segurança">
          <Toggle
            icon="🔒"
            label="Bloquear o app"
            hint="Pede PIN ou biometria ao abrir"
            value={settings.appLockEnabled}
            onChange={value => settings.update({ appLockEnabled: value })}
          />
          <Toggle
            icon="👆"
            label="Biometria"
            value={settings.biometricEnabled}
            onChange={value => settings.update({ biometricEnabled: value })}
          />
          <Row icon="🔑" label="Alterar PIN" value="" onPress={() => navigation.navigate('AppLock')} />
        </Section>

        {/* RF 14 */}
        <Section title="Notificações">
          <Row
            icon="🔔"
            label="Lembretes de estudo"
            value=""
            onPress={() => navigation.navigate('Notifications')}
          />
          <Row
            icon="📊"
            label="Relatório semanal"
            value=""
            onPress={() => navigation.navigate('WeeklyReport')}
          />
        </Section>

        {/* RF 13 */}
        <Section title="Conteúdo">
          <Row icon="📦" label="Conteúdo offline" value="" onPress={() => navigation.navigate('Offline')} />
          <Row
            icon="📥"
            label="Importar / Exportar"
            value=""
            onPress={() => navigation.navigate('ImportExport')}
          />
        </Section>

        <Pressable onPress={settings.reset} style={{ paddingVertical: 12 }}>
          <Text style={{ textAlign: 'center', color: theme.colors.danger, fontWeight: '700', fontSize: 13 }}>
            Restaurar configurações padrão
          </Text>
        </Pressable>
      </ScreenScroll>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: theme.colors.textFaint, paddingHorizontal: 4 }}>
        {title}
      </Text>
      <Card padded={false}>{children}</Card>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <Text style={{ fontSize: 17, width: 26 }}>{icon}</Text>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary }}>
        {label}
      </Text>
      {value ? (
        <Text style={{ fontSize: 12, color: theme.colors.textFaint }}>{value}</Text>
      ) : null}
      <Text style={{ color: theme.colors.textFaint, marginLeft: 4 }}>›</Text>
    </Pressable>
  );
}

function Toggle({
  icon,
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  icon: string;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border, opacity: disabled ? 0.5 : 1 }]}>
      <Text style={{ fontSize: 17, width: 26 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary }}>
          {label}
        </Text>
        {hint ? (
          <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 2 }}>{hint}</Text>
        ) : null}
      </View>
      <ToggleSwitch value={value} onChange={disabled ? () => {} : onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
