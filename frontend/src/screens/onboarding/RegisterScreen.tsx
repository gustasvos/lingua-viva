import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Input, Screen, ScreenHeader, ScreenScroll } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

/** RF 1.1 — Cadastro com e-mail e senha. RF 1.2 — botão do Google. */
export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signUp, signInWithGoogle, signingIn, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Informe seu nome';
    if (!form.email.includes('@')) next.email = 'E-mail inválido';
    if (form.password.length < 6) next.password = 'Use ao menos 6 caracteres';
    if (form.password !== form.confirm) next.confirm = 'As senhas não coincidem';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
  };

  return (
    <Screen background="plain">
      <ScreenHeader
        title="Criar conta"
        subtitle=""
        onBack={navigation.goBack}
        style={{ borderBottomWidth: 0 }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenScroll contentContainerStyle={styles.body}>
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            icon="👤"
            autoCapitalize="words"
            value={form.name}
            onChangeText={set('name')}
            error={errors.name}
          />
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            icon="✉️"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={set('email')}
            error={errors.email}
          />
          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            icon="🔑"
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? '🙈' : '👁️'}
            onRightIconPress={() => setShowPassword(v => !v)}
            value={form.password}
            onChangeText={set('password')}
            error={errors.password}
          />
          <Input
            label="Confirmar senha"
            placeholder="Repita a senha"
            icon="🔒"
            secureTextEntry
            value={form.confirm}
            onChangeText={set('confirm')}
            error={errors.confirm}
          />

          {error ? <Text style={{ color: theme.colors.danger, fontSize: 12 }}>{error}</Text> : null}

          <Button size="lg" fullWidth loading={signingIn} onPress={submit}>
            Criar conta
          </Button>

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: theme.colors.borderStrong }]} />
            <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>ou continue com</Text>
            <View style={[styles.line, { backgroundColor: theme.colors.borderStrong }]} />
          </View>

          {/* RF 1.2 — Firebase Authentication com Google (ver services/api/auth.ts). */}
          <Button size="lg" fullWidth variant="outline" icon="🅶" onPress={signInWithGoogle}>
            Continuar com Google
          </Button>

          <Pressable onPress={() => navigation.navigate('Login')} style={{ paddingVertical: 8 }}>
            <Text style={{ textAlign: 'center', fontSize: 13, color: theme.colors.textMuted }}>
              Já tem conta?{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Entrar</Text>
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
