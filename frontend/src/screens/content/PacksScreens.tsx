import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { ContentPack } from '../../services/types';
import { View, Text } from 'react-native';


type OfflineProps = NativeStackScreenProps<RootStackParamList, 'Offline'>;
type StoreProps = NativeStackScreenProps<RootStackParamList, 'Store'>;
type ImportProps = NativeStackScreenProps<RootStackParamList, 'ImportExport'>;

/** RF 13.1 / 13.2 — Download de lições e estudo offline. */
export function OfflineScreen({ navigation }: OfflineProps) {

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

function PackCard({ pack, onDownload }: { pack: ContentPack; onDownload: () => void }) {

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

/** RF 13.3 — Loja interna de conteúdo gratuito. */
export function StoreScreen({ navigation }: StoreProps) {

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

/** RF 13.4 — importar listas. RF 13.5 — exportar progresso e caderno. */
export function ImportExportScreen({ navigation }: ImportProps) {

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
