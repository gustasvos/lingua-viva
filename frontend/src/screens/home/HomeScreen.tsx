import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AudioPlayer,
  Badge,
  Button,
  Card,
  GradientHeader,
  HelpButton,
  IconButton,
  OptionButton,
  OptionState,
  ProgressBar,
  Screen,
  ScreenScroll,
  SectionHeader,
  StreakBadge,
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

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { user } = useAuth();
  const { language, dailyGoalXP } = useSettings();

  const info = getLanguage(language);
  const stats = useApi(() => api.progress.stats(language), [language]);
  const wordOfDay = useApi(() => api.daily.wordOfDay(language), [language]);
  const phraseOfDay = useApi(() => api.daily.phraseOfDay(language), [language]);
  const challenge = useApi(() => api.daily.challenge(language), [language]);
  const pending = useApi(
    () => api.lessons.list({ language, status: 'pending' }),
    [language],
  );
  const nextLesson = useApi(
    () => api.lessons.list({ language, status: 'in-progress' }),
    [language],
  );
  // RF 3.7 — palavra aleatória do caderno a cada abertura
  const randomWord = useApi(() => api.vocabulary.random(language), [language]);

  const [playing, setPlaying] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);

  const dailyXP = stats.data?.dailyXP ?? 0;
  const goal = stats.data?.dailyGoalXP ?? dailyGoalXP;
  const today = new Date().getDay();
  const lesson = nextLesson.data?.[0];

  return (
    <Screen edges={false}>
      <GradientHeader colors={gradients.brand}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Olá, {user?.name ?? 'Usuário'}! 👋</Text>
            <Text style={styles.headerTitle}>Pronto para estudar?</Text>
          </View>
          <IconButton icon="🔔" tone="light" onPress={() => navigation.navigate('Notifications')} />
          <HelpButton
            tone="light"
            title="Sua tela inicial"
            description="Aqui você acompanha a meta diária, retoma a lição em andamento e resolve o desafio do dia. Lições marcadas como pendentes aparecem em destaque mais abaixo."
          />
        </View>

        <View style={styles.statRow}>
          <View style={styles.statPill}>
            <StreakBadge streak={stats.data?.streak ?? 0} />
            <Text style={styles.statLabel}>dias</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 13 }}>
              ⚡ {stats.data?.totalXP ?? 0}
            </Text>
            <Text style={styles.statLabel}>XP total</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>
              ⏱️ {stats.data?.todayStudyTime ?? 0}min
            </Text>
          </View>
          <View style={styles.statPill}>
            <Text style={{ fontSize: 15 }}>{info.flag}</Text>
          </View>
        </View>
      </GradientHeader>

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* RF 9.4 — meta diária */}
        <Card>
          <View style={styles.goalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' }}>
                Meta diária
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                {dailyXP} / {goal} XP
              </Text>
            </View>
            <XPBadge xp={dailyXP} />
          </View>
          <ProgressBar value={dailyXP} max={goal} height={12} />
          <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 8 }}>
            {Math.max(0, goal - dailyXP)} XP para completar a meta de hoje
          </Text>
        </Card>

        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day, index) => {
            const isToday = index === today;
            const done = index < today;
            return (
              <View key={index} style={{ alignItems: 'center', gap: 4, flex: 1 }}>
                <Text style={{ fontSize: 10, color: theme.colors.textFaint, fontWeight: '700' }}>
                  {day}
                </Text>
                <View
                  style={[
                    styles.weekDot,
                    {
                      backgroundColor: isToday
                        ? theme.colors.primary
                        : done
                          ? theme.colors.successSoft
                          : theme.colors.surfaceStrong,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 12 }}>{isToday ? '⚡' : done ? '✓' : '·'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Próxima lição */}
        {lesson ? (
          <Pressable
            onPress={() =>
              navigation.navigate('LessonContent', {
                lessonId: lesson.id,
                lessonTitle: lesson.title,
              })
            }
          >
            <LinearGradient
              colors={gradients.brandSoft}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextLesson}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Badge color="amber">Próxima lição</Badge>
                  <Text style={styles.nextLessonTitle}>{lesson.title}</Text>
                  <Text style={styles.nextLessonMeta}>
                    {lesson.topic} · {lesson.duration} min
                  </Text>
                </View>
                <Text style={{ fontSize: 28 }}>📖</Text>
              </View>
              <ProgressBar
                value={lesson.progress}
                color="rgba(255,255,255,0.9)"
                trackColor="rgba(255,255,255,0.25)"
                style={{ marginVertical: 12 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.nextLessonMeta}>
                  {lesson.completedItems}/{lesson.totalItems} itens
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
                  Continuar →
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        ) : null}

        {/* Atalhos */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            { icon: '🔄', label: 'Revisar', colors: gradients.review, go: () => navigation.navigate('SpacedReview') },
            { icon: '🎯', label: 'Desafio', colors: gradients.amber, go: () => navigation.navigate('DailyChallenge') },
            { icon: '🌍', label: 'Cultura', colors: gradients.success, go: () => navigation.navigate('Culture') },
          ].map(action => (
            <Pressable key={action.label} style={{ flex: 1 }} onPress={action.go}>
              <LinearGradient
                colors={action.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.action}
              >
                <Text style={{ fontSize: 22 }}>{action.icon}</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
                  {action.label}
                </Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* RF 11 — palavra do dia */}
        {wordOfDay.data ? (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 16 }}>✨</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Palavra do dia</Text>
              <View style={{ flex: 1 }} />
              <AudioPlayer size="sm" playing={playing} onPress={() => setPlaying(v => !v)} />
            </View>
            <View style={[styles.wordBox, { backgroundColor: theme.colors.primarySurface }]}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: theme.colors.primarySoftText }}>
                {wordOfDay.data.word}
              </Text>
              <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>
                {wordOfDay.data.phonetic}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, marginTop: 4 }}>
                {wordOfDay.data.translation}
              </Text>
              {wordOfDay.data.example ? (
                <Text style={{ fontSize: 12, color: theme.colors.textMuted, fontStyle: 'italic', marginTop: 8 }}>
                  {wordOfDay.data.example}
                </Text>
              ) : null}
            </View>
            <Button
              size="sm"
              variant="secondary"
              style={{ marginTop: 12, alignSelf: 'flex-start' }}
              onPress={() => navigation.navigate('Tabs')}
            >
              + Caderno
            </Button>
          </Card>
        ) : null}

        {/* RF 11.1 — desafio do dia */}
        {challenge.data ? (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Desafio do dia</Text>
              <Badge color="amber">+{challenge.data.xpReward} XP</Badge>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, marginVertical: 12 }}>
              {challenge.data.question}
            </Text>
            <View style={{ gap: 8 }}>
              {challenge.data.options.map((option, index) => {
                let state: OptionState = 'idle';
                if (challengeAnswer !== null) {
                  if (index === challenge.data!.correctIndex) state = 'correct';
                  else if (index === challengeAnswer) state = 'wrong';
                }
                return (
                  <OptionButton
                    key={index}
                    label={option}
                    state={state}
                    disabled={challengeAnswer !== null}
                    onPress={() => setChallengeAnswer(index)}
                  />
                );
              })}
            </View>
          </Card>
        ) : null}

        {/* RF 11.2 — frase do dia */}
        {phraseOfDay.data ? (
          <Card onPress={() => navigation.navigate('PhraseOfDay')}>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 16 }}>💬</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Frase do dia</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', fontStyle: 'italic', color: theme.colors.textSecondary, marginTop: 8 }}>
              {phraseOfDay.data.phrase}
            </Text>
            <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 4 }}>
              {phraseOfDay.data.translation}
            </Text>
          </Card>
        ) : null}

        {/* RF 2.8 — lições pendentes priorizadas */}
        {pending.data && pending.data.length > 0 ? (
          <View>
            <SectionHeader
              title="📌 Lições pendentes"
              onAction={() => navigation.navigate('Tabs')}
            />
            <View style={{ gap: 8 }}>
              {pending.data.slice(0, 2).map(item => (
                <Card
                  key={item.id}
                  onPress={() =>
                    navigation.navigate('LessonContent', {
                      lessonId: item.id,
                      lessonTitle: item.title,
                    })
                  }
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>📌</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>
                        {item.topic}
                      </Text>
                    </View>
                    <Badge color="amber">Pendente</Badge>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ) : null}

        {/* RF 3.7 — palavra sorteada do caderno */}
        {randomWord.data ? (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 16 }}>📓</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Do seu caderno</Text>
              <Badge color="gray">Aleatório</Badge>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: theme.colors.text }}>
                  {randomWord.data.word}
                </Text>
                <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
                  {randomWord.data.translation} · {randomWord.data.phonetic}
                </Text>
              </View>
              <Button size="sm" variant="secondary" onPress={() => navigation.navigate('Flashcards')}>
                Revisar
              </Button>
            </View>
          </Card>
        ) : null}
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  statRow: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
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
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weekRow: { flexDirection: 'row' },
  weekDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nextLesson: { padding: 16, borderRadius: 24 },
  nextLessonTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
  nextLessonMeta: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  action: { alignItems: 'center', gap: 4, paddingVertical: 14, borderRadius: 18 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800' },
  wordBox: { padding: 14, borderRadius: 16, marginTop: 12 },
});
