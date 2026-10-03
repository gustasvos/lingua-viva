import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AsyncContent,
  Badge,
  Card,
  EmptyState,
  GradientHeader,
  HelpButton,
  IconButton,
  Screen,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { LANGUAGES, getLanguage } from '../../services/mock/data';
import { gradients, useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Culture'>;

/** RF 12.1 — Curiosidades sobre o país do idioma estudado. */
export function CultureScreen({ navigation }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const [language, setLanguage] = useState(settings.language);

  const articles = useApi(() => api.culture.list(language), [language]);
  const info = getLanguage(language);

  return (
    <Screen edges={false}>
      <GradientHeader colors={gradients.culture}>
        <View style={styles.headerRow}>
          <IconButton icon="←" tone="light" onPress={navigation.goBack} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Cultura</Text>
            <Text style={styles.subtitle}>
              {info.flag} {info.country} · descubra o mundo
            </Text>
          </View>
          <HelpButton
            tone="light"
            title="Seção de cultura"
            description="Textos curtos sobre tradições, festas e costumes dos países onde o idioma é falado. Troque o idioma nos botões abaixo do título para explorar outra cultura."
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {LANGUAGES.map(item => {
            const active = item.code === language;
            return (
              <Pressable
                key={item.code}
                onPress={() => setLanguage(item.code)}
                style={[
                  styles.languagePill,
                  { backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.2)' },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: active ? theme.palette.blue700 : '#FFFFFF',
                  }}
                >
                  {item.flag} {item.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </GradientHeader>

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
        <AsyncContent
          state={articles}
          loadingLabel="Carregando conteúdos…"
          empty={
            <EmptyState
              icon="🌍"
              title="Nada por aqui ainda"
              description="Os conteúdos culturais deste idioma serão publicados em breve."
            />
          }
        >
          {list =>
            list.map(article => (
              <Card
                key={article.id}
                padded={false}
                onPress={() => navigation.navigate('CultureArticle', { articleId: article.id })}
              >
                {article.image ? (
                  <Image source={{ uri: article.image }} style={styles.cover} />
                ) : null}
                <View style={{ padding: 16 }}>
                  <View style={styles.metaRow}>
                    <Badge color="blue">{article.category}</Badge>
                    <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>
                      {article.readTime} de leitura
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: theme.colors.text }}>
                    {article.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 4, lineHeight: 18 }}>
                    {article.description}
                  </Text>
                </View>
              </Card>
            ))
          }
        </AsyncContent>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 21, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  languagePill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  cover: { width: '100%', height: 150 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
});
