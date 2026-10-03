import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../../navigation/types';

type SocialProps = NativeStackScreenProps<RootStackParamList, 'Social'>;
type ShareProps = NativeStackScreenProps<RootStackParamList, 'ShareProgress'>;

/** RF 10.1 (ranking), 10.2 (grupos) e 10.4 (perguntas e respostas). */
export function SocialScreen({ navigation }: SocialProps) {

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

/** RF 10.5 / 10.3 — compartilhar progresso e a palavra do dia. */
export function ShareProgressScreen({ navigation }: ShareProps) {


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
