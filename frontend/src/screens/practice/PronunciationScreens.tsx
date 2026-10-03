import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../../navigation/types';


type PronunciationProps = NativeStackScreenProps<RootStackParamList, 'Pronunciation'>;
type ListeningProps = NativeStackScreenProps<RootStackParamList, 'ActiveListening'>;
type PassiveProps = NativeStackScreenProps<RootStackParamList, 'PassiveLearning'>;

/**
 * RF 6.5 / 6.6 / 6.7 — reconhecimento de fala, avaliação e comparação.
 */
export function PronunciationScreen({ navigation, route }: PronunciationProps) {

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

/** RF 6.9 — Escuta ativa: ouvir e digitar o que entendeu. */
export function ActiveListeningScreen({ navigation }: ListeningProps) {

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

/** RF 6.11 — Aprendizado passivo: reprodução em segundo plano. */
export function PassiveLearningScreen({ navigation }: PassiveProps) {

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
