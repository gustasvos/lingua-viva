import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Input, Screen, ScreenHeader, ScreenScroll } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

/** RF 1.1 / 1.2 / 1.3 — login por e-mail, Google ou biometria. */
export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signIn, signInWithGoogle, signingIn, error } = useAuth();
  const { biometricEnabled } = useSettings();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Screen background="plain">
      <ScreenHeader
        title="Bem-vindo de volta"
        subtitle="Continue de onde parou"
        onBack={navigation.goBack}
        style={{ borderBottomWidth: 0 }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenScroll contentContainerStyle={styles.body}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            icon="✉️"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={value => setForm(prev => ({ ...prev, email: value }))}
          />
          <View>
            <Input
              label="Senha"
              placeholder="Sua senha"
              icon="🔑"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? '🙈' : '👁️'}
              onRightIconPress={() => setShowPassword(v => !v)}
              value={form.password}
              onChangeText={value => setForm(prev => ({ ...prev, password: value }))}
            />
            <Pressable style={{ alignSelf: 'flex-end', marginTop: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.primary }}>
                Esqueci minha senha
              </Text>
            </Pressable>
          </View>

          {error ? <Text style={{ color: theme.colors.danger, fontSize: 12 }}>{error}</Text> : null}

          <Button size="lg" fullWidth loading={signingIn} onPress={() => signIn(form)}>
            Entrar
          </Button>

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: theme.colors.borderStrong }]} />
            <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>ou</Text>
            <View style={[styles.line, { backgroundColor: theme.colors.borderStrong }]} />
          </View>

          <Button size="lg" fullWidth variant="outline" icon="🅶" onPress={signInWithGoogle}>
            Entrar com Google
          </Button>

          {biometricEnabled ? (
            /* RF 1.3 — TODO: chamar expo-local-authentication aqui. */
            <Button size="lg" fullWidth variant="outline" icon="🔐" onPress={signInWithGoogle}>
              Usar biometria
            </Button>
          ) : null}

          <Pressable onPress={() => navigation.navigate('Register')} style={{ paddingVertical: 8 }}>
            <Text style={{ textAlign: 'center', fontSize: 13, color: theme.colors.textMuted }}>
              Não tem conta?{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Criar agora</Text>
            </Text>
          </Pressable>
        </ScreenScroll>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 24, paddingTop: 8, gap: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
});
