import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AudioPlayer,
  Badge,
  Button,
  Card,
  EmptyState,
  HelpButton,
  Input,
  LoadingState,
  Screen,
  ScreenHeader,
  ScreenScroll,
  SectionHeader,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { DictionaryEntry } from '../../services/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Dictionary'>;

const SUGGESTIONS = ['ephemeral', 'serendipity', 'resilient', 'eloquent'];

/** RF 4.1 — dicionário integrado. RF 4.2 — histórico de buscas. */
export function DictionaryScreen({ navigation }: Props) {
  const theme = useTheme();
  const { language } = useSettings();

  const [term, setTerm] = useState('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [added, setAdded] = useState(false);

  const history = useApi(() => api.dictionary.history(), [result]);

  const search = async (value?: string) => {
    const query = (value ?? term).trim();
    if (!query) return;
    setTerm(query);
    setLoading(true);
    setHistoryVisible(false);
    setAdded(false);
    try {
      setResult(await api.dictionary.search(query, language));
    } finally {
      setLoading(false);
    }
  };

  const addToNotebook = async () => {
    if (!result) return;
    await api.vocabulary.add({
      word: result.word,
      translation: result.translation ?? '',
      language,
      phonetic: result.phonetic,
      example: result.examples[0],
      difficulty: 'medium',
      isFavorite: false,
      hasVoiceNote: false,
      mastery: 0,
      tags: ['dicionário'],
    });
    setAdded(true);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Dicionário"
        onBack={navigation.goBack}
        right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => setHistoryVisible(value => !value)}
              style={[styles.historyButton, { backgroundColor: theme.colors.surfaceStrong }]}
            >
              <Text>🕐</Text>
            </Pressable>
            <HelpButton
              title="Dicionário"
              description="Busque qualquer palavra para ver definição, tradução, exemplos e sinônimos. O ícone de relógio abre o histórico das últimas buscas, e você pode salvar a palavra direto no seu caderno."
            />
          </View>
        }
      />

      <View style={[styles.searchBar, { backgroundColor: theme.colors.backgroundPlain }]}>
        <Input
          containerStyle={{ flex: 1 }}
          placeholder="Digite uma palavra…"
          icon="🔍"
          autoCapitalize="none"
          value={term}
          onChangeText={setTerm}
          returnKeyType="search"
          onSubmitEditing={() => search()}
        />
        <Button onPress={() => search()}>Buscar</Button>
      </View>

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        {historyVisible ? (
          <View>
            <SectionHeader
              title="🕐 Histórico"
              actionLabel="Limpar"
              onAction={() => api.dictionary.clearHistory().then(history.refetch)}
            />
            {(history.data ?? []).map((item, index) => (
              <Card key={`${item.word}-${index}`} style={{ marginBottom: 8 }} onPress={() => search(item.word)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                      {item.word}
                    </Text>
                    {item.translation ? (
                      <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                        {item.translation}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={{ color: theme.colors.textFaint }}>→</Text>
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {loading ? <LoadingState label="Consultando o dicionário…" /> : null}

        {result && !loading ? (
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.word, { color: theme.colors.text }]}>{result.word}</Text>
                <Text style={{ fontSize: 12, color: theme.colors.textFaint }}>
                  {result.phonetic}
                </Text>
                {result.partOfSpeech ? (
                  <Badge color="violet" style={{ marginTop: 6 }}>
                    {result.partOfSpeech}
                  </Badge>
                ) : null}
              </View>
              <AudioPlayer />
            </View>

            {result.translation ? (
              <View style={[styles.translationBox, { backgroundColor: theme.colors.primarySurface }]}>
                <Text style={[styles.sectionLabel, { color: theme.colors.primarySoftText }]}>
                  Tradução
                </Text>
                <Text style={{ fontSize: 17, fontWeight: '700', color: theme.colors.text }}>
                  {result.translation}
                </Text>
              </View>
            ) : null}

            {result.definitions.length ? (
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textFaint }]}>
                  Definições
                </Text>
                {result.definitions.map((definition, index) => (
                  <Text
                    key={index}
                    style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 19 }}
                  >
                    <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>
                      {index + 1}.{' '}
                    </Text>
                    {definition}
                  </Text>
                ))}
              </View>
            ) : null}

            {result.examples.length ? (
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textFaint }]}>
                  Exemplos
                </Text>
                {result.examples.map((example, index) => (
                  <Text
                    key={index}
                    style={{ fontSize: 13, color: theme.colors.textMuted, fontStyle: 'italic', marginTop: 4 }}
                  >
                    {example}
                  </Text>
                ))}
              </View>
            ) : null}

            {result.synonyms.length ? (
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textFaint }]}>
                  Sinônimos
                </Text>
                <View style={styles.tagRow}>
                  {result.synonyms.map(synonym => (
                    <View
                      key={synonym}
                      style={[styles.tag, { backgroundColor: theme.colors.surfaceStrong }]}
                    >
                      <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>
                        {synonym}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <Button
              fullWidth
              style={{ marginTop: 20 }}
              variant={added ? 'success' : 'primary'}
              onPress={addToNotebook}
            >
              {added ? '✅ Adicionada ao caderno' : '📝 Adicionar ao caderno'}
            </Button>
          </Card>
        ) : null}

        {!result && !loading && !historyVisible ? (
          <EmptyState
            icon="📖"
            title="Pesquise uma palavra"
            description="Digite qualquer palavra para ver definição, tradução e exemplos de uso."
            action={
              <View style={styles.tagRow}>
                {SUGGESTIONS.map(word => (
                  <Pressable
                    key={word}
                    onPress={() => search(word)}
                    style={[styles.suggestion, { backgroundColor: theme.colors.primarySoft }]}
                  >
                    <Text style={{ color: theme.colors.primarySoftText, fontWeight: '700', fontSize: 13 }}>
                      {word}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
          />
        ) : null}
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 16, alignItems: 'flex-end' },
  historyButton: { width: 36, height: 36, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  word: { fontSize: 24, fontWeight: '800' },
  translationBox: { padding: 14, borderRadius: 16, marginTop: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6, justifyContent: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  suggestion: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
});
