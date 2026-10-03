import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { AsyncContent, Screen } from '../../components/ui';
import { useSettings } from '../../contexts/SettingsContext';
import { useApi } from '../../hooks/useApi';
import { RootStackParamList } from '../../navigation/types';
import { api } from '../../services/api';
import {
  DictationExercise,
  FillBlankExercise,
  GuidedWritingExercise,
  HangmanExercise,
  MultipleChoiceExercise,
  QuickTrainExercise,
  ReadingExercise,
  VerbConjugationExercise,
} from '../../services/types';
import { Dictation } from './types/Dictation';
import { FillBlank } from './types/FillBlank';
import { GuidedWriting } from './types/GuidedWriting';
import { Hangman } from './types/Hangman';
import { MultipleChoice } from './types/MultipleChoice';
import { QuickTrain } from './types/QuickTrain';
import { Reading } from './types/Reading';
import { VerbConjugation } from './types/VerbConjugation';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercise'>;

/**
 * RF 5 — Ponto de entrada dos exercícios.
 * Busca o exercício na API pelo tipo e delega para o componente específico.
 * Para adicionar um novo tipo: crie o componente em ./types e registre no switch.
 */
export function ExerciseScreen({ navigation, route }: Props) {
  const { type, lessonId, lessonTitle } = route.params;
  const { language, difficulty } = useSettings();

  const state = useApi(
    () =>
      api.exercises.get({
        language,
        type,
        lessonId,
        difficulty,
        // RF 5.10 — modo aleatório: embaralha as alternativas a cada tentativa
        shuffle: true,
      }),
    [language, type, lessonId, difficulty],
  );

  const close = useCallback(() => navigation.goBack(), [navigation]);

  const finish = useCallback(
    async (correct: boolean, xp: number, extra?: { answer?: unknown }) => {
      const exerciseId = state.data && 'id' in state.data ? state.data.id : type;
      // Registra a tentativa (RF 9.1 / 9.3) antes de mostrar o resultado.
      const result = await api.exercises
        .submitAttempt({
          exerciseId,
          lessonId,
          type,
          correct,
          xp,
          answer: extra?.answer,
        })
        .catch(() => null);

      navigation.replace('ExerciseResult', {
        xp: result?.xpAwarded ?? xp,
        correct,
        lessonTitle,
        exerciseType: type,
        correctCount: result?.correctCount,
        totalCount: result?.totalCount,
      });
    },
    [navigation, state.data, type, lessonId, lessonTitle],
  );

  return (
    <Screen background="plain">
      <AsyncContent state={state} loadingLabel="Preparando o exercício…">
        {exercise => {
          const props = { onFinish: finish, onClose: close };
          switch (exercise.type) {
            case 'multiple-choice':
            case 'grammar-quiz':
              return <MultipleChoice exercise={exercise as MultipleChoiceExercise} {...props} />;
            case 'fill-blank':
              return <FillBlank exercise={exercise as FillBlankExercise} {...props} />;
            case 'reading':
              return <Reading exercise={exercise as ReadingExercise} {...props} />;
            case 'dictation':
              return <Dictation exercise={exercise as DictationExercise} {...props} />;
            case 'hangman':
              return <Hangman exercise={exercise as HangmanExercise} {...props} />;
            case 'verb-conjugation':
              return <VerbConjugation exercise={exercise as VerbConjugationExercise} {...props} />;
            case 'guided-writing':
              return <GuidedWriting exercise={exercise as GuidedWritingExercise} {...props} />;
            case 'quick-train':
              return <QuickTrain exercise={exercise as QuickTrainExercise} {...props} />;
            default:
              return <MultipleChoice exercise={exercise as MultipleChoiceExercise} {...props} />;
          }
        }}
      </AsyncContent>
    </Screen>
  );
}
