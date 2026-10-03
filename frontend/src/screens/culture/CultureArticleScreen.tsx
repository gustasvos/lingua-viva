import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AsyncContent,
  Badge,
  Button,
  IconButton,
  Screen,
  ScreenScroll,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CultureArticle'>;

export function CultureArticleScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const state = useApi(
    () => api.culture.detail(route.params.articleId, language),
    [route.params.articleId, language],
  );

  return (
    <Screen background="plain" edges={false}>
      <AsyncContent state={state} loadingLabel="Abrindo o artigo…">
        {article =>
          !article ? null : (
            <>
              <View>
                {article.image ? (
                  <Image source={{ uri: article.image }} style={styles.cover} />
                ) : (
                  <View style={[styles.cover, { backgroundColor: theme.colors.surfaceStrong }]} />
                )}
                <LinearGradient
                  colors={['rgba(0,0,0,0.55)', 'transparent']}
                  style={styles.coverOverlay}
                />
                <View style={[styles.backButton, { top: insets.top + 8 }]}>
                  <IconButton icon="←" tone="light" onPress={navigation.goBack} />
                </View>
              </View>

              <ScreenScroll contentContainerStyle={{ padding: 20, gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Badge color="blue">{article.category}</Badge>
                  <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>
                    {article.readTime} de leitura
                  </Text>
                </View>

                <Text style={[styles.title, { color: theme.colors.text }]}>{article.title}</Text>
                <Text style={[styles.content, { color: theme.colors.textSecondary }]}>
                  {article.content}
                </Text>

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  {/* TODO (RF 6.1): reproduzir a narração do artigo com expo-av. */}
                  <Button style={{ flex: 1 }} variant="secondary">
                    🔊 Ouvir
                  </Button>
                  <Button
                    style={{ flex: 1 }}
                    onPress={() =>
                      Share.share({ message: `${article.title}\n\n${article.description}` })
                    }
                  >
                    📤 Compartilhar
                  </Button>
                </View>
              </ScreenScroll>
            </>
          )
        }
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', height: 220 },
  coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  backButton: { position: 'absolute', left: 20 },
  title: { fontSize: 21, fontWeight: '800', lineHeight: 28 },
  content: { fontSize: 14, lineHeight: 23 },
});
