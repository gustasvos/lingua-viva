import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  Chip,
  Screen,
  ScreenHeader,
  ScreenScroll,
  SectionHeader,
  StreakBadge,
  XPBadge,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { getLanguage } from '../../services/mock/data';
import { gradients, useTheme } from '../../theme';

type SocialProps = NativeStackScreenProps<RootStackParamList, 'Social'>;
type ShareProps = NativeStackScreenProps<RootStackParamList, 'ShareProgress'>;

type Tab = 'ranking' | 'groups' | 'questions';

const TABS: { id: Tab; label: string }[] = [
  { id: 'ranking', label: '🏅 Ranking' },
  { id: 'groups', label: '👥 Grupos' },
  { id: 'questions', label: '💬 Perguntas' },
];

/** RF 10.1 (ranking), 10.2 (grupos) e 10.4 (perguntas e respostas). */
export function SocialScreen({ navigation }: SocialProps) {
  const theme = useTheme();
  const { language } = useSettings();
  const [tab, setTab] = useState<Tab>('ranking');

  const ranking = useApi(() => api.social.ranking(language), [language]);
  const groups = useApi(() => api.social.groups(), []);
  const questions = useApi(() => api.social.questions(language), [language]);

  return (
    <Screen>
      <ScreenHeader
        title="Social"
        subtitle="Compare seu progresso e tire dúvidas"
        onBack={navigation.goBack}
      />

      <View style={styles.tabRow}>
        {TABS.map(item => (
          <Chip key={item.id} active={tab === item.id} onPress={() => setTab(item.id)}>
            {item.label}
          </Chip>
        ))}
      </View>

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        {tab === 'ranking' ? (
          <>
            <SectionHeader title="Ranking entre amigos" />
            {(ranking.data ?? []).map(entry => (
              <Card
                key={entry.id}
                style={
                  entry.isMe
                    ? { borderColor: theme.colors.primary, borderWidth: 2 }
                    : undefined
                }
              >
                <View style={styles.row}>
                  <Text style={[styles.rank, { color: theme.colors.textFaint }]}>
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </Text>
                  <Text style={{ fontSize: 24 }}>{entry.avatar}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                      {entry.name}
                    </Text>
                    <StreakBadge streak={entry.streak} />
                  </View>
                  <XPBadge xp={entry.xp} />
                </View>
              </Card>
            ))}
            <Button fullWidth variant="secondary" onPress={() => navigation.navigate('ShareProgress')}>
              📤 Compartilhar meu progresso
            </Button>
          </>
        ) : null}

        {tab === 'groups' ? (
          <>
            <SectionHeader title="Meus grupos de estudo" />
            {(groups.data ?? []).map(group => {
              const info = getLanguage(group.language);
              return (
                <Card key={group.id}>
                  <View style={styles.row}>
                    <Text style={{ fontSize: 26 }}>{info.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                        {group.name}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
                        {group.members} membros · {group.progress} · {group.lastActivity}
                      </Text>
                    </View>
                    {group.isAdmin ? <Badge color="violet">Admin</Badge> : null}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 12 }}>
                    {group.memberAvatars.map((avatar, index) => (
                      <Text key={index} style={{ fontSize: 20 }}>
                        {avatar}
                      </Text>
                    ))}
                  </View>
                </Card>
              );
            })}
            <Button fullWidth>+ Criar novo grupo</Button>
          </>
        ) : null}

        {tab === 'questions' ? (
          <>
            <SectionHeader title="Dúvidas da comunidade" />
            {(questions.data ?? []).map(question => (
              <Card key={question.id}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 22 }}>{question.avatar}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.text }}>
                      {question.question}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 4 }}>
                      {question.user} · {question.time} · {question.answers} respostas · ▲{' '}
                      {question.votes}
                    </Text>
                  </View>
                  {question.resolved ? <Badge color="emerald">Resolvida</Badge> : null}
                </View>
              </Card>
            ))}
            <Button fullWidth>+ Fazer uma pergunta</Button>
          </>
        ) : null}
      </ScreenScroll>
    </Screen>
  );
}

/** RF 10.5 / 10.3 — compartilhar progresso e a palavra do dia. */
export function ShareProgressScreen({ navigation }: ShareProps) {
  const theme = useTheme();
  const { language } = useSettings();
  const stats = useApi(() => api.progress.stats(language), [language]);
  const word = useApi(() => api.daily.wordOfDay(language), [language]);
  const info = getLanguage(language);

  const shareProgress = () =>
    Share.share({
      message: `Estou estudando ${info.name} no LinguaViva! 🔥 ${stats.data?.streak ?? 0} dias de sequência e ⚡ ${stats.data?.totalXP ?? 0} XP.`,
    });

  const shareWord = () =>
    word.data
      ? Share.share({
          message: `Palavra do dia (${info.name}): ${word.data.word} — ${word.data.translation}\n\n"${word.data.example ?? ''}"`,
        })
      : undefined;

  return (
    <Screen>
      <ScreenHeader title="Compartilhar" onBack={navigation.goBack} />
      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
        <LinearGradient
          colors={gradients.brandSoft}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shareCard}
        >
          <Text style={{ fontSize: 40 }}>{info.flag}</Text>
          <Text style={styles.shareTitle}>
            {stats.data?.streak ?? 0} dias estudando {info.name}
          </Text>
          <Text style={styles.shareSubtitle}>⚡ {stats.data?.totalXP ?? 0} XP acumulados</Text>
          <Text style={styles.shareBrand}>LinguaViva</Text>
        </LinearGradient>

        <Button fullWidth size="lg" onPress={shareProgress}>
          📤 Compartilhar progresso
        </Button>

        {word.data ? (
          <Card>
            <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint }}>
              Palavra do dia
            </Text>
            <Text style={{ fontSize: 19, fontWeight: '800', color: theme.colors.text, marginTop: 6 }}>
              {word.data.word}
            </Text>
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
              {word.data.translation}
            </Text>
            <Button variant="secondary" style={{ marginTop: 12 }} onPress={shareWord}>
              Compartilhar palavra
            </Button>
          </Card>
        ) : null}
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rank: { fontSize: 14, fontWeight: '800', width: 32 },
  shareCard: { borderRadius: 28, padding: 28, alignItems: 'center', gap: 6 },
  shareTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  shareSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  shareBrand: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginTop: 12 },
});
