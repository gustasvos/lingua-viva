import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Button } from './Button';

/** Container base das telas, já respeitando a safe area superior. */
export function Screen({
  children,
  style,
  background = 'muted',
  edges = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** `muted` = fundo violeta claro das abas; `plain` = branco das telas cheias. */
  background?: 'muted' | 'plain' | 'transparent';
  edges?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const backgroundColor =
    background === 'plain'
      ? theme.colors.backgroundPlain
      : background === 'transparent'
        ? 'transparent'
        : theme.colors.background;

  return (
    <View style={[{ flex: 1, backgroundColor, paddingTop: edges ? insets.top : 0 }, style]}>
      {children}
    </View>
  );
}

export function ScreenScroll({ children, contentContainerStyle, ...rest }: ScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ paddingBottom: 24 + insets.bottom }, contentContainerStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

/** Cabeçalho simples com voltar + título, sobre fundo sólido. */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  backIcon = '←',
  style,
}: {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  backIcon?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.backgroundPlain,
          borderBottomColor: theme.colors.border,
        },
        style,
      ]}
    >
      {onBack ? <IconButton icon={backIcon} onPress={onBack} /> : null}
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{title}</Text>
        ) : null}
        {subtitle ? (
          <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Cabeçalho com gradiente, usado no Início, Perfil, Cultura, etc. */
export function GradientHeader({
  colors,
  children,
  style,
}: {
  colors: readonly [string, string, ...string[]];
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24 }, style]}
    >
      {children}
    </LinearGradient>
  );
}

export function IconButton({
  icon,
  onPress,
  tone = 'default',
  accessibilityLabel,
}: {
  icon: string;
  onPress?: () => void;
  tone?: 'default' | 'light' | 'primary';
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const backgrounds = {
    default: theme.colors.surfaceStrong,
    light: 'rgba(255,255,255,0.2)',
    primary: theme.colors.primarySoft,
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgrounds[tone],
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 16, color: tone === 'light' ? '#FFFFFF' : theme.colors.textSecondary }}>
        {icon}
      </Text>
    </Pressable>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 13 }}>
            {actionLabel ?? 'Ver tudo'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: theme.colors.overlay }}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={{
            backgroundColor: theme.colors.backgroundPlain,
            borderTopLeftRadius: theme.radius['2xl'],
            borderTopRightRadius: theme.radius['2xl'],
            padding: theme.spacing['2xl'],
            paddingBottom: theme.spacing['2xl'] + insets.bottom,
            maxHeight: '85%',
          }}
        >
          <View
            style={{
              width: 44,
              height: 4,
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 16,
              backgroundColor: theme.colors.borderStrong,
            }}
          />
          {title ? (
            <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>{title}</Text>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

/**
 * RF 12.4 — Ajuda contextual.
 * Cada tela passa seu próprio texto; o botão abre um sheet explicando a tela.
 */
export function HelpButton({
  title,
  description,
  tone = 'default',
}: {
  title: string;
  description: string;
  tone?: 'default' | 'light';
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <IconButton icon="?" tone={tone} accessibilityLabel="Ajuda" onPress={() => setOpen(true)} />
      <BottomSheet visible={open} onClose={() => setOpen(false)} title={title}>
        <HelpBody description={description} onClose={() => setOpen(false)} />
      </BottomSheet>
    </>
  );
}

function HelpBody({ description, onClose }: { description: string; onClose: () => void }) {
  const theme = useTheme();
  return (
    <>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 21, marginBottom: 20 }}>
        {description}
      </Text>
      <Button fullWidth onPress={onClose}>
        Entendi
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  sheetTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
});
