import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { View, Text } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'WordDetail'>;

/** RF 3.2 / 3.3 / 3.4 / 3.5 — favorito, dificuldade, anotação e nota de voz. */
export function WordDetailScreen({ navigation, route }: Props) {

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
