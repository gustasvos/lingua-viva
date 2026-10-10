import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  HelpButton,
  Input,
  Screen,
  ScreenHeader,
  ScreenScroll,
  TextArea,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { getLanguage } from '../../services/mock/data';
import { useTheme } from '../../theme';

type TranslationProps = NativeStackScreenProps<RootStackParamList, 'Translation'>;
type ConversationProps = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

/**
 * RF 7.1 / 7.2 / 7.3 — tradução de frases, com versão literal e contextual.
 *
 * TODO: conectar a um serviço de tradução (Google Translate, DeepL ou o seu
 * backend) em src/services/api — a tela já trata loading e resultado.
 */
export function TranslationScreen({ navigation }: TranslationProps) {
  const theme = useTheme();
  const { language } = useSettings();
  const info = getLanguage(language);

  const [text, setText] = useState('');
  const [result, setResult] = useState<{ literal: string; contextual: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const translate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        literal: `[tradução literal de "${text.trim()}" em ${info.name}]`,
        contextual: `[tradução contextual, como um nativo diria em ${info.name}]`,
      });
      setLoading(false);
    }, 700);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Tradução"
        subtitle={`Português → ${info.name}`}
        onBack={navigation.goBack}
        right={
          <HelpButton
            title="Tradução"
            description="Digite uma frase em português para ver duas versões: a literal, útil para entender a estrutura, e a contextual, que é como um nativo realmente falaria."
          />
        }
      />

      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Card>
          <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, marginBottom: 8 }}>
            🇧🇷 Português
          </Text>
          <TextArea
            value={text}
            onChangeText={setText}
            placeholder="Digite a frase que quer traduzir…"
          />
          <Button fullWidth style={{ marginTop: 12 }} loading={loading} onPress={translate}>
            Traduzir
          </Button>
        </Card>

        {result ? (
          <>
            <Card>
              <Badge color="gray">Tradução literal</Badge>
              <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text, marginTop: 10 }}>
                {result.literal}
              </Text>
            </Card>

            <Card style={{ borderColor: theme.colors.primary, borderWidth: 2 }}>
              <Badge color="violet">Tradução contextual</Badge>
              <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text, marginTop: 10 }}>
                {result.contextual}
              </Text>
              <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 8 }}>
                É assim que um falante nativo diria no dia a dia.
              </Text>
            </Card>
          </>
        ) : null}

        <Button fullWidth variant="secondary" onPress={() => navigation.navigate('Conversation')}>
          💬 Praticar conversação
        </Button>
      </ScreenScroll>
    </Screen>
  );
}

type Message = { id: string; from: 'bot' | 'me'; text: string };

/** RF 7.4 — Conversação simulada com um chatbot. */
export function ConversationScreen({ navigation }: ConversationProps) {
  const theme = useTheme();
  const { language } = useSettings();
  const info = getLanguage(language);
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', from: 'bot', text: `Hi! Let's practice ${info.nativeName}. How are you today?` },
  ]);
  const [draft, setDraft] = useState('');

  const send = () => {
    const value = draft.trim();
    if (!value) return;
    setDraft('');
    setMessages(prev => [...prev, { id: `me-${Date.now()}`, from: 'me', text: value }]);

    // TODO (RF 7.4): trocar por uma chamada real ao chatbot do backend.
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          from: 'bot',
          text: 'Nice! Can you say that again using a complete sentence?',
        },
      ]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 600);
  };

  return (
    <Screen background="plain">
      <ScreenHeader
        title="Conversação"
        subtitle={`Pratique ${info.name} com o assistente`}
        onBack={navigation.goBack}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(message => {
          const mine = message.from === 'me';
          return (
            <View
              key={message.id}
              style={[
                styles.bubble,
                {
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  backgroundColor: mine ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: mine ? 0 : 1,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: mine ? '#FFFFFF' : theme.colors.textSecondary,
                }}
              >
                {message.text}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.composer, { borderTopColor: theme.colors.border }]}>
        <Input
          containerStyle={{ flex: 1 }}
          placeholder="Escreva sua resposta…"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Button onPress={send}>Enviar</Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '82%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
