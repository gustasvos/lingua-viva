import { Exercise } from '../../../services/types';

/** Contrato comum de todos os tipos de exercício (RF 5). */
export type ExerciseProps<T extends Exercise = Exercise> = {
  exercise: T;
  /** Chamado ao concluir: registra a tentativa e abre a tela de resultado. */
  onFinish: (correct: boolean, xp: number, extra?: { answer?: unknown }) => void;
  onClose: () => void;
};
