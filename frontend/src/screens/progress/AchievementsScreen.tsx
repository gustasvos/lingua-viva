import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../../navigation/types';


type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

/** RF 9.10 — Medalhas por marcos. */
export function AchievementsScreen({ navigation }: Props) {

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
