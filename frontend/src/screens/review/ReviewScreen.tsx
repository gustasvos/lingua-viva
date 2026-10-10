import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Card,
  HelpButton,
  MasteryBar,
  Screen,
  ScreenScroll,
  SectionHeader,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { gradients, useTheme } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** RF 8 — Hub de revisão. */
export function ReviewScreen() {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { language } = useSettings();

  const spaced = useApi(() => api.review.spaced(language), [language]);
  const flashcards = useApi(() => api.review.flashcards(language), [language]);

  const dueToday = (spaced.data ?? []).filter(word => word.nextReview === 'Hoje');

  const modes = [
    {
      id: 'flashcards' as const,
      icon: '🃏',
      title: 'Flashcards',
      description: 'Memorize palavras com cartões interativos',
      colors: gradients.brandSoft,
      badge: `${flashcards.data?.length ?? 0} cartões`,
      go: () => navigation.navigate('Flashcards'),
    },
    {
      id: 'spaced' as const,
      icon: '🔁',
      title: 'Revisão espaçada',
      description: `${dueToday.length} palavras para revisar hoje`,
      colors: gradients.review,
      badge: 'Recomendado',
      go: () => navigation.navigate('SpacedReview'),
    },
    {
      id: 'image' as const,
      icon: '🖼️',
      title: 'Revisão por imagens',
      description: 'Associe imagens às palavras corretas',
      colors: gradients.success,
      badge: 'Visual',
      go: () => navigation.navigate('ImageReview'),
    },
    {
      id: 'exercise' as const,
      icon: '✏️',
      title: 'Exercícios variados',
      description: 'Pratique com tipos diferentes de exercício',
      colors: gradients.amber,
      badge: 'Aleatório',
      go: () => navigation.navigate('Exercise', { type: 'quick-train' }),
    },
  ];

  return (
    <Screen>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.backgroundPlain, borderBottomColor: theme.colors.border },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Revisar</Text>
          <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
            {dueToday.length} palavras pendentes hoje
          </Text>
        </View>
        <HelpButton
          title="Como revisar"
          description="A revisão espaçada escolhe as palavras no momento em que você está prestes a esquecê-las, com base nas suas últimas respostas. Os flashcards e a revisão por imagens são modos livres, sem agenda."
        />
      </View>

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Pressable onPress={() => navigation.navigate('SpacedReview')}>
          <LinearGradient
            colors={gradients.brandSoft}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <View style={styles.ctaIcon}>
              <Text style={{ fontSize: 26 }}>🔁</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitle}>Revisão de hoje</Text>
              <Text style={styles.ctaSubtitle}>
                {dueToday.length} palavras · baseado no seu desempenho
              </Text>
            </View>
            <View style={styles.ctaButton}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>▶ Iniciar</Text>
            </View>
          </LinearGradient>
        </Pressable>

        <SectionHeader title="Modos de revisão" style={{ marginTop: 8 }} />
        {modes.map(mode => (
          <Card key={mode.id} onPress={mode.go}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <LinearGradient
                colors={mode.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modeIcon}
              >
                <Text style={{ fontSize: 20 }}>{mode.icon}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: theme.colors.text }}>
                  {mode.title}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                  {mode.description}
                </Text>
              </View>
              <Badge color="violet">{mode.badge}</Badge>
            </View>
          </Card>
        ))}

        <SectionHeader
          title="Para revisar hoje"
          onAction={() => navigation.navigate('SpacedReview')}
          style={{ marginTop: 8 }}
        />
        {(spaced.data ?? []).slice(0, 3).map(word => (
          <Card key={word.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.faceIcon, { backgroundColor: theme.colors.surfaceStrong }]}>
                <Text>
                  {word.lastPerformance === 'hard' ? '😰' : word.lastPerformance === 'okay' ? '😐' : '😊'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                  {word.word}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                  {word.translation}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: word.nextReview === 'Hoje' ? theme.colors.danger : theme.colors.textFaint,
                }}
              >
                {word.nextReview}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <MasteryBar value={word.mastery} />
            </View>
          </Card>
        ))}
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 23, fontWeight: '800' },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 24 },
  ctaIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  ctaSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  ctaButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modeIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  faceIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
