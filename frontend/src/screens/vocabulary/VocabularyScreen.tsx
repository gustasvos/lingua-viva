import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  AudioPlayer,
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  HelpButton,
  IconButton,
  Input,
  MasteryBar,
  Screen,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { VocabularyFilter } from '../../services/api/vocabulary';
import { VocabularyWord } from '../../services/types';
import { useTheme } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS: { id: VocabularyFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'favorites', label: '❤️ Favoritas' },
  { id: 'hard', label: '😰 Difíceis' },
  { id: 'easy', label: '😊 Fáceis' },
];

const DIFFICULTY_LABEL = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' } as const;
const DIFFICULTY_COLOR = { easy: 'emerald', medium: 'amber', hard: 'red' } as const;

/** RF 3 — Caderno de vocabulário, com lista e nuvem de tags (RF 3.6). */
export function VocabularyScreen() {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { language } = useSettings();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<VocabularyFilter>('all');
  const [sort, setSort] = useState<'recent' | 'mastery'>('recent');
  const [view, setView] = useState<'list' | 'cloud'>('list');

  const words = useApi(
    () => api.vocabulary.list(language, { search, filter, sort }),
    [language, search, filter, sort],
  );

  return (
    <Screen>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.backgroundPlain, borderBottomColor: theme.colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Vocabulário</Text>
            <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
              {words.data?.length ?? 0} palavras no caderno
            </Text>
          </View>
          <IconButton
            icon={view === 'list' ? '☁️' : '📋'}
            tone="primary"
            accessibilityLabel="Alternar visualização"
            onPress={() => setView(value => (value === 'list' ? 'cloud' : 'list'))}
          />
          <IconButton icon="📖" onPress={() => navigation.navigate('Dictionary')} />
          <HelpButton
            title="Seu caderno"
            description="Aqui ficam as palavras que você salvou nas lições ou no dicionário. Filtre por favoritas e dificuldade, ou veja a nuvem de tags (☁️) para ter uma visão geral do seu vocabulário."
          />
        </View>

        <Input
          placeholder="Buscar no caderno…"
          icon="🔍"
          value={search}
          onChangeText={setSearch}
          rightIcon={search ? '✕' : undefined}
          onRightIconPress={() => setSearch('')}
        />
      </View>

      <ScreenScroll>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {FILTERS.map(item => (
            <Chip key={item.id} active={filter === item.id} onPress={() => setFilter(item.id)}>
              {item.label}
            </Chip>
          ))}
          <Chip
            active={sort === 'mastery'}
            onPress={() => setSort(value => (value === 'recent' ? 'mastery' : 'recent'))}
          >
            {sort === 'recent' ? '🕐 Recentes' : '📊 Domínio'}
          </Chip>
        </ScrollView>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <AsyncContent
            state={words}
            loadingLabel="Carregando seu caderno…"
            empty={
              <EmptyState
                icon="📝"
                title="Caderno vazio"
                description="Salve palavras durante as lições ou pelo dicionário para vê-las aqui."
                action={<Button onPress={() => navigation.navigate('Dictionary')}>Abrir dicionário</Button>}
              />
            }
          >
            {list =>
              view === 'cloud' ? (
                <WordCloud
                  words={list}
                  onPress={word => navigation.navigate('WordDetail', { wordId: word.id })}
                />
              ) : (
                list.map(word => (
                  <WordCard
                    key={word.id}
                    word={word}
                    onPress={() => navigation.navigate('WordDetail', { wordId: word.id })}
                  />
                ))
              )
            }
          </AsyncContent>
        </View>
      </ScreenScroll>
    </Screen>
  );
}

function WordCard({ word, onPress }: { word: VocabularyWord; onPress: () => void }) {
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);

  return (
    <Card onPress={onPress}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.wordTitleRow}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: theme.colors.text }}>
              {word.word}
            </Text>
            {word.isFavorite ? <Text>❤️</Text> : null}
            {word.hasVoiceNote ? <Text>🎙️</Text> : null}
            <Badge color={DIFFICULTY_COLOR[word.difficulty]}>
              {DIFFICULTY_LABEL[word.difficulty]}
            </Badge>
          </View>
          {word.phonetic ? (
            <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 2 }}>
              {word.phonetic}
            </Text>
          ) : null}
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginTop: 4 }}>
            {word.translation}
          </Text>
          {word.example ? (
            <Text style={{ fontSize: 11, color: theme.colors.textFaint, fontStyle: 'italic', marginTop: 4 }}>
              {word.example}
            </Text>
          ) : null}
        </View>
        <AudioPlayer size="sm" playing={playing} onPress={() => setPlaying(value => !value)} />
      </View>

      <View style={{ marginTop: 12 }}>
        <MasteryBar value={word.mastery} />
      </View>

      {word.tags.length ? (
        <View style={styles.tagRow}>
          {word.tags.map(tag => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.colors.surfaceStrong }]}>
              <Text style={{ fontSize: 10, color: theme.colors.textMuted }}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

/** RF 3.6 — Nuvem de vocabulário: tamanho e cor variam com a dificuldade. */
function WordCloud({
  words,
  onPress,
}: {
  words: VocabularyWord[];
  onPress: (word: VocabularyWord) => void;
}) {
  const theme = useTheme();
  const size = { easy: 24, medium: 18, hard: 15 };
  const color = {
    easy: theme.colors.success,
    medium: theme.colors.primary,
    hard: theme.palette.red400,
  };

  return (
    <Card>
      <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, textAlign: 'center' }}>
        Nuvem de vocabulário
      </Text>
      <Text style={{ fontSize: 11, color: theme.colors.textFaint, textAlign: 'center', marginTop: 2 }}>
        Tamanho = domínio · toque para ver detalhes
      </Text>

      <View style={styles.cloud}>
        {words.map(word => (
          <Pressable key={word.id} onPress={() => onPress(word)}>
            <Text
              style={{
                fontSize: size[word.difficulty],
                fontWeight: '800',
                color: color[word.difficulty],
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}
            >
              {word.word}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.legend}>
        {(['easy', 'medium', 'hard'] as const).map(key => (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color[key] }} />
            <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>
              {DIFFICULTY_LABEL[key]}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 23, fontWeight: '800' },
  chipRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  wordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  cloud: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, paddingVertical: 20 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 },
});
