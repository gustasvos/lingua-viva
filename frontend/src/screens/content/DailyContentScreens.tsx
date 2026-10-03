import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { View, Text } from 'react-native';


type ChallengeProps = NativeStackScreenProps<RootStackParamList, 'DailyChallenge'>;
type PhraseProps = NativeStackScreenProps<RootStackParamList, 'PhraseOfDay'>;

/** RF 11.1 — Desafio diário. */
export function DailyChallengeScreen({ navigation }: ChallengeProps) {

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

/** RF 11.2 — Frase do dia com explicação e áudio. */
export function PhraseOfDayScreen({ navigation }: PhraseProps) {

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