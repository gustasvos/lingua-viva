import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { View, Text } from 'react-native';
import { VocabularyWord } from '../../services/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** RF 3 — Caderno de vocabulário, com lista e nuvem de tags (RF 3.6). */
export function VocabularyScreen() {

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

function WordCard({ word, onPress }: { word: VocabularyWord; onPress: () => void }) {

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

/** RF 3.6 — Nuvem de vocabulário: tamanho e cor variam com a dificuldade. */
function WordCloud({
  words,
  onPress,
}: {
  words: VocabularyWord[];
  onPress: (word: VocabularyWord) => void;
}) {

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
