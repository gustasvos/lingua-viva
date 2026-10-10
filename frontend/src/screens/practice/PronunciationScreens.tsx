import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  HelpButton,
  MasteryBar,
  Screen,
  ScreenHeader,
  ScreenScroll,
  TextArea,
  ToggleSwitch,
} from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type PronunciationProps = NativeStackScreenProps<RootStackParamList, 'Pronunciation'>;
type ListeningProps = NativeStackScreenProps<RootStackParamList, 'ActiveListening'>;
type PassiveProps = NativeStackScreenProps<RootStackParamList, 'PassiveLearning'>;

/**
 * RF 6.5 / 6.6 / 6.7 — reconhecimento de fala, avaliação e comparação.
 *
 * TODO: a gravação e a pontuação são simuladas. Para valer:
 *  1. gravar com expo-av (Audio.Recording);
 *  2. enviar o arquivo para a API de reconhecimento de fala;
 *  3. exibir a pontuação e os fonemas que o serviço devolver.
 */
export function PronunciationScreen({ navigation, route }: PronunciationProps) {
  const theme = useTheme();
  const { speechSensitivity, update } = useSettings();
  const word = route.params?.word ?? 'Serendipity';
  const phonetic = route.params?.phonetic ?? '/ˌserənˈdɪpɪti/';

  const [phase, setPhase] = useState<'listen' | 'record' | 'result'>('listen');
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);

  const score = 78;
  const phonemes = [
    { label: 'ser', score: 90 },
    { label: 'en', score: 85 },
    { label: 'dip', score: 60 },
    { label: 'i', score: 55 },
    { label: 'ty', score: 75 },
  ];

  return (
    <Screen background="plain">
      <ScreenHeader
        title="Treino de pronúncia"
        onBack={navigation.goBack}
        right={
          <HelpButton
            title="Treino de pronúncia"
            description="Ouça o áudio nativo, grave sua voz e receba uma nota por sílaba. No modo tolerante pequenas variações são aceitas; no rigoroso a avaliação é mais exigente."
          />
        }
      />

      <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={[styles.wordCard, { backgroundColor: theme.colors.primarySurface }]}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.primarySoftText }}>
            {word}
          </Text>
          <Text style={{ fontSize: 13, color: theme.colors.textFaint, marginTop: 4 }}>
            {phonetic}
          </Text>

          <Pressable
            onPress={() => setPlaying(value => !value)}
            style={[
              styles.bigButton,
              { backgroundColor: playing ? theme.colors.primary : theme.colors.primarySoft },
            ]}
          >
            <Text style={{ fontSize: 28 }}>🔊</Text>
          </Pressable>
          <Text style={{ fontSize: 12, color: theme.colors.textFaint, marginTop: 10 }}>
            {playing ? 'Reproduzindo…' : 'Toque para ouvir o nativo'}
          </Text>
        </View>

        {/* RF 6.8 — sensibilidade do reconhecimento */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                Reconhecimento rigoroso
              </Text>
              <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 2 }}>
                Desligado = tolerante a pequenas variações
              </Text>
            </View>
            <ToggleSwitch
              value={speechSensitivity === 'strict'}
              onChange={value => update({ speechSensitivity: value ? 'strict' : 'tolerant' })}
            />
          </View>
        </Card>

        {phase === 'result' ? (
          <>
            <Card style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 44, fontWeight: '800', color: theme.colors.primary }}>
                {score}%
              </Text>
              <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
                de precisão na pronúncia
              </Text>
            </Card>

            <Card>
              <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, marginBottom: 12 }}>
                Precisão por sílaba
              </Text>
              <View style={{ gap: 10 }}>
                {phonemes.map(item => (
                  <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ width: 44, fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary }}>
                      {item.label}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <MasteryBar value={item.score} />
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            {/* RF 6.7 — comparação das gravações */}
            <Card>
              <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textFaint, marginBottom: 12 }}>
                Comparar gravações
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button style={{ flex: 1 }} variant="secondary">
                  🔊 Nativo
                </Button>
                <Button style={{ flex: 1 }} variant="secondary">
                  🎙️ Sua voz
                </Button>
              </View>
            </Card>

            <Button
              fullWidth
              size="lg"
              onPress={() => {
                setPhase('listen');
                setRecording(false);
              }}
            >
              Tentar novamente
            </Button>
          </>
        ) : (
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Badge color={recording ? 'red' : 'violet'}>
              {recording ? '🔴 Gravando…' : 'Toque no microfone e fale'}
            </Badge>
            <Pressable
              onPress={() => {
                if (recording) {
                  setRecording(false);
                  setPhase('result');
                } else {
                  setRecording(true);
                  setPhase('record');
                }
              }}
              style={[
                styles.bigButton,
                {
                  backgroundColor: recording ? theme.colors.danger : theme.colors.primary,
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                },
              ]}
            >
              <Text style={{ fontSize: 34 }}>🎙️</Text>
            </Pressable>
            <Text style={{ fontSize: 12, color: theme.colors.textFaint }}>
              {recording ? 'Toque novamente para finalizar' : 'Gravação de até 10 segundos'}
            </Text>
          </View>
        )}
      </ScreenScroll>
    </Screen>
  );
}

/** RF 6.9 — Escuta ativa: ouvir e digitar o que entendeu. */
export function ActiveListeningScreen({ navigation }: ListeningProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [played, setPlayed] = useState(false);
  const [checked, setChecked] = useState(false);

  const target = 'I would like a cup of coffee, please.';
  const isCorrect = text.trim().toLowerCase().replace(/[.,]/g, '') === target.toLowerCase().replace(/[.,]/g, '');

  return (
    <Screen background="plain">
      <ScreenHeader title="Escuta ativa" onBack={navigation.goBack} />
      <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={[styles.wordCard, { backgroundColor: theme.colors.primarySurface }]}>
          <Text style={{ fontSize: 44 }}>🎧</Text>
          <Pressable
            onPress={() => setPlayed(true)}
            style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
              🔊 {played ? 'Ouvir novamente' : 'Ouvir frase'}
            </Text>
          </Pressable>
        </View>

        {played ? (
          <>
            <TextArea
              value={text}
              onChangeText={setText}
              editable={!checked}
              placeholder="Digite o que você entendeu…"
            />
            {checked ? (
              <Card
                style={{
                  backgroundColor: isCorrect ? theme.colors.successSoft : theme.colors.dangerSoft,
                }}
              >
                <Text style={{ fontWeight: '800', fontSize: 13, color: theme.colors.text }}>
                  {isCorrect ? '✅ Exatamente isso!' : '❌ Quase lá'}
                </Text>
                {!isCorrect ? (
                  <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 6 }}>
                    A frase era: "{target}"
                  </Text>
                ) : null}
              </Card>
            ) : null}
            <Button
              fullWidth
              size="lg"
              onPress={() => (checked ? navigation.goBack() : setChecked(true))}
            >
              {checked ? 'Concluir' : 'Verificar'}
            </Button>
          </>
        ) : null}
      </ScreenScroll>
    </Screen>
  );
}

/** RF 6.11 — Aprendizado passivo: reprodução em segundo plano. */
export function PassiveLearningScreen({ navigation }: PassiveProps) {
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(true);

  return (
    <Screen background="plain">
      <ScreenHeader title="Aprendizado passivo" onBack={navigation.goBack} />
      <ScreenScroll contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Card style={{ alignItems: 'center', paddingVertical: 32, gap: 12 }}>
          <Text style={{ fontSize: 48 }}>🎵</Text>
          <Text style={{ fontSize: 15, fontWeight: '800', color: theme.colors.text }}>
            Playlist do seu vocabulário
          </Text>
          <Text style={{ fontSize: 12, color: theme.colors.textMuted, textAlign: 'center' }}>
            Reproduz palavras e frases em sequência, mesmo com a tela desligada.
          </Text>
          <Pressable
            onPress={() => setPlaying(value => !value)}
            style={[
              styles.bigButton,
              { backgroundColor: playing ? theme.colors.danger : theme.colors.primary },
            ]}
          >
            <Text style={{ fontSize: 28 }}>{playing ? '⏸️' : '▶️'}</Text>
          </Pressable>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary }}>
              Repetir playlist
            </Text>
            <ToggleSwitch value={repeat} onChange={setRepeat} />
          </View>
        </Card>

        {/* TODO (RF 6.11): configurar expo-av com staysActiveInBackground e
            expo-task-manager para manter o áudio tocando fora do app. */}
        <Text style={{ fontSize: 11, color: theme.colors.textFaint, textAlign: 'center' }}>
          A reprodução em segundo plano será ativada quando o áudio real for conectado.
        </Text>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wordCard: { borderRadius: 24, padding: 28, alignItems: 'center' },
  bigButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  playButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginTop: 16 },
});
