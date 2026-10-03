import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { View, Text } from 'react-native';


type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;


/** RF 14.1 — lembretes de estudo. RF 14.2 — relatório semanal por e-mail. */
export function NotificationsScreen({ navigation }: Props) {

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

