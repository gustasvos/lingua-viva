import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { gradients, palette } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AppLock'>;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

/**
 * RF 1.3 — Proteção de acesso por PIN ou biometria.
 * TODO: validar o PIN contra um hash guardado em expo-secure-store e usar
 * expo-local-authentication para a biometria.
 */
export function AppLockScreen({ navigation }: Props) {
  const { markUnlocked } = useAuth();
  const { biometricEnabled } = useSettings();
  const [pin, setPin] = useState('');

  const unlock = () => {
    setPin('');
    if (navigation.canGoBack()) navigation.goBack();
    markUnlocked();
  };

  const press = (key: string) => {
    if (key === '⌫') {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    if (!key) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) setTimeout(unlock, 250);
  };

  return (
    <LinearGradient colors={gradients.brandDeep} style={styles.container}>
      <Text style={{ fontSize: 44, marginBottom: 12 }}>🔐</Text>
      <Text style={styles.title}>Acesso protegido</Text>
      <Text style={styles.subtitle}>Insira seu PIN de 4 dígitos</Text>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map(index => (
          <View
            key={index}
            style={[styles.dot, index < pin.length && { backgroundColor: '#FFFFFF' }]}
          />
        ))}
      </View>

      <View style={styles.pad}>
        {KEYS.map((key, index) => (
          <Pressable
            key={index}
            onPress={() => press(key)}
            style={({ pressed }) => [
              styles.key,
              !key && { opacity: 0 },
              pressed && key ? { opacity: 0.6 } : null,
            ]}
          >
            <Text style={styles.keyLabel}>{key}</Text>
          </Pressable>
        ))}
      </View>

      {biometricEnabled ? (
        <Pressable onPress={unlock} style={{ marginTop: 16 }}>
          <Text style={styles.biometric}>👆 Usar biometria</Text>
        </Pressable>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 23, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: palette.violet200, marginTop: 4, marginBottom: 32 },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  pad: { width: 260, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  key: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  keyLabel: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  biometric: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
});
