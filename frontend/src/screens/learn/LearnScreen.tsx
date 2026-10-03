import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  HelpButton,
  IconButton,
  Input,
  LevelChip,
  PlaceholderNotice,
  ProgressBar,
  Screen,
  ScreenScroll,
  XPBadge,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { getLanguage } from '../../services/mock/data';
import { Lesson, LessonStatus, LevelId } from '../../services/types';
import { gradients, useTheme } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LEVEL_FILTERS: { id: LevelId | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'beginner', label: 'Iniciante' },
  { id: 'intermediate', label: 'Intermediário' },
  { id: 'advanced', label: 'Avançado' },
];

const STATUS_FILTERS: { id: LessonStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'in-progress', label: 'Em progresso' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'completed', label: 'Concluídas' },
];

const STATUS_ICON: Record<LessonStatus, string> = {
  completed: '✅',
  'in-progress': '📖',
  pending: '📌',
  locked: '🔒',
};

export function LearnScreen() {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { language } = useSettings();

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<LevelId | 'all'>('all');
  const [status, setStatus] = useState<LessonStatus | 'all'>('all');
  const [sort, setSort] = useState<'default' | 'xp' | 'duration'>('default');
  const [reordering, setReordering] = useState(false);
  const [localOrder, setLocalOrder] = useState<Lesson[] | null>(null);

  const languageInfo = getLanguage(language);

  // RF 2.6 — busca com filtros, resolvida pela API (hoje mock, amanhã backend).
  const lessons = useApi(
    () => api.lessons.list({ language, level, status, search, sort }),
    [language, level, status, search, sort],
  );

  const items = localOrder ?? lessons.data ?? [];
  const completedCount = useMemo(
    () => items.filter(lesson => lesson.status === 'completed').length,
    [items],
  );

  /**
   * RF 2.7 — reordenação das lições.
   * Aqui usamos um modo de reordenar com setas (sem dependências extras).
   * Para arrastar e soltar de verdade, instale react-native-draggable-flatlist
   * e chame api.lessons.saveOrder no onDragEnd.
   */
  const move = useCallback(
    (index: number, direction: -1 | 1) => {
      const list = [...(localOrder ?? lessons.data ?? [])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return;
      [list[index], list[target]] = [list[target], list[index]];
      setLocalOrder(list);
      api.lessons.saveOrder(
        language,
        list.map(lesson => lesson.id),
      );
    },
    [language, localOrder, lessons.data],
  );

  return (
    <Screen>
      <View style={[styles.header, { backgroundColor: theme.colors.backgroundPlain, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Aprender</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {languageInfo.flag} {languageInfo.name} · {completedCount} lições concluídas
            </Text>
          </View>
          <IconButton icon="🛍️" tone="primary" onPress={() => navigation.navigate('Store')} />
          <IconButton
            icon={reordering ? '✓' : '⇅'}
            accessibilityLabel="Reordenar lições"
            onPress={() => setReordering(value => !value)}
          />
          <HelpButton
            title="Como usar esta tela"
            description="Busque lições por título, tópico ou tag e filtre por nível e situação. Toque em ⇅ para reordenar a lista do seu jeito e em 📌 para marcar uma lição como pendente — ela ganha destaque na tela inicial."
          />
        </View>

        <Input
          placeholder="Buscar lição ou tópico…"
          icon="🔍"
          value={search}
          onChangeText={setSearch}
          rightIcon={search ? '✕' : undefined}
          onRightIconPress={() => setSearch('')}
        />
      </View>

      <ScreenScroll>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {LEVEL_FILTERS.map(filter => (
            <Chip key={filter.id} active={level === filter.id} onPress={() => setLevel(filter.id)}>
              {filter.label}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {STATUS_FILTERS.map(filter => (
            <Chip
              key={filter.id}
              active={status === filter.id}
              onPress={() => setStatus(filter.id)}
            >
              {filter.label}
            </Chip>
          ))}
          <Chip
            active={sort !== 'default'}
            onPress={() => setSort(sort === 'xp' ? 'default' : 'xp')}
          >
            {sort === 'xp' ? '↓ XP' : '⇅ Ordenar'}
          </Chip>
        </ScrollView>

        {api.lessons.isPlaceholderContent(language) ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <PlaceholderNotice
              text={`Ainda não há conteúdo próprio de ${languageInfo.name} no modo offline. Estamos exibindo a estrutura de inglês até a API responder por idioma.`}
            />
          </View>
        ) : null}

        {/* RF 5.9 — treino rápido de 5 minutos */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Pressable onPress={() => navigation.navigate('Exercise', { type: 'quick-train' })}>
            <LinearGradient
              colors={gradients.amber}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickTrain}
            >
              <View style={styles.quickIcon}>
                <Text style={{ fontSize: 22 }}>⚡</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.quickTitle}>Treino rápido</Text>
                <Text style={styles.quickSubtitle}>5 minutos de exercícios aleatórios</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 18 }}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <AsyncContent
            state={lessons}
            loadingLabel="Carregando lições…"
            empty={
              <EmptyState
                icon="🔍"
                title="Nenhuma lição encontrada"
                description="Tente outro termo de busca ou remova os filtros."
              />
            }
          >
            {() =>
              items.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  reordering={reordering}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                  onPress={() =>
                    navigation.navigate('LessonContent', {
                      lessonId: lesson.id,
                      lessonTitle: lesson.title,
                    })
                  }
                  onTogglePending={() =>
                    api.lessons.togglePending(lesson.id, lesson.status !== 'pending')
                  }
                />
              ))
            }
          </AsyncContent>
        </View>
      </ScreenScroll>
    </Screen>
  );
}

function LessonCard({
  lesson,
  onPress,
  onTogglePending,
  reordering,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  lesson: Lesson;
  onPress: () => void;
  onTogglePending: () => void;
  reordering: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const theme = useTheme();
  const locked = lesson.status === 'locked';

  const accent = {
    completed: theme.colors.success,
    'in-progress': theme.colors.primary,
    pending: theme.colors.warning,
    locked: theme.colors.borderStrong,
  }[lesson.status];

  return (
    <Card
      onPress={locked ? undefined : onPress}
      style={{ borderLeftWidth: 4, borderLeftColor: accent, opacity: locked ? 0.6 : 1 }}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={[styles.lessonIcon, { backgroundColor: theme.colors.surfaceStrong }]}>
          <Text style={{ fontSize: 20 }}>{STATUS_ICON[lesson.status]}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.lessonTitleRow}>
            <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>{lesson.title}</Text>
            <LevelChip level={lesson.level} />
          </View>
          <Text style={[styles.lessonMeta, { color: theme.colors.textMuted }]}>
            {lesson.topic} · {lesson.duration} min · {lesson.totalItems} itens
          </Text>

          {!locked && lesson.progress > 0 ? (
            <View style={{ marginTop: 8 }}>
              <ProgressBar value={lesson.progress} height={6} />
              <Text style={[styles.lessonProgress, { color: theme.colors.textFaint }]}>
                {lesson.completedItems}/{lesson.totalItems} concluídos
              </Text>
            </View>
          ) : null}

          <View style={styles.lessonFooter}>
            <View style={{ flexDirection: 'row', gap: 6, flex: 1, flexWrap: 'wrap' }}>
              {lesson.tags.slice(0, 2).map(tag => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: theme.colors.surfaceStrong }]}
                >
                  <Text style={{ fontSize: 10, color: theme.colors.textMuted }}>{tag}</Text>
                </View>
              ))}
            </View>
            <XPBadge xp={lesson.xp} />
          </View>
        </View>
      </View>

      {reordering ? (
        <View style={styles.reorderRow}>
          <Button size="sm" variant="secondary" disabled={isFirst} onPress={onMoveUp}>
            ↑ Subir
          </Button>
          <Button size="sm" variant="secondary" disabled={isLast} onPress={onMoveDown}>
            ↓ Descer
          </Button>
        </View>
      ) : !locked ? (
        <View style={styles.actionRow}>
          <Button
            size="sm"
            variant={lesson.status === 'completed' ? 'secondary' : 'primary'}
            style={{ flex: 1 }}
            onPress={onPress}
          >
            {lesson.status === 'completed'
              ? '↺ Refazer'
              : lesson.status === 'in-progress'
                ? '▶ Continuar'
                : '▶ Iniciar'}
          </Button>
          {/* RF 2.8 — marcar lição como pendente para revisão futura */}
          <Pressable
            onPress={onTogglePending}
            accessibilityLabel="Marcar como pendente"
            style={[styles.pinButton, { backgroundColor: theme.colors.surfaceStrong }]}
          >
            <Text>📌</Text>
          </Pressable>
        </View>
      ) : (
        <Badge color="gray" style={{ marginTop: 12 }}>
          Conclua a lição anterior para desbloquear
        </Badge>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 23, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  chipRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  quickTrain: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 24 },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  quickSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  lessonIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  lessonTitle: { fontSize: 14, fontWeight: '700' },
  lessonMeta: { fontSize: 11, marginTop: 3 },
  lessonProgress: { fontSize: 10, marginTop: 4 },
  lessonFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  reorderRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pinButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
