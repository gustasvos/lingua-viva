import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AsyncContent, Button, CheckMark, SelectableCard } from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { OnboardingStep } from './OnboardingStep';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingLanguage'>;

/** RF 2.1 — Seleção do idioma de aprendizado (a escolha é salva e usada em todo o app). */
export function LanguageSelectionScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const settings = useSettings();
  const fromSettings = route.params?.fromSettings;
  const [selected, setSelected] = useState<string | null>(settings.language ?? null);
  const languages = useApi(() => api.languages.list(), []);

  const confirm = () => {
    if (!selected) return;
    settings.update({ language: selected });
    if (fromSettings) navigation.goBack();
    else navigation.navigate('OnboardingLevel');
  };

  return (
    <OnboardingStep
      step={1}
      title="Qual idioma você quer aprender?"
      description="Você poderá adicionar um idioma secundário depois, sem perder o progresso."
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      footer={
        <Button size="xl" fullWidth disabled={!selected} onPress={confirm}>
          {fromSettings ? 'Salvar idioma' : 'Próximo'}
        </Button>
      }
    >
      <AsyncContent state={languages}>
        {items => (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {items.map(language => {
              const isSelected = selected === language.code;
              return (
                <SelectableCard
                  key={language.code}
                  selected={isSelected}
                  onPress={() => setSelected(language.code)}
                >
                  <View style={styles.row}>
                    <Text style={{ fontSize: 34 }}>{language.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.name, { color: theme.colors.text }]}>
                        {language.name}
                      </Text>
                      <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
                        {language.nativeName} · {language.speakers} falantes
                      </Text>
                    </View>
                    {isSelected ? <CheckMark size={26} /> : null}
                  </View>
                </SelectableCard>
              );
            })}

            {/* RF 2.2 — idioma secundário */}
            {settings.secondaryLanguage ? (
              <Text style={[styles.meta, { color: theme.colors.textFaint, textAlign: 'center' }]}>
                Idioma secundário atual: {settings.secondaryLanguage.toUpperCase()}
              </Text>
            ) : selected && selected !== settings.language ? (
              <Button
                variant="ghost"
                onPress={() => settings.update({ secondaryLanguage: settings.language })}
              >
                Manter {settings.language.toUpperCase()} como idioma secundário
              </Button>
            ) : null}
          </ScrollView>
        )}
      </AsyncContent>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { fontSize: 15, fontWeight: '700' },
  meta: { fontSize: 12, marginTop: 2 },
});
