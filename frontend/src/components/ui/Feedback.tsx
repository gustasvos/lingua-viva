import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { Button } from './Button';
import { AsyncState } from '../../hooks/useApi';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 44, marginBottom: 12 }}>{icon}</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.textMuted }]}>{description}</Text>
      {action ? <View style={{ marginTop: 20 }}>{action}</View> : null}
    </View>
  );
}

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={[styles.description, { color: theme.colors.textMuted, marginTop: 12 }]}>
        {label}
      </Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>📡</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Não foi possível carregar</Text>
      <Text style={[styles.description, { color: theme.colors.textMuted }]}>
        {message ?? 'Verifique sua conexão e tente novamente.'}
      </Text>
      {onRetry ? (
        <Button style={{ marginTop: 20 }} onPress={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </View>
  );
}

/**
 * Renderiza loading / erro / vazio / conteúdo a partir de um useApi.
 * Evita repetir esses três estados em cada tela.
 */
export function AsyncContent<T>({
  state,
  children,
  empty,
  loadingLabel,
  isEmpty,
}: {
  state: AsyncState<T>;
  children: (data: T) => React.ReactNode;
  empty?: React.ReactNode;
  loadingLabel?: string;
  isEmpty?: (data: T) => boolean;
}) {
  if (state.loading && state.data == null) return <LoadingState label={loadingLabel} />;
  if (state.error && state.data == null) {
    return <ErrorState message={state.error.message} onRetry={state.refetch} />;
  }
  if (state.data == null) return <>{empty ?? null}</>;
  const looksEmpty = isEmpty
    ? isEmpty(state.data)
    : Array.isArray(state.data) && state.data.length === 0;
  if (looksEmpty && empty) return <>{empty}</>;
  return <>{children(state.data)}</>;
}

/** Aviso de conteúdo reaproveitado de outro idioma enquanto a API não existe. */
export function PlaceholderNotice({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.warningSoft,
        borderWidth: 1,
        borderColor: theme.colors.warningBorder,
      }}
    >
      <Text>ℹ️</Text>
      <Text style={{ flex: 1, fontSize: 11, color: theme.colors.warningText, lineHeight: 16 }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  title: { fontSize: 17, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
  description: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
