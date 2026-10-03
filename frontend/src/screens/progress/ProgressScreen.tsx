import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

/** RF 9.2 (gráfico), 9.5/9.6 (tempo), 9.7 (erros) e 9.8 (mapa de calor). */
export function ProgressScreen({ navigation }: Props) {


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
