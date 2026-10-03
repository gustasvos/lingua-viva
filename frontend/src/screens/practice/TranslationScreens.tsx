import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { View, Text } from 'react-native';


type TranslationProps = NativeStackScreenProps<RootStackParamList, 'Translation'>;
type ConversationProps = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

/**
 * RF 7.1 / 7.2 / 7.3 — tradução de frases, com versão literal e contextual.
 *
 * TODO: conectar a um serviço de tradução (Google Translate, DeepL ou o seu
 * backend) em src/services/api — a tela já trata loading e resultado.
 */
export function TranslationScreen({ navigation }: TranslationProps) {

  return (
    <View
  style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Text style={{ color: 'green' }}>
    Em breve
  </Text>
</View>
  );
}

type Message = { id: string; from: 'bot' | 'me'; text: string };

/** RF 7.4 — Conversação simulada com um chatbot. */
export function ConversationScreen({ navigation }: ConversationProps) {


  return (
  <View
  style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Text style={{ color: 'green' }}>
    Em breve
  </Text>
</View>
  );
}

