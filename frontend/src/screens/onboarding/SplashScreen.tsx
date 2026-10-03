import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LANGUAGES } from '../../services/mock/data';
import { gradients, palette } from '../../theme';

/** Tela de abertura (mostrada enquanto sessão e preferências carregam). */
export function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  return (
    <LinearGradient colors={gradients.brand} style={styles.container}>
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ translateY: rise }] }}>
        <View style={styles.logo}>
          <Text style={{ fontSize: 44 }}>🌐</Text>
        </View>
        <Text style={styles.title}>LinguaViva</Text>
        <Text style={styles.subtitle}>Seu mundo, seus idiomas</Text>

        <View style={styles.pills}>
          {LANGUAGES.map(language => (
            <View key={language.code} style={styles.pill}>
              <Text style={styles.pillText}>
                {language.flag} {language.name}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  circle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999 },
  circleTop: { width: 260, height: 260, top: 60, right: -70 },
  circleBottom: { width: 320, height: 320, bottom: -90, left: -70 },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: palette.violet200, marginTop: 4, fontWeight: '500' },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 28,
    maxWidth: 290,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});
