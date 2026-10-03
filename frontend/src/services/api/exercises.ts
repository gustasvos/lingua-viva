/** RF 5 — Exercícios, tentativas e feedback. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { exerciseFor } from '../mock/data';
import {
  Exercise,
  ExerciseAttempt,
  ExerciseAttemptResult,
  ExerciseQuery,
  LessonFeedback,
} from '../types';

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** RF 5.10 — embaralha alternativas mantendo o índice correto coerente. */
function shuffleOptions(exercise: Exercise): Exercise {
  if ('options' in exercise && Array.isArray(exercise.options)) {
    const withIndex = exercise.options.map((option, index) => ({ option, index }));
    const mixed = shuffled(withIndex);
    return {
      ...exercise,
      options: mixed.map(item => item.option),
      correctIndex: mixed.findIndex(item => item.index === exercise.correctIndex),
    } as Exercise;
  }
  if (exercise.type === 'quick-train') {
    return { ...exercise, questions: shuffled(exercise.questions) };
  }
  return exercise;
}

export const exercisesApi = {
  async get(query: ExerciseQuery): Promise<Exercise> {
    if (USE_MOCK_API) {
      const exercise = exerciseFor(query.language, query.type);
      return mockResponse(query.shuffle ? shuffleOptions(exercise) : exercise);
    }
    const exercise = await request<Exercise>(endpoints.exercise, {
      query: {
        language: query.language,
        type: query.type,
        lessonId: query.lessonId,
        difficulty: query.difficulty,
      },
    });
    return query.shuffle ? shuffleOptions(exercise) : exercise;
  },

  /** Registra a tentativa e devolve o XP concedido (RF 9.1 / 9.3). */
  async submitAttempt(attempt: ExerciseAttempt): Promise<ExerciseAttemptResult> {
    if (USE_MOCK_API) {
      return mockResponse({ xpAwarded: attempt.xp }, 150);
    }
    return request<ExerciseAttemptResult>(endpoints.exerciseAttempt, {
      method: 'POST',
      body: attempt,
    });
  },

  /** RF 9.9 e 9.11 — esforço percebido e humor após a lição. */
  async sendFeedback(feedback: LessonFeedback): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 120);
    await request(endpoints.lessonFeedback, { method: 'POST', body: feedback });
  },
};
