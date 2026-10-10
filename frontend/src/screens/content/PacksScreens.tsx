import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  ProgressBar,
  Screen,
  ScreenHeader,
  ScreenScroll,
  SectionHeader,
} from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import { getLanguage } from '../../services/mock/data';
import { ContentPack } from '../../services/types';
import { useTheme } from '../../theme';

type OfflineProps = NativeStackScreenProps<RootStackParamList, 'Offline'>;
type StoreProps = NativeStackScreenProps<RootStackParamList, 'Store'>;
type ImportProps = NativeStackScreenProps<RootStackParamList, 'ImportExport'>;

/** RF 13.1 / 13.2 — Download de lições e estudo offline. */
export function OfflineScreen({ navigation }: OfflineProps) {
  const theme = useTheme();
  const remote = useApi(() => api.packs.offline(), []);
  const [packs, setPacks] = useState<ContentPack[]>([]);

  useEffect(() => {
    if (remote.data) setPacks(remote.data);
  }, [remote.data]);

  const download = (id: string) => {
    setPacks(prev =>
      prev.map(pack => (pack.id === id ? { ...pack, status: 'downloading', progress: 0 } : pack)),
    );
    api.packs
      .download(id, progress =>
        setPacks(prev => prev.map(pack => (pack.id === id ? { ...pack, progress } : pack))),
      )
      .then(() =>
        setPacks(prev =>
          prev.map(pack =>
            pack.id === id ? { ...pack, status: 'downloaded', progress: undefined } : pack,
          ),
        ),
      );
  };

  const downloaded = packs.filter(pack => pack.status === 'downloaded');
  const available = packs.filter(pack => pack.status !== 'downloaded');

  return (
    <Screen>
      <ScreenHeader title="Conteúdo offline" onBack={navigation.goBack} />
      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Card>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
              Espaço usado
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.primary }}>
              45 MB
            </Text>
          </View>
          <ProgressBar value={45} max={2000} />
          <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 8 }}>
            45 MB de 2 GB disponíveis
          </Text>
        </Card>

        <SectionHeader title="📦 Baixados" />
        {downloaded.map(pack => (
          <PackCard key={pack.id} pack={pack} onDownload={() => download(pack.id)} />
        ))}

        <SectionHeader
          title="⬇️ Disponíveis"
          actionLabel="Ver loja"
          onAction={() => navigation.navigate('Store')}
        />
        {available.map(pack => (
          <PackCard key={pack.id} pack={pack} onDownload={() => download(pack.id)} />
        ))}
      </ScreenScroll>
    </Screen>
  );
}

function PackCard({ pack, onDownload }: { pack: ContentPack; onDownload: () => void }) {
  const theme = useTheme();
  const info = getLanguage(pack.language);
  const isDownloaded = pack.status === 'downloaded';
  const isDownloading = pack.status === 'downloading';

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={[styles.flag, { backgroundColor: theme.colors.surfaceStrong }]}>
          <Text style={{ fontSize: 22 }}>{info.flag}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
            {pack.name}
          </Text>
          <Text style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
            {pack.lessons} lições · {pack.size}
          </Text>
          {isDownloading && pack.progress !== undefined ? (
            <ProgressBar value={pack.progress} height={5} style={{ marginTop: 8 }} />
          ) : null}
        </View>
        <Badge color={isDownloaded ? 'emerald' : isDownloading ? 'blue' : 'gray'}>
          {isDownloaded ? '✅ Baixado' : isDownloading ? '⬇️ Baixando' : '☁️ Disponível'}
        </Badge>
      </View>

      {!isDownloading ? (
        <Button
          size="sm"
          fullWidth
          style={{ marginTop: 12 }}
          variant={isDownloaded ? 'secondary' : 'primary'}
          onPress={onDownload}
        >
          {isDownloaded ? '🔄 Atualizar' : '⬇️ Baixar'}
        </Button>
      ) : null}
    </Card>
  );
}

/** RF 13.3 — Loja interna de conteúdo gratuito. */
export function StoreScreen({ navigation }: StoreProps) {
  const theme = useTheme();
  const remote = useApi(() => api.packs.store(), []);
  const [packs, setPacks] = useState<ContentPack[]>([]);

  useEffect(() => {
    if (remote.data) setPacks(remote.data);
  }, [remote.data]);

  return (
    <Screen>
      <ScreenHeader
        title="Loja de conteúdo"
        subtitle="Pacotes gratuitos para download"
        onBack={navigation.goBack}
      />
      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        {packs.map(pack => {
          const info = getLanguage(pack.language);
          const isDownloaded = pack.status === 'downloaded';
          return (
            <Card key={pack.id}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.flag, { backgroundColor: theme.colors.surfaceStrong }]}>
                  <Text style={{ fontSize: 22 }}>{info.flag}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                    {pack.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                    {pack.description}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 6 }}>
                    {pack.lessons} lições · {pack.size} · ⭐ {pack.rating}
                  </Text>
                </View>
              </View>
              <Button
                size="sm"
                fullWidth
                style={{ marginTop: 12 }}
                variant={isDownloaded ? 'success' : 'primary'}
                disabled={isDownloaded}
                onPress={() =>
                  setPacks(prev =>
                    prev.map(item =>
                      item.id === pack.id ? { ...item, status: 'downloaded' } : item,
                    ),
                  )
                }
              >
                {isDownloaded ? '✅ Baixado' : '⬇️ Baixar grátis'}
              </Button>
            </Card>
          );
        })}
      </ScreenScroll>
    </Screen>
  );
}

/** RF 13.4 — importar listas. RF 13.5 — exportar progresso e caderno. */
export function ImportExportScreen({ navigation }: ImportProps) {
  const theme = useTheme();
  const [state, setState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [file, setFile] = useState<string | null>(null);

  return (
    <Screen>
      <ScreenHeader title="Importar / Exportar" onBack={navigation.goBack} />
      <ScreenScroll contentContainerStyle={{ padding: 16, gap: 12 }}>
        <SectionHeader title="📥 Importar lista de palavras" />
        <Card>
          {state === 'idle' ? (
            <>
              <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 12 }}>
                Importe suas próprias listas em TXT ou CSV, com uma palavra por linha.
              </Text>
              {/* TODO (RF 13.4): usar expo-document-picker + expo-file-system para ler o arquivo. */}
              <Pressable
                onPress={() => setFile('vocabulario.csv')}
                style={[styles.dropzone, { borderColor: theme.colors.borderStrong }]}
              >
                <Text style={{ fontSize: 28 }}>📂</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary }}>
                  Selecionar arquivo
                </Text>
                <Text style={{ fontSize: 11, color: theme.colors.textFaint }}>TXT, CSV</Text>
              </Pressable>

              {file ? (
                <View style={{ marginTop: 12, gap: 12 }}>
                  <View style={[styles.fileRow, { backgroundColor: theme.colors.surfaceMuted }]}>
                    <Text>📄</Text>
                    <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary }}>
                      {file}
                    </Text>
                    <Pressable onPress={() => setFile(null)}>
                      <Text style={{ color: theme.colors.textFaint }}>✕</Text>
                    </Pressable>
                  </View>
                  <Button
                    fullWidth
                    onPress={() => {
                      setState('processing');
                      setTimeout(() => setState('success'), 1500);
                    }}
                  >
                    Importar arquivo
                  </Button>
                </View>
              ) : null}
            </>
          ) : state === 'processing' ? (
            <View style={{ alignItems: 'center', gap: 12, paddingVertical: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary }}>
                Processando arquivo…
              </Text>
              <ProgressBar value={65} />
            </View>
          ) : (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 16 }}>
              <Text style={{ fontSize: 32 }}>✅</Text>
              <Text style={{ fontWeight: '800', color: theme.colors.successText }}>
                Importação concluída
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                42 palavras adicionadas ao seu caderno
              </Text>
              <Button
                size="sm"
                variant="secondary"
                style={{ marginTop: 8 }}
                onPress={() => {
                  setState('idle');
                  setFile(null);
                }}
              >
                Importar outro
              </Button>
            </View>
          )}
        </Card>

        <SectionHeader title="📤 Exportar dados" />
        <Card>
          <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 12 }}>
            Gere um arquivo com seu progresso ou com o caderno de vocabulário.
          </Text>
          {/* TODO (RF 13.5): gerar o arquivo com expo-file-system e abrir expo-sharing. */}
          {[
            { label: '📊 Exportar progresso' },
            { label: '📝 Exportar caderno' },
          ].map(item => (
            <View key={item.label} style={[styles.exportRow, { borderBottomColor: theme.colors.border }]}>
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary }}>
                {item.label}
              </Text>
              <Button size="sm" variant="outline">
                TXT
              </Button>
              <Button size="sm" variant="outline">
                PDF
              </Button>
            </View>
          ))}
        </Card>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flag: { width: 48, height: 48, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 6,
  },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14 },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
