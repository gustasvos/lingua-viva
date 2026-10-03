import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ScreenScroll } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { gradients, palette, useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const FEATURES = [
  { icon: '📚', title: 'Lições interativas', description: '5 idiomas, todos os níveis' },
  { icon: '🎯', title: 'Exercícios variados', description: 'Quiz, ditado, pronúncia e mais' },
  { icon: '📊', title: 'Progresso em tempo real', description: 'XP, conquistas e metas diárias' },
];

export function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundPlain }}>
      <ScreenScroll>
        <LinearGradient
          colors={gradients.brandSoft}
          style={[styles.hero, { paddingTop: insets.top + 40 }]}
        >
          <View style={styles.heroCircle} />
          <View style={styles.logo}>
            <Text style={{ fontSize: 28 }}>🌐</Text>
          </View>
          <Text style={styles.heroTitle}>Aprenda idiomas{'\n'}do jeito certo</Text>
          <Text style={styles.heroSubtitle}>
            Método científico e gamificação para um estudo que cabe na sua rotina.
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          {FEATURES.map(feature => (
            <View key={feature.icon} style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primarySoft }]}>
                <Text style={{ fontSize: 22 }}>{feature.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.textMuted }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}

          <View style={{ gap: 12, marginTop: 12 }}>
            <Button size="xl" fullWidth onPress={() => navigation.navigate('Register')}>
              Criar conta gratuita
            </Button>
            <Button
              size="xl"
              fullWidth
              variant="outline"
              onPress={() => navigation.navigate('Login')}
            >
              Já tenho uma conta
            </Button>
            <Pressable onPress={continueAsGuest} style={{ paddingVertical: 8 }}>
              <Text style={[styles.guest, { color: theme.colors.textFaint }]}>
                Explorar sem cadastro
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 40, overflow: 'hidden' },
  heroCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -60,
    right: -60,
  },
  logo: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 29, fontWeight: '800', color: '#FFFFFF', lineHeight: 36 },
  heroSubtitle: { fontSize: 14, color: palette.violet200, marginTop: 8, lineHeight: 20 },
  body: { paddingHorizontal: 24, paddingTop: 24, gap: 16 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '700' },
  featureDescription: { fontSize: 12, marginTop: 2 },
  guest: { textAlign: 'center', fontSize: 13, fontWeight: '600' },
});
