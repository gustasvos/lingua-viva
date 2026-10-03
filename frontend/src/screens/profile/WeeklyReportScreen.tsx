import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { View, Text } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyReport'>;

const variation = (current: number, previous: number) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

/** RF 14.2 / 9.5 — resumo semanal de estudo. */
export function WeeklyReportScreen({ navigation }: Props) {

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

